import { DiceResultCard } from "@/components/dice/DiceResultCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Dice5 } from "lucide-react";
import type { DiceRollRecord } from "@/lib/types";

export function DiceHistory({ rolls }: { rolls: DiceRollRecord[] }) {
  if (rolls.length === 0) {
    return <EmptyState icon={<Dice5 className="size-6" />} title="Nessun tiro ancora" description="Il primo lancio comparirà qui." />;
  }
  return (
    <div className="flex max-h-80 flex-col gap-2 overflow-y-auto qf-scrollbar-thin pr-1">
      {rolls.map((r) => (
        <DiceResultCard key={r.id} roll={r} />
      ))}
    </div>
  );
}
