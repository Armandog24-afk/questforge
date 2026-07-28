import { AIGeneratorForm } from "@/components/ai/AIGeneratorForm";

export function AIEncounterGenerator({ campaignId, onSaveAsNote }: { campaignId?: string; onSaveAsNote?: (text: string) => void }) {
  return (
    <AIGeneratorForm
      requestType="encounter"
      endpoint="/api/ai/encounter"
      campaignId={campaignId}
      onSaveAsNote={onSaveAsNote}
      fields={[
        { key: "ambiente", label: "Ambiente", placeholder: "Dove avviene l'incontro" },
        { key: "tipoConflitto", label: "Tipo di conflitto", placeholder: "Combattimento, dilemma, inseguimento..." },
        { key: "difficolta", label: "Difficoltà narrativa", placeholder: "Facile, media, difficile" },
      ]}
    />
  );
}
