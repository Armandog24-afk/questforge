import { AIGeneratorForm } from "@/components/ai/AIGeneratorForm";

export function AINPCGenerator({ campaignId, onSaveAsNote }: { campaignId?: string; onSaveAsNote?: (text: string) => void }) {
  return (
    <AIGeneratorForm
      requestType="npc"
      endpoint="/api/ai/npc"
      campaignId={campaignId}
      onSaveAsNote={onSaveAsNote}
      fields={[
        { key: "ruolo", label: "Ruolo", placeholder: "Mercante, guardia, informatore..." },
        { key: "obiettivo", label: "Obiettivo", placeholder: "Cosa vuole ottenere" },
        { key: "segreto", label: "Segreto", placeholder: "Cosa nasconde" },
      ]}
    />
  );
}
