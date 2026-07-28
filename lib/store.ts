import {
  DEMO_ASSETS,
  DEMO_CAMPAIGNS,
  DEMO_CHARACTERS,
  DEMO_CHAT,
  DEMO_DICE_ROLLS,
  DEMO_MAP_RECORDS,
  DEMO_MUSIC,
  DEMO_NOTES,
  DEMO_PREMIUM_ITEMS,
  DEMO_SCENES,
  DEMO_TOKENS,
  DEMO_USERS,
} from "@/lib/demo";
import type {
  AppUser,
  AssetRecord,
  Campaign,
  Character,
  ChatMessageRecord,
  DiceRollRecord,
  MusicTrackRecord,
  NoteRecord,
  PremiumItemRecord,
  QFMap,
  QFToken,
  Scene,
} from "@/lib/types";

/**
 * In-memory data store used whenever DATABASE_URL isn't configured. Seeded
 * from the demo dataset and mutated by lib/data.ts, so campaign/scene/token
 * creation, dice history, chat and notes all genuinely work end-to-end for
 * the lifetime of the server process — not just static fixtures. Resets on
 * server restart, which is expected for a zero-config demo mode.
 */
interface Store {
  users: AppUser[];
  campaigns: Campaign[];
  scenes: Scene[];
  maps: QFMap[];
  tokens: QFToken[];
  characters: Character[];
  diceRolls: DiceRollRecord[];
  chat: ChatMessageRecord[];
  notes: NoteRecord[];
  music: MusicTrackRecord[];
  assets: AssetRecord[];
  premiumItems: PremiumItemRecord[];
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function createInitialStore(): Store {
  return {
    users: clone(DEMO_USERS),
    campaigns: clone(DEMO_CAMPAIGNS),
    scenes: clone(DEMO_SCENES),
    maps: clone(DEMO_MAP_RECORDS),
    tokens: clone(DEMO_TOKENS),
    characters: clone(DEMO_CHARACTERS),
    diceRolls: clone(DEMO_DICE_ROLLS),
    chat: clone(DEMO_CHAT),
    notes: clone(DEMO_NOTES),
    music: clone(DEMO_MUSIC),
    assets: clone(DEMO_ASSETS),
    premiumItems: clone(DEMO_PREMIUM_ITEMS),
  };
}

declare global {
  var __qfStore: Store | undefined;
}

export const store: Store = globalThis.__qfStore ?? (globalThis.__qfStore = createInitialStore());

export function newId(prefix: string) {
  return `${prefix}-${globalThis.crypto.randomUUID().slice(0, 8)}`;
}
