"use client";

import * as React from "react";
import { Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { CodeEditor } from "@/components/editor/code-editor";
import { diagnosticsFromExecution } from "@/components/editor/diagnostics";
import { OutputPanel } from "@/components/editor/output-panel";
import { useStudySession } from "@/features/analytics/telemetry";
import { useRunCode, type RunTarget } from "@/hooks/use-run-code";
import type { LanguageId } from "@/lib/code-languages";
import { cn } from "@/lib/utils";

interface CodePlaygroundProps {
  /** Lenguaje del curso. Decide editor, resaltado y diagnósticos. */
  language: LanguageId;
  /** Recurso al que pertenece esta ejecución (lo exige el servidor). */
  target: RunTarget;
  initialCode: string;
  /** Si true, muestra un campo opcional para stdin */
  showStdin?: boolean;
  className?: string;
  editorHeight?: number;
}

export function CodePlayground({
  language,
  target,
  initialCode,
  showStdin = false,
  className,
  editorHeight = 320,
}: CodePlaygroundProps) {
  const [code, setCode] = React.useState(initialCode);
  const [stdin, setStdin] = React.useState("");
  const { studySessionId, markEngaged } = useStudySession();

  // Playground libre (dentro de un ejemplo de código): la ejecución se
  // atribuye al PASO, no a un ejercicio — así no contamina el denominador
  // de "run → submit" de los retos.
  const { state, result, error, run, reset } = useRunCode({
    target,
    studySessionId,
  });

  function handleRun() {
    markEngaged("code_run");
    void run(code, stdin);
  }

  function handleReset() {
    setCode(initialCode);
    reset();
  }

  return (
    <div className={cn("space-y-3", className)}>
      <CodeEditor
        language={language}
        value={code}
        onChange={setCode}
        onRun={handleRun}
        minHeight={editorHeight}
        diagnostics={diagnosticsFromExecution(result, language)}
      />

      {showStdin ? (
        <div className="space-y-1.5">
          <Label className="text-[14px] font-bold text-muted-foreground">
            {language === "sql" ? "Preparación SQL" : "Entrada del programa"}
          </Label>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder={
              language === "csharp"
                ? "Valores que tu programa leerá con Console.ReadLine()..."
                : language === "sql"
                  ? "SQL de preparación (CREATE TABLE, INSERT...) antes de tu código..."
                  : "Valores que tu programa leerá con cin..."
            }
            rows={3}
            className="w-full rounded-[var(--radius-sm)] border border-input bg-surface px-3.5 py-2.5 font-mono text-base leading-relaxed transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)] sm:text-[14px]"
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={handleRun}
          disabled={state === "running"}
          loading={state === "running"}
          size="lg"
          className="max-sm:flex-1"
        >
          <Play className="fill-current" />
          {state === "running" ? "Compilando…" : "Compilar y ejecutar"}
        </Button>
        <Button
          onClick={handleReset}
          variant="ghost"
          disabled={state === "running"}
          size="lg"
        >
          <RotateCcw />
          Reiniciar
        </Button>
        <span className="hidden text-[13px] text-muted-foreground sm:inline-flex sm:items-center sm:gap-1.5">
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>Enter</Kbd>
          <span>para ejecutar</span>
        </span>
      </div>

      <OutputPanel state={state} result={result} error={error} />
    </div>
  );
}
