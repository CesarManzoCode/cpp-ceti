"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type * as Monaco from "monaco-editor";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { BrandSpinner } from "@/components/ui/brand-spinner";

import { CPP_COMPLETIONS, type CppCompletionKind } from "./cpp-completions";
import type { CppDiagnostic } from "./diagnostics";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[var(--terminal-bg)]">
        <BrandSpinner size="sm" />
      </div>
    ),
  },
);

interface CppEditorProps {
  value: string;
  onChange?: (value: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
  className?: string;
  minHeight?: number;
  /** Marca líneas con squiggles a partir de stderr de la última corrida. */
  diagnostics?: CppDiagnostic[];
  /** Etiqueta para accesibilidad. Default genérico. */
  ariaLabel?: string;
}

// Las cosas que se registran en Monaco (provider de completions, temas) son
// globales — la primera vez que se monta cualquier editor las dejamos puestas
// y los próximos las reutilizan. Sin esta guarda, cada mount añade un nuevo
// provider y los sugeridos aparecen duplicados.
let monacoRegistered = false;

export function CppEditor({
  value,
  onChange,
  onRun,
  readOnly = false,
  className,
  minHeight = 280,
  diagnostics,
  ariaLabel,
}: CppEditorProps) {
  const { resolvedTheme } = useTheme();
  const monacoTheme =
    resolvedTheme === "dark" ? "cpp-ceti-dark" : "cpp-ceti-light";
  const editorRef = React.useRef<Monaco.editor.IStandaloneCodeEditor | null>(
    null,
  );
  const monacoRef = React.useRef<typeof Monaco | null>(null);

  // Aplicar markers cuando cambian los diagnostics (errores/warnings).
  React.useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const model = editor.getModel();
    if (!model) return;
    const markers: Monaco.editor.IMarkerData[] = (diagnostics ?? []).map((d) => {
      const lineContent = model.getLineContent(
        Math.min(d.line, model.getLineCount()),
      );
      const endColumn = Math.max(d.column + 1, lineContent.length + 1);
      return {
        severity:
          d.severity === "error"
            ? monaco.MarkerSeverity.Error
            : monaco.MarkerSeverity.Warning,
        message: d.message,
        startLineNumber: Math.min(d.line, model.getLineCount()),
        startColumn: d.column,
        endLineNumber: Math.min(d.line, model.getLineCount()),
        endColumn,
      };
    });
    monaco.editor.setModelMarkers(model, "cpp-ceti", markers);
  }, [diagnostics]);

  return (
    <div
      role="region"
      aria-label={ariaLabel ?? "Editor de C++"}
      className={cn(
        "group/editor flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--terminal-border)] bg-[var(--terminal-bg)] transition-colors focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-[var(--primary-ring)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-[var(--terminal-border)] px-3.5 py-2">
        <span className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-terminal-danger/90" />
            <span className="size-2.5 rounded-full bg-terminal-warning/90" />
            <span className="size-2.5 rounded-full bg-terminal-success/90" />
          </span>
          <span className="font-mono text-[11px] text-terminal-muted">
            main.cpp
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="hidden font-mono text-[10px] text-terminal-faint sm:inline">
            Ctrl+Enter para ejecutar
          </span>
          <span className="eyebrow text-terminal-faint">C++</span>
        </span>
      </div>
      <div style={{ height: `min(${minHeight}px, 70svh)` }}>
        <MonacoEditor
          height="100%"
          language="cpp"
          value={value}
          theme={monacoTheme}
          onChange={(v) => onChange?.(v ?? "")}
          beforeMount={(monaco) => {
            // Temas — defineTheme es idempotente (reemplaza con el mismo nombre).
            monaco.editor.defineTheme("cpp-ceti-dark", {
              base: "vs-dark",
              inherit: true,
              rules: [
                { token: "comment", foreground: "6b7280", fontStyle: "italic" },
                { token: "keyword", foreground: "c084fc" },
                { token: "string", foreground: "86efac" },
                { token: "number", foreground: "fbbf24" },
                { token: "type", foreground: "60a5fa" },
              ],
              colors: {
                "editor.background": "#0f141d",
                "editor.foreground": "#e5e7eb",
                "editorLineNumber.foreground": "#3f4754",
                "editorLineNumber.activeForeground": "#9ca3af",
                "editor.selectionBackground": "#3b82f64d",
                "editor.lineHighlightBackground": "#1a2230",
                "editor.lineHighlightBorder": "#1a223000",
                "editorCursor.foreground": "#7aa2ff",
                "editorIndentGuide.background": "#1f2937",
                "editorIndentGuide.activeBackground": "#374151",
              },
            });
            monaco.editor.defineTheme("cpp-ceti-light", {
              base: "vs",
              inherit: true,
              rules: [
                { token: "comment", foreground: "6b7280", fontStyle: "italic" },
                { token: "keyword", foreground: "7c3aed" },
                { token: "string", foreground: "15803d" },
                { token: "number", foreground: "b45309" },
                { token: "type", foreground: "1d4ed8" },
              ],
              colors: {
                "editor.background": "#ffffff",
                "editor.foreground": "#0f172a",
                "editorLineNumber.foreground": "#cbd5e1",
                "editorLineNumber.activeForeground": "#475569",
                "editor.lineHighlightBackground": "#f8fafc",
                "editor.lineHighlightBorder": "#f8fafc00",
              },
            });

            // Completion provider — registrar una sola vez globalmente.
            if (!monacoRegistered) {
              monaco.languages.registerCompletionItemProvider("cpp", {
                provideCompletionItems(
                  model: Monaco.editor.ITextModel,
                  position: Monaco.Position,
                ) {
                  const word = model.getWordUntilPosition(position);
                  const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                  };
                  return {
                    suggestions: CPP_COMPLETIONS.map((c) => {
                      const isSnippet = c.insert.includes("$");
                      return {
                        label: c.label,
                        kind: monacoKindFor(monaco, c.kind),
                        insertText: c.insert,
                        insertTextRules: isSnippet
                          ? monaco.languages.CompletionItemInsertTextRule
                              .InsertAsSnippet
                          : undefined,
                        detail: c.detail,
                        documentation: c.doc,
                        filterText: c.filterText,
                        range,
                      };
                    }),
                  };
                },
                triggerCharacters: [".", ":", "<", "#"],
              });
              monacoRegistered = true;
            }
          }}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;
            editor.updateOptions({ readOnly });
            if (onRun) {
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                () => onRun(),
              );
            }
            // Asegurar que aplicamos markers si llegaron antes del mount.
            if (diagnostics && diagnostics.length > 0) {
              const model = editor.getModel();
              if (model) {
                monaco.editor.setModelMarkers(
                  model,
                  "cpp-ceti",
                  diagnostics.map((d) => ({
                    severity:
                      d.severity === "error"
                        ? monaco.MarkerSeverity.Error
                        : monaco.MarkerSeverity.Warning,
                    message: d.message,
                    startLineNumber: d.line,
                    startColumn: d.column,
                    endLineNumber: d.line,
                    endColumn: d.column + 1,
                  })),
                );
              }
            }
          }}
          options={{
            fontSize: 14,
            fontFamily:
              "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            automaticLayout: true,
            padding: { top: 14, bottom: 14 },
            lineNumbersMinChars: 3,
            renderLineHighlight: "line",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
            contextmenu: false,
            quickSuggestions: { other: true, comments: false, strings: false },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "smart",
            tabCompletion: "on",
            guides: {
              indentation: true,
              highlightActiveIndentation: true,
            },
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              useShadows: false,
            },
          }}
        />
      </div>
    </div>
  );
}

function monacoKindFor(
  monaco: typeof Monaco,
  kind: CppCompletionKind,
): Monaco.languages.CompletionItemKind {
  const K = monaco.languages.CompletionItemKind;
  switch (kind) {
    case "keyword":
      return K.Keyword;
    case "type":
      return K.TypeParameter;
    case "function":
      return K.Function;
    case "class":
      return K.Class;
    case "variable":
      return K.Variable;
    case "snippet":
      return K.Snippet;
  }
}
