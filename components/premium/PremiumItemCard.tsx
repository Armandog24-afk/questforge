import { Coins, Dices, Gem, Image as ImageIcon, Map as MapIcon, Music2, Palette, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { PremiumItemRecord } from "@/lib/types";

const ICONS = {
  token_skin: ImageIcon,
  dice_skin: Dices,
  map_pack: MapIcon,
  music_pack: Music2,
  theme: Palette,
  ai_credits: Sparkles,
  storage: Gem,
  avatar: Coins,
} as const;

export function PremiumItemCard({ item }: { item: PremiumItemRecord }) {
  const Icon = ICONS[item.itemType] ?? Sparkles;
  return (
    <Card className="flex flex-col">
      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-accent-purple/20 to-accent-blue/10 text-accent-purple">
        <Icon className="size-10" />
      </div>
      <CardHeader>
        {item.comingSoon && <Badge variant="warning">Coming soon</Badge>}
        <CardTitle className="text-base">{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between pt-0">
        <span className="font-display text-lg font-semibold">{item.priceEur.toFixed(2)} €</span>
        <Button size="sm" variant="secondary" disabled title="Disponibile prossimamente">
          Presto disponibile
        </Button>
      </CardContent>
    </Card>
  );
}
