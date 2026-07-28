import { AIGeneratorForm } from "@/components/ai/AIGeneratorForm";

export function AIPlaceGenerator({ campaignId, onSaveAsNote }: { campaignId?: string; onSaveAsNote?: (text: string) => void }) {
  return (
    <AIGeneratorForm
      requestType="place"
      endpoint="/api/ai/place"
      campaignId={campaignId}
      onSaveAsNote={onSaveAsNote}
      fields={[
        { key: "tipo", label: "Tipo di luogo", placeholder: "Villaggio, rovina, avamposto..." },
        { key: "atmosfera", label: "Atmosfera", placeholder: "Ostile, accogliente, inquietante..." },
        { key: "pericolo", label: "Pericolo", placeholder: "Cosa lo minaccia" },
      ]}
    />
  );
}
