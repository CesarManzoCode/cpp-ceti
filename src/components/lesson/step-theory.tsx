"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Markdown } from "@/components/markdown";
import type { TheoryStepContent } from "@/types/lesson";

interface StepTheoryProps {
  content: TheoryStepContent;
  onNext: () => void;
  isPending: boolean;
}

export function StepTheory({ content, onNext, isPending }: StepTheoryProps) {
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
    <article className="space-y-6">
      <Markdown>{content.markdown}</Markdown>

      {content.mediaUrl ? (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.mediaUrl}
            alt="Ilustración de apoyo de la lección"
            className="w-full"
          />
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-6">
        <span className="hidden text-xs text-muted-foreground sm:inline-flex sm:items-center sm:gap-1.5">
          <Kbd>Enter</Kbd>
          para continuar
        </span>
        <Button
          onClick={onNext}
          loading={isPending}
          size="lg"
          className="ml-auto"
        >
          Continuar
          <ArrowRight />
        </Button>
      </div>
    </article>
  );
}
