import { AIGeneratorForm } from "@/components/ai/AIGeneratorForm";

export function AIMapGenerator({
  campaignId,
  onUseAsMap,
}: {
  campaignId?: string;
  onUseAsMap?: (assetUrl: string) => void;
}) {
  return (
    <AIGeneratorForm
      requestType="map"
      endpoint="/api/ai/map"
      campaignId={campaignId}
      onUseAsMap={onUseAsMap}
      fields={[
        { key: "tipoLuogo", label: "Tipo di luogo", placeholder: "Taverna, laboratorio, cripta..." },
        { key: "genere", label: "Genere", placeholder: "Fantasy, cyberpunk, horror..." },
        { key: "stile", label: "Stile visivo", placeholder: "Realistico, stilizzato..." },
        { key: "atmosfera", label: "Atmosfera", placeholder: "Calda, minacciosa, sterile..." },
      ]}
    />
  );
}
