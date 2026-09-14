"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CloneCommandProps {
  command: string;
}

export function CloneCommand({ command }: CloneCommandProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard indisponível neste contexto (ex.: navegador sem permissão);
      // sem fallback visual, o comando continua selecionável manualmente.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-2 rounded-xs border border-[#3a3f46] bg-[#14171b] px-3 py-2",
        "font-mono text-xs text-[#c8c5bc] transition-colors hover:border-[#c99a46]/60",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c99a46]",
      )}
    >
      <span className="max-w-[16rem] truncate sm:max-w-none">{command}</span>
      {copied ? (
        <Check aria-hidden className="size-3.5 shrink-0 text-[#c99a46]" />
      ) : (
        <Copy aria-hidden className="size-3.5 shrink-0 text-[#8b9096]" />
      )}
      <span className="sr-only">{copied ? "Comando copiado" : "Copiar comando"}</span>
    </button>
  );
}
