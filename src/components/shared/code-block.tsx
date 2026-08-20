"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { renderTokens, tokenizeCpp } from "@/features/lessons/lib/cpp-syntax";
import { cn } from "@/lib/utils";

/**
 * Bloque de código dentro del contenido educativo.
 *
 * Es la única superficie oscura de una lección, y está pensada para
 * leerse: 14px, interlínea 1.7, relleno amplio y resaltado de sintaxis
 * con la misma paleta que el editor. El scroll horizontal se queda
 * dentro del bloque — la página nunca se desplaza de lado.
 */
export function CodeBlock({
  code,
  language,
  className,
  title,
}: {
  code: string;
  language?: string;
  className?: string;
  title?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Sin portapapeles (contexto no seguro): el texto sigue siendo
         seleccionable a mano. */
    }
  }

  const isCpp =
    !language || /^(cpp|c\+\+|c|cc|hpp|h)$/i.test(language.replace(/^language-/, ""));
  const lines = code.replace(/\n$/, "").split("\n");

  return (
    <div
      className={cn(
        "group/code relative my-6 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--terminal-border)] bg-terminal",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--terminal-border)] px-4 py-2">
        <span className="text-[12px] font-semibold text-terminal-muted">
          {title ?? (isCpp ? "C++" : (language ?? "código"))}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] px-2 py-1 text-[12px] font-semibold text-terminal-muted transition-colors hover:bg-terminal-elevated hover:text-terminal-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terminal-muted)]"
          aria-label={copied ? "Código copiado" : "Copiar código"}
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-terminal-success" aria-hidden />
              Copiado
            </>
          ) : (
            <>
              <Copy className="size-3.5" aria-hidden />
              Copiar
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <pre className="min-w-full px-4 py-4 font-mono text-[13.5px] leading-[1.75] text-terminal-fg sm:text-[14px]">
          <code>
            {lines.map((line, i) => (
              <span key={i} className="block whitespace-pre">
                {isCpp
                  ? renderTokens(tokenizeCpp(line), `l${i}`)
                  : (line || " ")}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
