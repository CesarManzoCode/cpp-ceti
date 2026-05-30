import { env } from "@/env";

// Logger estructurado sin dependencias. En producción emite JSON por línea
// (ingerible por Vercel/Datadog/Sentry). En dev pinta legible.
//
// Uso:
//   logger.info({ userId, action }, "submitted exercise");
//   logger.error({ err, route: "/api/run" }, "executor failed");

type Level = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const MIN_LEVEL: Level = env.NODE_ENV === "production" ? "info" : "debug";

interface LogContext {
  [key: string]: unknown;
}

function serializeError(err: unknown): Record<string, unknown> {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: env.NODE_ENV === "production" ? undefined : err.stack,
      ...(err.cause ? { cause: serializeError(err.cause) } : {}),
    };
  }
  return { value: String(err) };
}

function emit(level: Level, context: LogContext | undefined, message: string) {
  if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[MIN_LEVEL]) return;

  const payload: Record<string, unknown> = {
    level,
    msg: message,
    time: new Date().toISOString(),
  };

  if (context) {
    for (const [k, v] of Object.entries(context)) {
      payload[k] = k === "err" ? serializeError(v) : v;
    }
  }

  const line =
    env.NODE_ENV === "production"
      ? JSON.stringify(payload)
      : prettyLine(level, message, payload);

  if (level === "error" || level === "warn") {
    console.error(line);
  } else {
    console.log(line);
  }
}

function prettyLine(
  level: Level,
  message: string,
  payload: Record<string, unknown>,
): string {
  const tag = `[${level.toUpperCase()}]`;
  const rest = { ...payload };
  delete rest.level;
  delete rest.msg;
  delete rest.time;
  const ctx = Object.keys(rest).length > 0 ? ` ${JSON.stringify(rest)}` : "";
  return `${tag} ${message}${ctx}`;
}

export const logger = {
  debug(context: LogContext | string, message?: string) {
    if (typeof context === "string") emit("debug", undefined, context);
    else emit("debug", context, message ?? "");
  },
  info(context: LogContext | string, message?: string) {
    if (typeof context === "string") emit("info", undefined, context);
    else emit("info", context, message ?? "");
  },
  warn(context: LogContext | string, message?: string) {
    if (typeof context === "string") emit("warn", undefined, context);
    else emit("warn", context, message ?? "");
  },
  error(context: LogContext | string, message?: string) {
    if (typeof context === "string") emit("error", undefined, context);
    else emit("error", context, message ?? "");
  },
};

export type Logger = typeof logger;
