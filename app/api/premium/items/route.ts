import { NextResponse } from "next/server";
import { listPremiumItems } from "@/lib/data";

export async function GET() {
  const items = await listPremiumItems();
  return NextResponse.json({ items });
}
