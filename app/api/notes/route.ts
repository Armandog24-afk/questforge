import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createNote, getMembership, listNotes } from "@/lib/data";
import { canViewNote } from "@/lib/permissions";
import { noteCreateSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId");
  if (!campaignId) return NextResponse.json({ error: "campaignId richiesto" }, { status: 400 });

  const role = await getMembership(campaignId, user.id);
  const notes = await listNotes(campaignId);
  const visible = notes.filter((n) => canViewNote(role, n.visibility));
  return NextResponse.json({ notes: visible });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json().catch(() => null);
  const parsed = noteCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const role = await getMembership(parsed.data.campaignId, user.id);
  if (!role) return NextResponse.json({ error: "Non fai parte di questa campagna." }, { status: 403 });
  if (parsed.data.visibility === "master" && role !== "master") {
    return NextResponse.json({ error: "Solo il Master può creare note private." }, { status: 403 });
  }

  const note = await createNote({ ...parsed.data, createdBy: user.id });
  return NextResponse.json({ note }, { status: 201 });
}
