"use client";

import * as React from "react";
import { Token } from "@/components/tokens/Token";
import { clampTokenPosition } from "@/lib/tokens";
import { canMoveToken } from "@/lib/permissions";
import type { MemberRole, QFToken } from "@/lib/types";

export function TokenLayer({
  containerRef,
  tokens,
  role,
  userId,
  selectedId,
  onSelect,
  onMoveEnd,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  tokens: QFToken[];
  role: MemberRole | null;
  userId: string;
  selectedId?: string | null;
  onSelect: (token: QFToken) => void;
  onMoveEnd: (tokenId: string, x: number, y: number) => void;
}) {
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [positions, setPositions] = React.useState<Record<string, { x: number; y: number }>>({});

  function positionFor(token: QFToken) {
    return positions[token.id] ?? { x: token.xPosition, y: token.yPosition };
  }

  function handlePointerDown(token: QFToken) {
    return (e: React.PointerEvent) => {
      if (!canMoveToken(role, token, userId)) {
        onSelect(token);
        return;
      }
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragId(token.id);
      onSelect(token);
    };
  }

  React.useEffect(() => {
    if (!dragId) return;
    const id = dragId;

    function handleMove(e: PointerEvent) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const { x, y } = clampTokenPosition(
        ((e.clientX - rect.left) / rect.width) * 100,
        ((e.clientY - rect.top) / rect.height) * 100,
      );
      setPositions((prev) => ({ ...prev, [id]: { x, y } }));
    }

    function handleUp() {
      setDragId((currentId) => {
        if (currentId) {
          setPositions((prev) => {
            const pos = prev[currentId];
            if (pos) onMoveEnd(currentId, pos.x, pos.y);
            return prev;
          });
        }
        return null;
      });
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragId]);

  return (
    <div className="absolute inset-0">
      {tokens.map((token) => {
        const pos = positionFor(token);
        return (
          <Token
            key={token.id}
            token={{ ...token, xPosition: pos.x, yPosition: pos.y }}
            selected={selectedId === token.id}
            draggable={canMoveToken(role, token, userId)}
            onPointerDown={handlePointerDown(token)}
          />
        );
      })}
    </div>
  );
}
