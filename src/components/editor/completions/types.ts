// Forma común de una sugerencia de autocompletado, independiente del
// lenguaje. Cada lenguaje aporta su propia lista; el editor registra la
// del lenguaje del curso y sólo esa.

export type CompletionKind =
  | "keyword"
  | "type"
  | "function"
  | "class"
  | "snippet"
  | "variable";

export interface CodeCompletion {
  label: string;
  kind: CompletionKind;
  /** Texto a insertar. Si tiene `$1`/`$0`, se trata como snippet. */
  insert: string;
  /** Documentación breve mostrada en el popover. */
  detail?: string;
  /** Texto largo (markdown) opcional para el doc panel. */
  doc?: string;
  /** Aliases adicionales para fuzzy match. */
  filterText?: string;
}

/** Alias histórico del tipo de C++. */
export type CppCompletionKind = CompletionKind;
export type CppCompletion = CodeCompletion;
