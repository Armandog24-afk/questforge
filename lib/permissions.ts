import type { CampaignPrivacy, MemberRole, NoteVisibility } from "@/lib/types";

/**
 * Server-side source of truth for who can do what in a campaign/room.
 * Never trust the client — every API route must re-check these.
 */

export function canViewCampaign(role: MemberRole | null, privacy: CampaignPrivacy) {
  if (privacy === "public") return true;
  return role !== null;
}

export function canEditCampaign(role: MemberRole | null) {
  return role === "master";
}

export function canManageScene(role: MemberRole | null) {
  return role === "master";
}

export function canManageMap(role: MemberRole | null) {
  return role === "master";
}

export function canManageMusic(role: MemberRole | null) {
  return role === "master";
}

export function canMoveToken(
  role: MemberRole | null,
  token: { ownerId?: string | null; locked: boolean },
  userId: string,
) {
  if (!role) return false;
  if (token.locked && role !== "master") return false;
  if (role === "master") return true;
  if (role === "spectator") return false;
  return token.ownerId === userId;
}

export function canCreateOrDeleteToken(role: MemberRole | null) {
  return role === "master";
}

export function canRollDice(role: MemberRole | null) {
  return role === "master" || role === "player";
}

export function canWriteChat(role: MemberRole | null) {
  return role !== null && role !== "spectator";
}

export function canViewNote(
  role: MemberRole | null,
  visibility: NoteVisibility,
) {
  if (!role) return false;
  if (visibility === "shared") return true;
  return role === "master";
}

export function canManageNote(role: MemberRole | null, createdBy: string, userId: string) {
  if (role === "master") return true;
  return createdBy === userId;
}

export function canUseAI(role: MemberRole | null) {
  return role === "master" || role === "player";
}

export function canInvite(role: MemberRole | null) {
  return role === "master";
}

export function canManageMembers(role: MemberRole | null) {
  return role === "master";
}
