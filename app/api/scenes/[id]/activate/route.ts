import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { activateScene, createChatMessage, getMembership, getScene } from "@/lib/data";
import { canManageScene } from "@/lib/permissions";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const scene = await getScene(id);
  if (!scene) return NextResponse.json({ error: "Scena non trovata" }, { status: 404 });

  const role = await getMembership(scene.campaignId, user.id);
  if (!canManageScene(role)) {
    return NextResponse.json({ error: "Solo il Master può cambiare scena." }, { status: 403 });
  }

  await activateScene(scene.campaignId, id);
  await createChatMessage({
    campaignId: scene.campaignId,
    sceneId: id,
    userId: user.id,
    userName: user.nickname ?? user.name,
    type: "scene_change",
    message: `Scena cambiata: ${scene.name}.`,
  });
  return NextResponse.json({ ok: true });
}
