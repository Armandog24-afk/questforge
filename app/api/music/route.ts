import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createMusicTrack, getMembership, listMusicTracks } from "@/lib/data";
import { canManageMusic } from "@/lib/permissions";
import { musicTrackCreateSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId");
  const tracks = await listMusicTracks(campaignId);
  return NextResponse.json({ tracks });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json().catch(() => null);
  const parsed = musicTrackCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  if (parsed.data.campaignId) {
    const role = await getMembership(parsed.data.campaignId, user.id);
    if (!canManageMusic(role)) {
      return NextResponse.json({ error: "Solo il Master può gestire la musica." }, { status: 403 });
    }
  }

  const track = await createMusicTrack({
    ...parsed.data,
    category: parsed.data.category ?? "Generico",
    mood: parsed.data.mood ?? "Neutro",
  });
  return NextResponse.json({ track }, { status: 201 });
}
