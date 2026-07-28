import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteToken, getMembership, getToken, updateToken } from "@/lib/data";
import { canCreateOrDeleteToken, canMoveToken } from "@/lib/permissions";
import { tokenUpdateSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const existing = await getToken(id);
  if (!existing) return NextResponse.json({ error: "Token non trovato" }, { status: 404 });

  const role = await getMembership(existing.campaignId, user.id);
  const body = await request.json().catch(() => null);
  const parsed = tokenUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const isJustMove =
    Object.keys(parsed.data).every((k) => k === "xPosition" || k === "yPosition") &&
    Object.keys(parsed.data).length > 0;

  const allowed = isJustMove
    ? canMoveToken(role, existing, user.id)
    : canCreateOrDeleteToken(role) || existing.ownerId === user.id;

  if (!allowed) return NextResponse.json({ error: "Non hai i permessi per modificare questo token." }, { status: 403 });

  const token = await updateToken(id, parsed.data);
  return NextResponse.json({ token });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const existing = await getToken(id);
  if (!existing) return NextResponse.json({ error: "Token non trovato" }, { status: 404 });

  const role = await getMembership(existing.campaignId, user.id);
  if (!canCreateOrDeleteToken(role)) {
    return NextResponse.json({ error: "Solo il Master può eliminare token." }, { status: 403 });
  }
  await deleteToken(id);
  return NextResponse.json({ ok: true });
}
