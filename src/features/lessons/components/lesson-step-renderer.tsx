"use client";

import type { StepContent, ViewerStep } from "@/features/lessons/types";

import { StepTheory } from "./step-theory";
import { StepCodeExample } from "./step-code-example";
import { StepQuiz } from "./step-quiz";
import { StepFillBlank } from "./step-fill-blank";
import { StepCodeChallenge } from "./step-code-challenge";

interface LessonStepRendererProps {
  step: ViewerStep;
  onNext: () => void;
  isPending: boolean;
}

/**
 * Despachador: elige el componente concreto según `step.type`.
 * Cada step component es responsable de su propia UI/validación;
 * el viewer maneja la navegación y el progreso.
 */
export function LessonStepRenderer({
  step,
  onNext,
  isPending,
}: LessonStepRendererProps) {
  switch (step.type) {
    case "theory":
      return (
        <StepTheory
          content={step.content as Extract<StepContent, { type: "theory" }>}
          onNext={onNext}
          isPending={isPending}
        />
      );
    case "code_example":
      return (
        <StepCodeExample
          content={
            step.content as Extract<StepContent, { type: "code_example" }>
          }
          onNext={onNext}
          isPending={isPending}
        />
      );
    case "quiz":
      return (
        <StepQuiz
          content={step.content as Extract<StepContent, { type: "quiz" }>}
          onNext={onNext}
          isPending={isPending}
        />
      );
    case "fill_blank":
      return (
        <StepFillBlank
          content={
            step.content as Extract<StepContent, { type: "fill_blank" }>
          }
          onNext={onNext}
          isPending={isPending}
        />
      );
    case "code_challenge": {
      if (!step.exercise) {
        return (
          <p className="text-sm text-destructive">
            Este reto está mal configurado (falta el ejercicio).
          </p>
        );
      }
      return (
        <StepCodeChallenge
          exercise={step.exercise}
          onNext={onNext}
          isPending={isPending}
        />
      );
    }
    default:
      return (
        <p className="text-sm text-muted-foreground">
          Tipo de paso desconocido.
        </p>
      );
  }
}
