import { FileText, Map as MapIcon, Music2, Image as ImageIcon, Sparkles, StickyNote } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { AssetRecord } from "@/lib/types";

const ICONS = {
  map: MapIcon,
  token: ImageIcon,
  music: Music2,
  scene: FileText,
  image: ImageIcon,
  prompt: Sparkles,
  note: StickyNote,
} as const;

export function AssetCard({ asset }: { asset: AssetRecord }) {
  const Icon = ICONS[asset.assetType] ?? FileText;
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-2">
      {asset.previewUrl ? (
        <div className="qf-map-checker aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${asset.previewUrl})` }} />
      ) : (
        <div className="flex aspect-video items-center justify-center bg-surface text-muted">
          <Icon className="size-8" />
        </div>
      )}
      <div className="space-y-1.5 p-3">
        <p className="truncate text-sm font-medium">{asset.name}</p>
        <div className="flex flex-wrap items-center gap-1">
          <Badge variant="outline">{asset.assetType}</Badge>
          <Badge variant={asset.source === "ai" ? "purple" : "outline"}>{asset.source}</Badge>
          {asset.tags.slice(0, 2).map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
