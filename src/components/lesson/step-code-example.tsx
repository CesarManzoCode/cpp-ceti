"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

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
    <div className="space-y-6">
      <Markdown>{content.explanation}</Markdown>

      {content.runnable ? (
        <CodePlayground initialCode={content.code} editorHeight={260} />
      ) : (
        <CppEditor value={content.code} readOnly minHeight={220} />
      )}

      {content.expectedOutput && !content.runnable ? (
        <div className="rounded-xl border bg-zinc-950 p-4 font-mono text-sm text-zinc-100">
          <p className="mb-2 text-xs uppercase tracking-wider text-zinc-400">
            Salida esperada
          </p>
          <pre className="whitespace-pre-wrap">{content.expectedOutput}</pre>
        </div>
      ) : null}

      <div className="flex justify-end pt-2">
        <Button onClick={onNext} disabled={isPending} size="lg">
          Continuar
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
