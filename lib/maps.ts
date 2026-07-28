import type { GridType } from "@/lib/types";

export function gridBackgroundStyle(gridType: GridType, gridSize: number, color = "rgba(255,255,255,0.08)") {
  if (gridType === "none") return {};
  if (gridType === "hex") {
    const w = gridSize * 1.75;
    const h = gridSize * 1.5;
    return {
      backgroundImage: `linear-gradient(30deg, ${color} 1px, transparent 1px), linear-gradient(150deg, ${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: `${w}px ${h}px`,
    } as const;
  }
  return {
    backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
    backgroundSize: `${gridSize}px ${gridSize}px`,
  } as const;
}

export const MAP_UPLOAD_LIMITS = {
  maxBytes: 8 * 1024 * 1024,
  acceptedTypes: ["image/png", "image/jpeg", "image/webp"],
} as const;
