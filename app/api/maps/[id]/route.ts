import { NextResponse } from "next/server";
import { getMap } from "@/lib/data";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const map = await getMap(id);
  if (!map) return NextResponse.json({ error: "Mappa non trovata" }, { status: 404 });
  return NextResponse.json({ map });
}
