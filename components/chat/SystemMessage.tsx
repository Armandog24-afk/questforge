import { Dice5, Info, MapPin, MoveRight, NotebookPen } from "lucide-react";
import type { ChatMessageRecord } from "@/lib/types";

const ICONS = {
  system: Info,
  dice: Dice5,
  token_move: MoveRight,
  scene_change: MapPin,
  note: NotebookPen,
  user: Info,
} as const;

export function SystemMessage({ message }: { message: ChatMessageRecord }) {
  const Icon = ICONS[message.type] ?? Info;
  return (
    <div className="flex items-center gap-2 py-1 text-xs italic text-muted">
      <Icon className="size-3.5 shrink-0" />
      <span>{message.message}</span>
    </div>
  );
}
