import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createCampaign, listCampaignsForUser } from "@/lib/data";
import { campaignCreateSchema } from "@/lib/validation";

export async function GET() {
  const user = await getCurrentUser();
  const campaigns = await listCampaignsForUser(user.id);
  return NextResponse.json({ campaigns });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json().catch(() => null);
  const parsed = campaignCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const campaign = await createCampaign({ ...parsed.data, ownerId: user.id });
  return NextResponse.json({ campaign }, { status: 201 });
}
