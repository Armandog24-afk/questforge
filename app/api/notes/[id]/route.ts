import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteNote, getMembership, listNotes, updateNote } from "@/lib/data";
import { canManageNote } from "@/lib/permissions";
import { noteUpdateSchema } from "@/lib/validation";

async function findNote(id: string, campaignId: string) {
  const notes = await listNotes(campaignId);
  return notes.find((n) => n.id === id) ?? null;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const body = await request.json().catch(() => null);
  const parsed = noteUpdateSchema.safeParse(body);
  if (!parsed.success || !body?.campaignId) {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }

  const existing = await findNote(id, body.campaignId);
  if (!existing) return NextResponse.json({ error: "Nota non trovata" }, { status: 404 });

  const role = await getMembership(existing.campaignId, user.id);
  if (!canManageNote(role, existing.createdBy, user.id)) {
    return NextResponse.json({ error: "Non puoi modificare questa nota." }, { status: 403 });
  }

  const note = await updateNote(id, parsed.data);
  return NextResponse.json({ note });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId");
  if (!campaignId) return NextResponse.json({ error: "campaignId richiesto" }, { status: 400 });

  const existing = await findNote(id, campaignId);
  if (!existing) return NextResponse.json({ error: "Nota non trovata" }, { status: 404 });

  const role = await getMembership(existing.campaignId, user.id);
  if (!canManageNote(role, existing.createdBy, user.id)) {
    return NextResponse.json({ error: "Non puoi eliminare questa nota." }, { status: 403 });
  }

  await deleteNote(id);
  return NextResponse.json({ ok: true });
}
