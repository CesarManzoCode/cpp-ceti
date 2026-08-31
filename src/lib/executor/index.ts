import { env } from "@/env";
import type { ExecutionProfileId } from "@/lib/code-languages";

import { Judge0Executor } from "./judge0";
import { PistonExecutor } from "./piston";
import { WandboxExecutor } from "./wandbox";
import type { CodeExecutor } from "./types";

export type {
  CodeExecutor,
  ExecutionRequest,
  ExecutionResult,
  ExecutionStatus,
  TestCaseInput,
  TestCaseResult,
  TestRunRequest,
} from "./types";
export { ExecutorProfileUnavailableError } from "./types";
export { buildFeedback } from "./feedback";
export { normalizeOutput } from "./normalize";

let cached: CodeExecutor | null = null;

/**
 * Devuelve la instancia única (singleton) del executor para la app.
 *
 * El SINGLETON es del proveedor; el LENGUAJE no. Cada llamada lleva su
 * `profileId` y el adapter arma la petición correspondiente. Por eso dos
 * peticiones concurrentes (una C++ y una C#) no pueden pisarse: no hay
 * estado de lenguaje en el objeto.
 *
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
      // Los nombres genéricos siguen siendo alias válidos del perfil de C++
      // para no romper despliegues que ya dependen de ellos.
      "cpp17-wandbox": {
        compiler: env.WANDBOX_CPP_COMPILER ?? env.WANDBOX_COMPILER,
        compilerOptions:
          env.WANDBOX_CPP_OPTIONS ?? env.WANDBOX_COMPILER_OPTIONS,
      },
      "csharp-mono-6.12": {
        compiler: env.WANDBOX_CSHARP_COMPILER,
        compilerOptions: env.WANDBOX_CSHARP_OPTIONS,
      },
    });
    return cached;
  }

  if (provider === "piston" || provider === "piston-selfhosted") {
    // env validó que PISTON_URL exista para el provider self-hosted.
    const baseUrl =
      provider === "piston-selfhosted"
        ? env.PISTON_URL!
        : (env.PISTON_URL ?? "https://emkc.org/api/v2/piston");
    cached = new PistonExecutor(baseUrl, {
      "cpp17-wandbox": { version: env.PISTON_CPP_VERSION },
      "csharp-mono-6.12": { version: env.PISTON_CSHARP_VERSION },
    });
    return cached;
  }

  const judge0Profiles = {
    "cpp17-wandbox": {
      languageId: env.JUDGE0_CPP_LANGUAGE_ID
        ? Number(env.JUDGE0_CPP_LANGUAGE_ID)
        : undefined,
    },
    "csharp-mono-6.12": {
      languageId: env.JUDGE0_CSHARP_LANGUAGE_ID
        ? Number(env.JUDGE0_CSHARP_LANGUAGE_ID)
        : undefined,
    },
  };

  if (provider === "judge0-selfhosted") {
    const headers: Record<string, string> = {};
    if (env.JUDGE0_AUTH_TOKEN) {
      headers["X-Auth-Token"] = env.JUDGE0_AUTH_TOKEN;
    }
    cached = new Judge0Executor(
      env.JUDGE0_SELFHOSTED_URL!,
      headers,
      judge0Profiles,
    );
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
      judge0Profiles,
    );
    return cached;
  }

  throw new ExecutorConfigError(`Provider de executor desconocido: ${provider}`);
}

/**
 * Executor capaz de correr el perfil pedido, o error.
 *
 * Un proveedor sólo puede relevar a otro para el MISMO perfil de ejecución.
 * Nunca hay relevo entre lenguajes ni entre versiones distintas de C#: si
 * el proveedor configurado no puede con el perfil, el alumno ve un error de
 * entorno y nadie califica nada.
 */
export function getExecutorForProfile(
  profileId: ExecutionProfileId,
): CodeExecutor {
  const executor = getCodeExecutor();
  if (!executor.supportsProfile(profileId)) {
    throw new ExecutorConfigError(
      `El proveedor configurado (${env.CODE_EXECUTOR_PROVIDER}) no soporta el ` +
        `perfil de ejecución "${profileId}".`,
    );
  }
  return executor;
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
