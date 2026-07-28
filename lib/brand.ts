export const BRAND = {
  name: "QuestForge",
  payoff: "Crea la scena. Gioca l'avventura.",
  hero: "Crea mappe, atmosfera e avventure per ogni GDR.",
  description:
    "Una stanza condivisa con IA, token, dadi, musica e strumenti narrativi per giocare senza setup complessi.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

export const MICROCOPY = {
  createCampaign: "Crea una campagna",
  forgeScene: "Forgia una scena",
  generateMap: "Genera una mappa",
  openTable: "Apri il tavolo",
  joinSession: "Unisciti alla sessione",
  rollDice: "Lancia i dadi",
  evokeAtmosphere: "Evoca atmosfera",
  saveToCampaign: "Salva nella campagna",
  askAI: "Chiedi all'AI Master Assistant",
} as const;

export const GENRES = [
  "Fantasy",
  "Horror",
  "Sci-fi",
  "Cyberpunk",
  "Investigativo",
  "Post-apocalittico",
  "Storico",
  "Moderno",
  "Supereroistico",
  "Narrativo",
  "Homebrew",
  "Altro",
] as const;

export const TONES = [
  "Epico",
  "Dark",
  "Comico",
  "Realistico",
  "Pulp",
  "Misterioso",
  "Cinematico",
  "Grottesco",
  "Drammatico",
] as const;

export const GAME_SYSTEM_EXAMPLES = [
  "D&D 5e",
  "Pathfinder",
  "Cyberpunk RED",
  "Vampiri",
  "Call of Cthulhu",
  "Not the End",
  "Homebrew",
] as const;
