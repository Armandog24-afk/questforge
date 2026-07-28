import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { joinCampaign } from "@/lib/data";

const schema = z.object({ inviteCode: z.string().trim().min(3).max(30) });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Codice invito non valido." }, { status: 400 });
  }

  const campaign = await joinCampaign(parsed.data.inviteCode, user.id);
  if (!campaign) {
    return NextResponse.json({ error: "Nessuna campagna trovata con questo codice." }, { status: 404 });
  }
  return NextResponse.json({ campaign });
}
