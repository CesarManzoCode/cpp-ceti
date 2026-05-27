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
    <div className="space-y-6">
      <Markdown>{content.markdown}</Markdown>

      {content.mediaUrl ? (
        <div className="overflow-hidden rounded-xl border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={content.mediaUrl} alt="" className="w-full" />
        </div>
      ) : null}

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} disabled={isPending} size="lg">
          Continuar
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
