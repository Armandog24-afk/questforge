import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createChatMessage, createDiceRoll, getMembership } from "@/lib/data";
import { canRollDice } from "@/lib/permissions";
import { DiceFormulaError, formatDiceResult, rollDice } from "@/lib/dice";
import { diceRollSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json().catch(() => null);
  const parsed = diceRollSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const role = await getMembership(parsed.data.campaignId, user.id);
  if (!canRollDice(role)) {
    return NextResponse.json({ error: "Non puoi lanciare dadi in questa campagna." }, { status: 403 });
  }

  let result;
  try {
    result = rollDice(parsed.data.formula);
  } catch (err) {
    if (err instanceof DiceFormulaError) return NextResponse.json({ error: err.message }, { status: 400 });
    throw err;
  }

  const displayName = user.nickname ?? user.name;
  const roll = await createDiceRoll({
    campaignId: parsed.data.campaignId,
    sceneId: parsed.data.sceneId ?? undefined,
    userId: user.id,
    userName: displayName,
    formula: result.formula,
    results: result.rolls,
    total: result.total,
    visibility: parsed.data.visibility,
  });

  const critSuffix = result.isCriticalSuccess ? " 🎯 Critico!" : result.isCriticalFailure ? " 💀 Fallimento critico!" : "";
  await createChatMessage({
    campaignId: parsed.data.campaignId,
    sceneId: parsed.data.sceneId ?? undefined,
    userId: user.id,
    userName: displayName,
    type: "dice",
    message: `${displayName} tira ${result.formula} → ${formatDiceResult(result)}${critSuffix}`,
  });

  return NextResponse.json({ roll, result });
}
