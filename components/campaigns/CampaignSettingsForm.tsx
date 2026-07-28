"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { GENRES, TONES } from "@/lib/brand";
import type { Campaign, CampaignPrivacy } from "@/lib/types";

export function CampaignSettingsForm({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = React.useState(campaign.name);
  const [description, setDescription] = React.useState(campaign.description);
  const [genre, setGenre] = React.useState(campaign.genre);
  const [tone, setTone] = React.useState(campaign.tone);
  const [gameSystem, setGameSystem] = React.useState(campaign.gameSystem);
  const [privacy, setPrivacy] = React.useState<CampaignPrivacy>(campaign.privacy);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, genre, tone, gameSystem, privacy }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Impostazioni salvate", variant: "success" });
      router.refresh();
    } catch {
      toast({ title: "Salvataggio fallito", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Eliminare definitivamente "${campaign.name}"? L'azione non è reversibile.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Campagna eliminata", variant: "success" });
      router.push("/campaigns");
    } catch {
      toast({ title: "Impossibile eliminare la campagna", variant: "error" });
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dettagli campagna</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="description">Descrizione</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="gameSystem">Sistema di gioco</Label>
            <Input id="gameSystem" value={gameSystem} onChange={(e) => setGameSystem(e.target.value)} />
          </div>
          <div>
            <Label>Genere</Label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenre(g)}
                  className={cn(
                    "rounded-full border border-border px-3 py-1 text-xs text-muted hover:border-accent-purple/50",
                    genre === g && "border-accent-purple bg-accent-purple/15 text-accent-purple",
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Tono</Label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={cn(
                    "rounded-full border border-border px-3 py-1 text-xs text-muted hover:border-accent-purple/50",
                    tone === t && "border-accent-purple bg-accent-purple/15 text-accent-purple",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Privacy</Label>
            <div className="flex flex-wrap gap-2">
              {(["private", "invite", "public"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrivacy(p)}
                  className={cn(
                    "rounded-full border border-border px-3 py-1 text-xs capitalize text-muted hover:border-accent-purple/50",
                    privacy === p && "border-accent-purple bg-accent-purple/15 text-accent-purple",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="size-4" /> Salva modifiche
          </Button>
        </CardContent>
      </Card>

      <Card className="border-error/30">
        <CardHeader>
          <CardTitle className="text-base text-error">Zona pericolosa</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="size-4" /> Elimina campagna
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
