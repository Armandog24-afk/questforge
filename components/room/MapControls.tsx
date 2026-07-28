import { Grid3x3, Lock, Maximize, Unlock, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function MapControls({
  gridEnabled,
  locked,
  canManage,
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleGrid,
  onToggleLock,
}: {
  gridEnabled: boolean;
  locked: boolean;
  canManage: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleGrid: () => void;
  onToggleLock: () => void;
}) {
  return (
    <div className="absolute bottom-3 right-3 z-10 flex gap-1 rounded-xl border border-border bg-surface/90 p-1 backdrop-blur">
      <Button variant="ghost" size="icon" onClick={onZoomIn} aria-label="Zoom avanti">
        <ZoomIn className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onZoomOut} aria-label="Zoom indietro">
        <ZoomOut className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onReset} aria-label="Reset vista">
        <Maximize className="size-4" />
      </Button>
      {canManage && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleGrid}
            className={cn(gridEnabled && "text-accent-purple")}
            aria-label="Mostra/nascondi griglia"
          >
            <Grid3x3 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleLock} aria-label="Blocca/sblocca mappa">
            {locked ? <Lock className="size-4" /> : <Unlock className="size-4" />}
          </Button>
        </>
      )}
    </div>
  );
}
