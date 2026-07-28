"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { DiceFormulaInput } from "@/components/dice/DiceFormulaInput";
import { DiceHistory } from "@/components/dice/DiceHistory";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { DiceRollRecord, DiceVisibility, MemberRole } from "@/lib/types";

export function DiceRoller({
  campaignId,
  sceneId,
  role,
  initialRolls,
  onRolled,
}: {
  campaignId: string;
  sceneId: string;
  role: MemberRole | null;
  initialRolls: DiceRollRecord[];
  onRolled: (roll: DiceRollRecord) => void;
}) {
  const [formula, setFormula] = React.useState("1d20");
  const [visibility, setVisibility] = React.useState<DiceVisibility>("public");
  const [rolling, setRolling] = React.useState(false);
  const { toast } = useToast();

  async function handleRoll() {
    setRolling(true);
    try {
      const res = await fetch("/api/dice/roll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, sceneId, formula, visibility }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Formula non valida");
      onRolled(data.roll);
    } catch (err) {
      toast({ title: "Tiro non riuscito", description: err instanceof Error ? err.message : undefined, variant: "error" });
    } finally {
      setRolling(false);
    }
  }

  return (
    <div className="space-y-3">
      <DiceFormulaInput value={formula} onChange={setFormula} onSubmit={rolling ? () => {} : handleRoll} />
      {role === "master" && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setVisibility((v) => (v === "public" ? "private_master" : "public"))}
        >
          {visibility === "public" ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
          {visibility === "public" ? "Tiro pubblico" : "Tiro privato (solo Master)"}
        </Button>
      )}
      <DiceHistory rolls={initialRolls} />
    </div>
  );
}
