"use client";

import { Badge } from "@/components/ui/Badge";
import type { AssetType } from "@/lib/types";

const TYPES: { value: AssetType | "all"; label: string }[] = [
  { value: "all", label: "Tutti" },
  { value: "map", label: "Mappe" },
  { value: "music", label: "Musiche" },
  { value: "note", label: "Note" },
  { value: "prompt", label: "Prompt IA" },
  { value: "token", label: "Token" },
];

export function AssetFilters({
  value,
  onChange,
}: {
  value: AssetType | "all";
  onChange: (v: AssetType | "all") => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {TYPES.map((t) => (
        <Badge
          key={t.value}
          variant={value === t.value ? "purple" : "outline"}
          className="cursor-pointer"
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </Badge>
      ))}
    </div>
  );
}
