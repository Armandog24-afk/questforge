"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ChatInput({ onSend, disabled }: { onSend: (message: string) => void; disabled?: boolean }) {
  const [value, setValue] = React.useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={disabled ? "Solo lettura" : "Scrivi un messaggio..."}
        disabled={disabled}
        maxLength={1000}
        aria-label="Messaggio chat"
      />
      <Button onClick={submit} disabled={disabled} size="icon" aria-label="Invia">
        <Send className="size-4" />
      </Button>
    </div>
  );
}
