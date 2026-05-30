import { env } from "@/env";

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

  const provider = env.CODE_EXECUTOR_PROVIDER;

  if (provider === "wandbox") {
    cached = new WandboxExecutor(env.WANDBOX_URL ?? "https://wandbox.org", {
      compiler: env.WANDBOX_COMPILER,
      compilerOptions: env.WANDBOX_COMPILER_OPTIONS,
    });
    return cached;
  }

  if (provider === "piston") {
    cached = new PistonExecutor(
      env.PISTON_URL ?? "https://emkc.org/api/v2/piston",
      { version: env.PISTON_CPP_VERSION },
    );
    return cached;
  }

  if (provider === "piston-selfhosted") {
    // env validó que PISTON_URL exista para este provider.
    cached = new PistonExecutor(env.PISTON_URL!, {
      version: env.PISTON_CPP_VERSION,
    });
    return cached;
  }

  const languageId = env.JUDGE0_CPP_LANGUAGE_ID
    ? Number(env.JUDGE0_CPP_LANGUAGE_ID)
    : undefined;

  if (provider === "judge0-selfhosted") {
    const headers: Record<string, string> = {};
    if (env.JUDGE0_AUTH_TOKEN) {
      headers["X-Auth-Token"] = env.JUDGE0_AUTH_TOKEN;
    }
    cached = new Judge0Executor(env.JUDGE0_SELFHOSTED_URL!, headers, {
      languageId,
    });
    return cached;
  }

  if (provider === "judge0-rapidapi") {
    const host = env.JUDGE0_RAPIDAPI_HOST ?? "judge0-ce.p.rapidapi.com";
    cached = new Judge0Executor(
      `https://${host}`,
      {
        "X-RapidAPI-Key": env.JUDGE0_RAPIDAPI_KEY!,
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
