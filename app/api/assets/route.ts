import { NextResponse } from "next/server";
import { listAssets } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId");
  const assets = await listAssets(campaignId);
  return NextResponse.json({ assets });
}
