"use client";

import * as React from "react";
import { Plus, Save } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { TOKEN_COLORS } from "@/lib/tokens";
import type { Campaign, Character } from "@/lib/types";

export function CharacterEditor({
  campaigns,
  onCreate,
  trigger,
  character,
}: {
  campaigns: Campaign[];
  onCreate: (input: {
    campaignId: string;
    name: string;
    roleLabel?: string;
    originLabel?: string;
    mainResource?: string;
    description?: string;
    backstory?: string;
    color: string;
  }) => Promise<void>;
  trigger?: React.ReactNode;
  character?: Character;
}) {
  const [open, setOpen] = React.useState(false);
  const [campaignId, setCampaignId] = React.useState(campaigns[0]?.id ?? "");
  const [name, setName] = React.useState(character?.name ?? "");
  const [roleLabel, setRoleLabel] = React.useState(character?.roleLabel ?? "");
  const [originLabel, setOriginLabel] = React.useState(character?.originLabel ?? "");
  const [mainResource, setMainResource] = React.useState(character?.mainResource ?? "");
  const [description, setDescription] = React.useState(character?.description ?? "");
  const [backstory, setBackstory] = React.useState(character?.backstory ?? "");
  const [color, setColor] = React.useState(character?.color ?? TOKEN_COLORS[3]);
  const [saving, setSaving] = React.useState(false);

  async function submit() {
    if (!name.trim() || !campaignId) return;
    setSaving(true);
    try {
      await onCreate({
        campaignId,
        name: name.trim(),
        roleLabel: roleLabel || undefined,
        originLabel: originLabel || undefined,
        mainResource: mainResource || undefined,
        description: description || undefined,
        backstory: backstory || undefined,
        color,
      });
      setOpen(false);
      setName("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="size-4" /> Nuovo personaggio
          </Button>
        )}
      </DialogTrigger>
      <DialogContent title="Personaggio" className="max-h-[85vh] overflow-y-auto qf-scrollbar-thin">
        <div className="mt-4 space-y-3">
          <div>
            <Label htmlFor="char-campaign">Campagna</Label>
            <select
              id="char-campaign"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="flex h-10 w-full rounded-[var(--radius-button)] border border-border bg-surface-2 px-3 text-sm"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="char-name">Nome</Label>
            <Input id="char-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="char-role">Ruolo/archetipo</Label>
              <Input id="char-role" value={roleLabel} onChange={(e) => setRoleLabel(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="char-origin">Specie/origine</Label>
              <Input id="char-origin" value={originLabel} onChange={(e) => setOriginLabel(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="char-resource">Risorsa principale</Label>
            <Input id="char-resource" value={mainResource} onChange={(e) => setMainResource(e.target.value)} placeholder="Es. Punti Ferita: 30/30" />
          </div>
          <div>
            <Label htmlFor="char-desc">Descrizione breve</Label>
            <Textarea id="char-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="char-backstory">Backstory</Label>
            <Textarea id="char-backstory" value={backstory} onChange={(e) => setBackstory(e.target.value)} />
          </div>
          <div>
            <Label>Colore token</Label>
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
          <Button onClick={submit} disabled={saving} className="w-full">
            <Save className="size-4" /> Salva personaggio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
