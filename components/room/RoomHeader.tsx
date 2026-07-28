"use client";

import Link from "next/link";
import { ArrowLeft, Copy, Settings } from "lucide-react";
import { PlayerList } from "@/components/room/PlayerList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Logo } from "@/components/layout/TopBar";
import type { Campaign, MemberRole, Scene } from "@/lib/types";

export function RoomHeader({ campaign, scene, role }: { campaign: Campaign; scene: Scene; role: MemberRole | null }) {
  const { toast } = useToast();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface/60 px-4">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/campaigns/${campaign.id}`} aria-label="Torna alla campagna">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <Logo className="hidden lg:flex" />
        <div className="hidden sm:block">
          <p className="text-sm font-medium leading-tight">{campaign.name}</p>
          <p className="text-xs leading-tight text-muted">{scene.name}</p>
        </div>
        <Badge variant="blue" className="hidden md:inline-flex">
          {campaign.gameSystem}
        </Badge>
      </div>
      <div className="flex items-center gap-3">
        <PlayerList members={campaign.members} />
        <button
          onClick={() => {
            navigator.clipboard.writeText(campaign.inviteCode);
            toast({ title: "Codice copiato", variant: "success" });
          }}
          className="hidden items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted hover:text-foreground sm:flex"
        >
          <Copy className="size-3" /> {campaign.inviteCode}
        </button>
        {role === "master" && (
          <Button asChild variant="ghost" size="icon">
            <Link href={`/campaigns/${campaign.id}/settings`} aria-label="Impostazioni">
              <Settings className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
