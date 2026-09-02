// =====================================================================
// Mini-tokenizador usado por los pasos "fill blank" para resaltar el
// código del template (sin Monaco). Monaco hace su propio highlighting en
// el editor real; aquí solo necesitamos colorear líneas estáticas.
// Las clases CSS están alineadas con las variables `--syntax-*` de
// globals.css para que se vean igual que el resto de superficies de código.
//
// La estructura léxica que este tokenizador reconoce (comentarios `//`,
// literales, números, identificadores, operadores) es común a C++ y C#. Lo
// único que cambia por lenguaje es el VOCABULARIO: qué palabras son
// keyword y cuáles son tipos de la biblioteca.
// =====================================================================

import type { ReactNode } from "react";

import type { LanguageId } from "@/lib/code-languages";

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

const CSHARP_KEYWORDS = new Set([
  "int", "double", "decimal", "char", "void", "bool", "float", "long",
  "short", "byte", "string", "object", "var",
  "return", "if", "else", "for", "foreach", "in", "while", "do", "switch",
  "case", "default", "break", "continue", "true", "false", "null",
  "const", "readonly", "static", "struct", "class", "enum",
  "public", "private", "protected", "internal",
  "abstract", "virtual", "override", "sealed", "partial",
  "using", "namespace", "new", "this", "base", "is", "as",
  "try", "catch", "finally", "throw", "get", "set", "value",
]);

// Tipos y miembros de `System` que el curso usa; se resaltan como tipo.
const CSHARP_TYPES = new Set([
  "System", "Console", "Math", "Convert",
  "WriteLine", "Write", "ReadLine", "Parse", "ToString", "Length",
  "Exception", "ArgumentException", "InvalidOperationException",
  "FormatException", "DivideByZeroException", "Main",
]);

const SQL_KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET",
  "DELETE", "CREATE", "TABLE", "ALTER", "DROP", "ADD", "COLUMN",
  "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "NOT", "NULL", "UNIQUE",
  "CHECK", "DEFAULT", "ORDER", "BY", "GROUP", "HAVING", "JOIN", "ON",
  "AND", "OR", "IN", "LIKE", "BETWEEN", "IS", "DISTINCT", "AS",
  "UNION", "EXCEPT", "PRAGMA", "DESC", "ASC", "LIMIT",
]);

const SQL_TYPES = new Set(["INTEGER", "TEXT", "REAL", "NUMERIC", "BLOB"]);

const VOCABULARY: Record<LanguageId, { keywords: Set<string>; types: Set<string> }> = {
  cpp: { keywords: CPP_KEYWORDS, types: CPP_TYPES },
  csharp: { keywords: CSHARP_KEYWORDS, types: CSHARP_TYPES },
  // El contenido y las soluciones del curso escriben las keywords en
  // MAYÚSCULAS de forma consistente (convención SQL habitual); el match es
  // por texto exacto, igual que en C++/C#.
  sql: { keywords: SQL_KEYWORDS, types: SQL_TYPES },
};

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

export function tokenizeCode(
  code: string,
  language: LanguageId = "cpp",
): Token[] {
  const vocabulary = VOCABULARY[language] ?? VOCABULARY.cpp;
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

    // Directiva del preprocesador: #include, #define (C++).
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
      if (vocabulary.keywords.has(word)) kind = "keyword";
      else if (vocabulary.types.has(word)) kind = "type";
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

/** Alias histórico: tokeniza como C++. */
export function tokenizeCpp(code: string): Token[] {
  return tokenizeCode(code, "cpp");
}
