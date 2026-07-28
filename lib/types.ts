export type MemberRole = "master" | "player" | "spectator";
export type CampaignPrivacy = "private" | "invite" | "public";
export type GridType = "none" | "square" | "hex";
export type AssetSource = "upload" | "demo" | "ai" | "premium";
export type NoteVisibility = "master" | "shared";
export type DiceVisibility = "public" | "private_master";
export type ChatMessageType = "user" | "dice" | "token_move" | "scene_change" | "note" | "system";
export type AIRequestType =
  | "scene"
  | "map"
  | "npc"
  | "item"
  | "place"
  | "encounter"
  | "atmosphere"
  | "music";
export type AssetType = "map" | "token" | "music" | "scene" | "image" | "prompt" | "note";
export type PremiumItemType =
  | "token_skin"
  | "dice_skin"
  | "map_pack"
  | "music_pack"
  | "theme"
  | "ai_credits"
  | "storage"
  | "avatar";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  nickname?: string | null;
  preferredRole: "master" | "player" | "both";
  isPremium: boolean;
  aiCredits: number;
}

export interface CampaignMember {
  userId: string;
  campaignId: string;
  role: MemberRole;
  user: AppUser;
  joinedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  genre: string;
  tone: string;
  gameSystem: string;
  coverImage?: string;
  ownerId: string;
  privacy: CampaignPrivacy;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
  members: CampaignMember[];
}

export interface QFMap {
  id: string;
  campaignId: string;
  name: string;
  imageUrl: string;
  prompt?: string | null;
  genre?: string | null;
  style?: string | null;
  atmosphere?: string | null;
  tags: string[];
  source: AssetSource;
  createdBy: string;
  createdAt: string;
}

export interface Character {
  id: string;
  campaignId: string;
  userId: string;
  name: string;
  avatar?: string | null;
  tokenImage?: string | null;
  roleLabel?: string | null;
  originLabel?: string | null;
  mainResource?: string | null;
  description?: string | null;
  abilitiesNotes?: string | null;
  inventoryNotes?: string | null;
  backstory?: string | null;
  color: string;
}

export interface QFToken {
  id: string;
  campaignId: string;
  sceneId: string;
  characterId?: string | null;
  ownerId?: string | null;
  name: string;
  icon?: string | null;
  imageUrl?: string | null;
  color: string;
  xPosition: number;
  yPosition: number;
  size: number;
  locked: boolean;
  visible: boolean;
}

export interface Scene {
  id: string;
  campaignId: string;
  name: string;
  description?: string | null;
  mapId?: string | null;
  activeMusicId?: string | null;
  gridType: GridType;
  gridEnabled: boolean;
  gridSize: number;
  isActive: boolean;
  createdBy: string;
}

export interface DiceRollRecord {
  id: string;
  campaignId: string;
  sceneId?: string | null;
  userId?: string | null;
  userName: string;
  formula: string;
  results: number[];
  total: number;
  visibility: DiceVisibility;
  createdAt: string;
}

export interface ChatMessageRecord {
  id: string;
  campaignId: string;
  sceneId?: string | null;
  userId?: string | null;
  userName: string;
  type: ChatMessageType;
  message: string;
  createdAt: string;
}

export interface NoteRecord {
  id: string;
  campaignId: string;
  sceneId?: string | null;
  title: string;
  content: string;
  visibility: NoteVisibility;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MusicTrackRecord {
  id: string;
  campaignId?: string | null;
  name: string;
  category: string;
  mood: string;
  audioUrl: string;
  loopEnabled: boolean;
  source: AssetSource;
}

export interface AssetRecord {
  id: string;
  campaignId?: string | null;
  assetType: AssetType;
  name: string;
  url?: string;
  previewUrl?: string;
  tags: string[];
  source: AssetSource;
  createdBy?: string;
  createdAt: string;
}

export interface PremiumItemRecord {
  id: string;
  itemType: PremiumItemType;
  name: string;
  description: string;
  priceEur: number;
  previewUrl?: string;
  active: boolean;
  comingSoon: boolean;
}
