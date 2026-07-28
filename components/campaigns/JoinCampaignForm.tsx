"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function JoinCampaignForm() {
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleJoin() {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Errore");
      toast({ title: "Ti sei unito alla campagna!", variant: "success" });
      router.push(`/campaigns/${data.campaign.id}`);
    } catch (err) {
      toast({ title: "Codice non valido", description: err instanceof Error ? err.message : undefined, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2">
          <KeyRound className="size-4 shrink-0 text-muted" />
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Codice invito (es. CRIPTA-7X2K)"
            className="font-mono"
          />
        </div>
        <Button onClick={handleJoin} disabled={loading} variant="secondary">
          Unisciti alla sessione
        </Button>
      </CardContent>
    </Card>
  );
}
