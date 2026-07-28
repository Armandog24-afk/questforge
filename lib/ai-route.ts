import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getMembership } from "@/lib/data";
import { canUseAI } from "@/lib/permissions";
import { generateAIContent } from "@/lib/ai";
import { AI_PROMPT_MAX_LENGTH } from "@/lib/ai";
import type { AIRequestType } from "@/lib/types";

export function createAIRoute(type: AIRequestType) {
  return async function POST(request: Request) {
    const user = await getCurrentUser();
    const body = await request.json().catch(() => null);

    const campaignId: string | undefined = body?.campaignId || undefined;
    const fields: Record<string, string> = body?.fields ?? {};

    if (campaignId) {
      const role = await getMembership(campaignId, user.id);
      if (!canUseAI(role)) {
        return NextResponse.json({ error: "Non puoi usare l'AI Master Assistant in questa campagna." }, { status: 403 });
      }
    }

    const totalLength = Object.values(fields).join("").length;
    if (totalLength > AI_PROMPT_MAX_LENGTH) {
      return NextResponse.json({ error: `Il prompt supera i ${AI_PROMPT_MAX_LENGTH} caratteri.` }, { status: 400 });
    }

    const result = await generateAIContent(type, fields);
    return NextResponse.json({ result });
  };
}
