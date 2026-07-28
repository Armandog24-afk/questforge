import { DEMO_MAPS } from "@/lib/demo-maps";
import type {
  AppUser,
  AssetRecord,
  Campaign,
  Character,
  ChatMessageRecord,
  DiceRollRecord,
  MusicTrackRecord,
  NoteRecord,
  PremiumItemRecord,
  QFMap,
  QFToken,
  Scene,
} from "@/lib/types";

/**
 * Fully self-contained demo dataset. Powers the app end-to-end with zero
 * external configuration (no DATABASE_URL, no AI keys, no storage). This is
 * what ships to a fresh clone and what `prisma/seed.ts` writes into a real
 * database once one is configured.
 */

export const DEMO_USERS: AppUser[] = [
  {
    id: "user-marco",
    email: "marco@questforge.demo",
    name: "Marco",
    nickname: "Il Narratore",
    preferredRole: "master",
    isPremium: false,
    aiCredits: 42,
  },
  {
    id: "user-giulia",
    email: "giulia@questforge.demo",
    name: "Giulia",
    nickname: "Lyra",
    preferredRole: "player",
    isPremium: false,
    aiCredits: 12,
  },
  {
    id: "user-luca",
    email: "luca@questforge.demo",
    name: "Luca",
    nickname: "Arkan",
    preferredRole: "player",
    isPremium: false,
    aiCredits: 8,
  },
  {
    id: "user-sara",
    email: "sara@questforge.demo",
    name: "Sara",
    nickname: "Nyx",
    preferredRole: "player",
    isPremium: false,
    aiCredits: 15,
  },
  {
    id: "user-dario",
    email: "dario@questforge.demo",
    name: "Dario",
    nickname: "Unit-7",
    preferredRole: "player",
    isPremium: false,
    aiCredits: 20,
  },
];

export const DEMO_CURRENT_USER_ID = "user-marco";

function userById(id: string) {
  const u = DEMO_USERS.find((u) => u.id === id);
  if (!u) throw new Error(`Demo user ${id} not found`);
  return u;
}

export const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-cripta",
    name: "La Cripta delle Lanterne",
    description:
      "Un gruppo di avventurieri segue le tracce di un culto che riaccende antiche lanterne sepolte per risvegliare qualcosa di molto più antico della morte.",
    genre: "Fantasy",
    tone: "Dark",
    gameSystem: "D&D 5e",
    ownerId: "user-marco",
    privacy: "invite",
    inviteCode: "CRIPTA-7X2K",
    createdAt: "2026-05-02T18:00:00.000Z",
    updatedAt: "2026-07-20T21:00:00.000Z",
    members: [
      { userId: "user-marco", campaignId: "camp-cripta", role: "master", user: userById("user-marco"), joinedAt: "2026-05-02T18:00:00.000Z" },
      { userId: "user-giulia", campaignId: "camp-cripta", role: "player", user: userById("user-giulia"), joinedAt: "2026-05-02T19:00:00.000Z" },
      { userId: "user-luca", campaignId: "camp-cripta", role: "player", user: userById("user-luca"), joinedAt: "2026-05-02T19:05:00.000Z" },
      { userId: "user-sara", campaignId: "camp-cripta", role: "player", user: userById("user-sara"), joinedAt: "2026-05-03T10:00:00.000Z" },
    ],
  },
  {
    id: "camp-neon",
    name: "Neon Rain 2097",
    description:
      "Night City non esiste più, ma la pioggia acida e i neon sì. Una squadra di runner indaga una corporazione che vende ricordi rubati.",
    genre: "Cyberpunk",
    tone: "Cinematico",
    gameSystem: "Cyberpunk RED",
    ownerId: "user-marco",
    privacy: "invite",
    inviteCode: "NEON-9RN4",
    createdAt: "2026-06-10T20:00:00.000Z",
    updatedAt: "2026-07-22T22:30:00.000Z",
    members: [
      { userId: "user-marco", campaignId: "camp-neon", role: "master", user: userById("user-marco"), joinedAt: "2026-06-10T20:00:00.000Z" },
      { userId: "user-dario", campaignId: "camp-neon", role: "player", user: userById("user-dario"), joinedAt: "2026-06-10T20:10:00.000Z" },
      { userId: "user-giulia", campaignId: "camp-neon", role: "player", user: userById("user-giulia"), joinedAt: "2026-06-11T09:00:00.000Z" },
    ],
  },
  {
    id: "camp-corvo",
    name: "Il Mistero di Villa Corvo",
    description:
      "Una villa isolata, una famiglia che nasconde un patto e investigatori che iniziano a dubitare della propria sanità mentale.",
    genre: "Investigativo",
    tone: "Misterioso",
    gameSystem: "Call of Cthulhu",
    ownerId: "user-marco",
    privacy: "private",
    inviteCode: "CORVO-4LM1",
    createdAt: "2026-07-01T17:00:00.000Z",
    updatedAt: "2026-07-25T19:00:00.000Z",
    members: [
      { userId: "user-marco", campaignId: "camp-corvo", role: "master", user: userById("user-marco"), joinedAt: "2026-07-01T17:00:00.000Z" },
      { userId: "user-luca", campaignId: "camp-corvo", role: "player", user: userById("user-luca"), joinedAt: "2026-07-01T17:30:00.000Z" },
      { userId: "user-sara", campaignId: "camp-corvo", role: "player", user: userById("user-sara"), joinedAt: "2026-07-01T17:40:00.000Z" },
    ],
  },
];

