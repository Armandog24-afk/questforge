"use client";

import * as React from "react";
import { CharacterCard } from "@/components/characters/CharacterCard";
import { CharacterEditor } from "@/components/characters/CharacterEditor";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { Users } from "lucide-react";
import type { Campaign, Character } from "@/lib/types";

export function CharactersPageClient({
  campaigns,
  initialCharacters,
}: {
  campaigns: Campaign[];
  initialCharacters: Character[];
}) {
  const [characters, setCharacters] = React.useState(initialCharacters);
  const { toast } = useToast();

  async function handleCreate(input: {
    campaignId: string;
    name: string;
    roleLabel?: string;
    originLabel?: string;
    mainResource?: string;
    description?: string;
    backstory?: string;
    color: string;
  }) {
    const res = await fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      toast({ title: "Impossibile creare il personaggio", description: data.error, variant: "error" });
      return;
    }
    setCharacters((prev) => [...prev, data.character]);
    toast({ title: "Personaggio creato", variant: "success" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Personaggi</h1>
        {campaigns.length > 0 && <CharacterEditor campaigns={campaigns} onCreate={handleCreate} />}
      </div>

      {characters.length === 0 ? (
        <EmptyState icon={<Users className="size-6" />} title="Nessun personaggio ancora" description="Crea il tuo primo personaggio per una campagna." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((c) => (
            <CharacterCard key={c.id} character={c} />
          ))}
        </div>
      )}
    </div>
  );
}
