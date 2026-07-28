import { DEMO_MAPS } from "@/lib/demo-maps";
import type { AIRequestType } from "@/lib/types";

/**
 * Central AI abstraction. Every AI-powered feature in QuestForge goes
 * through `generateAIContent`. If OPENAI_API_KEY is missing (the default for
 * a fresh clone), it falls back to deterministic, still-useful Italian mock
 * content — the app must never break because a provider isn't configured.
 */

export const AI_PROMPT_MAX_LENGTH = 2000;

export interface AIGenerationResult {
  text: string;
  assetUrl?: string;
  provider: string;
  status: "completed" | "mock" | "failed";
}

type Fields = Record<string, string | undefined>;

function line(label: string, value?: string) {
  return value ? `- ${label}: ${value}\n` : "";
}

function buildSystemPrompt() {
  return (
    "Sei l'AI Master Assistant di QuestForge, un tool per Game Master di GDR da tavolo di qualsiasi sistema. " +
    "Rispondi sempre in italiano, con testo pronto da leggere al tavolo: concreto, evocativo ma breve, mai un saggio. " +
    "Non fare riferimento a opere protette da copyright salvo quelle esplicitamente citate dall'utente. " +
    "Non generare mai contenuti che blocchino la sessione: se mancano dettagli, inventali in modo coerente."
  );
}

function buildUserPrompt(type: AIRequestType, fields: Fields) {
  const details = Object.entries(fields)
    .filter(([, v]) => Boolean(v))
    .map(([k, v]) => line(k, v))
    .join("");

  const instructions: Record<AIRequestType, string> = {
    scene: "Genera una scena giocabile: descrizione pronta da leggere, elementi visivi, eventi possibili, agganci narrativi, complicazioni.",
    npc: "Genera un PNG: nome, descrizione, modo di parlare, obiettivo, segreto, utilità in scena.",
    item: "Genera un oggetto narrativo: nome, descrizione, effetto narrativo, costo o conseguenza, aggancio di storia.",
    place: "Genera un luogo: descrizione, punti di interesse, segreti, PNG presenti, scene possibili.",
    encounter: "Genera un incontro: situazione iniziale, ostacolo, nemici o complicazioni, esiti possibili, twist.",
    atmosphere: "Genera atmosfera sensoriale: descrizione sensoriale, suoni suggeriti, musica suggerita, luci/colori, testo da leggere ai giocatori.",
    map: "Descrivi una mappa coerente con questi dettagli, pensata per essere disegnata dall'alto per una sessione di GDR.",
    music: "Descrivi un brano d'atmosfera coerente con questi dettagli (mood, strumenti, intensità, durata).",
  };

  return `${instructions[type]}\n\nDettagli forniti dal Master:\n${details || "(nessun dettaglio aggiuntivo, inventa qualcosa di coerente)"}`;
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY non configurata");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9,
      max_tokens: 500,
    }),
  });

  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Risposta OpenAI vuota");
  return text as string;
}

const MOCK_NAMES = ["Sorren", "Kael", "Mirya", "Thessa", "Voss", "Ilyra", "Draven", "Nessa"];
function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}
function seedFrom(fields: Fields) {
  const s = Object.values(fields).filter(Boolean).join("|");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h || 1;
}

function mockScene(fields: Fields, seed: number) {
  const luogo = fields.luogo || "un luogo dimenticato";
  const tono = fields.tono || fields.genere || "misterioso";
  return (
    `**Descrizione:** ${luogo} si apre davanti al gruppo con un'atmosfera ${tono.toLowerCase()}. ` +
    `L'aria è densa, e ogni suono sembra fuori posto.\n\n` +
    `**Elementi visivi:** luci fioche, superfici consumate dal tempo, un dettaglio fuori posto che cattura l'attenzione.\n\n` +
    `**Eventi possibili:** un rumore improvviso, la scoperta di un indizio, l'arrivo di un PNG inatteso.\n\n` +
    `**Agganci narrativi:** ${fields.obiettivo || "qualcosa di importante"} sembra collegato a questo posto.\n\n` +
    `**Complicazioni:** ${pick(["il tempo stringe", "qualcuno li sta osservando", "una trappola dimenticata", "un alleato inaspettato interviene"], seed)}.`
  );
}

function mockNPC(fields: Fields, seed: number) {
  const nome = pick(MOCK_NAMES, seed);
  const ruolo = fields.ruolo || "figura misteriosa";
  return (
    `**Nome:** ${nome}\n\n` +
    `**Descrizione:** ${ruolo}, con uno sguardo che pesa più delle parole che dice.\n\n` +
    `**Modo di parlare:** ${pick(["frasi brevi e taglienti", "un tono formale che nasconde nervosismo", "domande più che risposte", "un accento che tradisce origini lontane"], seed)}.\n\n` +
    `**Obiettivo:** ${fields.obiettivo || "proteggere un segreto che non gli appartiene del tutto"}.\n\n` +
    `**Segreto:** ${fields.segreto || "sa più di quanto ammetta, e teme le conseguenze di parlare"}.\n\n` +
    `**Utilità in scena:** può fornire un indizio decisivo, ma solo se guadagnato con qualcosa in cambio.`
  );
}

function mockItem(fields: Fields, seed: number) {
  return (
    `**Nome oggetto:** ${pick(["Lanterna dei Sussurri", "Chiave Senza Serratura", "Moneta Corrosa", "Frammento di Vetro Nero"], seed)}\n\n` +
    `**Descrizione:** un oggetto ${fields.rarita || "raro"} che sembra reagire alla presenza di ${fields.funzione || "chi lo osserva troppo a lungo"}.\n\n` +
    `**Effetto narrativo:** ${fields.effetto || "rivela qualcosa di nascosto, ma a un prezzo non ancora chiaro"}.\n\n` +
    `**Costo/conseguenza:** ogni uso lascia un segno, fisico o mentale, su chi lo porta.\n\n` +
    `**Aggancio di storia:** qualcuno lo cerca da molto tempo, e non è detto che sia un alleato.`
  );
}

