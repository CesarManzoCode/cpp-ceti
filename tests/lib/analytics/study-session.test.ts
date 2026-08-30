import { beforeEach, describe, expect, it } from "vitest";

import {
  MAX_HEARTBEAT_CREDIT_MS,
  SESSION_IDLE_TIMEOUT_MS,
  closeStaleStudySessions,
  creditForGap,
  effectiveEndedAt,
  endStudySession,
  heartbeatStudySession,
  isStale,
  startStudySession,
} from "@/lib/analytics/study-session";
import { createFakeDb, type FakeDb } from "../../helpers/fake-prisma";

const db = createFakeDb();
const asPrisma = db as unknown as Parameters<typeof startStudySession>[0];

beforeEach(() => {
  (db as FakeDb).reset();
});

describe("crédito de tiempo activo", () => {
  it("acredita el hueco entre latidos", () => {
    expect(creditForGap(30_000)).toBe(30_000);
  });

  it("acota un hueco grande: una pestaña olvidada no suma horas", () => {
    expect(creditForGap(3 * 60 * 60 * 1000)).toBe(MAX_HEARTBEAT_CREDIT_MS);
  });

  it("nunca acredita tiempo negativo ni basura", () => {
    expect(creditForGap(-5_000)).toBe(0);
    expect(creditForGap(Number.NaN)).toBe(0);
  });
});

describe("sesiones huérfanas", () => {
  const lastPingAt = new Date("2026-08-30T10:00:00.000Z");

  it("una sesión cerrada no es huérfana", () => {
    const endedAt = new Date("2026-08-30T10:05:00.000Z");
    expect(
      isStale({ endedAt, lastPingAt }, new Date("2026-08-30T18:00:00.000Z")),
    ).toBe(false);
  });

  it("una sesión abierta sin latidos recientes sí lo es", () => {
    const now = new Date(lastPingAt.getTime() + SESSION_IDLE_TIMEOUT_MS + 1);
    expect(isStale({ endedAt: null, lastPingAt }, now)).toBe(true);
  });

  it("el fin efectivo de una sesión abierta es su último latido, no ahora", () => {
    expect(effectiveEndedAt({ endedAt: null, lastPingAt })).toEqual(lastPingAt);
  });

  it("cierra huérfanas EN su último latido, no en now()", async () => {
    await closeStaleStudySessions(asPrisma, "user_1");
    const raw = (db as FakeDb).rawQueries.at(-1);
    expect(raw?.sql).toContain('"endedAt" = GREATEST("lastPingAt", "startedAt")');
    expect(raw?.sql).toContain("'expired'");
    expect(raw?.sql).toContain('"endedAt" IS NULL');
    expect(raw?.values[0]).toBe("user_1");
  });
});

describe("startStudySession", () => {
  it("es idempotente por clientKey: dos llamadas, una sesión", async () => {
    const first = await startStudySession(asPrisma, {
      userId: "user_1",
      surface: "lesson",
      resourceId: "lesson_1",
      clientKey: "key-abc",
    });
    const second = await startStudySession(asPrisma, {
      userId: "user_1",
      surface: "lesson",
      resourceId: "lesson_1",
      clientKey: "key-abc",
    });

    expect(first.id).toBe(second.id);
    expect(first.created).toBe(true);
    expect(second.created).toBe(false);
    expect((db as FakeDb).table("studySession")).toHaveLength(1);
  });

  it("dos llamadas concurrentes con la misma clave no duplican la sesión", async () => {
    const [a, b] = await Promise.all([
      startStudySession(asPrisma, {
        userId: "user_1",
        surface: "practice",
        resourceId: "p1",
        clientKey: "key-race",
      }),
      startStudySession(asPrisma, {
        userId: "user_1",
        surface: "practice",
        resourceId: "p1",
        clientKey: "key-race",
      }),
    ]);
    expect(a.id).toBe(b.id);
    expect((db as FakeDb).table("studySession")).toHaveLength(1);
  });

  it("claves distintas (otra visita) sí abren sesiones distintas", async () => {
    const first = await startStudySession(asPrisma, {
      userId: "user_1",
      surface: "lesson",
      resourceId: "lesson_1",
      clientKey: "key-1",
    });
    const second = await startStudySession(asPrisma, {
      userId: "user_1",
      surface: "lesson",
      resourceId: "lesson_1",
      clientKey: "key-2",
    });
    expect(first.id).not.toBe(second.id);
  });

  it("dos usuarios pueden usar la misma clave sin colisionar", async () => {
    const a = await startStudySession(asPrisma, {
      userId: "user_1",
      surface: "lesson",
      resourceId: "lesson_1",
      clientKey: "same",
    });
    const b = await startStudySession(asPrisma, {
      userId: "user_2",
      surface: "lesson",
      resourceId: "lesson_1",
      clientKey: "same",
    });
    expect(a.id).not.toBe(b.id);
  });
});

describe("heartbeat y cierre", () => {
  it("el latido sólo toca sesiones abiertas del propio usuario", async () => {
    await heartbeatStudySession(asPrisma, "user_1", "sess_1");
    const raw = (db as FakeDb).rawQueries.at(-1);
    expect(raw?.sql).toContain('"lastPingAt" = now()');
    expect(raw?.sql).toContain('"userId" =');
    expect(raw?.sql).toContain('"endedAt" IS NULL');
    expect(raw?.values).toContain("user_1");
    expect(raw?.values).toContain("sess_1");
  });

  it("el crédito del latido está acotado en el propio SQL", async () => {
    await heartbeatStudySession(asPrisma, "user_1", "sess_1");
    const raw = (db as FakeDb).rawQueries.at(-1);
    expect(raw?.sql).toContain("LEAST");
    expect(raw?.sql).toContain("GREATEST");
    expect(raw?.values).toContain(MAX_HEARTBEAT_CREDIT_MS);
  });

  it("el cierre es idempotente por construcción (WHERE endedAt IS NULL)", async () => {
    await endStudySession(asPrisma, "user_1", "sess_1");
    const raw = (db as FakeDb).rawQueries.at(-1);
    expect(raw?.sql).toContain('"endedAt" = now()');
    expect(raw?.sql).toContain("'closed'");
    expect(raw?.sql).toContain('"endedAt" IS NULL');
  });
});
