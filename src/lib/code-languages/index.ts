// =====================================================================
// Registro central de lenguajes y perfiles de ejecución.
//
// Este módulo es DATO PLANO y server-safe: no importa Monaco, ni React,
// ni nada del cliente. Lo consumen el seed, el executor, las rutas y la
// UI. Cualquier "¿qué lenguaje es esto?" se responde aquí y NUNCA con
// un `if (slug.startsWith("csharp"))` ni leyendo un fence de markdown.
//
// El conjunto es deliberadamente pequeño. Agregar un tercer lenguaje
// cuesta: una entrada aquí, un valor del enum `ProgrammingLanguage` con
// su migración, capacidad del provider, diagnósticos y contenido. No es
// un marketplace de compiladores: es una lista corta y controlada.
// =====================================================================

/** Lenguajes soportados por la plataforma. */
export type LanguageId = "cpp" | "csharp" | "sql";

/**
 * Perfil de ejecución: la combinación exacta de lenguaje + toolchain +
 * versión con la que se compila y califica. El `Course` es la fuente de
 * verdad de este valor; el cliente jamás lo elige.
 */
export type ExecutionProfileId =
  | "cpp17-wandbox"
  | "csharp-mono-6.12"
  | "sql-sqlite3-wandbox";

export interface LanguageProfile {
  id: LanguageId;
  /** Etiqueta visible (badges, lectores de pantalla). */
  label: string;
  /** Identificador de lenguaje de Monaco. */
  monacoLanguage: "cpp" | "csharp" | "sql";
  /** Fences de markdown que representan a este lenguaje. */
  markdownFences: readonly string[];
  extension: ".cpp" | ".cs" | ".sql";
  defaultFileName: "main.cpp" | "Program.cs" | "main.sql";
  /** Perfiles de ejecución válidos para este lenguaje. */
  executionProfiles: readonly ExecutionProfileId[];
}

export const LANGUAGE_PROFILES = {
  cpp: {
    id: "cpp",
    label: "C++",
    monacoLanguage: "cpp",
    markdownFences: ["cpp", "c++"],
    extension: ".cpp",
    defaultFileName: "main.cpp",
    executionProfiles: ["cpp17-wandbox"],
  },
  csharp: {
    id: "csharp",
    label: "C#",
    monacoLanguage: "csharp",
    markdownFences: ["csharp", "cs"],
    extension: ".cs",
    defaultFileName: "Program.cs",
    executionProfiles: ["csharp-mono-6.12"],
  },
  sql: {
    id: "sql",
    label: "SQL",
    monacoLanguage: "sql",
    markdownFences: ["sql"],
    extension: ".sql",
    defaultFileName: "main.sql",
    executionProfiles: ["sql-sqlite3-wandbox"],
  },
} as const satisfies Record<LanguageId, LanguageProfile>;

export const LANGUAGE_IDS = Object.keys(LANGUAGE_PROFILES) as LanguageId[];

export const EXECUTION_PROFILE_IDS: ExecutionProfileId[] = [
  "cpp17-wandbox",
  "csharp-mono-6.12",
  "sql-sqlite3-wandbox",
];

/** Lenguaje al que pertenece cada perfil de ejecución. */
const PROFILE_LANGUAGE: Record<ExecutionProfileId, LanguageId> = {
  "cpp17-wandbox": "cpp",
  "csharp-mono-6.12": "csharp",
  "sql-sqlite3-wandbox": "sql",
};

export function isLanguageId(value: unknown): value is LanguageId {
  return typeof value === "string" && value in LANGUAGE_PROFILES;
}

export function isExecutionProfileId(
  value: unknown,
): value is ExecutionProfileId {
  return (
    typeof value === "string" &&
    (EXECUTION_PROFILE_IDS as string[]).includes(value)
  );
}

/**
 * Perfil del lenguaje. Lanza si el valor no está registrado: un valor
 * desconocido en la base de datos es un error de configuración, NO un
 * motivo para caer a C++ por default.
 */
export function getLanguageProfile(language: LanguageId): LanguageProfile {
  const profile = LANGUAGE_PROFILES[language];
  if (!profile) {
    throw new UnknownLanguageError(`Lenguaje no registrado: ${String(language)}`);
  }
  return profile;
}

/** Lenguaje de un perfil de ejecución. Lanza si el perfil no existe. */
export function languageOfProfile(profile: ExecutionProfileId): LanguageId {
  const language = PROFILE_LANGUAGE[profile];
  if (!language) {
    throw new UnknownLanguageError(
      `Perfil de ejecución no registrado: ${String(profile)}`,
    );
  }
  return language;
}

/** ¿El perfil pertenece al lenguaje? Falso también si alguno no existe. */
export function isCompatible(
  language: unknown,
  profile: unknown,
): language is LanguageId {
  if (!isLanguageId(language) || !isExecutionProfileId(profile)) return false;
  return (
    LANGUAGE_PROFILES[language].executionProfiles as readonly string[]
  ).includes(profile);
}

/**
 * Valida el par (lenguaje, perfil) y lo devuelve tipado. Úsalo en el
 * borde: seed, resolución de recursos y configuración del executor.
 * Falla cerrado — nunca devuelve un default.
 */
export function assertLanguagePair(
  language: unknown,
  profile: unknown,
  context: string,
): { language: LanguageId; executionProfile: ExecutionProfileId } {
  if (!isLanguageId(language)) {
    throw new UnknownLanguageError(
      `${context}: lenguaje desconocido (${String(language)})`,
    );
  }
  if (!isExecutionProfileId(profile)) {
    throw new UnknownLanguageError(
      `${context}: perfil de ejecución desconocido (${String(profile)})`,
    );
  }
  if (!isCompatible(language, profile)) {
    throw new UnknownLanguageError(
      `${context}: el perfil ${profile} no pertenece al lenguaje ${language}`,
    );
  }
  return { language, executionProfile: profile };
}

/** Lenguaje cuyo fence de markdown coincide, o null. */
export function languageFromFence(fence: string | undefined): LanguageId | null {
  if (!fence) return null;
  const normalized = fence.trim().toLowerCase();
  for (const id of LANGUAGE_IDS) {
    if ((LANGUAGE_PROFILES[id].markdownFences as readonly string[]).includes(normalized)) {
      return id;
    }
  }
  return null;
}

/**
 * Error de configuración de lenguaje/perfil. Se traduce a un mensaje
 * neutral ("Entorno de ejecución no disponible") en el borde HTTP; el
 * detalle real sólo va al log del servidor.
 */
export class UnknownLanguageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnknownLanguageError";
  }
}
