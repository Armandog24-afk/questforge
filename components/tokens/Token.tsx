"use client";

import { Lock } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import type { QFToken } from "@/lib/types";

export function Token({
  token,
  selected,
  draggable,
  onPointerDown,
  onClick,
}: {
  token: QFToken;
  selected?: boolean;
  draggable?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onClick?: () => void;
}) {
  if (!token.visible) return null;
  const size = 40 * token.size;

  return (
    <button
      type="button"
      onPointerDown={onPointerDown}
      onClick={onClick}
      style={{
        left: `${token.xPosition}%`,
        top: `${token.yPosition}%`,
        width: size,
        height: size,
        backgroundColor: token.color,
        touchAction: "none",
      }}
      className={cn(
        "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/70 text-xs font-bold text-white shadow-lg transition-shadow",
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        selected && "ring-2 ring-offset-2 ring-offset-background ring-accent-purple",
      )}
      aria-label={token.name}
      title={token.name}
    >
      {token.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={token.imageUrl} alt="" className="size-full rounded-full object-cover" />
      ) : (
        initials(token.name)
      )}
      {token.locked && (
        <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-surface border border-border">
          <Lock className="size-2.5 text-muted" />
        </span>
      )}
    </button>
  );
}
