"use client";

import * as React from "react";
import { Loader2, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CppEditor } from "@/components/editor/cpp-editor";
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
      />

      {showStdin ? (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Entrada estándar (stdin)
          </label>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Valores que tu programa leerá con cin..."
            rows={3}
            className="w-full rounded-lg border bg-background px-3 py-2 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Button onClick={handleRun} disabled={state === "running"} size="lg">
          {state === "running" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Ejecutando…
            </>
          ) : (
            <>
              <Play className="size-4 fill-current" />
              Ejecutar (Ctrl+Enter)
            </>
          )}
        </Button>
        <Button onClick={handleReset} variant="ghost" disabled={state === "running"}>
          <RotateCcw className="size-4" />
          Reiniciar
        </Button>
      </div>

      <OutputPanel state={state} result={result} error={error} />
    </div>
  );
}
