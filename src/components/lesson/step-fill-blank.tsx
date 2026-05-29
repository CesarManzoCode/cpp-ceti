"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Lightbulb, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";
import type { FillBlankStepContent } from "@/types/lesson";

const CPP_IDENTIFIER_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

interface StepFillBlankProps {
  content: FillBlankStepContent;
  onNext: () => void;
  isPending: boolean;
}

export function StepFillBlank({
  content,
  onNext,
  isPending,
}: StepFillBlankProps) {
  const [values, setValues] = React.useState<string[]>(
    () => content.blanks.map(() => ""),
  );
  const [submitted, setSubmitted] = React.useState(false);
  const [showHint, setShowHint] = React.useState<number | null>(null);
  const [feedbackKey, setFeedbackKey] = React.useState(0);

  const allCorrect = content.blanks.every((b, i) =>
    isBlankCorrect(b, values[i] ?? "", values),
  );

  function verify() {
    setSubmitted(true);
    setFeedbackKey((k) => k + 1);
  }

  const lines = renderTemplateLines(
    content.template,
    values,
    setValues,
    submitted,
    content,
  );

  return (
    <article className="space-y-7">
      <header className="space-y-2">
        <p className="eyebrow text-primary">Completa el código</p>
        {content.prompt ? (
          <div className="prose-instructions text-balance text-foreground">
            <Markdown>{content.prompt}</Markdown>
          </div>
        ) : (
          <h3 className="text-balance text-xl font-semibold tracking-tight">
            Llena los espacios para que el programa compile.
          </h3>
        )}
      </header>

      <div
        key={feedbackKey}
        className={cn(
          "overflow-hidden rounded-[var(--radius-md)] border border-[var(--terminal-border)] bg-terminal",
          submitted && !allCorrect && "animate-shake",
          submitted && allCorrect && "animate-correct",
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--terminal-border)] bg-terminal-elevated px-4 py-2 text-[11px] text-terminal-muted">
          <span className="flex items-center gap-2 font-mono">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-terminal-danger/90" />
              <span className="size-2.5 rounded-full bg-terminal-warning/90" />
              <span className="size-2.5 rounded-full bg-terminal-success/90" />
            </span>
            main.cpp
          </span>
          <span className="font-mono uppercase tracking-[0.14em]">edición</span>
        </div>
        <div className="overflow-x-auto py-4 font-mono text-[13px] leading-[1.7] text-terminal-fg">
          {lines.map((nodes, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[3.25rem_1fr] hover:bg-terminal-elevated/50"
            >
              <span className="select-none border-r border-[var(--terminal-border)] pr-3 text-right font-mono text-terminal-faint tabular-nums">
                {idx + 1}
              </span>
              <div className="whitespace-pre pl-4">
                {nodes.length === 0 ? " " : nodes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {content.blanks.some((b) => b.hint) ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">¿Atorado?</span>
          {content.blanks.map((blank, idx) =>
            blank.hint ? (
              <Button
                key={idx}
                variant="ghost"
                size="xs"
                onClick={() => setShowHint(showHint === idx ? null : idx)}
              >
                <Lightbulb className="text-warning" />
                Pista {idx + 1}
              </Button>
            ) : null,
          )}
        </div>
      ) : null}

      {showHint !== null && content.blanks[showHint]?.hint ? (
        <div className="rounded-[var(--radius-md)] border border-warning/40 bg-warning-soft p-3 text-sm">
          <strong className="font-semibold text-warning-foreground">
            Pista:
          </strong>{" "}
          <span className="text-foreground/90">
            {content.blanks[showHint].hint}
          </span>
        </div>
      ) : null}

      {submitted && !allCorrect ? (
        <div className="rounded-[var(--radius-md)] border border-destructive/30 bg-destructive-soft p-3 text-sm text-destructive">
          Algunas respuestas no son correctas. Revisa los campos marcados.
        </div>
      ) : null}

      {submitted && allCorrect ? (
        <div className="flex items-start gap-2 rounded-[var(--radius-md)] border border-success/30 bg-success-soft p-3 text-sm text-success">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            ¡Perfecto! Eso es justo lo que faltaba.
            {content.explanation ? (
              <span className="text-foreground/85">
                {" "}
                — {content.explanation}
              </span>
            ) : null}
          </span>
        </div>
      ) : null}

      <div className="flex justify-end gap-2 border-t border-border/70 pt-6">
        {!submitted || !allCorrect ? (
          <>
            {submitted && !allCorrect ? (
              <Button
                onClick={() => setSubmitted(false)}
                variant="ghost"
                size="lg"
              >
                <Pencil />
                Corregir
              </Button>
            ) : null}
            <Button
              onClick={verify}
              disabled={values.some((v) => !v.trim())}
              size="lg"
            >
              Verificar
            </Button>
          </>
        ) : (
          <Button onClick={onNext} loading={isPending} size="lg">
            Continuar
            <ArrowRight />
          </Button>
        )}
      </div>
    </article>
  );
}

// =====================================================================
// C++ syntax highlighting — minimal tokenizer
// =====================================================================

type TokenKind =
  | "keyword"
  | "type"
  | "string"
  | "number"
  | "comment"
  | "preprocessor"
  | "operator"
  | "text";

interface Token {
  text: string;
  kind: TokenKind;
}

const CPP_KEYWORDS = new Set([
  "int", "double", "char", "void", "bool", "float", "long", "short",
  "unsigned", "signed", "auto",
  "return", "if", "else", "for", "while", "do", "switch", "case", "default",
  "break", "continue", "true", "false",
  "const", "static", "extern", "struct", "class",
  "public", "private", "protected", "using", "namespace", "sizeof",
  "new", "delete", "this", "nullptr",
]);

// Common stdlib types/identifiers that we want highlighted as "type"
const CPP_TYPES = new Set([
  "std", "string", "cout", "cin", "endl", "cerr",
  "ofstream", "ifstream", "fstream", "ios",
  "printf", "scanf", "sprintf", "fprintf", "fscanf", "getline",
  "fopen", "fclose", "fgets", "fputs",
  "size_t", "FILE", "NULL",
]);

const TOKEN_CLASSES: Record<TokenKind, string> = {
  keyword: "text-syntax-keyword",
  type: "text-syntax-type",
  string: "text-syntax-string",
  number: "text-syntax-number",
  comment: "italic text-syntax-comment",
  preprocessor: "text-syntax-keyword",
  operator: "text-syntax-operator",
  text: "text-terminal-fg",
};

function tokenizeCpp(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < code.length) {
    const c = code[i];

    // Single-line comment
    if (c === "/" && code[i + 1] === "/") {
      const end = code.length;
      tokens.push({ text: code.slice(i, end), kind: "comment" });
      i = end;
      continue;
    }

    // String literal
    if (c === '"') {
      let end = i + 1;
      while (end < code.length && code[end] !== '"') {
        if (code[end] === "\\" && end + 1 < code.length) end++;
        end++;
      }
      end = Math.min(end + 1, code.length);
      tokens.push({ text: code.slice(i, end), kind: "string" });
      i = end;
      continue;
    }

    // Char literal
    if (c === "'") {
      let end = i + 1;
      while (end < code.length && code[end] !== "'") {
        if (code[end] === "\\" && end + 1 < code.length) end++;
        end++;
      }
      end = Math.min(end + 1, code.length);
      tokens.push({ text: code.slice(i, end), kind: "string" });
      i = end;
      continue;
    }

    // Preprocessor directive: #include, #define, etc.
    if (c === "#") {
      let end = i + 1;
      while (end < code.length && /[a-zA-Z_]/.test(code[end])) end++;
      tokens.push({ text: code.slice(i, end), kind: "preprocessor" });
      i = end;
      continue;
    }

    // Number
    if (/\d/.test(c)) {
      let end = i;
      while (end < code.length && /[\d.]/.test(code[end])) end++;
      tokens.push({ text: code.slice(i, end), kind: "number" });
      i = end;
      continue;
    }

    // Identifier or keyword
    if (/[a-zA-Z_]/.test(c)) {
      let end = i;
      while (end < code.length && /[a-zA-Z_0-9]/.test(code[end])) end++;
      const word = code.slice(i, end);
      let kind: TokenKind = "text";
      if (CPP_KEYWORDS.has(word)) kind = "keyword";
      else if (CPP_TYPES.has(word)) kind = "type";
      tokens.push({ text: word, kind });
      i = end;
      continue;
    }

    // Multi-char operators
    const twoChar = code.slice(i, i + 2);
    if (
      ["<<", ">>", "==", "!=", "<=", ">=", "++", "--", "+=", "-=", "*=", "/=",
       "||", "&&", "->"].includes(twoChar)
    ) {
      tokens.push({ text: twoChar, kind: "operator" });
      i += 2;
      continue;
    }

    // Single-char operators
    if (/[+\-*/%=<>!&|]/.test(c)) {
      tokens.push({ text: c, kind: "operator" });
      i++;
      continue;
    }

    // Whitespace and punctuation: emit as plain text token (preserve as-is)
    let end = i;
    while (
      end < code.length &&
      !/[a-zA-Z_0-9"'#+\-*/%=<>!&|]/.test(code[end]) &&
      !(code[end] === "/" && code[end + 1] === "/")
    ) {
      end++;
    }
    if (end > i) {
      tokens.push({ text: code.slice(i, end), kind: "text" });
      i = end;
    } else {
      tokens.push({ text: c, kind: "text" });
      i++;
    }
  }
  return tokens;
}

function renderTokens(tokens: Token[], baseKey: string): React.ReactNode[] {
  return tokens.map((tok, idx) => (
    <span key={`${baseKey}-${idx}`} className={TOKEN_CLASSES[tok.kind]}>
      {tok.text}
    </span>
  ));
}

// =====================================================================
// Template renderer
// =====================================================================

type Segment =
  | { type: "text"; text: string }
  | { type: "newline" }
  | { type: "input"; idx: number };

function parseTemplate(template: string): Segment[] {
  const segments: Segment[] = [];
  const re = /\{\{(\d+)\}\}|\n/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(template)) !== null) {
    if (match.index > lastIdx) {
      segments.push({
        type: "text",
        text: template.slice(lastIdx, match.index),
      });
    }
    if (match[0] === "\n") {
      segments.push({ type: "newline" });
    } else {
      segments.push({ type: "input", idx: Number(match[1]) });
    }
    lastIdx = re.lastIndex;
  }
  if (lastIdx < template.length) {
    segments.push({ type: "text", text: template.slice(lastIdx) });
  }
  return segments;
}

/**
 * Valida la respuesta de un blank.
 *
 * Reglas:
 * 1. Si tiene `matchBlank`, el valor debe ser un identificador C++ válido
 *    (o cumplir el `pattern` si está definido) Y coincidir con el valor del
 *    blank referenciado. Esto permite "cualquier nombre, pero el mismo en
 *    ambos lugares".
 * 2. Si tiene `pattern` (sin `matchBlank`), se valida contra ese regex anclado.
 * 3. Si no, se compara exacto con `answer`.
 */
function isBlankCorrect(
  blank: FillBlankStepContent["blanks"][number],
  value: string,
  allValues: string[],
): boolean {
  const trimmed = value.trim();
  if (blank.matchBlank !== undefined) {
    const formatRe = blank.pattern
      ? safeRegex(`^(?:${blank.pattern})$`)
      : CPP_IDENTIFIER_RE;
    if (formatRe && !formatRe.test(trimmed)) return false;
    const other = (allValues[blank.matchBlank] ?? "").trim();
    if (!other) return false;
    return trimmed === other;
  }
  if (blank.pattern) {
    const re = safeRegex(`^(?:${blank.pattern})$`);
    if (re) return re.test(trimmed);
    return trimmed === blank.answer.trim();
  }
  return trimmed === blank.answer.trim();
}

function safeRegex(source: string): RegExp | null {
  try {
    return new RegExp(source);
  } catch {
    return null;
  }
}

function renderTemplateLines(
  template: string,
  values: string[],
  setValues: React.Dispatch<React.SetStateAction<string[]>>,
  submitted: boolean,
  content: FillBlankStepContent,
): React.ReactNode[][] {
  const segments = parseTemplate(template);
  const lines: React.ReactNode[][] = [[]];
  let textKey = 0;

  for (const seg of segments) {
    if (seg.type === "newline") {
      lines.push([]);
      continue;
    }
    if (seg.type === "text") {
      const tokens = tokenizeCpp(seg.text);
      const rendered = renderTokens(tokens, `t${textKey++}`);
      lines[lines.length - 1].push(...rendered);
      continue;
    }
    // input
    const blankIdx = seg.idx;
    const value = values[blankIdx] ?? "";
    const blank = content.blanks[blankIdx];
    const expected = blank?.answer ?? "";
    const isWrong =
      submitted && !(blank && isBlankCorrect(blank, value, values));
    const isRight = submitted && !isWrong;
    lines[lines.length - 1].push(
      <input
        key={`b-${blankIdx}`}
        value={value}
        onChange={(e) => {
          const next = [...values];
          next[blankIdx] = e.target.value;
          setValues(next);
        }}
        disabled={isRight}
        aria-invalid={isWrong || undefined}
        aria-label={`Espacio ${blankIdx + 1}`}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        className={cn(
          // 16px en móvil evita el auto-zoom de iOS Safari al enfocar el input.
          "mx-[2px] inline-block min-w-16 rounded border px-1.5 py-[1px] align-baseline font-mono text-[16px] outline-none transition-colors sm:text-[13px]",
          isWrong
            ? "border-destructive/70 bg-destructive/15 text-destructive"
            : isRight
              ? "border-success/70 bg-success/15 text-success"
              : "border-[var(--terminal-border)] bg-terminal-elevated text-syntax-type focus:border-syntax-type focus:ring-2 focus:ring-syntax-type/30",
        )}
        style={{
          width: `${Math.max(value.length, expected.length, 6) + 1}ch`,
        }}
      />,
    );
  }
  return lines;
}
