"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const QUICK_DICE = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"];

export function DiceFormulaInput({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {QUICK_DICE.map((d) => (
          <Button
            key={d}
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onChange(value.match(/^\d*d\d+/i) ? value.replace(/^\d*d\d+/i, `1${d}`) : `1${d}`)}
            className={cn("font-mono")}
          >
            {d}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder="1d20+3"
          className="font-mono"
          aria-label="Formula dado"
        />
        <Button onClick={onSubmit}>Lancia</Button>
      </div>
    </div>
  );
}
