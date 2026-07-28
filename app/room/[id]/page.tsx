import { notFound, redirect } from "next/navigation";
import { GameRoom } from "@/components/room/GameRoom";
import { getCurrentUser } from "@/lib/auth";
import {
  getCampaign,
  getMap,
  getMembership,
  listCharactersForCampaign,
  listChat,
  listDiceRolls,
  listMapsForCampaign,
  listMusicTracks,
  listNotes,
  listScenesForCampaign,
  listTokensForScene,
  getScene,
} from "@/lib/data";
import { canViewCampaign, canViewNote } from "@/lib/permissions";

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scene = await getScene(id);
  if (!scene) notFound();

  const user = await getCurrentUser();
  const campaign = await getCampaign(scene.campaignId);
  if (!campaign) notFound();

  const role = await getMembership(campaign.id, user.id);
  if (!canViewCampaign(role, campaign.privacy)) redirect("/campaigns");

  const [scenes, maps, characters, tokens, diceRolls, chat, notes, musicTracks, map] = await Promise.all([
    listScenesForCampaign(campaign.id),
    listMapsForCampaign(campaign.id),
    listCharactersForCampaign(campaign.id),
    listTokensForScene(scene.id),
    listDiceRolls(campaign.id, scene.id),
    listChat(campaign.id, scene.id),
    listNotes(campaign.id),
    listMusicTracks(campaign.id),
    getMap(scene.mapId),
  ]);

  const visibleDiceRolls = diceRolls.filter((r) => r.visibility === "public" || role === "master");
  const visibleNotes = notes.filter((n) => canViewNote(role, n.visibility));
  const visibleTokens = tokens.filter((t) => t.visible || role === "master");

  return (
    <GameRoom
      campaign={campaign}
      scene={scene}
      scenes={scenes}
      role={role}
      user={user}
      initialMap={map}
      maps={maps}
      characters={characters}
      initialTokens={visibleTokens}
      initialDiceRolls={visibleDiceRolls}
      initialChat={chat}
      initialNotes={visibleNotes}
      musicTracks={musicTracks}
    />
  );
}
