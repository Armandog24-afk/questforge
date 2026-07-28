import { initials } from "@/lib/utils";
import type { CampaignMember } from "@/lib/types";

export function PlayerList({ members }: { members: CampaignMember[] }) {
  return (
    <div className="flex items-center -space-x-2">
      {members.map((m) => (
        <span
          key={m.userId}
          title={`${m.user.nickname ?? m.user.name} (${m.role})`}
          className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-accent-purple/25 text-xs font-semibold text-accent-purple"
        >
          {initials(m.user.name)}
        </span>
      ))}
    </div>
  );
}
