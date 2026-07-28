import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { store, newId } from "@/lib/store";
import { generateInviteCode } from "@/lib/slug";
import type {
  AssetRecord,
  Campaign,
  CampaignMember,
  CampaignPrivacy,
  Character,
  ChatMessageRecord,
  ChatMessageType,
  DiceRollRecord,
  GridType,
  MemberRole,
  MusicTrackRecord,
  NoteRecord,
  NoteVisibility,
  PremiumItemRecord,
  QFMap,
  QFToken,
  Scene,
} from "@/lib/types";

/**
 * Single data-access surface for the whole app. When DATABASE_URL is set it
 * reads/writes through Prisma; otherwise it transparently reads/writes the
 * in-memory demo store (lib/store.ts) so every page and API route works
 * end-to-end out of the box. Pages and API routes should import from here
 * rather than touching prisma/store directly.
 */

function campaignFromDb(c: NonNullable<Awaited<ReturnType<typeof fetchCampaignDb>>>): Campaign {
  return {
    id: c.id,
    name: c.name,
    description: c.description ?? "",
    genre: c.genre ?? "",
    tone: c.tone ?? "",
    gameSystem: c.gameSystem ?? "",
    coverImage: c.coverImage ?? undefined,
    ownerId: c.ownerId,
    privacy: c.privacy,
    inviteCode: c.inviteCode,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    members: c.members.map(
      (m): CampaignMember => ({
        userId: m.userId,
        campaignId: m.campaignId,
        role: m.role,
        joinedAt: m.joinedAt.toISOString(),
        user: {
          id: m.user.id,
          email: m.user.email,
          name: m.user.name ?? m.user.email,
          image: m.user.image,
          nickname: m.user.nickname,
          preferredRole: m.user.preferredRole,
          isPremium: m.user.isPremium,
          aiCredits: m.user.aiCredits,
        },
      }),
    ),
  };
}

async function fetchCampaignDb(id: string) {
  return prisma!.campaign.findUnique({
    where: { id },
    include: { members: { include: { user: true } } },
  });
}

// ───────────────────────────── Campaigns ─────────────────────────────

