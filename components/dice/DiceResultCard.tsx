import { Skull, Target } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";
import type { DiceRollResult } from "@/lib/dice";
import type { DiceRollRecord } from "@/lib/types";

export function DiceResultCard({ roll, live }: { roll: DiceRollRecord; live?: DiceRollResult }) {
  const isCrit = live?.isCriticalSuccess;
  const isFumble = live?.isCriticalFailure;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm",
        isCrit && "border-success/50 bg-success/10",
        isFumble && "border-error/50 bg-error/10",
      )}
    >
      <div className="min-w-0">
        <p className="truncate font-medium">{roll.userName}</p>
        <p className="font-mono text-xs text-muted">
          {roll.formula} → [{roll.results.join(", ")}]
        </p>
      </div>
      <div className="flex items-center gap-2">
        {isCrit && <Target className="size-4 text-success" />}
        {isFumble && <Skull className="size-4 text-error" />}
        {roll.visibility === "private_master" && <Badge variant="outline">Privato</Badge>}
        <span className="font-mono text-lg font-bold">{roll.total}</span>
      </div>
      <span className="hidden shrink-0 font-mono text-[10px] text-muted sm:block">{formatDateTime(roll.createdAt)}</span>
    </div>
  );
}