export const DEMO_MAP_RECORDS: QFMap[] = [
  {
    id: "map-taverna",
    campaignId: "camp-cripta",
    name: "Taverna del Cinghiale Nero",
    imageUrl: DEMO_MAPS.tavern,
    genre: "Fantasy",
    atmosphere: "Calda, rumorosa, un po' sospetta",
    tags: ["taverna", "interno", "sociale"],
    source: "demo",
    createdBy: "user-marco",
    createdAt: "2026-05-02T18:10:00.000Z",
  },
  {
    id: "map-bosco",
    campaignId: "camp-cripta",
    name: "Bosco Nebbioso",
    imageUrl: DEMO_MAPS.forest,
    genre: "Fantasy",
    atmosphere: "Silenzioso, umido, minaccioso",
    tags: ["esterno", "esplorazione"],
    source: "demo",
    createdBy: "user-marco",
    createdAt: "2026-05-05T18:10:00.000Z",
  },
  {
    id: "map-cripta",
    campaignId: "camp-cripta",
    name: "Cripta delle Lanterne",
    imageUrl: DEMO_MAPS.crypt,
    genre: "Fantasy",
    atmosphere: "Gelida, sacra, corrotta",
    tags: ["dungeon", "sotterraneo", "boss"],
    source: "demo",
    createdBy: "user-marco",
    createdAt: "2026-05-10T18:10:00.000Z",
  },
  {
    id: "map-lab",
    campaignId: "camp-neon",
    name: "Laboratorio Abbandonato",
    imageUrl: DEMO_MAPS.lab,
    genre: "Cyberpunk",
    atmosphere: "Sterile, inquietante, tecnologica",
    tags: ["interno", "corporazione"],
    source: "demo",
    createdBy: "user-marco",
    createdAt: "2026-06-10T20:20:00.000Z",
  },
  {
    id: "map-vicolo",
    campaignId: "camp-neon",
    name: "Vicolo Neon",
    imageUrl: DEMO_MAPS.cyberAlley,
    genre: "Cyberpunk",
    atmosphere: "Piovosa, neon, pericolosa",
    tags: ["esterno", "città", "inseguimento"],
    source: "demo",
    createdBy: "user-marco",
    createdAt: "2026-06-14T20:20:00.000Z",
  },
  {
    id: "map-nave",
    campaignId: "camp-neon",
    name: "Nave Spaziale alla Deriva",
    imageUrl: DEMO_MAPS.spaceship,
    genre: "Sci-fi",
    atmosphere: "Silenziosa, claustrofobica, alla deriva",
    tags: ["interno", "spazio", "mistero"],
    source: "demo",
    createdBy: "user-marco",
    createdAt: "2026-06-20T20:20:00.000Z",
  },
  {
    id: "map-villa",
    campaignId: "camp-corvo",
    name: "Villa Corvo - Salotto degli Specchi",
    imageUrl: DEMO_MAPS.villa,
    genre: "Horror",
    atmosphere: "Opprimente, elegante, malata",
    tags: ["interno", "horror", "indagine"],
    source: "demo",
    createdBy: "user-marco",
    createdAt: "2026-07-01T17:20:00.000Z",
  },
];

