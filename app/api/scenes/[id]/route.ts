import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteScene, getMembership, getScene, updateScene } from "@/lib/data";
import { canManageScene } from "@/lib/permissions";
import { sceneUpdateSchema } from "@/lib/validation";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scene = await getScene(id);
  if (!scene) return NextResponse.json({ error: "Scena non trovata" }, { status: 404 });
  return NextResponse.json({ scene });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const scene = await getScene(id);
  if (!scene) return NextResponse.json({ error: "Scena non trovata" }, { status: 404 });

  const role = await getMembership(scene.campaignId, user.id);
  if (!canManageScene(role)) return NextResponse.json({ error: "Solo il Master può modificare la scena." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = sceneUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updated = await updateScene(id, parsed.data);
  return NextResponse.json({ scene: updated });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const scene = await getScene(id);
  if (!scene) return NextResponse.json({ error: "Scena non trovata" }, { status: 404 });

  const role = await getMembership(scene.campaignId, user.id);
  if (!canManageScene(role)) return NextResponse.json({ error: "Solo il Master può eliminare la scena." }, { status: 403 });

  await deleteScene(id);
  return NextResponse.json({ ok: true });
}
