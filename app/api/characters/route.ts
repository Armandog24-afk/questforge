import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createCharacter, getMembership, listCharactersForCampaign } from "@/lib/data";
import { characterCreateSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId");
  if (!campaignId) return NextResponse.json({ error: "campaignId richiesto" }, { status: 400 });
  const characters = await listCharactersForCampaign(campaignId);
  return NextResponse.json({ characters });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json().catch(() => null);
  const parsed = characterCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const role = await getMembership(parsed.data.campaignId, user.id);
  if (!role) return NextResponse.json({ error: "Non fai parte di questa campagna." }, { status: 403 });

  const character = await createCharacter({ ...parsed.data, userId: user.id });
  return NextResponse.json({ character }, { status: 201 });
}
