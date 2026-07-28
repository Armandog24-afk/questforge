export const DICE_LIMITS = {
  maxQuantity: 100,
  maxSides: 1000,
  maxFormulaLength: 32,
  maxModifier: 1000,
} as const;

export interface ParsedDiceFormula {
  formula: string;
  quantity: number;
  sides: number;
  keep?: { mode: "kh" | "kl"; count: number };
  modifier: number;
}

export interface DiceRollResult {
  formula: string;
  rolls: number[];
  kept: number[];
  dropped: number[];
  modifier: number;
  total: number;
  isCriticalSuccess: boolean;
  isCriticalFailure: boolean;
}

const FORMULA_RE = /^(\d{1,3})d(\d{1,4})(?:(kh|kl)(\d{1,3}))?([+-]\d{1,4})?$/i;

export class DiceFormulaError extends Error {}

export function parseDiceFormula(input: string): ParsedDiceFormula {
  const formula = input.trim().replace(/\s+/g, "");

  if (!formula) throw new DiceFormulaError("Inserisci una formula, ad esempio 1d20+3.");
  if (formula.length > DICE_LIMITS.maxFormulaLength) {
    throw new DiceFormulaError(`La formula è troppo lunga (max ${DICE_LIMITS.maxFormulaLength} caratteri).`);
  }

  const match = FORMULA_RE.exec(formula);
  if (!match) {
    throw new DiceFormulaError(`Formula non valida: "${input}". Usa un formato come 2d6+1 o 1d20.`);
  }

  const [, qtyStr, sidesStr, keepMode, keepCountStr, modStr] = match;
  const quantity = Number(qtyStr);
  const sides = Number(sidesStr);
  const modifier = modStr ? Number(modStr) : 0;

  if (quantity < 1 || quantity > DICE_LIMITS.maxQuantity) {
    throw new DiceFormulaError(`Quantità di dadi non valida (1-${DICE_LIMITS.maxQuantity}).`);
  }
  if (sides < 2 || sides > DICE_LIMITS.maxSides) {
    throw new DiceFormulaError(`Il dado deve avere tra 2 e d${DICE_LIMITS.maxSides} facce.`);
  }
  if (Math.abs(modifier) > DICE_LIMITS.maxModifier) {
    throw new DiceFormulaError("Il modificatore è troppo alto.");
  }

  const keep = keepMode
    ? { mode: keepMode.toLowerCase() as "kh" | "kl", count: Number(keepCountStr) }
    : undefined;

  if (keep && (keep.count < 1 || keep.count > quantity)) {
    throw new DiceFormulaError("Il numero di dadi da tenere non è valido per questa formula.");
  }

  return { formula, quantity, sides, keep, modifier };
}

export function rollDice(input: string | ParsedDiceFormula): DiceRollResult {
  const parsed = typeof input === "string" ? parseDiceFormula(input) : input;
  const rolls = Array.from({ length: parsed.quantity }, () => 1 + Math.floor(Math.random() * parsed.sides));

  let kept = rolls;
  let dropped: number[] = [];

  if (parsed.keep) {
    const sorted = rolls
      .map((value, index) => ({ value, index }))
      .sort((a, b) => (parsed.keep!.mode === "kh" ? b.value - a.value : a.value - b.value));
    const keptEntries = sorted.slice(0, parsed.keep.count);
    const keptIndices = new Set(keptEntries.map((e) => e.index));
    kept = rolls.filter((_, i) => keptIndices.has(i));
    dropped = rolls.filter((_, i) => !keptIndices.has(i));
  }

  const total = kept.reduce((sum, v) => sum + v, 0) + parsed.modifier;

  const isD20Single = parsed.sides === 20 && parsed.quantity === 1 && !parsed.keep;

  return {
    formula: parsed.formula,
    rolls,
    kept,
    dropped,
    modifier: parsed.modifier,
    total,
    isCriticalSuccess: isD20Single && rolls[0] === 20,
    isCriticalFailure: isD20Single && rolls[0] === 1,
  };
}

export function formatDiceResult(result: DiceRollResult): string {
  const rollsPart =
    result.dropped.length > 0
      ? `[${result.kept.join(", ")}] (scartati: ${result.dropped.join(", ")})`
      : `[${result.rolls.join(", ")}]`;
  const modPart = result.modifier ? (result.modifier > 0 ? ` + ${result.modifier}` : ` - ${Math.abs(result.modifier)}`) : "";
  return `${rollsPart}${modPart} = ${result.total}`;
}
