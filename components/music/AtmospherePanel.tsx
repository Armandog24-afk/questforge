"use client";

import * as React from "react";
import { MusicTrackCard } from "@/components/music/MusicTrackCard";
import { Badge } from "@/components/ui/Badge";
import type { MusicTrackRecord } from "@/lib/types";

export function AtmospherePanel({
  tracks,
  activeMusicId,
  onSetActive,
}: {
  tracks: MusicTrackRecord[];
  activeMusicId?: string | null;
  onSetActive?: (id: string) => void;
}) {
  const categories = Array.from(new Set(tracks.map((t) => t.category)));
  const [filter, setFilter] = React.useState<string | null>(null);
  const visible = filter ? tracks.filter((t) => t.category === filter) : tracks;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <Badge
          variant={filter === null ? "purple" : "outline"}
          className="cursor-pointer"
          onClick={() => setFilter(null)}
        >
          Tutte
        </Badge>
        {categories.map((c) => (
          <Badge key={c} variant={filter === c ? "purple" : "outline"} className="cursor-pointer" onClick={() => setFilter(c)}>
            {c}
          </Badge>
        ))}
      </div>
      <div className="flex max-h-96 flex-col gap-2 overflow-y-auto qf-scrollbar-thin pr-1">
        {visible.map((t) => (
          <MusicTrackCard
            key={t.id}
            track={t}
            active={t.id === activeMusicId}
            onSetActive={onSetActive ? () => onSetActive(t.id) : undefined}
          />
        ))}
      </div>
      <p className="text-xs text-muted">
        Tracce demo generate proceduralmente (nessun file audio commerciale). Genera atmosfera con IA in arrivo.
      </p>
    </div>
  );
}
