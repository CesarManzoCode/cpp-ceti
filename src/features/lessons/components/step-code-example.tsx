"use client";

import * as React from "react";
import { ArrowRight, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { TerminalSurface } from "@/components/ui/terminal-surface";
import { Markdown } from "@/components/shared/markdown";
import { CodePlayground } from "@/components/editor/code-playground";
import { CppEditor } from "@/components/editor/cpp-editor";
import type { CodeExampleStepContent } from "@/features/lessons/types";

interface StepCodeExampleProps {
  content: CodeExampleStepContent;
  onNext: () => void;
  isPending: boolean;
}

const NEEDS_STDIN_RE = /\b(cin\s*>>|scanf\s*\(|getline\s*\()/;

export function StepCodeExample({
  content,
  onNext,
  isPending,
}: StepCodeExampleProps) {
  React.useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Enter" && !isPending) onNext();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNext, isPending]);

  return (
    <article className="space-y-7">
      <Markdown>{content.explanation}</Markdown>

      {content.runnable ? (
        <CodePlayground
          initialCode={content.code}
          editorHeight={260}
          showStdin={NEEDS_STDIN_RE.test(content.code)}
        />
      ) : (
        <CppEditor value={content.code} readOnly minHeight={220} />
      )}

      {content.expectedOutput && !content.runnable ? (
        <TerminalSurface title="Salida esperada" icon={Terminal}>
          <pre className="whitespace-pre-wrap p-4 text-[13px] text-terminal-fg">
            {content.expectedOutput}
          </pre>
        </TerminalSurface>
      ) : null}

      <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-6">
        <span className="hidden text-xs text-muted-foreground sm:inline-flex sm:items-center sm:gap-1.5">
          <Kbd>Enter</Kbd>
          para continuar
        </span>
        <Button onClick={onNext} loading={isPending} size="lg" className="ml-auto">
          Continuar
          <ArrowRight />
        </Button>
      </div>
    </article>
  );
}
