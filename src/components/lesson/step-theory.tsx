"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import type { TheoryStepContent } from "@/types/lesson";

interface StepTheoryProps {
  content: TheoryStepContent;
  onNext: () => void;
  isPending: boolean;
}

export function StepTheory({ content, onNext, isPending }: StepTheoryProps) {
  return (
    <article className="space-y-7">
      <Markdown>{content.markdown}</Markdown>

      {content.mediaUrl ? (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={content.mediaUrl} alt="" className="w-full" />
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
