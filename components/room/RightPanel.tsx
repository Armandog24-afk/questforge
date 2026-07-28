"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { DiceRoller } from "@/components/dice/DiceRoller";
import { AIMasterAssistant } from "@/components/ai/AIMasterAssistant";
import { AtmospherePanel } from "@/components/music/AtmospherePanel";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { ChatLog } from "@/components/chat/ChatLog";
import { ChatInput } from "@/components/chat/ChatInput";
import type {
  AppUser,
  ChatMessageRecord,
  DiceRollRecord,
  MemberRole,
  MusicTrackRecord,
  NoteRecord,
} from "@/lib/types";

export function RightPanel({
  campaignId,
  sceneId,
  activeMusicId,
  role,
  user,
  diceRolls,
  chat,
  notes,
  musicTracks,
  onRolled,
  onSendChat,
  onSetActiveMusic,
  onSaveAINote,
  onUseAIMap,
}: {
  campaignId: string;
  sceneId: string;
  activeMusicId?: string | null;
  role: MemberRole | null;
  user: AppUser;
  diceRolls: DiceRollRecord[];
  chat: ChatMessageRecord[];
  notes: NoteRecord[];
  musicTracks: MusicTrackRecord[];
  onRolled: (roll: DiceRollRecord) => void;
  onSendChat: (message: string) => void;
  onSetActiveMusic: (id: string) => void;
  onSaveAINote: (text: string) => void;
  onUseAIMap: (assetUrl: string) => void;
}) {
  return (
    <Tabs defaultValue="dice" className="flex h-full flex-col">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="dice">Dadi</TabsTrigger>
        <TabsTrigger value="ai">AI</TabsTrigger>
        <TabsTrigger value="music">Atmosfera</TabsTrigger>
        <TabsTrigger value="notes">Note</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
      </TabsList>

      <TabsContent value="dice" className="flex-1 overflow-y-auto qf-scrollbar-thin">
        <DiceRoller campaignId={campaignId} sceneId={sceneId} role={role} initialRolls={diceRolls} onRolled={onRolled} />
      </TabsContent>

      <TabsContent value="ai" className="flex-1 overflow-y-auto qf-scrollbar-thin">
        <AIMasterAssistant campaignId={campaignId} onSaveAsNote={onSaveAINote} onUseAsMap={onUseAIMap} />
      </TabsContent>

      <TabsContent value="music" className="flex-1 overflow-y-auto qf-scrollbar-thin">
        <AtmospherePanel tracks={musicTracks} activeMusicId={activeMusicId} onSetActive={onSetActiveMusic} />
      </TabsContent>

      <TabsContent value="notes" className="flex-1 overflow-y-auto qf-scrollbar-thin">
        <NotesPanel campaignId={campaignId} sceneId={sceneId} role={role} user={user} initialNotes={notes} />
      </TabsContent>

      <TabsContent value="chat" className="flex flex-1 flex-col gap-2">
        <ChatLog messages={chat} currentUserId={user.id} />
        <ChatInput onSend={onSendChat} disabled={role === "spectator" || !role} />
      </TabsContent>
    </Tabs>
  );
}
