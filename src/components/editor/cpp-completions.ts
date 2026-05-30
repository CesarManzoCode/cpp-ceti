// Datos de autocompletado para Monaco. Snippets compactos pensados para el
// nivel del curso (no son una replica de IntelliSense de IDE pro): tipos
// primitivos, control de flujo, std namespace básico y plantillas frecuentes.
//
// Cada entry se mapea a un Monaco CompletionItem en el provider (cpp-editor).
// `insert` puede usar la sintaxis de tabstops $1 / $0 cuando insertSnippet
// está habilitado.

export type CppCompletionKind =
  | "keyword"
  | "type"
  | "function"
  | "class"
  | "snippet"
  | "variable";

export interface CppCompletion {
  label: string;
  kind: CppCompletionKind;
  /** Texto a insertar. Si tiene `$1`/`$0`, se trata como snippet. */
  insert: string;
  /** Documentación breve mostrada en el popover. */
  detail?: string;
  /** Texto largo (markdown) opcional para el doc panel. */
  doc?: string;
  /** Aliases adicionales para fuzzy match. */
  filterText?: string;
}

export const CPP_COMPLETIONS: CppCompletion[] = [
  // Tipos primitivos
  { label: "int", kind: "type", insert: "int", detail: "Entero de 32 bits" },
  { label: "long", kind: "type", insert: "long", detail: "Entero ≥32 bits" },
  {
    label: "long long",
    kind: "type",
    insert: "long long",
    detail: "Entero de 64 bits",
  },
  { label: "double", kind: "type", insert: "double", detail: "Punto flotante 64-bit" },
  { label: "float", kind: "type", insert: "float", detail: "Punto flotante 32-bit" },
  { label: "char", kind: "type", insert: "char", detail: "Carácter de 1 byte" },
  { label: "bool", kind: "type", insert: "bool", detail: "true | false" },
  { label: "void", kind: "type", insert: "void", detail: "Sin tipo de retorno" },
  { label: "auto", kind: "type", insert: "auto", detail: "Inferencia de tipo" },
  { label: "const", kind: "keyword", insert: "const", detail: "Valor inmutable" },

  // Control de flujo
  {
    label: "if",
    kind: "snippet",
    insert: "if (${1:cond}) {\n  $0\n}",
    detail: "Bloque condicional",
  },
  {
    label: "ifelse",
    kind: "snippet",
    insert: "if (${1:cond}) {\n  $2\n} else {\n  $0\n}",
    detail: "if / else",
  },
  {
    label: "for",
    kind: "snippet",
    insert: "for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n  $0\n}",
    detail: "Loop clásico",
  },
  {
    label: "forr",
    kind: "snippet",
    insert: "for (const auto& ${1:x} : ${2:cont}) {\n  $0\n}",
    detail: "Range-based for",
  },
  {
    label: "while",
    kind: "snippet",
    insert: "while (${1:cond}) {\n  $0\n}",
    detail: "Loop condicional",
  },
  {
    label: "do",
    kind: "snippet",
    insert: "do {\n  $0\n} while (${1:cond});",
    detail: "do / while",
  },
  {
    label: "switch",
    kind: "snippet",
    insert:
      "switch (${1:value}) {\n  case ${2:1}:\n    $0\n    break;\n  default:\n    break;\n}",
    detail: "Selector múltiple",
  },
  { label: "return", kind: "keyword", insert: "return", detail: "Devolver valor" },
  { label: "break", kind: "keyword", insert: "break", detail: "Salir de un loop" },
  { label: "continue", kind: "keyword", insert: "continue", detail: "Siguiente iteración" },
  { label: "true", kind: "keyword", insert: "true", detail: "Verdadero" },
  { label: "false", kind: "keyword", insert: "false", detail: "Falso" },

  // std namespace (lo más usado en el curso)
  {
    label: "cout",
    kind: "variable",
    insert: "cout",
    detail: "std::ostream (salida estándar)",
  },
  {
    label: "cin",
    kind: "variable",
    insert: "cin",
    detail: "std::istream (entrada estándar)",
  },
  { label: "endl", kind: "variable", insert: "endl", detail: "Salto de línea + flush" },
  {
    label: "string",
    kind: "class",
    insert: "string",
    detail: "std::string — texto",
  },
  {
    label: "vector",
    kind: "class",
    insert: "vector<${1:int}>",
    detail: "std::vector — arreglo dinámico",
  },
  {
    label: "array",
    kind: "class",
    insert: "array<${1:int}, ${2:N}>",
    detail: "std::array — arreglo de tamaño fijo",
  },
  {
    label: "map",
    kind: "class",
    insert: "map<${1:string}, ${2:int}>",
    detail: "std::map — diccionario ordenado",
  },
  {
    label: "set",
    kind: "class",
    insert: "set<${1:int}>",
    detail: "std::set — conjunto único",
  },
  {
    label: "pair",
    kind: "class",
    insert: "pair<${1:int}, ${2:int}>",
    detail: "std::pair — dos valores",
  },
  { label: "size_t", kind: "type", insert: "size_t", detail: "Tipo de tamaño" },

  // Funciones estándar
  {
    label: "getline",
    kind: "function",
    insert: "getline(cin, ${1:line})",
    detail: "Lee una línea completa de stdin",
  },
  {
    label: "to_string",
    kind: "function",
    insert: "to_string(${1:value})",
    detail: "Número → string",
  },
  {
    label: "stoi",
    kind: "function",
    insert: "stoi(${1:str})",
    detail: "string → int",
  },
  {
    label: "sort",
    kind: "function",
    insert: "sort(${1:v}.begin(), ${1:v}.end())",
    detail: "Ordena un rango",
  },
  {
    label: "max",
    kind: "function",
    insert: "max(${1:a}, ${2:b})",
    detail: "Máximo de dos valores",
  },
  {
    label: "min",
    kind: "function",
    insert: "min(${1:a}, ${2:b})",
    detail: "Mínimo de dos valores",
  },
  {
    label: "abs",
    kind: "function",
    insert: "abs(${1:value})",
    detail: "Valor absoluto",
  },
  {
    label: "swap",
    kind: "function",
    insert: "swap(${1:a}, ${2:b})",
    detail: "Intercambia dos valores",
  },

  // Templates / esqueletos
  {
    label: "main",
    kind: "snippet",
    insert:
      "#include <iostream>\nusing namespace std;\n\nint main() {\n  $0\n  return 0;\n}",
    detail: "Esqueleto de programa",
    filterText: "main hello iostream",
  },
  {
    label: "include",
    kind: "snippet",
    insert: "#include <${1:iostream}>",
    detail: "Directiva de include",
  },
  {
    label: "iostream",
    kind: "snippet",
    insert: "#include <iostream>",
    detail: "Header de entrada/salida",
  },
  {
    label: "vectorh",
    kind: "snippet",
    insert: "#include <vector>",
    detail: "Header de std::vector",
  },
  {
    label: "stringh",
    kind: "snippet",
    insert: "#include <string>",
    detail: "Header de std::string",
  },
  {
    label: "using",
    kind: "snippet",
    insert: "using namespace std;",
    detail: "Evita escribir std::",
  },
  {
    label: "couts",
    kind: "snippet",
    insert: 'cout << "${1:texto}" << endl;',
    detail: "Imprime una línea",
  },
  {
    label: "cins",
    kind: "snippet",
    insert: "cin >> ${1:variable};",
    detail: "Lee una variable",
  },
];
