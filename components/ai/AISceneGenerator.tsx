import { AIGeneratorForm } from "@/components/ai/AIGeneratorForm";

export function AISceneGenerator({ campaignId, onSaveAsNote }: { campaignId?: string; onSaveAsNote?: (text: string) => void }) {
  return (
    <AIGeneratorForm
      requestType="scene"
      endpoint="/api/ai/scene"
      campaignId={campaignId}
      onSaveAsNote={onSaveAsNote}
      fields={[
        { key: "luogo", label: "Luogo", placeholder: "Taverna, cripta, vicolo..." },
        { key: "tono", label: "Tono", placeholder: "Dark, epico, misterioso..." },
        { key: "pericolo", label: "Pericolo", placeholder: "Basso, medio, alto" },
        { key: "obiettivo", label: "Obiettivo", placeholder: "Cosa cercano i giocatori" },
      ]}
    />
  );
}
