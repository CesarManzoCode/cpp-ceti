"use client";

import * as React from "react";
import { ArrowRight, Code2, MonitorCog, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TerminalSurface } from "@/components/ui/terminal-surface";
import { Markdown } from "@/components/shared/markdown";
import { CodePlayground } from "@/components/editor/code-playground";
import { CodeEditor } from "@/components/editor/code-editor";
import { StepActions, StepKind } from "@/features/lessons/components/step-shell";
import type { LanguageId } from "@/lib/code-languages";
import type { CodeExampleStepContent } from "@/features/lessons/types";

interface StepCodeExampleProps {
  language: LanguageId;
  /** Id del paso: es el recurso que el servidor resuelve para ejecutarlo. */
  stepId: string;
  lessonId: string;
  content: CodeExampleStepContent;
  onNext: () => void;
  isPending: boolean;
}

/**
 * ¿El ejemplo lee de la entrada estándar? Sólo entonces se muestra el campo
 * de stdin. Cada lenguaje tiene su forma de leer.
 *
 * SQL no tiene un equivalente de `cin`/`Console.ReadLine`: un script SQL no
 * lee entrada interactiva mientras corre. Ningún ejemplo `code_example` de
 * SQL necesita este campo — de ahí el regex que nunca matchea.
 */
const NEEDS_STDIN_RE: Record<LanguageId, RegExp> = {
  cpp: /\b(cin\s*>>|scanf\s*\(|getline\s*\()/,
  csharp: /\bConsole\s*\.\s*Read(Line|Key)?\s*\(/,
  sql: /[^\s\S]/,
};

export function StepCodeExample({
  language,
  stepId,
  lessonId,
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
      <StepKind label="Ejemplo" icon={<Code2 aria-hidden />} tone="info" />

      <Markdown language={language}>{content.explanation}</Markdown>

      {content.runnable ? (
        <CodePlayground
          language={language}
          target={{ stepId, lessonId }}
          initialCode={content.code}
          editorHeight={260}
          showStdin={NEEDS_STDIN_RE[language].test(content.code)}
        />
      ) : (
        <>
          <CodeEditor
            language={language}
            value={content.code}
            readOnly
            minHeight={220}
          />
          {/* Sin botón de ejecutar, y con la razón a la vista: este código
              no corre en el navegador. Fingir lo contrario sería mentir
              sobre lo que el alumno acaba de ver. */}
          {content.localOnlyNote ? (
            <p className="flex items-start gap-2.5 rounded-[var(--radius-md)] border border-warning/25 bg-warning-soft px-4 py-3 text-[14px] leading-relaxed text-foreground">
              <MonitorCog
                className="mt-0.5 size-[18px] shrink-0 text-warning"
                aria-hidden
              />
              <span>{content.localOnlyNote}</span>
            </p>
          ) : null}
        </>
      )}

      {content.expectedOutput && !content.runnable ? (
        <TerminalSurface title="Salida esperada" icon={Terminal}>
          <pre className="whitespace-pre-wrap p-4 text-[14px] leading-relaxed text-terminal-fg">
            {content.expectedOutput}
          </pre>
        </TerminalSurface>
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
