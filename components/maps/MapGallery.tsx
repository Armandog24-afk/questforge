"use client";

import { cn } from "@/lib/utils";
import type { QFMap } from "@/lib/types";

export function MapGallery({
  maps,
  activeMapId,
  onSelect,
}: {
  maps: QFMap[];
  activeMapId?: string | null;
  onSelect: (map: QFMap) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {maps.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onSelect(m)}
          className={cn(
            "group overflow-hidden rounded-xl border border-border text-left transition-colors hover:border-accent-purple/50",
            activeMapId === m.id && "border-accent-purple qf-glow",
          )}
        >
          <div className="qf-map-checker aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${m.imageUrl})` }} />
          <p className="truncate px-2 py-1.5 text-xs">{m.name}</p>
        </button>
      ))}
    </div>
  );
}
