"use client";

import * as React from "react";
import { Map as MapIcon } from "lucide-react";
import { MapControls } from "@/components/room/MapControls";
import { TokenLayer } from "@/components/tokens/TokenLayer";
import { GridOverlay } from "@/components/maps/GridOverlay";
import { EmptyState } from "@/components/ui/EmptyState";
import { clamp } from "@/lib/utils";
import type { MemberRole, QFMap, QFToken, Scene } from "@/lib/types";

export function MapCanvas({
  map,
  scene,
  tokens,
  role,
  userId,
  selectedTokenId,
  onSelectToken,
  onMoveTokenEnd,
  onToggleGrid,
}: {
  map: QFMap | null;
  scene: Scene;
  tokens: QFToken[];
  role: MemberRole | null;
  userId: string;
  selectedTokenId?: string | null;
  onSelectToken: (token: QFToken) => void;
  onMoveTokenEnd: (tokenId: string, x: number, y: number) => void;
  onToggleGrid: () => void;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [locked, setLocked] = React.useState(false);
  const panStart = React.useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  function handlePanStart(e: React.PointerEvent) {
    if (locked || (e.target as HTMLElement).closest("button")) return;
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }

  function handlePanMove(e: React.PointerEvent) {
    if (!panStart.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setPan({ x: panStart.current.panX + dx, y: panStart.current.panY + dy });
  }

  function handlePanEnd() {
    panStart.current = null;
  }

  return (
    <div className="relative flex-1 overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
      {map ? (
        <div
          className="relative h-full w-full cursor-move overflow-hidden"
          onPointerDown={handlePanStart}
          onPointerMove={handlePanMove}
          onPointerUp={handlePanEnd}
          onPointerLeave={handlePanEnd}
        >
          <div
            ref={containerRef}
            className="qf-map-checker absolute inset-0 bg-cover bg-center transition-transform"
            style={{
              backgroundImage: `url(${map.imageUrl})`,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center",
            }}
          >
            <GridOverlay gridType={scene.gridType} gridSize={scene.gridSize} enabled={scene.gridEnabled} />
            <TokenLayer
              containerRef={containerRef}
              tokens={tokens}
              role={role}
              userId={userId}
              selectedId={selectedTokenId}
              onSelect={onSelectToken}
              onMoveEnd={onMoveTokenEnd}
            />
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<MapIcon className="size-6" />}
          title="Nessuna mappa assegnata"
          description="Scegli una mappa demo, generane una con l'IA o caricane una tua dalla sidebar."
          className="h-full justify-center border-none"
        />
      )}
      <MapControls
        gridEnabled={scene.gridEnabled}
        locked={locked}
        canManage={role === "master"}
        onZoomIn={() => setZoom((z) => clamp(z + 0.15, 0.5, 3))}
        onZoomOut={() => setZoom((z) => clamp(z - 0.15, 0.5, 3))}
        onReset={() => {
          setZoom(1);
          setPan({ x: 0, y: 0 });
        }}
        onToggleGrid={onToggleGrid}
        onToggleLock={() => setLocked((l) => !l)}
      />
    </div>
  );
}
