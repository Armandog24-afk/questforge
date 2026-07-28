import { AIGeneratorForm } from "@/components/ai/AIGeneratorForm";

export function AIItemGenerator({ campaignId, onSaveAsNote }: { campaignId?: string; onSaveAsNote?: (text: string) => void }) {
  return (
    <AIGeneratorForm
      requestType="item"
      endpoint="/api/ai/item"
      campaignId={campaignId}
      onSaveAsNote={onSaveAsNote}
      fields={[
        { key: "rarita", label: "Rarità", placeholder: "Comune, raro, leggendario..." },
        { key: "funzione", label: "Funzione", placeholder: "Cosa dovrebbe fare" },
        { key: "effetto", label: "Effetto narrativo", placeholder: "Come influisce sulla storia" },
      ]}
    />
  );
}
