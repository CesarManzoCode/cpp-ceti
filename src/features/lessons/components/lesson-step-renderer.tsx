"use client";

import type { LanguageId } from "@/lib/code-languages";
import type { StepContent, ViewerStep } from "@/features/lessons/types";

import { StepTheory } from "./step-theory";
import { StepCodeExample } from "./step-code-example";
import { StepQuiz } from "./step-quiz";
import { StepFillBlank } from "./step-fill-blank";
import { StepCodeChallenge } from "./step-code-challenge";
import { StepMatching } from "./step-matching";
import { StepCodeCompletion } from "./step-code-completion";
import type { StepSignalHandler } from "./step-signal";

interface LessonStepRendererProps {
  step: ViewerStep;
  /** Lenguaje del curso. Llega desde el servidor, nunca se infiere aquí. */
  language: LanguageId;
  lessonId: string;
  onNext: () => void;
  isPending: boolean;
  /** Señales pedagógicas del paso (intento / respuesta revelada). */
  onSignal?: StepSignalHandler;
}

/**
 * Despachador: elige el componente concreto según `step.type`.
 * Cada step component es responsable de su propia UI/validación;
 * el viewer maneja la navegación y el progreso.
 */
export function LessonStepRenderer({
  step,
  language,
  lessonId,
  onNext,
  isPending,
  onSignal,
}: LessonStepRendererProps) {
  switch (step.type) {
    case "theory":
      return (
        <StepTheory
          language={language}
          content={step.content as Extract<StepContent, { type: "theory" }>}
          onNext={onNext}
          isPending={isPending}
        />
      );
    case "code_example":
      return (
        <StepCodeExample
          language={language}
          stepId={step.id}
          lessonId={lessonId}
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
          language={language}
          content={step.content as Extract<StepContent, { type: "quiz" }>}
          onNext={onNext}
          isPending={isPending}
          onSignal={onSignal}
        />
      );
    case "fill_blank":
      return (
        <StepFillBlank
          language={language}
          content={
            step.content as Extract<StepContent, { type: "fill_blank" }>
          }
          onNext={onNext}
          isPending={isPending}
          onSignal={onSignal}
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
          language={language}
          lessonId={lessonId}
          exercise={step.exercise}
          onNext={onNext}
          isPending={isPending}
          onSignal={onSignal}
        />
      );
    }
    case "matching":
      return (
        <StepMatching
          language={language}
          content={step.content as Extract<StepContent, { type: "matching" }>}
          onNext={onNext}
          isPending={isPending}
          onSignal={onSignal}
        />
      );
    case "code_completion":
      return (
        <StepCodeCompletion
          language={language}
          content={
            step.content as Extract<StepContent, { type: "code_completion" }>
          }
          onNext={onNext}
          isPending={isPending}
          onSignal={onSignal}
        />
      );
    default:
      return (
        <p className="text-sm text-muted-foreground">
          Tipo de paso desconocido.
        </p>
      );
  }
}
