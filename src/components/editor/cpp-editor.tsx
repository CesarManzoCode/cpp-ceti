"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[var(--terminal-bg)]">
        <Loader2 className="size-5 animate-spin text-zinc-500" />
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
}

export function CppEditor({
  value,
  onChange,
  onRun,
  readOnly = false,
  className,
  minHeight = 280,
}: CppEditorProps) {
  const { resolvedTheme } = useTheme();
  const monacoTheme =
    resolvedTheme === "dark" ? "cpp-ceti-dark" : "cpp-ceti-light";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-lg)] border border-[var(--terminal-border)] bg-[var(--terminal-bg)] shadow-[var(--shadow-xs)]",
        className,
      )}
      style={{ minHeight }}
    >
      <MonacoEditor
        height={minHeight}
        language="cpp"
        value={value}
        theme={monacoTheme}
        onChange={(v) => onChange?.(v ?? "")}
        beforeMount={(monaco) => {
          // Tema oscuro custom para que combine con la app
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
        }}
        onMount={(editor, monaco) => {
          editor.updateOptions({ readOnly });
          if (onRun) {
            // Ctrl+Enter / Cmd+Enter → ejecutar
            editor.addCommand(
              monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
              () => onRun(),
            );
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
  );
}
