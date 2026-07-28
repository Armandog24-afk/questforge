import { AppShell } from "@/components/layout/AppShell";
import { CharactersPageClient } from "@/components/characters/CharactersPageClient";
import { getCurrentUser } from "@/lib/auth";
import { listCampaignsForUser, listCharactersForCampaign } from "@/lib/data";

export const metadata = { title: "Personaggi" };

export default async function CharactersPage() {
  const user = await getCurrentUser();
  const campaigns = await listCampaignsForUser(user.id);
  const characterLists = await Promise.all(campaigns.map((c) => listCharactersForCampaign(c.id)));
  const characters = characterLists.flat().filter((c) => c.userId === user.id);

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-5xl">
        <CharactersPageClient campaigns={campaigns} initialCharacters={characters} />
      </div>
    </AppShell>
  );
}
