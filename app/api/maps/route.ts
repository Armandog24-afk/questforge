import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createMap, getMembership, listMapsForCampaign } from "@/lib/data";
import { canManageMap } from "@/lib/permissions";
import { mapCreateSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId");
  if (!campaignId) return NextResponse.json({ error: "campaignId richiesto" }, { status: 400 });
  const maps = await listMapsForCampaign(campaignId);
  return NextResponse.json({ maps });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json().catch(() => null);
  const parsed = mapCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const role = await getMembership(parsed.data.campaignId, user.id);
  if (!canManageMap(role)) return NextResponse.json({ error: "Solo il Master può caricare mappe." }, { status: 403 });

  const map = await createMap({ ...parsed.data, createdBy: user.id });
  return NextResponse.json({ map }, { status: 201 });
}
