"use client";

import { ArrowRight, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { CodePlayground } from "@/components/editor/code-playground";
import { CppEditor } from "@/components/editor/cpp-editor";
import type { CodeExampleStepContent } from "@/types/lesson";

interface StepCodeExampleProps {
  content: CodeExampleStepContent;
  onNext: () => void;
  isPending: boolean;
}

export function StepCodeExample({
  content,
  onNext,
  isPending,
}: StepCodeExampleProps) {
  return (
    <article className="space-y-7">
      <Markdown>{content.explanation}</Markdown>

      {content.runnable ? (
        <CodePlayground initialCode={content.code} editorHeight={260} />
      ) : (
        <CppEditor value={content.code} readOnly minHeight={220} />
      )}

      {content.expectedOutput && !content.runnable ? (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-[var(--terminal-bg)]">
          <div className="flex items-center gap-2 border-b border-[var(--terminal-border)] px-4 py-2 text-[11px] uppercase tracking-wider text-zinc-400">
            <Terminal className="size-3.5" aria-hidden />
            Salida esperada
          </div>
          <pre className="whitespace-pre-wrap p-4 font-mono text-[13px] text-zinc-100">
            {content.expectedOutput}
          </pre>
        </div>
      ) : null}

      <div className="flex justify-end border-t border-border/70 pt-6">
        <Button onClick={onNext} loading={isPending} size="lg">
          Continuar
          <ArrowRight />
        </Button>
      </div>
    </article>
  );
}
