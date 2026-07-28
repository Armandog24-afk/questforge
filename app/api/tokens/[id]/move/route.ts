import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createChatMessage, getMembership, getToken, updateToken } from "@/lib/data";
import { canMoveToken } from "@/lib/permissions";
import { tokenMoveSchema } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const existing = await getToken(id);
  if (!existing) return NextResponse.json({ error: "Token non trovato" }, { status: 404 });

  const role = await getMembership(existing.campaignId, user.id);
  if (!canMoveToken(role, existing, user.id)) {
    return NextResponse.json({ error: "Non puoi muovere questo token." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = tokenMoveSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const token = await updateToken(id, parsed.data);
  let message = null;
  if (token) {
    message = await createChatMessage({
      campaignId: token.campaignId,
      sceneId: token.sceneId,
      userId: user.id,
      userName: user.nickname ?? user.name,
      type: "token_move",
      message: `${user.nickname ?? user.name} ha spostato ${token.name}.`,
    });
  }
  return NextResponse.json({ token, message });
}
