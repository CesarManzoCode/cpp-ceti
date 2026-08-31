// Fábricas de autocompletado por lenguaje.
//
// El editor registra el proveedor del lenguaje del curso y sólo ese: en un
// archivo de C# no deben aparecer `#include` ni `std::`, y en uno de C++ no
// deben aparecer propiedades ni `Console`.

import type { LanguageId } from "@/lib/code-languages";

import { CPP_COMPLETIONS } from "./cpp";
import { CSHARP_COMPLETIONS } from "./csharp";
import type { CodeCompletion } from "./types";

export type { CodeCompletion, CompletionKind } from "./types";
export { CPP_COMPLETIONS } from "./cpp";
export { CSHARP_COMPLETIONS } from "./csharp";

const BY_LANGUAGE: Record<LanguageId, CodeCompletion[]> = {
  cpp: CPP_COMPLETIONS,
  csharp: CSHARP_COMPLETIONS,
};

/** Sugerencias del lenguaje indicado. Vacío si no hay registro. */
export function completionsFor(language: LanguageId): CodeCompletion[] {
  return BY_LANGUAGE[language] ?? [];
}

/** Caracteres que disparan el autocompletado en cada lenguaje. */
export function triggerCharactersFor(language: LanguageId): string[] {
  return language === "csharp" ? [".", '"'] : [".", ":", "<", "#"];
}
