import { z } from "zod";

export const campaignCreateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(2000).optional(),
  genre: z.string().trim().max(60),
  tone: z.string().trim().max(60),
  gameSystem: z.string().trim().max(80),
  privacy: z.enum(["private", "invite", "public"]).default("invite"),
});

export const campaignUpdateSchema = campaignCreateSchema.partial();

export const sceneCreateSchema = z.object({
  campaignId: z.string().min(1),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(2000).optional(),
  mapId: z.string().optional().nullable(),
  gridType: z.enum(["none", "square", "hex"]).default("square"),
  gridEnabled: z.boolean().default(true),
  gridSize: z.number().int().min(10).max(200).default(40),
});

export const sceneUpdateSchema = sceneCreateSchema.partial().omit({ campaignId: true });

export const tokenCreateSchema = z.object({
  campaignId: z.string().min(1),
  sceneId: z.string().min(1),
  characterId: z.string().optional().nullable(),
  ownerId: z.string().optional().nullable(),
  name: z.string().trim().min(1).max(60),
  icon: z.string().max(8).optional(),
  imageUrl: z.string().url().optional().nullable(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#7c3aed"),
  xPosition: z.number().min(0).max(100).default(50),
  yPosition: z.number().min(0).max(100).default(50),
  size: z.number().min(0.25).max(4).default(1),
  locked: z.boolean().default(false),
  visible: z.boolean().default(true),
});

export const tokenMoveSchema = z.object({
  xPosition: z.number().min(0).max(100),
  yPosition: z.number().min(0).max(100),
});

export const tokenUpdateSchema = tokenCreateSchema.partial().omit({ campaignId: true, sceneId: true });

export const characterCreateSchema = z.object({
  campaignId: z.string().min(1),
  name: z.string().trim().min(1).max(60),
  avatar: z.string().url().optional().nullable(),
  roleLabel: z.string().max(80).optional(),
  originLabel: z.string().max(80).optional(),
  mainResource: z.string().max(80).optional(),
  description: z.string().max(2000).optional(),
  abilitiesNotes: z.string().max(4000).optional(),
  inventoryNotes: z.string().max(4000).optional(),
  backstory: z.string().max(4000).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#2563eb"),
});

export const characterUpdateSchema = characterCreateSchema.partial().omit({ campaignId: true });

export const diceRollSchema = z.object({
  campaignId: z.string().min(1),
  sceneId: z.string().optional().nullable(),
  formula: z.string().trim().min(1).max(32),
  visibility: z.enum(["public", "private_master"]).default("public"),
});

export const noteCreateSchema = z.object({
  campaignId: z.string().min(1),
  sceneId: z.string().optional().nullable(),
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1).max(10000),
  visibility: z.enum(["master", "shared"]).default("shared"),
  tags: z.array(z.string().max(30)).max(10).default([]),
});

export const noteUpdateSchema = noteCreateSchema.partial().omit({ campaignId: true });

export const chatMessageSchema = z.object({
  campaignId: z.string().min(1),
  sceneId: z.string().optional().nullable(),
  type: z.enum(["user", "dice", "token_move", "scene_change", "note", "system"]).default("user"),
  message: z.string().trim().min(1).max(1000),
});

export const mapCreateSchema = z.object({
  campaignId: z.string().min(1),
  name: z.string().trim().min(1).max(80),
  imageUrl: z.string().min(1),
  prompt: z.string().max(2000).optional(),
  genre: z.string().max(60).optional(),
  style: z.string().max(60).optional(),
  atmosphere: z.string().max(120).optional(),
  tags: z.array(z.string().max(30)).max(15).default([]),
  source: z.enum(["upload", "demo", "ai", "premium"]).default("upload"),
});

export const aiPromptSchema = z.object({
  campaignId: z.string().optional().nullable(),
  sceneId: z.string().optional().nullable(),
  requestType: z.enum(["scene", "map", "npc", "item", "place", "encounter", "atmosphere", "music"]),
  fields: z.record(z.string(), z.string().max(2000)).default({}),
});

export const musicTrackCreateSchema = z.object({
  campaignId: z.string().optional().nullable(),
  name: z.string().trim().min(1).max(80),
  category: z.string().max(40).optional(),
  mood: z.string().max(40).optional(),
  audioUrl: z.string().min(1),
  loopEnabled: z.boolean().default(true),
  source: z.enum(["upload", "demo", "ai", "premium"]).default("demo"),
  prompt: z.string().max(2000).optional(),
});
