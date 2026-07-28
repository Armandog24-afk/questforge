import { AudioPlayer } from "@/components/music/AudioPlayer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { MusicTrackRecord } from "@/lib/types";

export function MusicTrackCard({
  track,
  active,
  onSetActive,
}: {
  track: MusicTrackRecord;
  active?: boolean;
  onSetActive?: () => void;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-2 p-3", active && "border-accent-purple/50 bg-accent-purple/10")}>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{track.name}</p>
        <div className="mt-1 flex gap-1.5">
          <Badge variant="outline">{track.category}</Badge>
          <Badge variant="outline">{track.mood}</Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <AudioPlayer audioUrl={track.audioUrl} name={track.name} />
        {onSetActive && (
          <Button size="sm" variant={active ? "primary" : "ghost"} onClick={onSetActive}>
            {active ? "Attiva" : "Usa in scena"}
          </Button>
        )}
      </div>
    </div>
  );
}