export const DEMO_SCENES: Scene[] = [
  { id: "scene-taverna", campaignId: "camp-cripta", name: "Taverna del Cinghiale Nero", description: "Il gruppo si ritrova per la prima volta.", mapId: "map-taverna", gridType: "square", gridEnabled: true, gridSize: 40, isActive: true, createdBy: "user-marco" },
  { id: "scene-bosco", campaignId: "camp-cripta", name: "Bosco Nebbioso", description: "Il sentiero verso la cripta si perde nella nebbia.", mapId: "map-bosco", gridType: "hex", gridEnabled: true, gridSize: 44, isActive: false, createdBy: "user-marco" },
  { id: "scene-cripta", campaignId: "camp-cripta", name: "Cripta delle Lanterne", description: "L'altare centrale pulsa di una luce viola.", mapId: "map-cripta", gridType: "square", gridEnabled: true, gridSize: 40, isActive: false, createdBy: "user-marco" },

  { id: "scene-lab", campaignId: "camp-neon", name: "Laboratorio Abbandonato", description: "Terminali spenti, tranne uno.", mapId: "map-lab", gridType: "square", gridEnabled: true, gridSize: 40, isActive: true, createdBy: "user-marco" },
  { id: "scene-vicolo", campaignId: "camp-neon", name: "Vicolo Neon", description: "Un inseguimento tra i neon bagnati di pioggia.", mapId: "map-vicolo", gridType: "none", gridEnabled: false, gridSize: 40, isActive: false, createdBy: "user-marco" },
  { id: "scene-nave", campaignId: "camp-neon", name: "Nave Spaziale alla Deriva", description: "Un relitto che non dovrebbe essere lì.", mapId: "map-nave", gridType: "square", gridEnabled: true, gridSize: 40, isActive: false, createdBy: "user-marco" },

  { id: "scene-villa", campaignId: "camp-corvo", name: "Villa Corvo - Salotto degli Specchi", description: "Gli specchi non riflettono sempre la stanza giusta.", mapId: "map-villa", gridType: "none", gridEnabled: false, gridSize: 40, isActive: true, createdBy: "user-marco" },
];

export const DEMO_CHARACTERS: Character[] = [
  { id: "char-arkan", campaignId: "camp-cripta", userId: "user-luca", name: "Arkan", roleLabel: "Guerriero errante", originLabel: "Umano delle terre di confine", mainResource: "Punti Ferita: 34/34", description: "Un mercenario che ha smesso di combattere per soldi, ma non per abitudine.", backstory: "Ha lasciato il suo villaggio dopo un raid che non è riuscito a fermare.", color: "#ef4444" },
  { id: "char-lyra", campaignId: "camp-cripta", userId: "user-giulia", name: "Lyra", roleLabel: "Maga delle rovine", originLabel: "Alto elfa", mainResource: "Slot incantesimo: 3/4", description: "Studia rovine antiche cercando risposte che nessuno vuole darle.", backstory: "La sua accademia è stata cancellata da una guerra che i libri di storia ignorano.", color: "#7c3aed" },
  { id: "char-nyx", campaignId: "camp-cripta", userId: "user-sara", name: "Nyx", roleLabel: "Ladra silenziosa", originLabel: "Mezzelfa", mainResource: "Punti Ferita: 22/22", description: "Non ruba per necessità. Ruba perché le porte chiuse la offendono.", color: "#22c55e" },
  { id: "char-unit7", campaignId: "camp-neon", userId: "user-dario", name: "Unit-7", roleLabel: "Androide tattico", originLabel: "Prototipo dismesso", mainResource: "Integrità: 88%", description: "Costruito per la guerra, riprogrammato per sopravvivere in pace.", color: "#2563eb" },
  { id: "char-vera", campaignId: "camp-corvo", userId: "user-luca", name: "Vera Holt", roleLabel: "Investigatrice privata", originLabel: "Ex detective di polizia", mainResource: "Sanità Mentale: 61/99", description: "Ha lasciato il distintivo dopo un caso che nessuno voleva riaprire.", color: "#f59e0b" },
  { id: "char-elias", campaignId: "camp-corvo", userId: "user-sara", name: "Padre Elias", roleLabel: "Occultista riluttante", originLabel: "Ex sacerdote", mainResource: "Sanità Mentale: 54/90", description: "Crede ancora in Dio. È il resto in cui ha smesso di credere.", color: "#9ca3af" },
];

