"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { AISceneGenerator } from "@/components/ai/AISceneGenerator";
import { AIMapGenerator } from "@/components/ai/AIMapGenerator";
import { AINPCGenerator } from "@/components/ai/AINPCGenerator";
import { AIItemGenerator } from "@/components/ai/AIItemGenerator";
import { AIPlaceGenerator } from "@/components/ai/AIPlaceGenerator";
import { AIEncounterGenerator } from "@/components/ai/AIEncounterGenerator";
import { AIAtmosphereGenerator } from "@/components/ai/AIAtmosphereGenerator";

export function AIMasterAssistant({
  campaignId,
  onSaveAsNote,
  onUseAsMap,
}: {
  campaignId: string;
  onSaveAsNote: (text: string) => void;
  onUseAsMap: (assetUrl: string) => void;
}) {
  return (
    <Tabs defaultValue="scene">
      <TabsList className="flex flex-wrap h-auto">
        <TabsTrigger value="scene">Scena</TabsTrigger>
        <TabsTrigger value="map">Mappa</TabsTrigger>
        <TabsTrigger value="npc">PNG</TabsTrigger>
        <TabsTrigger value="item">Oggetto</TabsTrigger>
        <TabsTrigger value="place">Luogo</TabsTrigger>
        <TabsTrigger value="encounter">Incontro</TabsTrigger>
        <TabsTrigger value="atmosphere">Atmosfera</TabsTrigger>
      </TabsList>
      <TabsContent value="scene">
        <AISceneGenerator campaignId={campaignId} onSaveAsNote={onSaveAsNote} />
      </TabsContent>
      <TabsContent value="map">
        <AIMapGenerator campaignId={campaignId} onUseAsMap={onUseAsMap} />
      </TabsContent>
      <TabsContent value="npc">
        <AINPCGenerator campaignId={campaignId} onSaveAsNote={onSaveAsNote} />
      </TabsContent>
      <TabsContent value="item">
        <AIItemGenerator campaignId={campaignId} onSaveAsNote={onSaveAsNote} />
      </TabsContent>
      <TabsContent value="place">
        <AIPlaceGenerator campaignId={campaignId} onSaveAsNote={onSaveAsNote} />
      </TabsContent>
      <TabsContent value="encounter">
        <AIEncounterGenerator campaignId={campaignId} onSaveAsNote={onSaveAsNote} />
      </TabsContent>
      <TabsContent value="atmosphere">
        <AIAtmosphereGenerator campaignId={campaignId} onSaveAsNote={onSaveAsNote} />
      </TabsContent>
    </Tabs>
  );
}
