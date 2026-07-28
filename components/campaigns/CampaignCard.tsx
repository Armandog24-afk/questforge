import Link from "next/link";
import { Users, Dice5 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Campaign } from "@/lib/types";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-colors hover:border-accent-purple/40">
      <div className="qf-map-checker h-28 border-b border-border bg-gradient-to-br from-accent-purple/25 to-accent-blue/15" />
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="purple">{campaign.genre}</Badge>
          <Badge variant="outline">{campaign.tone}</Badge>
        </div>
        <CardTitle>{campaign.name}</CardTitle>
        <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between pt-0">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> {campaign.members.length}
          </span>
          <span className="flex items-center gap-1">
            <Dice5 className="size-3.5" /> {campaign.gameSystem}
          </span>
        </div>
        <Button asChild size="sm">
          <Link href={`/campaigns/${campaign.id}`}>Apri</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