export const DEMO_TOKENS: QFToken[] = [
  { id: "tok-arkan", campaignId: "camp-cripta", sceneId: "scene-taverna", characterId: "char-arkan", ownerId: "user-luca", name: "Arkan", color: "#ef4444", xPosition: 32, yPosition: 55, size: 1, locked: false, visible: true },
  { id: "tok-lyra", campaignId: "camp-cripta", sceneId: "scene-taverna", characterId: "char-lyra", ownerId: "user-giulia", name: "Lyra", color: "#7c3aed", xPosition: 45, yPosition: 60, size: 1, locked: false, visible: true },
  { id: "tok-nyx", campaignId: "camp-cripta", sceneId: "scene-taverna", characterId: "char-nyx", ownerId: "user-sara", name: "Nyx", color: "#22c55e", xPosition: 58, yPosition: 50, size: 1, locked: false, visible: true },
  { id: "tok-oste", campaignId: "camp-cripta", sceneId: "scene-taverna", ownerId: null, name: "Oste", color: "#f59e0b", xPosition: 50, yPosition: 25, size: 1, locked: true, visible: true },

  { id: "tok-unit7", campaignId: "camp-neon", sceneId: "scene-lab", characterId: "char-unit7", ownerId: "user-dario", name: "Unit-7", color: "#2563eb", xPosition: 40, yPosition: 45, size: 1, locked: false, visible: true },
  { id: "tok-drone", campaignId: "camp-neon", sceneId: "scene-lab", ownerId: null, name: "Drone di sorveglianza", color: "#ef4444", xPosition: 65, yPosition: 30, size: 0.8, locked: false, visible: true },

  { id: "tok-vera", campaignId: "camp-corvo", sceneId: "scene-villa", characterId: "char-vera", ownerId: "user-luca", name: "Vera Holt", color: "#f59e0b", xPosition: 35, yPosition: 62, size: 1, locked: false, visible: true },
  { id: "tok-elias", campaignId: "camp-corvo", sceneId: "scene-villa", characterId: "char-elias", ownerId: "user-sara", name: "Padre Elias", color: "#9ca3af", xPosition: 50, yPosition: 62, size: 1, locked: false, visible: true },
];

export const DEMO_DICE_ROLLS: DiceRollRecord[] = [
  { id: "roll-1", campaignId: "camp-cripta", sceneId: "scene-taverna", userId: "user-luca", userName: "Luca (Arkan)", formula: "1d20+5", results: [17], total: 22, visibility: "public", createdAt: "2026-07-20T21:05:00.000Z" },
  { id: "roll-2", campaignId: "camp-cripta", sceneId: "scene-taverna", userId: "user-giulia", userName: "Giulia (Lyra)", formula: "2d6", results: [3, 5], total: 8, visibility: "public", createdAt: "2026-07-20T21:07:00.000Z" },
  { id: "roll-3", campaignId: "camp-cripta", sceneId: "scene-taverna", userId: "user-marco", userName: "Marco (Master)", formula: "1d20", results: [20], total: 20, visibility: "private_master", createdAt: "2026-07-20T21:09:00.000Z" },
  { id: "roll-4", campaignId: "camp-neon", sceneId: "scene-lab", userId: "user-dario", userName: "Dario (Unit-7)", formula: "3d8+2", results: [4, 7, 2], total: 15, visibility: "public", createdAt: "2026-07-22T22:31:00.000Z" },
];

export const DEMO_CHAT: ChatMessageRecord[] = [
  { id: "chat-1", campaignId: "camp-cripta", sceneId: "scene-taverna", userId: "user-marco", userName: "Marco", type: "system", message: "La sessione è iniziata.", createdAt: "2026-07-20T21:00:00.000Z" },
  { id: "chat-2", campaignId: "camp-cripta", sceneId: "scene-taverna", userId: "user-luca", userName: "Luca", type: "user", message: "Mi siedo al bancone e ordino qualcosa di forte.", createdAt: "2026-07-20T21:02:00.000Z" },
  { id: "chat-3", campaignId: "camp-cripta", sceneId: "scene-taverna", userId: "user-luca", userName: "Luca (Arkan)", type: "dice", message: "Arkan tira 1d20+5 → 22", createdAt: "2026-07-20T21:05:00.000Z" },
  { id: "chat-4", campaignId: "camp-cripta", sceneId: "scene-taverna", userId: "user-giulia", userName: "Giulia", type: "user", message: "Osservo la stanza in cerca di simboli sospetti.", createdAt: "2026-07-20T21:06:00.000Z" },
  { id: "chat-5", campaignId: "camp-cripta", sceneId: "scene-taverna", userId: "user-sara", userName: "Sara", type: "token_move", message: "Nyx si è spostata sulla mappa.", createdAt: "2026-07-20T21:10:00.000Z" },
  { id: "chat-6", campaignId: "camp-neon", sceneId: "scene-lab", userId: "user-marco", userName: "Marco", type: "scene_change", message: "Scena cambiata: Laboratorio Abbandonato.", createdAt: "2026-07-22T22:00:00.000Z" },
  { id: "chat-7", campaignId: "camp-neon", sceneId: "scene-lab", userId: "user-dario", userName: "Dario (Unit-7)", type: "dice", message: "Unit-7 tira 3d8+2 → 15", createdAt: "2026-07-22T22:31:00.000Z" },
];

