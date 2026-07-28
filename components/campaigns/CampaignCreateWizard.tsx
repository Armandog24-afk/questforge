"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { GAME_SYSTEM_EXAMPLES, GENRES, TONES } from "@/lib/brand";
import type { CampaignPrivacy } from "@/lib/types";

const STEPS = ["Nome", "Genere", "Tono", "Sistema", "Privacy"] as const;

export function CampaignCreateWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [genre, setGenre] = React.useState<string>(GENRES[0]);
  const [tone, setTone] = React.useState<string>(TONES[0]);
  const [gameSystem, setGameSystem] = React.useState("");
  const [privacy, setPrivacy] = React.useState<CampaignPrivacy>("invite");

  const canProceed = [name.trim().length >= 2, Boolean(genre), Boolean(tone), gameSystem.trim().length > 0, true][step];

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, genre, tone, gameSystem, privacy }),
      });
      if (!res.ok) throw new Error("Errore nella creazione");
      const data = await res.json();
      toast({ title: "Campagna forgiata!", description: name, variant: "success" });
      router.push(`/campaigns/${data.campaign.id}`);
    } catch {
      toast({ title: "Qualcosa è andato storto", description: "Riprova tra poco.", variant: "error" });
      setSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <div className="mb-2 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full bg-surface-2",
                i <= step && "bg-accent-purple",
              )}
            />
          ))}
        </div>
        <CardTitle>
          Passo {step + 1} di {STEPS.length} — {STEPS[step]}
        </CardTitle>
        <CardDescription>Forgia una nuova campagna in meno di un minuto.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome campagna</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. La Cripta delle Lanterne" autoFocus />
            </div>
            <div>
              <Label htmlFor="description">Descrizione (opzionale)</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Di cosa parla questa avventura?" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <Label>Genere</Label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenre(g)}
                  className={cn(
                    "rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:border-accent-purple/50",
                    genre === g && "border-accent-purple bg-accent-purple/15 text-accent-purple",
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <Label>Tono</Label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={cn(
                    "rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:border-accent-purple/50",
                    tone === t && "border-accent-purple bg-accent-purple/15 text-accent-purple",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="gameSystem">Sistema di gioco</Label>
              <Input
                id="gameSystem"
                value={gameSystem}
                onChange={(e) => setGameSystem(e.target.value)}
                placeholder="Es. D&D 5e, Homebrew..."
                autoFocus
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {GAME_SYSTEM_EXAMPLES.map((s) => (
                <Badge key={s} variant="outline" className="cursor-pointer" onClick={() => setGameSystem(s)}>
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-2">
            <Label>Privacy</Label>
            {(
              [
                { value: "private", label: "Privata", desc: "Solo su invito diretto del Master." },
                { value: "invite", label: "Link invito", desc: "Chiunque abbia il codice può unirsi." },
                { value: "public", label: "Pubblica", desc: "Visibile a tutti (disponibile in futuro)." },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPrivacy(opt.value)}
                className={cn(
                  "flex w-full flex-col rounded-xl border border-border p-3 text-left hover:border-accent-purple/50",
                  privacy === opt.value && "border-accent-purple bg-accent-purple/10",
                )}
              >
                <span className="font-medium">{opt.label}</span>
                <span className="text-xs text-muted">{opt.desc}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft className="size-4" /> Indietro
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={!canProceed}>
              Avanti <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Forgia la campagna
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
