import { gridBackgroundStyle } from "@/lib/maps";
import type { GridType } from "@/lib/types";

export function GridOverlay({ gridType, gridSize, enabled }: { gridType: GridType; gridSize: number; enabled: boolean }) {
  if (!enabled || gridType === "none") return null;
  return <div className="pointer-events-none absolute inset-0" style={gridBackgroundStyle(gridType, gridSize)} />;
}
