import { AppShell } from "@/components/layout/AppShell";
import { CampaignCreateWizard } from "@/components/campaigns/CampaignCreateWizard";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Crea una campagna" };

export default async function CreatePage() {
  const user = await getCurrentUser();
  return (
    <AppShell user={user}>
      <div className="py-6">
        <CampaignCreateWizard />
      </div>
    </AppShell>
  );
}
