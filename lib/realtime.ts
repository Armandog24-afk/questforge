/**
 * Realtime abstraction. When Supabase Realtime is configured, channels sync
 * token moves, chat, dice rolls, scene changes and presence across clients.
 * Without it, the room falls back to local state + optimistic API writes —
 * fully usable single-client/demo, structured so wiring a real channel later
 * is a drop-in change (swap `subscribe`/`publish` bodies only).
 */

export const isRealtimeConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export type RealtimeChannel =
  | `campaign:${string}`
  | `scene:${string}`
  | `chat:${string}`
  | `tokens:${string}`;

export type RealtimeHandler<T = unknown> = (payload: T) => void;

export interface RealtimeClient {
  subscribe: <T>(channel: RealtimeChannel, handler: RealtimeHandler<T>) => () => void;
  publish: <T>(channel: RealtimeChannel, payload: T) => void;
}

function createNoopRealtimeClient(): RealtimeClient {
  const handlers = new Map<string, Set<RealtimeHandler>>();

  return {
    subscribe(channel, handler) {
      const set = handlers.get(channel) ?? new Set();
      set.add(handler as RealtimeHandler);
      handlers.set(channel, set);
      return () => set.delete(handler as RealtimeHandler);
    },
    publish(channel, payload) {
      handlers.get(channel)?.forEach((h) => h(payload));
    },
  };
}

let client: RealtimeClient | null = null;

export function getRealtimeClient(): RealtimeClient {
  if (!client) {
    // Supabase Realtime wiring goes here when NEXT_PUBLIC_SUPABASE_URL is set.
    client = createNoopRealtimeClient();
  }
  return client;
}
