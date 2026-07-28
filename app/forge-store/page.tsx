import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ForgeStoreGrid } from "@/components/premium/ForgeStoreGrid";
import { Badge } from "@/components/ui/Badge";
import { getCurrentUser } from "@/lib/auth";
import { listPremiumItems } from "@/lib/data";

export const metadata = { title: "Forge Store" };

export default async function ForgeStorePage() {
  const user = await getCurrentUser();
  const items = await listPremiumItems();

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <Badge variant="purple" className="mb-2">
            <Sparkles className="size-3" /> Anteprima
          </Badge>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Forge Store</h1>
          <p className="max-w-xl text-sm text-muted">
            Il core di QuestForge resta gratuito. Questi contenuti premium arriveranno presto: skin, pacchetti mappe e
            musica, crediti IA extra e storage aggiuntivo.
          </p>
        </div>
        <ForgeStoreGrid items={items} />
      </div>
    </AppShell>
  );
}
