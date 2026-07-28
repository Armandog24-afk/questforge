import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteCampaign, getCampaign, getMembership, updateCampaign } from "@/lib/data";
import { canEditCampaign } from "@/lib/permissions";
import { campaignUpdateSchema } from "@/lib/validation";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  if (!campaign) return NextResponse.json({ error: "Campagna non trovata" }, { status: 404 });
  return NextResponse.json({ campaign });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const role = await getMembership(id, user.id);
  if (!canEditCampaign(role)) {
    return NextResponse.json({ error: "Solo il Master può modificare la campagna." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = campaignUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const campaign = await updateCampaign(id, parsed.data);
  return NextResponse.json({ campaign });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const role = await getMembership(id, user.id);
  if (!canEditCampaign(role)) {
    return NextResponse.json({ error: "Solo il Master può eliminare la campagna." }, { status: 403 });
  }
  await deleteCampaign(id);
  return NextResponse.json({ ok: true });
}
