import { PrismaClient } from "@prisma/client";
import {
  AI_PROMPT_EXAMPLES,
  DEMO_CAMPAIGNS,
  DEMO_CHARACTERS,
  DEMO_CHAT,
  DEMO_DICE_ROLLS,
  DEMO_MAP_RECORDS,
  DEMO_MUSIC,
  DEMO_NOTES,
  DEMO_PREMIUM_ITEMS,
  DEMO_SCENES,
  DEMO_TOKENS,
  DEMO_USERS,
} from "../lib/demo";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding QuestForge demo data...");

  for (const user of DEMO_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        preferredRole: user.preferredRole,
        isPremium: user.isPremium,
        aiCredits: user.aiCredits,
      },
    });
  }

  for (const campaign of DEMO_CAMPAIGNS) {
    await prisma.campaign.upsert({
      where: { id: campaign.id },
      update: {},
      create: {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        genre: campaign.genre,
        tone: campaign.tone,
        gameSystem: campaign.gameSystem,
        ownerId: campaign.ownerId,
        privacy: campaign.privacy,
        inviteCode: campaign.inviteCode,
        createdAt: new Date(campaign.createdAt),
        updatedAt: new Date(campaign.updatedAt),
      },
    });

    for (const member of campaign.members) {
      await prisma.campaignMember.upsert({
        where: { campaignId_userId: { campaignId: campaign.id, userId: member.userId } },
        update: { role: member.role },
        create: { campaignId: campaign.id, userId: member.userId, role: member.role },
      });
    }
  }

  for (const map of DEMO_MAP_RECORDS) {
    await prisma.map.upsert({
      where: { id: map.id },
      update: {},
      create: {
        id: map.id,
        campaignId: map.campaignId,
        name: map.name,
        imageUrl: map.imageUrl,
        genre: map.genre,
        atmosphere: map.atmosphere,
        tags: map.tags,
        source: map.source,
        createdBy: map.createdBy,
      },
    });
  }

  for (const scene of DEMO_SCENES) {
    await prisma.scene.upsert({
      where: { id: scene.id },
      update: {},
      create: {
        id: scene.id,
        campaignId: scene.campaignId,
        name: scene.name,
        description: scene.description,
        mapId: scene.mapId,
        gridType: scene.gridType,
        gridEnabled: scene.gridEnabled,
        gridSize: scene.gridSize,
        isActive: scene.isActive,
        createdBy: scene.createdBy,
      },
    });
  }

  for (const character of DEMO_CHARACTERS) {
    await prisma.character.upsert({
      where: { id: character.id },
      update: {},
      create: {
        id: character.id,
        campaignId: character.campaignId,
        userId: character.userId,
        name: character.name,
        roleLabel: character.roleLabel,
        originLabel: character.originLabel,
        mainResource: character.mainResource,
        description: character.description,
        backstory: character.backstory,
        color: character.color,
      },
    });
  }

  for (const token of DEMO_TOKENS) {
    await prisma.token.upsert({
      where: { id: token.id },
      update: {},
      create: {
        id: token.id,
        campaignId: token.campaignId,
        sceneId: token.sceneId,
        characterId: token.characterId ?? null,
        ownerId: token.ownerId ?? null,
        name: token.name,
        color: token.color,
        xPosition: token.xPosition,
        yPosition: token.yPosition,
        size: token.size,
        locked: token.locked,
        visible: token.visible,
      },
    });
  }

  for (const roll of DEMO_DICE_ROLLS) {
    await prisma.diceRoll.upsert({
      where: { id: roll.id },
      update: {},
      create: {
        id: roll.id,
        campaignId: roll.campaignId,
        sceneId: roll.sceneId,
        userId: roll.userId,
        formula: roll.formula,
        results: roll.results,
        total: roll.total,
        visibility: roll.visibility,
        createdAt: new Date(roll.createdAt),
      },
    });
  }

  for (const msg of DEMO_CHAT) {
    await prisma.chatMessage.upsert({
      where: { id: msg.id },
      update: {},
      create: {
        id: msg.id,
        campaignId: msg.campaignId,
        sceneId: msg.sceneId,
        userId: msg.userId,
        type: msg.type,
        message: msg.message,
        createdAt: new Date(msg.createdAt),
      },
    });
  }

  for (const note of DEMO_NOTES) {
    await prisma.note.upsert({
      where: { id: note.id },
      update: {},
      create: {
        id: note.id,
        campaignId: note.campaignId,
        sceneId: note.sceneId,
        title: note.title,
        content: note.content,
        visibility: note.visibility,
        tags: note.tags,
        createdBy: note.createdBy,
      },
    });
  }

  for (const track of DEMO_MUSIC) {
    await prisma.musicTrack.upsert({
      where: { id: track.id },
      update: {},
      create: {
        id: track.id,
        campaignId: track.campaignId,
        name: track.name,
        category: track.category,
        mood: track.mood,
        audioUrl: track.audioUrl,
        loopEnabled: track.loopEnabled,
        source: track.source,
      },
    });
  }

  for (const item of DEMO_PREMIUM_ITEMS) {
    await prisma.premiumItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        itemType: item.itemType,
        name: item.name,
        description: item.description,
        priceEur: item.priceEur,
        active: item.active,
        comingSoon: item.comingSoon,
      },
    });
  }

  for (const [i, prompt] of AI_PROMPT_EXAMPLES.entries()) {
    await prisma.aIRequest.upsert({
      where: { id: `ai-example-${i}` },
      update: {},
      create: {
        id: `ai-example-${i}`,
        requestType: "scene",
        prompt,
        status: "mock",
        provider: "mock",
      },
    });
  }

  console.log("Seed completato.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
