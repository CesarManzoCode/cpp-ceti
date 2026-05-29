import { Judge0Executor } from "./judge0";
import { PistonExecutor } from "./piston";
import { WandboxExecutor } from "./wandbox";
import type { CodeExecutor } from "./types";

export type { CodeExecutor, ExecutionRequest, ExecutionResult, TestCaseInput, TestCaseResult } from "./types";
export { buildFeedback } from "./feedback";

let cached: CodeExecutor | null = null;

/**
 * Devuelve la instancia única (singleton) del executor para la app.
 * El provider se elige por env var `CODE_EXECUTOR_PROVIDER`:
 *  - "wandbox"           → API pública de Wandbox (default, gratis, sin auth, estable)
 *  - "piston"            → API pública de Piston (whitelist desde feb 2026)
 *  - "piston-selfhosted" → Piston corriendo en tu propio servidor
 *  - "judge0-rapidapi"   → Judge0 vía RapidAPI (requiere tarjeta)
 *  - "judge0-selfhosted" → Judge0 en tu propio servidor (DigitalOcean/Hetzner)
 */
export function getCodeExecutor(): CodeExecutor {
  if (cached) return cached;

  const provider = process.env.CODE_EXECUTOR_PROVIDER ?? "wandbox";

  if (provider === "wandbox") {
    cached = new WandboxExecutor(
      process.env.WANDBOX_URL ?? "https://wandbox.org",
      {
        compiler: process.env.WANDBOX_COMPILER,
        compilerOptions: process.env.WANDBOX_COMPILER_OPTIONS,
      },
    );
    return cached;
  }

  if (provider === "piston") {
    cached = new PistonExecutor(
      process.env.PISTON_URL ?? "https://emkc.org/api/v2/piston",
      {
        version: process.env.PISTON_CPP_VERSION,
      },
    );
    return cached;
  }

  if (provider === "piston-selfhosted") {
    const url = process.env.PISTON_URL;
    if (!url) {
      throw new ExecutorConfigError(
        "PISTON_URL es obligatorio cuando CODE_EXECUTOR_PROVIDER es 'piston-selfhosted'",
      );
    }
    cached = new PistonExecutor(url, {
      version: process.env.PISTON_CPP_VERSION,
    });
    return cached;
  }

  const languageIdEnv = process.env.JUDGE0_CPP_LANGUAGE_ID;
  const languageId = languageIdEnv ? Number(languageIdEnv) : undefined;

  if (provider === "judge0-selfhosted") {
    const url = process.env.JUDGE0_SELFHOSTED_URL;
    if (!url) {
      throw new ExecutorConfigError(
        "JUDGE0_SELFHOSTED_URL es obligatorio cuando CODE_EXECUTOR_PROVIDER es 'judge0-selfhosted'",
      );
    }
    const headers: Record<string, string> = {};
    if (process.env.JUDGE0_AUTH_TOKEN) {
      headers["X-Auth-Token"] = process.env.JUDGE0_AUTH_TOKEN;
    }
    cached = new Judge0Executor(url, headers, { languageId });
    return cached;
  }

  if (provider === "judge0-rapidapi") {
    const key = process.env.JUDGE0_RAPIDAPI_KEY;
    const host = process.env.JUDGE0_RAPIDAPI_HOST ?? "judge0-ce.p.rapidapi.com";
    if (!key) {
      throw new ExecutorConfigError(
        "JUDGE0_RAPIDAPI_KEY es obligatorio cuando CODE_EXECUTOR_PROVIDER es 'judge0-rapidapi'",
      );
    }
    cached = new Judge0Executor(
      `https://${host}`,
      {
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": host,
      },
      { languageId },
    );
    return cached;
  }

  throw new ExecutorConfigError(`Provider de executor desconocido: ${provider}`);
}

export class ExecutorConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExecutorConfigError";
  }
}

/** Para testing: limpia el singleton (útil en hot reload de dev). */
export function resetCodeExecutor() {
  cached = null;
}