function mockPlace(fields: Fields, seed: number) {
  const tipo = fields.tipo || "un luogo isolato";
  return (
    `**Descrizione:** ${tipo}, ${fields.atmosfera || "avvolto in un silenzio innaturale"}.\n\n` +
    `**Punti di interesse:** un ingresso nascosto, un simbolo inciso nella pietra, una stanza sigillata.\n\n` +
    `**Segreti:** ${pick(["un passaggio segreto porta altrove", "qualcuno vive qui in segreto", "il luogo non è quello che sembra"], seed)}.\n\n` +
    `**PNG presenti:** un guardiano riluttante, un viandante che sa più di quanto dice.\n\n` +
    `**Scene possibili:** un'indagine, un confronto, una fuga.`
  );
}

function mockEncounter(fields: Fields, seed: number) {
  return (
    `**Situazione iniziale:** ${fields.ambiente || "il gruppo si trova in una posizione scomoda"}.\n\n` +
    `**Ostacolo:** ${pick(["un nemico più forte del previsto", "un dilemma morale", "una trappola ambientale", "il tempo che scorre contro di loro"], seed)}.\n\n` +
    `**Nemici/complicazioni:** ${fields.tipoConflitto || "una minaccia diretta accompagnata da un fattore ambientale avverso"}.\n\n` +
    `**Esiti possibili:** vittoria netta, vittoria con un costo, ritirata, patto inaspettato.\n\n` +
    `**Twist:** ${pick(["l'apparente nemico ha un obiettivo comune", "l'incontro era una trappola per qualcun altro", "qualcuno del gruppo viene riconosciuto"], seed)}.`
  );
}

function mockAtmosphere(fields: Fields, seed: number) {
  return (
    `**Descrizione sensoriale:** ${fields.emozione || "tensione"} nell'aria, ${pick(["un odore di muffa e cera", "un freddo innaturale", "un ronzio elettrico costante", "un silenzio che pesa"], seed)}.\n\n` +
    `**Suoni suggeriti:** passi lontani, un respiro trattenuto, un rumore che non si ripete.\n\n` +
    `**Musica suggerita:** un tappeto ambientale a bassa intensità, con picchi improvvisi.\n\n` +
    `**Luci/colori:** toni ${pick(["viola e blu scuro", "ambra e ombra", "verde malato", "grigio acciaio"], seed)}.\n\n` +
    `**Testo da leggere:** "${pick(["Il silenzio qui non è vuoto: è in attesa.", "Ogni passo sembra svegliare qualcosa.", "L'aria è ferma, come se anche il tempo esitasse."], seed)}"`
  );
}

function mockMapDescription(fields: Fields) {
  return `Mappa generata (mock) per: ${fields.tipoLuogo || "un luogo"} in stile ${fields.stile || "coerente col genere"}, atmosfera ${fields.atmosfera || "adatta alla scena"}.`;
}

function mockMusicDescription(fields: Fields) {
  return `Traccia generata (mock): mood ${fields.mood || "neutro"}, intensità ${fields.intensita || "media"}, durata ${fields.durata || "loop breve"}.`;
}

function pickDemoMapKey(fields: Fields, seed: number): keyof typeof DEMO_MAPS {
  const text = `${fields.tipoLuogo ?? ""} ${fields.genere ?? ""} ${fields.stile ?? ""}`.toLowerCase();
  if (/cyber|neon|città|urban/.test(text)) return "cyberAlley";
  if (/laborator|scienz|tech/.test(text)) return "lab";
  if (/nave|spazio|astro/.test(text)) return "spaceship";
  if (/bosco|foresta|natura/.test(text)) return "forest";
  if (/cripta|tomba|dungeon|gotic/.test(text)) return "crypt";
  if (/villa|manor|magion/.test(text)) return "villa";
  if (/taverna|locanda/.test(text)) return "tavern";
  const keys = Object.keys(DEMO_MAPS) as (keyof typeof DEMO_MAPS)[];
  return pick(keys, seed);
}

export async function generateAIContent(type: AIRequestType, fields: Fields): Promise<AIGenerationResult> {
  const seed = seedFrom(fields);

  if (process.env.OPENAI_API_KEY && type !== "map" && type !== "music") {
    try {
      const text = await callOpenAI(buildSystemPrompt(), buildUserPrompt(type, fields));
      return { text, provider: "openai", status: "completed" };
    } catch {
      // fall through to mock — the app must never hard-fail on AI errors
    }
  }

  switch (type) {
    case "scene":
      return { text: mockScene(fields, seed), provider: "mock", status: "mock" };
    case "npc":
      return { text: mockNPC(fields, seed), provider: "mock", status: "mock" };
    case "item":
      return { text: mockItem(fields, seed), provider: "mock", status: "mock" };
    case "place":
      return { text: mockPlace(fields, seed), provider: "mock", status: "mock" };
    case "encounter":
      return { text: mockEncounter(fields, seed), provider: "mock", status: "mock" };
    case "atmosphere":
      return { text: mockAtmosphere(fields, seed), provider: "mock", status: "mock" };
    case "map":
      return {
        text: mockMapDescription(fields),
        assetUrl: DEMO_MAPS[pickDemoMapKey(fields, seed)],
        provider: "mock",
        status: "mock",
      };
    case "music":
      return { text: mockMusicDescription(fields), provider: "mock", status: "mock" };
    default:
      return { text: "Contenuto non disponibile.", provider: "mock", status: "mock" };
  }
}
