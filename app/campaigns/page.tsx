import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { JoinCampaignForm } from "@/components/campaigns/JoinCampaignForm";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCurrentUser } from "@/lib/auth";
import { listCampaignsForUser } from "@/lib/data";

export const metadata = { title: "Le tue campagne" };

export default async function CampaignsPage() {
  const user = await getCurrentUser();
  const campaigns = await listCampaignsForUser(user.id);

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Le tue campagne</h1>
          <Button asChild>
            <Link href="/create">
              <Plus className="size-4" /> Crea nuova campagna
            </Link>
          </Button>
        </div>

        <JoinCampaignForm />

        {campaigns.length === 0 ? (
          <EmptyState
            title="Ancora nessuna campagna. Forgia la tua prima scena."
            action={
              <Button asChild>
                <Link href="/create">Crea una campagna</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
