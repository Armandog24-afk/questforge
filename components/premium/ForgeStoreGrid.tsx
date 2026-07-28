import { PremiumItemCard } from "@/components/premium/PremiumItemCard";
import type { PremiumItemRecord } from "@/lib/types";

export function ForgeStoreGrid({ items }: { items: PremiumItemRecord[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <PremiumItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
