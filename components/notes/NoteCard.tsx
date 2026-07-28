"use client";

import { Lock, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";
import type { NoteRecord } from "@/lib/types";

export function NoteCard({
  note,
  canManage,
  onDelete,
}: {
  note: NoteRecord;
  canManage: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3">
      <div className="mb-1 flex items-start justify-between gap-2">
        <p className="font-medium">{note.title}</p>
        <Badge variant={note.visibility === "master" ? "warning" : "success"}>
          {note.visibility === "master" ? <Lock className="size-3" /> : <Users className="size-3" />}
          {note.visibility === "master" ? "Master" : "Condivisa"}
        </Badge>
      </div>
      <p className="whitespace-pre-wrap text-sm text-muted">{note.content}</p>
      {note.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {note.tags.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
      )}
      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted">{formatDateTime(note.updatedAt)}</span>
        {canManage && (
          <Button variant="ghost" size="sm" onClick={() => onDelete(note.id)} aria-label="Elimina nota">
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
