"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/shared/markdown";
import { StepActions } from "@/features/lessons/components/step-shell";
import type { TheoryStepContent } from "@/features/lessons/types";

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
        <div className="overflow-hidden border border-border bg-surface-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.mediaUrl}
            alt="Ilustración de apoyo de la lección"
            className="w-full"
          />
        </div>
      ) : null}

      <StepActions hint="para continuar">
        <Button onClick={onNext} loading={isPending} size="lg">
          Continuar
          <ArrowRight />
        </Button>
      </StepActions>
    </article>
  );
}
