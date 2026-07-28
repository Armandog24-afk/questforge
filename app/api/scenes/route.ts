import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createScene, getMembership, listScenesForCampaign } from "@/lib/data";
import { canManageScene } from "@/lib/permissions";
import { sceneCreateSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId");
  if (!campaignId) return NextResponse.json({ error: "campaignId richiesto" }, { status: 400 });
  const scenes = await listScenesForCampaign(campaignId);
  return NextResponse.json({ scenes });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json().catch(() => null);
  const parsed = sceneCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const role = await getMembership(parsed.data.campaignId, user.id);
  if (!canManageScene(role)) {
    return NextResponse.json({ error: "Solo il Master può creare scene." }, { status: 403 });
  }

  const scene = await createScene({ ...parsed.data, createdBy: user.id });
  return NextResponse.json({ scene }, { status: 201 });
}
