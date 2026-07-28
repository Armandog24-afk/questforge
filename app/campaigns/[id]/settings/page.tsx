import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { CampaignSettingsForm } from "@/components/campaigns/CampaignSettingsForm";
import { getCurrentUser } from "@/lib/auth";
import { getCampaign, getMembership } from "@/lib/data";
import { canEditCampaign } from "@/lib/permissions";

export const metadata = { title: "Impostazioni campagna" };

export default async function CampaignSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  const role = await getMembership(id, user.id);
  if (!canEditCampaign(role)) redirect(`/campaigns/${id}`);

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="font-display text-2xl font-semibold">Impostazioni — {campaign.name}</h1>
        <CampaignSettingsForm campaign={campaign} />
      </div>
    </AppShell>
  );
}
