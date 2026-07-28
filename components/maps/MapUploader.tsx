"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { uploadImageClient, UploadValidationError } from "@/lib/storage";

export function MapUploader({ onUploaded }: { onUploaded: (input: { name: string; imageUrl: string }) => void }) {
  const [name, setName] = React.useState("");
  const [preview, setPreview] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const { toast } = useToast();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageClient(file, "maps");
      setPreview(url);
      if (!name) setName(file.name.replace(/\.[^.]+$/, ""));
    } catch (err) {
      toast({
        title: "Upload non riuscito",
        description: err instanceof UploadValidationError ? err.message : "Riprova con un altro file.",
        variant: "error",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2 rounded-xl border border-dashed border-border p-3">
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-border bg-surface-2 p-4 text-center text-sm text-muted hover:border-accent-purple/50">
        <Upload className="size-5" />
        {uploading ? "Caricamento..." : "PNG, JPG o WebP (max 8MB)"}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>
      {preview && (
        <div className="space-y-2">
          <div className="aspect-video overflow-hidden rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${preview})` }} />
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome mappa" />
          <Button size="sm" onClick={() => preview && onUploaded({ name: name || "Mappa caricata", imageUrl: preview })}>
            Usa come mappa attiva
          </Button>
        </div>
      )}
    </div>
  );
}