export async function listCampaignsForUser(userId: string): Promise<Campaign[]> {
  if (isDatabaseConfigured && prisma) {
    const rows = await prisma.campaign.findMany({
      where: { members: { some: { userId } } },
      include: { members: { include: { user: true } } },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map(campaignFromDb);
  }
  return store.campaigns
    .filter((c) => c.members.some((m) => m.userId === userId))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  if (isDatabaseConfigured && prisma) {
    const row = await fetchCampaignDb(id);
    return row ? campaignFromDb(row) : null;
  }
  return store.campaigns.find((c) => c.id === id) ?? null;
}

export async function getCampaignByInviteCode(code: string): Promise<Campaign | null> {
  if (isDatabaseConfigured && prisma) {
    const row = await prisma.campaign.findUnique({
      where: { inviteCode: code },
      include: { members: { include: { user: true } } },
    });
    return row ? campaignFromDb(row) : null;
  }
  return store.campaigns.find((c) => c.inviteCode.toLowerCase() === code.toLowerCase()) ?? null;
}

export async function createCampaign(input: {
  name: string;
  description?: string;
  genre: string;
  tone: string;
  gameSystem: string;
  privacy: CampaignPrivacy;
  ownerId: string;
}): Promise<Campaign> {
  const now = new Date().toISOString();

  if (isDatabaseConfigured && prisma) {
    const row = await prisma.campaign.create({
      data: {
        name: input.name,
        description: input.description,
        genre: input.genre,
        tone: input.tone,
        gameSystem: input.gameSystem,
        privacy: input.privacy,
        ownerId: input.ownerId,
        members: { create: { userId: input.ownerId, role: "master" } },
      },
      include: { members: { include: { user: true } } },
    });
    const campaign = campaignFromDb(row);
    await createScene({
      campaignId: campaign.id,
      name: "Scena iniziale",
      createdBy: input.ownerId,
      isActive: true,
    });
    return campaign;
  }

  const owner = store.users.find((u) => u.id === input.ownerId);
  const campaign: Campaign = {
    id: newId("camp"),
    name: input.name,
    description: input.description ?? "",
    genre: input.genre,
    tone: input.tone,
    gameSystem: input.gameSystem,
    ownerId: input.ownerId,
    privacy: input.privacy,
    inviteCode: generateInviteCode(),
    createdAt: now,
    updatedAt: now,
    members: owner
      ? [{ userId: owner.id, campaignId: "", role: "master", user: owner, joinedAt: now }]
      : [],
  };
  campaign.members.forEach((m) => (m.campaignId = campaign.id));
  store.campaigns.unshift(campaign);
  await createScene({ campaignId: campaign.id, name: "Scena iniziale", createdBy: input.ownerId, isActive: true });
  return campaign;
}

export async function joinCampaign(inviteCode: string, userId: string): Promise<Campaign | null> {
  const campaign = await getCampaignByInviteCode(inviteCode);
  if (!campaign) return null;

  if (isDatabaseConfigured && prisma) {
    await prisma.campaignMember.upsert({
      where: { campaignId_userId: { campaignId: campaign.id, userId } },
      update: {},
      create: { campaignId: campaign.id, userId, role: "player" },
    });
    return getCampaign(campaign.id);
  }

  const stored = store.campaigns.find((c) => c.id === campaign.id)!;
  const user = store.users.find((u) => u.id === userId);
  if (user && !stored.members.some((m) => m.userId === userId)) {
    stored.members.push({ userId, campaignId: stored.id, role: "player", user, joinedAt: new Date().toISOString() });
  }
  return stored;
}

export async function getMembership(campaignId: string, userId: string): Promise<MemberRole | null> {
  if (isDatabaseConfigured && prisma) {
    const member = await prisma.campaignMember.findUnique({
      where: { campaignId_userId: { campaignId, userId } },
    });
    return member?.role ?? null;
  }
  const campaign = store.campaigns.find((c) => c.id === campaignId);
  return campaign?.members.find((m) => m.userId === userId)?.role ?? null;
}

export async function listAllCampaigns(): Promise<Campaign[]> {
  if (isDatabaseConfigured && prisma) {
    const rows = await prisma.campaign.findMany({ include: { members: { include: { user: true } } } });
    return rows.map(campaignFromDb);
  }
  return store.campaigns;
}

export async function updateCampaign(
  id: string,
  patch: Partial<Pick<Campaign, "name" | "description" | "genre" | "tone" | "gameSystem" | "privacy">>,
): Promise<Campaign | null> {
  if (isDatabaseConfigured && prisma) {
    await prisma.campaign.update({ where: { id }, data: patch });
    return getCampaign(id);
  }
  const campaign = store.campaigns.find((c) => c.id === id);
  if (!campaign) return null;
  Object.assign(campaign, patch, { updatedAt: new Date().toISOString() });
  return campaign;
}

export async function deleteCampaign(id: string): Promise<void> {
  if (isDatabaseConfigured && prisma) {
    await prisma.campaign.delete({ where: { id } });
    return;
  }
  store.campaigns = store.campaigns.filter((c) => c.id !== id);
  store.scenes = store.scenes.filter((s) => s.campaignId !== id);
  store.tokens = store.tokens.filter((t) => t.campaignId !== id);
  store.maps = store.maps.filter((m) => m.campaignId !== id);
}

// ───────────────────────────── Scenes ─────────────────────────────

export async function listScenesForCampaign(campaignId: string): Promise<Scene[]> {
  if (isDatabaseConfigured && prisma) {
    return prisma.scene.findMany({ where: { campaignId }, orderBy: { createdAt: "asc" } });
  }
  return store.scenes.filter((s) => s.campaignId === campaignId);
}

export async function getScene(id: string): Promise<Scene | null> {
  if (isDatabaseConfigured && prisma) {
    return prisma.scene.findUnique({ where: { id } });
  }
  return store.scenes.find((s) => s.id === id) ?? null;
}

export async function getActiveScene(campaignId: string): Promise<Scene | null> {
  if (isDatabaseConfigured && prisma) {
    const active = await prisma.scene.findFirst({ where: { campaignId, isActive: true } });
    if (active) return active;
    return prisma.scene.findFirst({ where: { campaignId }, orderBy: { createdAt: "asc" } });
  }
  const scenes = store.scenes.filter((s) => s.campaignId === campaignId);
  return scenes.find((s) => s.isActive) ?? scenes[0] ?? null;
}

export async function createScene(input: {
  campaignId: string;
  name: string;
  description?: string;
  mapId?: string | null;
  gridType?: GridType;
  gridEnabled?: boolean;
  gridSize?: number;
  createdBy: string;
  isActive?: boolean;
}): Promise<Scene> {
  if (isDatabaseConfigured && prisma) {
    return prisma.scene.create({
      data: {
        campaignId: input.campaignId,
        name: input.name,
        description: input.description,
        mapId: input.mapId ?? undefined,
        gridType: input.gridType ?? "square",
        gridEnabled: input.gridEnabled ?? true,
        gridSize: input.gridSize ?? 40,
        isActive: input.isActive ?? false,
        createdBy: input.createdBy,
      },
    });
  }
  const scene: Scene = {
    id: newId("scene"),
    campaignId: input.campaignId,
    name: input.name,
    description: input.description ?? "",
    mapId: input.mapId ?? null,
    gridType: input.gridType ?? "square",
    gridEnabled: input.gridEnabled ?? true,
    gridSize: input.gridSize ?? 40,
    isActive: input.isActive ?? false,
    createdBy: input.createdBy,
  };
  store.scenes.push(scene);
  return scene;
}

export async function updateScene(id: string, patch: Partial<Scene>): Promise<Scene | null> {
  if (isDatabaseConfigured && prisma) {
    return prisma.scene.update({ where: { id }, data: patch });
  }
  const scene = store.scenes.find((s) => s.id === id);
  if (!scene) return null;
  Object.assign(scene, patch);
  return scene;
}

export async function activateScene(campaignId: string, sceneId: string): Promise<void> {
  if (isDatabaseConfigured && prisma) {
    await prisma.$transaction([
      prisma.scene.updateMany({ where: { campaignId }, data: { isActive: false } }),
      prisma.scene.update({ where: { id: sceneId }, data: { isActive: true } }),
    ]);
    return;
  }
  store.scenes.filter((s) => s.campaignId === campaignId).forEach((s) => (s.isActive = s.id === sceneId));
}

export async function deleteScene(id: string): Promise<void> {
  if (isDatabaseConfigured && prisma) {
    await prisma.scene.delete({ where: { id } });
    return;
  }
  store.scenes = store.scenes.filter((s) => s.id !== id);
  store.tokens = store.tokens.filter((t) => t.sceneId !== id);
}

// ───────────────────────────── Maps ─────────────────────────────

export async function listMapsForCampaign(campaignId: string): Promise<QFMap[]> {
  if (isDatabaseConfigured && prisma) {
    const rows = await prisma.map.findMany({ where: { campaignId }, orderBy: { createdAt: "desc" } });
    return rows.map((r) => ({ ...r, tags: (r.tags as string[]) ?? [], createdAt: r.createdAt.toISOString() }));
  }
  return store.maps.filter((m) => m.campaignId === campaignId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getMap(mapId?: string | null): Promise<QFMap | null> {
  if (!mapId) return null;
  if (isDatabaseConfigured && prisma) {
    const row = await prisma.map.findUnique({ where: { id: mapId } });
    return row ? { ...row, tags: (row.tags as string[]) ?? [], createdAt: row.createdAt.toISOString() } : null;
  }
  return store.maps.find((m) => m.id === mapId) ?? null;
}

export async function createMap(input: Omit<QFMap, "id" | "createdAt">): Promise<QFMap> {
  if (isDatabaseConfigured && prisma) {
    const row = await prisma.map.create({
      data: {
        campaignId: input.campaignId,
        name: input.name,
        imageUrl: input.imageUrl,
        prompt: input.prompt ?? undefined,
        genre: input.genre ?? undefined,
        style: input.style ?? undefined,
        atmosphere: input.atmosphere ?? undefined,
        tags: input.tags,
        source: input.source,
        createdBy: input.createdBy,
      },
    });
    return { ...row, tags: (row.tags as string[]) ?? [], createdAt: row.createdAt.toISOString() };
  }
  const map: QFMap = { ...input, id: newId("map"), createdAt: new Date().toISOString() };
  store.maps.unshift(map);
  return map;
}

// ───────────────────────────── Tokens ─────────────────────────────

export async function listTokensForScene(sceneId: string): Promise<QFToken[]> {
  if (isDatabaseConfigured && prisma) {
    return prisma.token.findMany({ where: { sceneId } });
  }
  return store.tokens.filter((t) => t.sceneId === sceneId);
}

export async function createToken(input: Omit<QFToken, "id">): Promise<QFToken> {
  if (isDatabaseConfigured && prisma) {
    return prisma.token.create({ data: input });
  }
  const token: QFToken = { ...input, id: newId("tok") };
  store.tokens.push(token);
  return token;
}

export async function updateToken(id: string, patch: Partial<QFToken>): Promise<QFToken | null> {
  if (isDatabaseConfigured && prisma) {
    return prisma.token.update({ where: { id }, data: patch });
  }
  const token = store.tokens.find((t) => t.id === id);
  if (!token) return null;
  Object.assign(token, patch);
  return token;
}

export async function deleteToken(id: string): Promise<void> {
  if (isDatabaseConfigured && prisma) {
    await prisma.token.delete({ where: { id } });
    return;
  }
  store.tokens = store.tokens.filter((t) => t.id !== id);
}

export async function getToken(id: string): Promise<QFToken | null> {
  if (isDatabaseConfigured && prisma) {
    return prisma.token.findUnique({ where: { id } });
  }
  return store.tokens.find((t) => t.id === id) ?? null;
}

// ───────────────────────────── Characters ─────────────────────────────

export async function listCharactersForCampaign(campaignId: string): Promise<Character[]> {
  if (isDatabaseConfigured && prisma) {
    const rows = await prisma.character.findMany({ where: { campaignId } });
    return rows.map((r) => ({ ...r, color: r.color ?? "#2563eb" }));
  }
  return store.characters.filter((c) => c.campaignId === campaignId);
}

export async function createCharacter(input: Omit<Character, "id">): Promise<Character> {
  if (isDatabaseConfigured && prisma) {
    const row = await prisma.character.create({ data: input });
    return { ...row, color: row.color ?? "#2563eb" };
  }
  const character: Character = { ...input, id: newId("char") };
  store.characters.push(character);
  return character;
}

export async function updateCharacter(id: string, patch: Partial<Character>): Promise<Character | null> {
  if (isDatabaseConfigured && prisma) {
    const row = await prisma.character.update({ where: { id }, data: patch });
    return { ...row, color: row.color ?? "#2563eb" };
  }
  const character = store.characters.find((c) => c.id === id);
  if (!character) return null;
  Object.assign(character, patch);
  return character;
}

// ───────────────────────────── Dice ─────────────────────────────

export async function listDiceRolls(campaignId: string, sceneId?: string | null): Promise<DiceRollRecord[]> {
  if (isDatabaseConfigured && prisma) {
    const rows = await prisma.diceRoll.findMany({
      where: { campaignId, ...(sceneId ? { sceneId } : {}) },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: true },
    });
    return rows.map((r) => ({
      id: r.id,
      campaignId: r.campaignId,
      sceneId: r.sceneId,
      userId: r.userId,
      userName: r.user?.name ?? "Anonimo",
      formula: r.formula,
      results: r.results as number[],
      total: r.total,
      visibility: r.visibility,
      createdAt: r.createdAt.toISOString(),
    }));
  }
  return store.diceRolls
    .filter((r) => r.campaignId === campaignId && (!sceneId || r.sceneId === sceneId))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 100);
}

export async function createDiceRoll(input: Omit<DiceRollRecord, "id" | "createdAt">): Promise<DiceRollRecord> {
  const createdAt = new Date().toISOString();
  if (isDatabaseConfigured && prisma) {
    const row = await prisma.diceRoll.create({
      data: {
        campaignId: input.campaignId,
        sceneId: input.sceneId ?? undefined,
        userId: input.userId ?? undefined,
        formula: input.formula,
        results: input.results,
        total: input.total,
        visibility: input.visibility,
      },
    });
    return { ...input, id: row.id, createdAt: row.createdAt.toISOString() };
  }
  const roll: DiceRollRecord = { ...input, id: newId("roll"), createdAt };
  store.diceRolls.unshift(roll);
  return roll;
}

// ───────────────────────────── Chat ─────────────────────────────

export async function listChat(campaignId: string, sceneId?: string | null): Promise<ChatMessageRecord[]> {
  if (isDatabaseConfigured && prisma) {
    const rows = await prisma.chatMessage.findMany({
      where: { campaignId, ...(sceneId ? { sceneId } : {}) },
      orderBy: { createdAt: "asc" },
      take: 200,
      include: { user: true },
    });
    return rows.map((r) => ({
      id: r.id,
      campaignId: r.campaignId,
      sceneId: r.sceneId,
      userId: r.userId,
      userName: r.user?.name ?? "Sistema",
      type: r.type,
      message: r.message,
      createdAt: r.createdAt.toISOString(),
    }));
  }
  return store.chat
    .filter((c) => c.campaignId === campaignId && (!sceneId || c.sceneId === sceneId))
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}

export async function createChatMessage(input: {
  campaignId: string;
  sceneId?: string | null;
  userId?: string | null;
  userName: string;
  type: ChatMessageType;
  message: string;
}): Promise<ChatMessageRecord> {
  const createdAt = new Date().toISOString();
  if (isDatabaseConfigured && prisma) {
    const row = await prisma.chatMessage.create({
      data: {
        campaignId: input.campaignId,
        sceneId: input.sceneId ?? undefined,
        userId: input.userId ?? undefined,
        type: input.type,
        message: input.message,
      },
    });
    return { ...input, id: row.id, createdAt: row.createdAt.toISOString() };
  }
  const message: ChatMessageRecord = { ...input, id: newId("chat"), createdAt };
  store.chat.push(message);
  return message;
}

// ───────────────────────────── Notes ─────────────────────────────

export async function listNotes(campaignId: string): Promise<NoteRecord[]> {
  if (isDatabaseConfigured && prisma) {
    const rows = await prisma.note.findMany({ where: { campaignId }, orderBy: { updatedAt: "desc" } });
    return rows.map((r) => ({
      ...r,
      tags: (r.tags as string[]) ?? [],
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  }
  return store.notes.filter((n) => n.campaignId === campaignId).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function createNote(input: {
  campaignId: string;
  sceneId?: string | null;
  title: string;
  content: string;
  visibility: NoteVisibility;
  tags: string[];
  createdBy: string;
}): Promise<NoteRecord> {
  const now = new Date().toISOString();
  if (isDatabaseConfigured && prisma) {
    const row = await prisma.note.create({
      data: {
        campaignId: input.campaignId,
        sceneId: input.sceneId ?? undefined,
        title: input.title,
        content: input.content,
        visibility: input.visibility,
        tags: input.tags,
        createdBy: input.createdBy,
      },
    });
    return { ...input, id: row.id, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
  }
  const note: NoteRecord = { ...input, id: newId("note"), createdAt: now, updatedAt: now };
  store.notes.unshift(note);
  return note;
}

export async function updateNote(id: string, patch: Partial<NoteRecord>): Promise<NoteRecord | null> {
  const updatedAt = new Date().toISOString();
  if (isDatabaseConfigured && prisma) {
    const row = await prisma.note.update({ where: { id }, data: { ...patch, tags: patch.tags } });
    return {
      ...row,
      tags: (row.tags as string[]) ?? [],
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
  const note = store.notes.find((n) => n.id === id);
  if (!note) return null;
  Object.assign(note, patch, { updatedAt });
  return note;
}

export async function deleteNote(id: string): Promise<void> {
  if (isDatabaseConfigured && prisma) {
    await prisma.note.delete({ where: { id } });
    return;
  }
  store.notes = store.notes.filter((n) => n.id !== id);
}

// ───────────────────────────── Music ─────────────────────────────

export async function listMusicTracks(campaignId?: string | null): Promise<MusicTrackRecord[]> {
  if (isDatabaseConfigured && prisma) {
    const rows = await prisma.musicTrack.findMany({
      where: campaignId ? { OR: [{ campaignId }, { campaignId: null }] } : {},
    });
    return rows.map((r) => ({ ...r, category: r.category ?? "Generico", mood: r.mood ?? "Neutro" }));
  }
  return store.music.filter((m) => !campaignId || !m.campaignId || m.campaignId === campaignId);
}

export async function createMusicTrack(input: Omit<MusicTrackRecord, "id">): Promise<MusicTrackRecord> {
  if (isDatabaseConfigured && prisma) {
    const row = await prisma.musicTrack.create({ data: input });
    return { ...row, category: row.category ?? "Generico", mood: row.mood ?? "Neutro" };
  }
  const track: MusicTrackRecord = { ...input, id: newId("music") };
  store.music.unshift(track);
  return track;
}

// ───────────────────────────── Assets & Premium ─────────────────────────────

export async function listAssets(campaignId?: string | null): Promise<AssetRecord[]> {
  if (isDatabaseConfigured && prisma) {
    const rows = await prisma.asset.findMany({
      where: campaignId ? { campaignId } : {},
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => ({
      ...r,
      tags: (r.tags as string[]) ?? [],
      createdAt: r.createdAt.toISOString(),
      url: r.url ?? undefined,
      previewUrl: r.previewUrl ?? undefined,
      createdBy: r.createdBy ?? undefined,
    }));
  }
  return campaignId ? store.assets.filter((a) => a.campaignId === campaignId) : store.assets;
}

export async function listPremiumItems(): Promise<PremiumItemRecord[]> {
  if (isDatabaseConfigured && prisma) {
    const rows = await prisma.premiumItem.findMany({ where: { active: true } });
    return rows.map((r) => ({ ...r, description: r.description ?? "", previewUrl: r.previewUrl ?? undefined }));
  }
  return store.premiumItems;
}
