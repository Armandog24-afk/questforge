"use client";

import * as React from "react";
import { Copy, RefreshCw, Save, Sparkles } from "lucide-react";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import type { AIRequestType } from "@/lib/types";

export interface AIField {
  key: string;
  label: string;
  placeholder?: string;
}

export function AIGeneratorForm({
  requestType,
  endpoint,
  fields,
  campaignId,
  onSaveAsNote,
  onUseAsMap,
}: {
  requestType: AIRequestType;
  endpoint: string;
  fields: AIField[];
  campaignId?: string;
  onSaveAsNote?: (text: string) => void;
  onUseAsMap?: (assetUrl: string) => void;
}) {
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ text: string; assetUrl?: string; status: string } | null>(null);
  const { toast } = useToast();

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, fields: values }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Errore generazione");
      setResult(data.result);
    } catch (err) {
      toast({ title: "Generazione fallita", description: err instanceof Error ? err.message : undefined, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key}>
            <Label htmlFor={`ai-${requestType}-${f.key}`}>{f.label}</Label>
            <Input
              id={`ai-${requestType}-${f.key}`}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              maxLength={200}
            />
          </div>
        ))}
      </div>
      <Button onClick={generate} disabled={loading} className="w-full sm:w-auto">
        <Sparkles className="size-4" /> {loading ? "Generazione..." : "Chiedi all'AI Master Assistant"}
      </Button>

      {result && (
        <div className="space-y-2 rounded-xl border border-border bg-surface-2 p-3">
          <div className="flex items-center justify-between">
            <Badge variant={result.status === "mock" ? "warning" : "success"}>
              {result.status === "mock" ? "Mock AI" : "AI"}
            </Badge>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(result.text)} aria-label="Copia">
                <Copy className="size-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={generate} aria-label="Rigenera">
                <RefreshCw className="size-3.5" />
              </Button>
              {onSaveAsNote && (
                <Button variant="ghost" size="sm" onClick={() => onSaveAsNote(result.text)} aria-label="Salva come nota">
                  <Save className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
          {result.assetUrl && (
            <div
              className="qf-map-checker aspect-video w-full rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${result.assetUrl})` }}
            />
          )}
          <p className="whitespace-pre-wrap text-sm">{result.text}</p>
          {onUseAsMap && result.assetUrl && (
            <Button size="sm" variant="secondary" onClick={() => onUseAsMap(result.assetUrl!)}>
              Usa come mappa attiva
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
