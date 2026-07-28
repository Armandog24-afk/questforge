"use client";

import * as React from "react";
import { SystemMessage } from "@/components/chat/SystemMessage";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessageSquare } from "lucide-react";
import { formatDateTime, initials } from "@/lib/utils";
import type { ChatMessageRecord } from "@/lib/types";

export function ChatLog({ messages, currentUserId }: { messages: ChatMessageRecord[]; currentUserId: string }) {
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  if (messages.length === 0) {
    return <EmptyState icon={<MessageSquare className="size-6" />} title="Nessun messaggio" description="Il log della sessione apparirà qui." />;
  }

  return (
    <div className="flex max-h-96 flex-col gap-1.5 overflow-y-auto qf-scrollbar-thin pr-1">
      {messages.map((m) =>
        m.type === "user" ? (
          <div
            key={m.id}
            className={`flex flex-col rounded-xl px-3 py-2 text-sm ${
              m.userId === currentUserId ? "ml-8 bg-accent-purple/15" : "mr-8 bg-surface-2"
            }`}
          >
            <div className="mb-0.5 flex items-center gap-1.5 text-xs text-muted">
              <span className="flex size-4 items-center justify-center rounded-full bg-accent-purple/20 text-[9px] font-semibold text-accent-purple">
                {initials(m.userName)}
              </span>
              {m.userName}
              <span className="ml-auto font-mono text-[10px]">{formatDateTime(m.createdAt)}</span>
            </div>
            <p className="break-words">{m.message}</p>
          </div>
        ) : (
          <SystemMessage key={m.id} message={m} />
        ),
      )}
      <div ref={endRef} />
    </div>
  );
}
