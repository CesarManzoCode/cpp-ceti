// =====================================================================
// Mini-tokenizador de C++ usado por los pasos "fill blank" para resaltar
// el código del template (sin Monaco). Monaco hace su propio highlighting
// en el editor real; aquí solo necesitamos colorear líneas estáticas.
// Las clases CSS están alineadas con las variables `--syntax-*` de
// globals.css para que se vean igual que el resto de superficies de código.
// =====================================================================

import type { ReactNode } from "react";

export type TokenKind =
  | "keyword"
  | "type"
  | "string"
  | "number"
  | "comment"
  | "preprocessor"
  | "operator"
  | "text";

export interface Token {
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

// stdlib types/identifiers que queremos resaltar como "type"
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

export function tokenizeCpp(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < code.length) {
    const c = code[i];

    // Comentario de línea
    if (c === "/" && code[i + 1] === "/") {
      tokens.push({ text: code.slice(i), kind: "comment" });
      i = code.length;
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

    // Directiva: #include, #define, etc.
    if (c === "#") {
      let end = i + 1;
      while (end < code.length && /[a-zA-Z_]/.test(code[end])) end++;
      tokens.push({ text: code.slice(i, end), kind: "preprocessor" });
      i = end;
      continue;
    }

    // Número
    if (/\d/.test(c)) {
      let end = i;
      while (end < code.length && /[\d.]/.test(code[end])) end++;
      tokens.push({ text: code.slice(i, end), kind: "number" });
      i = end;
      continue;
    }

    // Identificador o keyword
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

    // Operadores multi-char
    const twoChar = code.slice(i, i + 2);
    if (
      ["<<", ">>", "==", "!=", "<=", ">=", "++", "--", "+=", "-=", "*=", "/=",
       "||", "&&", "->"].includes(twoChar)
    ) {
      tokens.push({ text: twoChar, kind: "operator" });
      i += 2;
      continue;
    }

    if (/[+\-*/%=<>!&|]/.test(c)) {
      tokens.push({ text: c, kind: "operator" });
      i++;
      continue;
    }

    // Whitespace y puntuación: agrupados como texto plano
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

export function renderTokens(tokens: Token[], baseKey: string): ReactNode[] {
  return tokens.map((tok, idx) => (
    <span key={`${baseKey}-${idx}`} className={TOKEN_CLASSES[tok.kind]}>
      {tok.text}
    </span>
  ));
}
