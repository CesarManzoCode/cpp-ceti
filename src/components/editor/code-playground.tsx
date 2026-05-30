"use client";

import * as React from "react";
import { Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { CppEditor } from "@/components/editor/cpp-editor";
import { diagnosticsFromExecution } from "@/components/editor/diagnostics";
import { OutputPanel } from "@/components/editor/output-panel";
import { useRunCode } from "@/hooks/use-run-code";
import { cn } from "@/lib/utils";

interface CodePlaygroundProps {
  initialCode: string;
  /** Si true, muestra un campo opcional para stdin */
  showStdin?: boolean;
  className?: string;
  editorHeight?: number;
}

export function CodePlayground({
  initialCode,
  showStdin = false,
  className,
  editorHeight = 320,
}: CodePlaygroundProps) {
  const [code, setCode] = React.useState(initialCode);
  const [stdin, setStdin] = React.useState("");
  const { state, result, error, run, reset } = useRunCode();

  function handleRun() {
    void run(code, stdin);
  }

  function handleReset() {
    setCode(initialCode);
    reset();
  }

  return (
    <div className={cn("space-y-3", className)}>
      <CppEditor
        value={code}
        onChange={setCode}
        onRun={handleRun}
        minHeight={editorHeight}
        diagnostics={diagnosticsFromExecution(result)}
      />

      {showStdin ? (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Entrada estándar (stdin)
          </Label>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Valores que tu programa leerá con cin..."
            rows={3}
            className="w-full rounded-[var(--radius-sm)] border border-input bg-surface px-3 py-2 font-mono text-sm transition-[border-color,box-shadow] focus-visible:border-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)]"
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={handleRun}
          disabled={state === "running"}
          loading={state === "running"}
          size="lg"
        >
          <Play className="fill-current" />
          {state === "running" ? "Ejecutando…" : "Ejecutar"}
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
        <span className="hidden text-xs text-muted-foreground sm:inline-flex sm:items-center sm:gap-1.5">
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
