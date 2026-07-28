import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createChatMessage, getMembership, listChat } from "@/lib/data";
import { canWriteChat } from "@/lib/permissions";
import { chatMessageSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId");
  const sceneId = searchParams.get("sceneId");
  if (!campaignId) return NextResponse.json({ error: "campaignId richiesto" }, { status: 400 });
  const messages = await listChat(campaignId, sceneId);
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json().catch(() => null);
  const parsed = chatMessageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const role = await getMembership(parsed.data.campaignId, user.id);
  if (!canWriteChat(role)) {
    return NextResponse.json({ error: "Non puoi scrivere in questa chat." }, { status: 403 });
  }

  const message = await createChatMessage({
    ...parsed.data,
    userId: user.id,
    userName: user.nickname ?? user.name,
  });
  return NextResponse.json({ message }, { status: 201 });
}