export const DEMO_NOTES: NoteRecord[] = [
  {
    id: "note-1",
    campaignId: "camp-cripta",
    sceneId: "scene-cripta",
    title: "Segreto dell'altare",
    content: "L'altare si attiva solo se tutte e tre le lanterne sono accese contemporaneamente. Il Master decide quando rivelarlo.",
    visibility: "master",
    tags: ["segreto", "boss"],
    createdBy: "user-marco",
    createdAt: "2026-05-10T19:00:00.000Z",
    updatedAt: "2026-05-10T19:00:00.000Z",
  },
  {
    id: "note-2",
    campaignId: "camp-cripta",
    title: "Obiettivo del gruppo",
    content: "Trovare le tre lanterne rubate dal culto prima della luna piena.",
    visibility: "shared",
    tags: ["obiettivo"],
    createdBy: "user-marco",
    createdAt: "2026-05-02T18:30:00.000Z",
    updatedAt: "2026-05-02T18:30:00.000Z",
  },
  {
    id: "note-3",
    campaignId: "camp-neon",
    title: "Indizio: badge corporativo",
    content: "Il badge trovato nel laboratorio appartiene a una divisione ufficialmente chiusa nel 2091.",
    visibility: "shared",
    tags: ["indizio"],
    createdBy: "user-marco",
    createdAt: "2026-06-10T21:00:00.000Z",
    updatedAt: "2026-06-10T21:00:00.000Z",
  },
];

export const DEMO_MUSIC: MusicTrackRecord[] = [
  { id: "music-dungeon", name: "Dungeon Ambience", category: "Dungeon", mood: "Teso", audioUrl: "synth:dungeon:110", loopEnabled: true, source: "demo", campaignId: null },
  { id: "music-rain", name: "Rainy City", category: "Città", mood: "Malinconico", audioUrl: "synth:rain:220", loopEnabled: true, source: "demo", campaignId: null },
  { id: "music-tavern", name: "Tavern Warmth", category: "Taverna", mood: "Caldo", audioUrl: "synth:tavern:196", loopEnabled: true, source: "demo", campaignId: null },
  { id: "music-boss", name: "Boss Fight", category: "Combattimento", mood: "Epico", audioUrl: "synth:boss:82", loopEnabled: true, source: "demo", campaignId: null },
  { id: "music-space", name: "Space Drift", category: "Spazio", mood: "Onirico", audioUrl: "synth:space:130", loopEnabled: true, source: "demo", campaignId: null },
  { id: "music-horror", name: "Horror Tension", category: "Horror", mood: "Inquietante", audioUrl: "synth:horror:60", loopEnabled: true, source: "demo", campaignId: null },
  { id: "music-forest", name: "Forest Night", category: "Natura", mood: "Sereno", audioUrl: "synth:forest:174", loopEnabled: true, source: "demo", campaignId: null },
  { id: "music-cyber", name: "Cyberpunk Pulse", category: "Cyberpunk", mood: "Elettrico", audioUrl: "synth:cyber:146", loopEnabled: true, source: "demo", campaignId: null },
];

export const AI_PROMPT_EXAMPLES = [
  "Genera una taverna fantasy con atmosfera sospetta.",
  "Genera un PNG cyberpunk con un segreto pericoloso.",
  "Genera una cripta gotica con un altare maledetto.",
  "Genera una scena investigativa in una villa abbandonata.",
  "Genera un oggetto misterioso per una campagna horror.",
];

