"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { MapGallery } from "@/components/maps/MapGallery";
import { MapUploader } from "@/components/maps/MapUploader";
import { MapGeneratorPanel } from "@/components/maps/MapGeneratorPanel";
import { TokenPanel } from "@/components/tokens/TokenPanel";
import { CharacterCard } from "@/components/characters/CharacterCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import type { Character, MemberRole, QFMap, QFToken, Scene } from "@/lib/types";

export function SceneSidebar({
  campaignId,
  scenes,
  currentScene,
  maps,
  characters,
  tokens,
  role,
  onCreateScene,
  onSelectMap,
  onCreateToken,
  onUpdateToken,
  onDeleteToken,
  onDuplicateToken,
}: {
  campaignId: string;
  scenes: Scene[];
  currentScene: Scene;
  maps: QFMap[];
  characters: Character[];
  tokens: QFToken[];
  role: MemberRole | null;
  onCreateScene: (name: string) => Promise<void>;
  onSelectMap: (map: { id?: string; name: string; imageUrl: string }) => void;
  onCreateToken: (input: { name: string; color: string }) => Promise<void>;
  onUpdateToken: (id: string, patch: Partial<QFToken>) => void;
  onDeleteToken: (id: string) => void;
  onDuplicateToken: (token: QFToken) => void;
}) {
  const [newSceneName, setNewSceneName] = React.useState("");
  const isMaster = role === "master";

  return (
    <Tabs defaultValue="scenes" className="flex h-full flex-col">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="scenes">Scene</TabsTrigger>
        <TabsTrigger value="maps">Mappe</TabsTrigger>
        <TabsTrigger value="tokens">Token</TabsTrigger>
        <TabsTrigger value="characters">PG</TabsTrigger>
      </TabsList>

      <TabsContent value="scenes" className="flex-1 space-y-2 overflow-y-auto qf-scrollbar-thin">
        {scenes.map((s) => (
          <Link
            key={s.id}
            href={`/room/${s.id}`}
            className={cn(
              "flex items-center justify-between rounded-xl border border-border bg-surface-2 p-2.5 text-sm hover:border-accent-purple/40",
              s.id === currentScene.id && "border-accent-purple bg-accent-purple/10",
            )}
          >
            <span className="truncate">{s.name}</span>
            {s.isActive && <Badge variant="success">Attiva</Badge>}
          </Link>
        ))}
        {isMaster && (
          <div className="flex gap-2 pt-2">
            <Input value={newSceneName} onChange={(e) => setNewSceneName(e.target.value)} placeholder="Nuova scena..." />
            <Button
              size="sm"
              onClick={async () => {
                if (!newSceneName.trim()) return;
                await onCreateScene(newSceneName.trim());
                setNewSceneName("");
              }}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="maps" className="flex-1 space-y-4 overflow-y-auto qf-scrollbar-thin">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Mappe della campagna</p>
          <MapGallery maps={maps} activeMapId={currentScene.mapId} onSelect={onSelectMap} />
        </div>
        {isMaster && (
          <>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
                <Plus className="size-3" /> Carica mappa
              </p>
              <MapUploader onUploaded={onSelectMap} />
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
                <Sparkles className="size-3" /> Genera con IA
              </p>
              <MapGeneratorPanel campaignId={campaignId} onUseAsMap={(url) => onSelectMap({ name: "Mappa generata", imageUrl: url })} />
            </div>
          </>
        )}
      </TabsContent>

      <TabsContent value="tokens" className="flex-1 overflow-y-auto qf-scrollbar-thin">
        <TokenPanel
          tokens={tokens}
          role={role}
          onCreate={onCreateToken}
          onUpdate={onUpdateToken}
          onDelete={onDeleteToken}
          onDuplicate={onDuplicateToken}
        />
      </TabsContent>

      <TabsContent value="characters" className="flex-1 space-y-2 overflow-y-auto qf-scrollbar-thin">
        {characters.length === 0 ? (
          <EmptyState title="Nessun personaggio" />
        ) : (
          characters.map((c) => <CharacterCard key={c.id} character={c} compact />)
        )}
      </TabsContent>
    </Tabs>
  );
}
