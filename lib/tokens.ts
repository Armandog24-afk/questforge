import { clamp } from "@/lib/utils";

export const TOKEN_ICONS = [
  "Guerriero",
  "Maga",
  "Ladro",
  "Investigatrice",
  "Robot",
  "Goblin",
  "Cultista",
  "Alieno",
  "Mostro",
  "Marker generico",
] as const;

export const TOKEN_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#2563eb",
  "#7c3aed",
  "#ec4899",
  "#14b8a6",
  "#9ca3af",
] as const;

export function clampTokenPosition(x: number, y: number) {
  return { x: clamp(x, 0, 100), y: clamp(y, 0, 100) };
}

export function pixelToPercent(px: number, py: number, width: number, height: number) {
  return clampTokenPosition((px / width) * 100, (py / height) * 100);
}
