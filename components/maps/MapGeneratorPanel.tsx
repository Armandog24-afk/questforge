import { AIMapGenerator } from "@/components/ai/AIMapGenerator";

export function MapGeneratorPanel({
  campaignId,
  onUseAsMap,
}: {
  campaignId: string;
  onUseAsMap: (assetUrl: string) => void;
}) {
  return <AIMapGenerator campaignId={campaignId} onUseAsMap={onUseAsMap} />;
}
