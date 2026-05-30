import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock prisma client antes de importar nada que dependa de él.
vi.mock("@/lib/db", () => ({
  db: {
    rateLimit: {
      upsert: vi.fn(),
    },
  },
}));

import { db } from "@/lib/db";
import { RateLimitError, enforceRateLimit } from "@/lib/rate-limit";

const upsert = db.rateLimit.upsert as ReturnType<typeof vi.fn>;

describe("enforceRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Fija el reloj para que startOfWindow sea determinista.
    vi.setSystemTime(new Date("2026-05-29T12:34:56Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    upsert.mockReset();
  });

  it("permite el primer hit (count=1) sin lanzar", async () => {
    upsert.mockResolvedValueOnce({ count: 1 });
    await expect(enforceRateLimit("user-a", "run")).resolves.toBeUndefined();
    expect(upsert).toHaveBeenCalledOnce();
  });

  it("permite el último hit dentro del límite", async () => {
    // límite de "run" = 30 → count 30 todavía pasa
    upsert.mockResolvedValueOnce({ count: 30 });
    await expect(enforceRateLimit("user-a", "run")).resolves.toBeUndefined();
  });

  it("lanza RateLimitError cuando count > límite", async () => {
    upsert.mockResolvedValueOnce({ count: 31 });
    await expect(
      enforceRateLimit("user-a", "run"),
    ).rejects.toBeInstanceOf(RateLimitError);
  });

  it("RateLimitError trae retryAfterSec ≥ 1", async () => {
    upsert.mockResolvedValueOnce({ count: 99 });
    try {
      await enforceRateLimit("user-a", "submit-practice");
      throw new Error("debió haber lanzado");
    } catch (err) {
      expect(err).toBeInstanceOf(RateLimitError);
      expect((err as RateLimitError).retryAfterSec).toBeGreaterThanOrEqual(1);
      expect((err as RateLimitError).retryAfterSec).toBeLessThanOrEqual(60);
    }
  });

  it("upsert usa el endpoint correcto", async () => {
    upsert.mockResolvedValueOnce({ count: 1 });
    await enforceRateLimit("user-a", "submit-lesson-exercise");
    const call = upsert.mock.calls[0][0];
    expect(call.where.userId_endpoint_windowStart.endpoint).toBe(
      "submit-lesson-exercise",
    );
    expect(call.where.userId_endpoint_windowStart.userId).toBe("user-a");
  });
});
