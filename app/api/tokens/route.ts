import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createToken, getMembership, listTokensForScene } from "@/lib/data";
import { canCreateOrDeleteToken } from "@/lib/permissions";
import { tokenCreateSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sceneId = searchParams.get("sceneId");
  if (!sceneId) return NextResponse.json({ error: "sceneId richiesto" }, { status: 400 });
  const tokens = await listTokensForScene(sceneId);
  return NextResponse.json({ tokens });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json().catch(() => null);
  const parsed = tokenCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const role = await getMembership(parsed.data.campaignId, user.id);
  if (!canCreateOrDeleteToken(role)) {
    return NextResponse.json({ error: "Solo il Master può creare token." }, { status: 403 });
  }

  const token = await createToken(parsed.data);
  return NextResponse.json({ token }, { status: 201 });
}
