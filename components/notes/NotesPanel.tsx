"use client";

import * as React from "react";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { NotebookPen } from "lucide-react";
import type { AppUser, MemberRole, NoteRecord, NoteVisibility } from "@/lib/types";

export function NotesPanel({
  campaignId,
  sceneId,
  role,
  user,
  initialNotes,
}: {
  campaignId: string;
  sceneId?: string;
  role: MemberRole | null;
  user: AppUser;
  initialNotes: NoteRecord[];
}) {
  const [notes, setNotes] = React.useState(initialNotes);
  const { toast } = useToast();

  async function handleCreate(input: { title: string; content: string; visibility: NoteVisibility; tags: string[] }) {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, sceneId, ...input }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast({ title: "Impossibile salvare la nota", description: data.error, variant: "error" });
      return;
    }
    setNotes((prev) => [data.note, ...prev]);
    toast({ title: "Nota salvata", variant: "success" });
  }

  async function handleDelete(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await fetch(`/api/notes/${id}?campaignId=${campaignId}`, { method: "DELETE" });
  }

  return (
    <div className="space-y-3">
      <NoteEditor isMaster={role === "master"} onCreate={handleCreate} />
      {notes.length === 0 ? (
        <EmptyState icon={<NotebookPen className="size-6" />} title="Nessuna nota" description="Crea la prima nota di campagna." />
      ) : (
        <div className="flex max-h-96 flex-col gap-2 overflow-y-auto qf-scrollbar-thin pr-1">
          {notes.map((n) => (
            <NoteCard key={n.id} note={n} canManage={role === "master" || n.createdBy === user.id} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
