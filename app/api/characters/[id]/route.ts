import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listCharactersForCampaign, updateCharacter } from "@/lib/data";
import { characterUpdateSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const body = await request.json().catch(() => null);
  const parsed = characterUpdateSchema.safeParse(body);
  if (!parsed.success || !body?.campaignId) {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }

  const characters = await listCharactersForCampaign(body.campaignId);
  const existing = characters.find((c) => c.id === id);
  if (!existing) return NextResponse.json({ error: "Personaggio non trovato" }, { status: 404 });
  if (existing.userId !== user.id) {
    return NextResponse.json({ error: "Puoi modificare solo il tuo personaggio." }, { status: 403 });
  }

  const character = await updateCharacter(id, parsed.data);
  return NextResponse.json({ character });
}
