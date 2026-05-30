import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ActionError,
  isUniqueViolation,
  withActionErrorHandling,
} from "@/lib/action-error";
import { logger } from "@/lib/logger";
import { RateLimitError } from "@/lib/rate-limit";

describe("withActionErrorHandling", () => {
  beforeEach(() => {
    // restoreMocks de vitest.config restablece spies entre tests, así que
    // re-aplicamos el silencio del logger en cada caso. Después del spy,
    // `logger.error` ES el mock; las aserciones van directas sobre él.
    vi.spyOn(logger, "error").mockImplementation(() => {});
  });

  it("devuelve el resultado cuando el callback no lanza", async () => {
    const wrapped = withActionErrorHandling("test", async (n: number) => n * 2);
    await expect(wrapped(21)).resolves.toBe(42);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("re-lanza ActionError sin loguear", async () => {
    const wrapped = withActionErrorHandling("test", async () => {
      throw new ActionError("mensaje listo para usuario");
    });
    await expect(wrapped()).rejects.toBeInstanceOf(ActionError);
    await expect(wrapped()).rejects.toHaveProperty(
      "message",
      "mensaje listo para usuario",
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("convierte RateLimitError a ActionError preservando el mensaje", async () => {
    const wrapped = withActionErrorHandling("test", async () => {
      throw new RateLimitError("Demasiado rápido, espera 5s.", 5);
    });
    await expect(wrapped()).rejects.toMatchObject({
      name: "ActionError",
      message: "Demasiado rápido, espera 5s.",
    });
  });

  it("propaga UNAUTHORIZED tal cual (para que lo manejen layouts)", async () => {
    const wrapped = withActionErrorHandling("test", async () => {
      throw new Error("UNAUTHORIZED");
    });
    await expect(wrapped()).rejects.toMatchObject({
      message: "UNAUTHORIZED",
    });
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("oculta errores random detrás de un mensaje genérico + log full", async () => {
    const wrapped = withActionErrorHandling("test-action", async () => {
      throw new Error("internal: row exploded with sensitive details");
    });
    const err = await wrapped().catch((e) => e as ActionError);
    expect(err).toBeInstanceOf(ActionError);
    expect(err.message).not.toContain("sensitive");
    expect(logger.error).toHaveBeenCalledOnce();
    const spy = vi.mocked(logger.error);
    const ctx = spy.mock.calls[0]?.[0] as { action?: string };
    expect(ctx?.action).toBe("test-action");
  });

  it("loguea + sanea PrismaClientKnownRequestError con código", async () => {
    const wrapped = withActionErrorHandling("test", async () => {
      throw new Prisma.PrismaClientKnownRequestError("boom", {
        code: "P2002",
        clientVersion: "test",
      });
    });
    const err = await wrapped().catch((e) => e as ActionError);
    expect(err).toBeInstanceOf(ActionError);
    expect(err.message).not.toBe("boom");
    expect(logger.error).toHaveBeenCalledOnce();
    const spy = vi.mocked(logger.error);
    const ctx = spy.mock.calls[0]?.[0] as { code?: string };
    expect(ctx?.code).toBe("P2002");
  });
});

describe("isUniqueViolation", () => {
  it("detecta P2002", () => {
    const err = new Prisma.PrismaClientKnownRequestError("dup", {
      code: "P2002",
      clientVersion: "test",
    });
    expect(isUniqueViolation(err)).toBe(true);
  });

  it("no detecta otros códigos Prisma", () => {
    const err = new Prisma.PrismaClientKnownRequestError("nope", {
      code: "P2003",
      clientVersion: "test",
    });
    expect(isUniqueViolation(err)).toBe(false);
  });

  it("no detecta Errors normales", () => {
    expect(isUniqueViolation(new Error("nope"))).toBe(false);
    expect(isUniqueViolation("string")).toBe(false);
    expect(isUniqueViolation(null)).toBe(false);
  });
});
