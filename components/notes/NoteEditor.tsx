"use client";

import * as React from "react";
import { Lock, Plus, Users } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { NoteVisibility } from "@/lib/types";

export function NoteEditor({
  isMaster,
  onCreate,
}: {
  isMaster: boolean;
  onCreate: (input: { title: string; content: string; visibility: NoteVisibility; tags: string[] }) => Promise<void>;
}) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [visibility, setVisibility] = React.useState<NoteVisibility>("shared");
  const [tagsInput, setTagsInput] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function submit() {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await onCreate({
        title: title.trim(),
        content: content.trim(),
        visibility,
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setTitle("");
      setContent("");
      setTagsInput("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2 rounded-xl border border-border bg-surface-2 p-3">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titolo nota" maxLength={120} />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Contenuto..."
        maxLength={10000}
        className="min-h-[80px]"
      />
      <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Tag separati da virgola" />
      <div className="flex items-center justify-between">
        {isMaster ? (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setVisibility("shared")}
              className={cn(
                "flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs",
                visibility === "shared" && "border-success/50 bg-success/15 text-[#86efac]",
              )}
            >
              <Users className="size-3" /> Condivisa
            </button>
            <button
              type="button"
              onClick={() => setVisibility("master")}
              className={cn(
                "flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs",
                visibility === "master" && "border-warning/50 bg-warning/15 text-[#fcd34d]",
              )}
            >
              <Lock className="size-3" /> Master
            </button>
          </div>
        ) : (
          <span />
        )}
        <Button size="sm" onClick={submit} disabled={saving}>
          <Plus className="size-3.5" /> Salva nota
        </Button>
      </div>
    </div>
  );
}
