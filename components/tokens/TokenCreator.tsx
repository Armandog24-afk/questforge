"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { cn, initials } from "@/lib/utils";
import { TOKEN_COLORS, TOKEN_ICONS } from "@/lib/tokens";

export function TokenCreator({
  onCreate,
}: {
  onCreate: (input: { name: string; color: string }) => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState<string>(TOKEN_COLORS[0]);
  const [saving, setSaving] = React.useState(false);

  async function submit() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onCreate({ name: name.trim(), color });
      setName("");
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <Plus className="size-4" /> Nuovo token
        </Button>
      </DialogTrigger>
      <DialogContent title="Crea token">
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="token-name">Nome</Label>
            <Input id="token-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Goblin, Guardia..." />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TOKEN_ICONS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setName(label)}
                className="rounded-full border border-border px-2.5 py-1 text-xs text-muted hover:border-accent-purple/50"
              >
                {label}
              </button>
            ))}
          </div>
          <div>
            <Label>Colore</Label>
            <div className="flex flex-wrap gap-2">
              {TOKEN_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={cn("size-8 rounded-full border-2 border-white/40", color === c && "ring-2 ring-accent-purple")}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 p-3">
            <span
              style={{ backgroundColor: color }}
              className="flex size-9 items-center justify-center rounded-full text-xs font-bold text-white"
            >
              {initials(name || "?")}
            </span>
            <span className="text-sm text-muted">Anteprima token</span>
          </div>
          <Button onClick={submit} disabled={saving} className="w-full">
            Crea token
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
