"use client";

import * as React from "react";
import { Check, Copy, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { BRAND } from "@/lib/brand";

export function InvitePanel({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = React.useState<"code" | "link" | null>(null);
  const { toast } = useToast();

  async function copy(value: string, kind: "code" | "link") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      toast({ title: "Copiato negli appunti", variant: "success" });
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast({ title: "Impossibile copiare", variant: "error" });
    }
  }

  const link = `${BRAND.url}/campaigns/join?code=${inviteCode}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 font-mono text-sm">{inviteCode}</code>
      <Button variant="secondary" size="sm" onClick={() => copy(inviteCode, "code")}>
        {copied === "code" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} Copia codice
      </Button>
      <Button variant="secondary" size="sm" onClick={() => copy(link, "link")}>
        {copied === "link" ? <Check className="size-3.5" /> : <LinkIcon className="size-3.5" />} Copia link
      </Button>
    </div>
  );
}
