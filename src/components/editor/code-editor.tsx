"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type * as Monaco from "monaco-editor";

import { cn } from "@/lib/utils";
import {
  getLanguageProfile,
  type LanguageId,
} from "@/lib/code-languages";
import { BrandSpinner } from "@/components/ui/brand-spinner";

import { completionsFor, triggerCharactersFor } from "./completions";
import type { CompletionKind } from "./completions";
import type { CodeDiagnostic } from "./diagnostics";

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

interface CodeEditorProps {
  /**
   * Lenguaje del CURSO al que pertenece el recurso. De él salen el modo de
   * Monaco, el nombre del archivo, las sugerencias y el parser de errores.
   * Nunca se deduce del contenido del código.
   */
  language: LanguageId;
  value: string;
  onChange?: (value: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
  className?: string;
  minHeight?: number;
  /** Marca líneas con squiggles a partir de la última corrida. */
  diagnostics?: CodeDiagnostic[];
  /** Etiqueta para accesibilidad. Default derivado del lenguaje. */
  ariaLabel?: string;
}

// El provider de completions de Monaco es GLOBAL por lenguaje: registrarlo
// en cada mount duplicaría las sugerencias. Se registra una vez por lenguaje
// y se guarda su disposable para poder soltarlo en el hot reload de dev
// (donde el módulo se re-evalúa y el provider anterior quedaría colgado).
const registeredLanguages = new Map<string, Monaco.IDisposable>();

export function CodeEditor({
  language,
  value,
  onChange,
  onRun,
  readOnly = false,
  className,
  minHeight = 280,
  diagnostics,
  ariaLabel,
}: CodeEditorProps) {
  const profile = getLanguageProfile(language);
  // La consola es oscura en ambos temas — igual que TerminalSurface y el
  // panel de salida. El código se lee sobre el mismo fondo siempre, así el
  // resaltado de sintaxis significa lo mismo de día y de noche.
  const editorRef = React.useRef<Monaco.editor.IStandaloneCodeEditor | null>(
    null,
  );
  const monacoRef = React.useRef<typeof Monaco | null>(null);

  // En celular subimos a 16px: mejora la legibilidad del código en pantalla
  // chica y evita el auto-zoom de iOS Safari al enfocar el editor. Desktop
  // (sm+, ≥640px) se queda en 14px — igual que siempre.
  const [fontSize, setFontSize] = React.useState(14);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setFontSize(mq.matches ? 16 : 14);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  React.useEffect(() => {
    editorRef.current?.updateOptions({ fontSize });
  }, [fontSize]);

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
    monaco.editor.setModelMarkers(model, "ceti-compiler", markers);
  }, [diagnostics]);

  return (
    <div
      role="region"
      aria-label={ariaLabel ?? `Editor de ${profile.label}`}
      className={cn(
        "group/editor flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--terminal-border)] bg-[var(--terminal-bg)] transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-[var(--primary-ring)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--terminal-border)] px-4 py-2.5">
        <span className="font-mono text-[12px] font-medium text-terminal-muted">
          {profile.defaultFileName}
        </span>
        <span className="hidden text-[12px] text-terminal-faint sm:inline">
          Ctrl+Enter para ejecutar
        </span>
      </div>
      <div style={{ height: `min(${minHeight}px, 70svh)` }}>
        <MonacoEditor
          height="100%"
          language={profile.monacoLanguage}
          path={profile.defaultFileName}
          value={value}
          theme="ceti-dark"
          onChange={(v) => onChange?.(v ?? "")}
          beforeMount={(monaco) => {
            // Temas — defineTheme es idempotente (reemplaza con el mismo nombre).
            // Paleta espejo de las variables --syntax-* de globals.css.
            // Si cambias una, cambia la otra.
            monaco.editor.defineTheme("ceti-dark", {
              base: "vs-dark",
              inherit: true,
              rules: [
                { token: "comment", foreground: "7d87a0", fontStyle: "italic" },
                { token: "keyword", foreground: "f2a2c0" },
                { token: "string", foreground: "a8dfb0" },
                { token: "number", foreground: "f0c674" },
                { token: "type", foreground: "8fc6f5" },
              ],
              colors: {
                "editor.background": "#171e2d",
                "editor.foreground": "#e9edf2",
                "editorLineNumber.foreground": "#565e73",
                "editorLineNumber.activeForeground": "#a3a8b4",
                "editor.selectionBackground": "#3f6bd44d",
                "editor.lineHighlightBackground": "#1e2637",
                "editor.lineHighlightBorder": "#1e263700",
                "editorCursor.foreground": "#8fc6f5",
                "editorIndentGuide.background": "#252d40",
                "editorIndentGuide.activeBackground": "#3b445a",
              },
            });

            // Un provider por lenguaje de Monaco, registrado una sola vez.
            // Las sugerencias salen del registro del lenguaje: en un archivo
            // de C# no puede aparecer `#include` ni `std::`.
            const monacoLanguage = profile.monacoLanguage;
            if (!registeredLanguages.has(monacoLanguage)) {
              const completions = completionsFor(profile.id);
              const disposable =
                monaco.languages.registerCompletionItemProvider(monacoLanguage, {
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
                      suggestions: completions.map((c) => {
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
                  triggerCharacters: triggerCharactersFor(profile.id),
                });
              registeredLanguages.set(monacoLanguage, disposable);
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
                  "ceti-compiler",
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
            fontSize,
            fontFamily:
              "var(--font-plex-mono), ui-monospace, SFMono-Regular, monospace",
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
  kind: CompletionKind,
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
