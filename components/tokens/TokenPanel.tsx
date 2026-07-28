"use client";

import { Copy, Eye, EyeOff, Lock, Trash2, Unlock } from "lucide-react";
import { TokenCreator } from "@/components/tokens/TokenCreator";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { initials } from "@/lib/utils";
import type { MemberRole, QFToken } from "@/lib/types";

export function TokenPanel({
  tokens,
  role,
  onCreate,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  tokens: QFToken[];
  role: MemberRole | null;
  onCreate: (input: { name: string; color: string }) => Promise<void>;
  onUpdate: (id: string, patch: Partial<QFToken>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (token: QFToken) => void;
}) {
  const isMaster = role === "master";

  return (
    <div className="space-y-3">
      {isMaster && <TokenCreator onCreate={onCreate} />}
      {tokens.length === 0 ? (
        <EmptyState title="Nessun token in questa scena" />
      ) : (
        <div className="flex flex-col gap-1.5">
          {tokens.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-2 p-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  style={{ backgroundColor: t.color }}
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                >
                  {initials(t.name)}
                </span>
                <span className="truncate text-sm">{t.name}</span>
              </div>
              {isMaster && (
                <div className="flex shrink-0 gap-0.5">
                  <Button variant="ghost" size="icon" className="size-7" onClick={() => onUpdate(t.id, { visible: !t.visible })} aria-label="Mostra/nascondi">
                    {t.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7" onClick={() => onUpdate(t.id, { locked: !t.locked })} aria-label="Blocca/sblocca">
                    {t.locked ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7" onClick={() => onDuplicate(t)} aria-label="Duplica">
                    <Copy className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7" onClick={() => onDelete(t.id)} aria-label="Elimina">
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