export const DEMO_ASSETS: AssetRecord[] = [
  ...DEMO_MAP_RECORDS.map((m): AssetRecord => ({
    id: `asset-${m.id}`,
    campaignId: m.campaignId,
    assetType: "map",
    name: m.name,
    previewUrl: m.imageUrl,
    tags: m.tags,
    source: m.source,
    createdBy: m.createdBy,
    createdAt: m.createdAt,
  })),
  ...DEMO_MUSIC.map((t): AssetRecord => ({
    id: `asset-${t.id}`,
    campaignId: t.campaignId,
    assetType: "music",
    name: t.name,
    tags: [t.category, t.mood],
    source: t.source,
    createdAt: "2026-05-01T00:00:00.000Z",
  })),
  ...DEMO_NOTES.map((n): AssetRecord => ({
    id: `asset-${n.id}`,
    campaignId: n.campaignId,
    assetType: "note",
    name: n.title,
    tags: n.tags,
    source: "upload",
    createdBy: n.createdBy,
    createdAt: n.createdAt,
  })),
  ...AI_PROMPT_EXAMPLES.map((p, i): AssetRecord => ({
    id: `asset-prompt-${i}`,
    campaignId: null,
    assetType: "prompt",
    name: p,
    tags: ["ai", "prompt"],
    source: "ai",
    createdAt: "2026-05-01T00:00:00.000Z",
  })),
];

export const DEMO_PREMIUM_ITEMS: PremiumItemRecord[] = [
  { id: "prem-token-fantasy", itemType: "token_skin", name: "Fantasy Token Pack", description: "40 token illustrati per eroi, mostri e PNG fantasy.", priceEur: 4.99, active: true, comingSoon: true },
  { id: "prem-dice-cyber", itemType: "dice_skin", name: "Cyberpunk Neon Dice", description: "Set di dadi con glow neon e animazioni di lancio.", priceEur: 3.49, active: true, comingSoon: true },
  { id: "prem-map-dungeon", itemType: "map_pack", name: "Dungeon Map Pack", description: "12 mappe generate per dungeon crawl.", priceEur: 6.99, active: true, comingSoon: true },
  { id: "prem-music-horror", itemType: "music_pack", name: "Horror Ambience Pack", description: "10 tracce d'atmosfera per scene horror.", priceEur: 4.99, active: true, comingSoon: true },
  { id: "prem-theme-noir", itemType: "theme", name: "Noir Theme Pack", description: "Temi grafici alternativi per la stanza di gioco.", priceEur: 2.99, active: true, comingSoon: true },
  { id: "prem-ai-credits", itemType: "ai_credits", name: "AI Credits x100", description: "100 generazioni extra per l'AI Master Assistant.", priceEur: 5.99, active: true, comingSoon: true },
  { id: "prem-storage", itemType: "storage", name: "Storage Campagne+", description: "Spazio aggiuntivo per mappe e asset delle tue campagne.", priceEur: 3.99, active: true, comingSoon: true },
  { id: "prem-avatar", itemType: "avatar", name: "Avatar Premium Pack", description: "20 avatar illustrati per i tuoi personaggi.", priceEur: 2.49, active: true, comingSoon: true },
];

export function getDemoCampaign(id: string) {
  return DEMO_CAMPAIGNS.find((c) => c.id === id) ?? null;
}

export function getDemoScenesForCampaign(campaignId: string) {
  return DEMO_SCENES.filter((s) => s.campaignId === campaignId);
}

export function getDemoActiveScene(campaignId: string) {
  return DEMO_SCENES.find((s) => s.campaignId === campaignId && s.isActive) ?? getDemoScenesForCampaign(campaignId)[0] ?? null;
}

export function getDemoMap(mapId?: string | null) {
  return DEMO_MAP_RECORDS.find((m) => m.id === mapId) ?? null;
}

export function getDemoTokensForScene(sceneId: string) {
  return DEMO_TOKENS.filter((t) => t.sceneId === sceneId);
}

export function getDemoCharactersForCampaign(campaignId: string) {
  return DEMO_CHARACTERS.filter((c) => c.campaignId === campaignId);
}

export function getDemoMapsForCampaign(campaignId: string) {
  return DEMO_MAP_RECORDS.filter((m) => m.campaignId === campaignId);
}

export function getDemoMembership(campaignId: string, userId: string) {
  return getDemoCampaign(campaignId)?.members.find((m) => m.userId === userId) ?? null;
}
