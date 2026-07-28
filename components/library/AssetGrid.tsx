"use client";

import * as React from "react";
import { AssetCard } from "@/components/library/AssetCard";
import { AssetFilters } from "@/components/library/AssetFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Library } from "lucide-react";
import type { AssetRecord, AssetType } from "@/lib/types";

export function AssetGrid({ assets }: { assets: AssetRecord[] }) {
  const [filter, setFilter] = React.useState<AssetType | "all">("all");
  const visible = filter === "all" ? assets : assets.filter((a) => a.assetType === filter);

  return (
    <div className="space-y-4">
      <AssetFilters value={filter} onChange={setFilter} />
      {visible.length === 0 ? (
        <EmptyState icon={<Library className="size-6" />} title="Nessun asset trovato" description="Prova a cambiare filtro." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((a) => (
            <AssetCard key={a.id} asset={a} />
          ))}
        </div>
      )}
    </div>
  );
}
