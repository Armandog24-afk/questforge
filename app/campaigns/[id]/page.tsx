import Link from "next/link";
import { notFound } from "next/navigation";
import { Compass, Settings, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { InvitePanel } from "@/components/campaigns/InvitePanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { initials } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { getCampaign, getMembership, listCharactersForCampaign, listMapsForCampaign, listScenesForCampaign } from "@/lib/data";
import { canEditCampaign } from "@/lib/permissions";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  const role = await getMembership(id, user.id);
  const [scenes, characters, maps] = await Promise.all([
    listScenesForCampaign(id),
    listCharactersForCampaign(id),
    listMapsForCampaign(id),
  ]);
  const activeScene = scenes.find((s) => s.isActive) ?? scenes[0];

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="purple">{campaign.genre}</Badge>
              <Badge variant="outline">{campaign.tone}</Badge>
              <Badge variant="blue">{campaign.gameSystem}</Badge>
            </div>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">{campaign.name}</h1>
            <p className="mt-1 max-w-xl text-sm text-muted">{campaign.description}</p>
          </div>
          <div className="flex gap-2">
            {activeScene && (
              <Button asChild>
                <Link href={`/room/${activeScene.id}`}>
                  <Compass className="size-4" /> Apri il tavolo
                </Link>
              </Button>
            )}
            {canEditCampaign(role) && (
              <Button asChild variant="secondary">
                <Link href={`/campaigns/${id}/settings`}>
                  <Settings className="size-4" /> Impostazioni
                </Link>
              </Button>
            )}
          </div>
        </div>

        {canEditCampaign(role) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invita giocatori</CardTitle>
              <CardDescription>Condividi il codice o il link per far entrare il gruppo.</CardDescription>
            </CardHeader>
            <CardContent>
              <InvitePanel inviteCode={campaign.inviteCode} />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scene ({scenes.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {scenes.map((s) => (
                <Link
                  key={s.id}
                  href={`/room/${s.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-2 p-3 text-sm hover:border-accent-purple/40"
                >
                  <span>{s.name}</span>
                  {s.isActive && <Badge variant="success">Attiva</Badge>}
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4" /> Membri ({campaign.members.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {campaign.members.map((m) => (
                <div key={m.userId} className="flex items-center justify-between rounded-xl border border-border bg-surface-2 p-3 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full bg-accent-purple/20 text-xs font-semibold text-accent-purple">
                      {initials(m.user.name)}
                    </span>
                    {m.user.nickname ?? m.user.name}
                  </span>
                  <Badge variant={m.role === "master" ? "purple" : "outline"}>{m.role}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personaggi ({characters.length})</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map((c) => (
              <div key={c.id} className="rounded-xl border border-border bg-surface-2 p-3">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <p className="font-medium">{c.name}</p>
                </div>
                <p className="mt-1 text-xs text-muted">{c.roleLabel}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mappe ({maps.length})</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {maps.map((m) => (
              <div key={m.id} className="overflow-hidden rounded-xl border border-border">
                <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${m.imageUrl})` }} />
                <p className="truncate p-2 text-xs">{m.name}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
