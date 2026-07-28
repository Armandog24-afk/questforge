import { Badge } from "@/components/ui/Badge";
import { initials } from "@/lib/utils";
import type { Character } from "@/lib/types";

export function CharacterCard({ character, compact }: { character: Character; compact?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3">
      <div className="flex items-center gap-2">
        <span
          style={{ backgroundColor: character.color }}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        >
          {initials(character.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{character.name}</p>
          {character.roleLabel && <p className="truncate text-xs text-muted">{character.roleLabel}</p>}
        </div>
      </div>
      {!compact && (
        <div className="mt-2 space-y-1 text-xs text-muted">
          {character.originLabel && <p>{character.originLabel}</p>}
          {character.mainResource && <Badge variant="outline">{character.mainResource}</Badge>}
          {character.description && <p className="line-clamp-2">{character.description}</p>}
        </div>
      )}
    </div>
  );
}
