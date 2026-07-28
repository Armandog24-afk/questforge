import Link from "next/link";
import { Compass, KeyRound, Library, Plus, Store } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCurrentUser } from "@/lib/auth";
import { listCampaignsForUser, getActiveScene } from "@/lib/data";
import { AI_PROMPT_EXAMPLES } from "@/lib/demo";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const campaigns = await listCampaignsForUser(user.id);
  const latestCampaign = campaigns[0];
  const latestScene = latestCampaign ? await getActiveScene(latestCampaign.id) : null;

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Bentornato,</p>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">{user.nickname ?? user.name}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/create">
                <Plus className="size-4" /> Crea nuova campagna
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/campaigns">
                <KeyRound className="size-4" /> Unisciti con codice
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickCard href="/create" icon={Plus} title="Crea campagna" description="Wizard in 5 step" />
          <QuickCard
            href={latestCampaign && latestScene ? `/room/${latestScene.id}` : "/campaigns"}
            icon={Compass}
            title="Apri ultima stanza"
            description={latestScene?.name ?? "Nessuna scena attiva"}
          />
          <QuickCard href="/library" icon={Library} title="Libreria asset" description="Mappe, musiche, prompt" />
          <QuickCard href="/forge-store" icon={Store} title="Forge Store" description="Contenuti premium (coming soon)" />
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Le tue campagne</h2>
          </div>
          {campaigns.length === 0 ? (
            <EmptyState
              title="Ancora nessuna campagna. Forgia la tua prima scena."
              description="Crea una campagna per iniziare a giocare, oppure unisciti con un codice invito."
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
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold">Prompt IA recenti</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Suggerimenti per l&apos;AI Master Assistant</CardTitle>
              <CardDescription>Copia uno di questi prompt direttamente nella stanza di gioco.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {AI_PROMPT_EXAMPLES.map((p) => (
                <div key={p} className="rounded-xl border border-border bg-surface-2 p-3 text-sm text-muted">
                  {p}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}

function QuickCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-colors hover:border-accent-purple/40">
        <CardContent className="flex flex-col gap-2 p-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent-purple/15 text-accent-purple">
            <Icon className="size-4" />
          </span>
          <p className="font-display font-semibold">{title}</p>
          <p className="text-xs text-muted">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
