import { AIGeneratorForm } from "@/components/ai/AIGeneratorForm";

export function AIAtmosphereGenerator({ campaignId, onSaveAsNote }: { campaignId?: string; onSaveAsNote?: (text: string) => void }) {
  return (
    <AIGeneratorForm
      requestType="atmosphere"
      endpoint="/api/ai/atmosphere"
      campaignId={campaignId}
      onSaveAsNote={onSaveAsNote}
      fields={[
        { key: "emozione", label: "Emozione", placeholder: "Paura, meraviglia, tensione..." },
        { key: "intensita", label: "Intensità", placeholder: "Bassa, media, alta" },
        { key: "paroleChiave", label: "Parole chiave", placeholder: "3-4 parole evocative" },
      ]}
    />
  );
}
