"use client";

import * as React from "react";
import { RoomHeader } from "@/components/room/RoomHeader";
import { SceneSidebar } from "@/components/room/SceneSidebar";
import { MapCanvas } from "@/components/room/MapCanvas";
import { RightPanel } from "@/components/room/RightPanel";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Layers, MessagesSquare } from "lucide-react";
import { TOKEN_COLORS } from "@/lib/tokens";
import type {
  AppUser,
  Campaign,
  Character,
  ChatMessageRecord,
  DiceRollRecord,
  MemberRole,
  MusicTrackRecord,
  NoteRecord,
  QFMap,
  QFToken,
  Scene,
} from "@/lib/types";

export function GameRoom({
  campaign,
  scene: initialScene,
  scenes,
  role,
  user,
  initialMap,
  maps,
  characters,
  initialTokens,
  initialDiceRolls,
  initialChat,
  initialNotes,
  musicTracks,
}: {
  campaign: Campaign;
  scene: Scene;
  scenes: Scene[];
  role: MemberRole | null;
  user: AppUser;
  initialMap: QFMap | null;
  maps: QFMap[];
  characters: Character[];
  initialTokens: QFToken[];
  initialDiceRolls: DiceRollRecord[];
  initialChat: ChatMessageRecord[];
  initialNotes: NoteRecord[];
  musicTracks: MusicTrackRecord[];
}) {
  const { toast } = useToast();
  const [scene, setScene] = React.useState(initialScene);
  const [map, setMap] = React.useState<QFMap | null>(initialMap);
  const [tokens, setTokens] = React.useState(initialTokens);
  const [diceRolls, setDiceRolls] = React.useState(initialDiceRolls);
  const [chat, setChat] = React.useState(initialChat);
  const [selectedTokenId, setSelectedTokenId] = React.useState<string | null>(null);

  const isMaster = role === "master";

  function appendChat(message: ChatMessageRecord | null) {
    if (message) setChat((prev) => [...prev, message]);
  }

  async function handleMoveTokenEnd(tokenId: string, x: number, y: number) {
    setTokens((prev) => prev.map((t) => (t.id === tokenId ? { ...t, xPosition: x, yPosition: y } : t)));
    const res = await fetch(`/api/tokens/${tokenId}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xPosition: x, yPosition: y }),
    });
    const data = await res.json().catch(() => null);
    if (data?.message) appendChat(data.message);
  }

  async function handleCreateToken(input: { name: string; color: string }) {
    const res = await fetch("/api/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId: campaign.id,
        sceneId: scene.id,
        name: input.name,
        color: input.color,
        xPosition: 50,
        yPosition: 50,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast({ title: "Impossibile creare il token", description: data.error, variant: "error" });
      return;
    }
    setTokens((prev) => [...prev, data.token]);
  }

  async function handleUpdateToken(id: string, patch: Partial<QFToken>) {
    setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    await fetch(`/api/tokens/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function handleDeleteToken(id: string) {
    setTokens((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tokens/${id}`, { method: "DELETE" });
  }

  async function handleDuplicateToken(token: QFToken) {
    const color = TOKEN_COLORS[Math.floor(Math.random() * TOKEN_COLORS.length)];
    await handleCreateToken({ name: `${token.name} (copia)`, color });
  }

  async function handleCreateScene(name: string) {
    const res = await fetch("/api/scenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: campaign.id, name }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast({ title: "Impossibile creare la scena", description: data.error, variant: "error" });
      return;
    }
    toast({ title: "Scena forgiata!", description: name, variant: "success" });
    window.location.href = `/room/${data.scene.id}`;
  }

  async function assignMap(input: { id?: string; name: string; imageUrl: string }) {
    if (!isMaster) return;
    let mapId = input.id;
    let mapRecord: QFMap | null = maps.find((m) => m.id === input.id) ?? null;

    if (!mapId) {
      const res = await fetch("/api/maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: campaign.id, name: input.name, imageUrl: input.imageUrl, source: "upload" }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Impossibile salvare la mappa", description: data.error, variant: "error" });
        return;
      }
      mapId = data.map.id;
      mapRecord = data.map;
    }

    await fetch(`/api/scenes/${scene.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mapId }),
    });
    setScene((prev) => ({ ...prev, mapId: mapId! }));
    setMap(mapRecord ?? { id: mapId!, campaignId: campaign.id, name: input.name, imageUrl: input.imageUrl, tags: [], source: "upload", createdBy: user.id, createdAt: new Date().toISOString() });
    toast({ title: "Mappa attiva aggiornata", variant: "success" });
  }

  async function handleToggleGrid() {
    if (!isMaster) return;
    const gridEnabled = !scene.gridEnabled;
    setScene((prev) => ({ ...prev, gridEnabled }));
    await fetch(`/api/scenes/${scene.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gridEnabled }),
    });
  }

  async function handleSendChat(message: string) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: campaign.id, sceneId: scene.id, type: "user", message }),
    });
    const data = await res.json();
    if (res.ok) appendChat(data.message);
  }

  function handleSetActiveMusic(id: string) {
    if (!isMaster) return;
    setScene((prev) => ({ ...prev, activeMusicId: id }));
  }

  async function handleSaveAINote(text: string) {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId: campaign.id,
        sceneId: scene.id,
        title: "Generato dall'AI Master Assistant",
        content: text,
        visibility: isMaster ? "master" : "shared",
        tags: ["ai"],
      }),
    });
    if (res.ok) toast({ title: "Salvato nelle note", variant: "success" });
  }

  const sidebarProps = {
    campaignId: campaign.id,
    scenes,
    currentScene: scene,
    maps,
    characters,
    tokens,
    role,
    onCreateScene: handleCreateScene,
    onSelectMap: assignMap,
    onCreateToken: handleCreateToken,
    onUpdateToken: handleUpdateToken,
    onDeleteToken: handleDeleteToken,
    onDuplicateToken: handleDuplicateToken,
  };

  const rightPanelProps = {
    campaignId: campaign.id,
    sceneId: scene.id,
    activeMusicId: scene.activeMusicId,
    role,
    user,
    diceRolls,
    chat,
    notes: initialNotes,
    musicTracks,
    onRolled: (roll: DiceRollRecord) => setDiceRolls((prev) => [roll, ...prev]),
    onSendChat: handleSendChat,
    onSetActiveMusic: handleSetActiveMusic,
    onSaveAINote: handleSaveAINote,
    onUseAIMap: (assetUrl: string) => assignMap({ name: "Mappa generata IA", imageUrl: assetUrl }),
  };

  return (
    <div className="flex h-screen flex-col">
      <RoomHeader campaign={campaign} scene={scene} role={role} />
      <div className="flex flex-1 gap-3 overflow-hidden p-3">
        <aside className="hidden w-72 shrink-0 rounded-[var(--radius-card)] border border-border bg-surface p-3 lg:flex">
          <SceneSidebar {...sidebarProps} />
        </aside>

        <div className="flex flex-1 flex-col gap-3 overflow-hidden">
          <div className="flex gap-2 lg:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary" size="sm">
                  <Layers className="size-4" /> Scene e mappe
                </Button>
              </DrawerTrigger>
              <DrawerContent title="Scene, mappe, token e PG" side="left">
                <SceneSidebar {...sidebarProps} />
              </DrawerContent>
            </Drawer>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary" size="sm">
                  <MessagesSquare className="size-4" /> Dadi, IA, chat
                </Button>
              </DrawerTrigger>
              <DrawerContent title="Strumenti di sessione" side="right">
                <RightPanel {...rightPanelProps} />
              </DrawerContent>
            </Drawer>
          </div>

          <MapCanvas
            map={map}
            scene={scene}
            tokens={tokens}
            role={role}
            userId={user.id}
            selectedTokenId={selectedTokenId}
            onSelectToken={(t) => setSelectedTokenId(t.id)}
            onMoveTokenEnd={handleMoveTokenEnd}
            onToggleGrid={handleToggleGrid}
          />
        </div>

        <aside className="hidden w-80 shrink-0 rounded-[var(--radius-card)] border border-border bg-surface p-3 xl:flex">
          <RightPanel {...rightPanelProps} />
        </aside>
      </div>
    </div>
  );
}
