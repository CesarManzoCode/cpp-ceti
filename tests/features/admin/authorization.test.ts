import { beforeEach, describe, expect, it, vi } from "vitest";

import type { FakeDb } from "../../helpers/fake-prisma";

const getSession = vi.hoisted(() => vi.fn());

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));
vi.mock("@/lib/db", async () => {
  const { createFakeDb } = await import("../../helpers/fake-prisma");
  return { db: createFakeDb() };
});
vi.mock("@/lib/get-session", () => ({ getSession }));
vi.mock("@/env", () => ({
  env: { ADMIN_EMAILS: "jefa@ceti.mx", NODE_ENV: "test" },
  googleAuthEnabled: false,
}));

import { updateReportStatus } from "@/features/admin/actions";
import { getAdminContext, requireAdmin, requireAdminPage } from "@/lib/admin";
import { db } from "@/lib/db";

const fake = db as unknown as FakeDb;

beforeEach(() => {
  fake.reset();
  fake.seed("user", [
    { id: "student", email: "alumno@ceti.mx", role: "student" },
    { id: "admin", email: "admin@ceti.mx", role: "admin" },
    // Rol de alumno, pero está en ADMIN_EMAILS (arranque en frío).
    { id: "boss", email: "jefa@ceti.mx", role: "student" },
  ]);
  fake.seed("bugReport", [
    { id: "bug_1", userId: "student", message: "typo", status: "open", triagedAt: null },
  ]);
  getSession.mockReset();
});

describe("autorización del panel", () => {
  it("un alumno no es admin", async () => {
    getSession.mockResolvedValue({ user: { id: "student" } });
    expect(await getAdminContext()).toBeNull();
    await expect(requireAdmin()).rejects.toThrow(/acceso/i);
  });

  it("sin sesión tampoco", async () => {
    getSession.mockResolvedValue(null);
    expect(await getAdminContext()).toBeNull();
  });

  it("el rol admin de la BD manda", async () => {
    getSession.mockResolvedValue({ user: { id: "admin" } });
    expect(await getAdminContext()).toEqual({
      userId: "admin",
      email: "admin@ceti.mx",
    });
  });

  it("ADMIN_EMAILS sirve para el primer admin", async () => {
    getSession.mockResolvedValue({ user: { id: "boss" } });
    expect((await getAdminContext())?.userId).toBe("boss");
  });

  it("el rol se lee de la BD, no del payload de la sesión", async () => {
    // Una cookie vieja podría afirmar cualquier cosa: da igual.
    getSession.mockResolvedValue({
      user: { id: "student", role: "admin", email: "admin@ceti.mx" },
    });
    expect(await getAdminContext()).toBeNull();
  });

  it("un usuario borrado no pasa aunque tenga sesión", async () => {
    getSession.mockResolvedValue({ user: { id: "fantasma" } });
    expect(await getAdminContext()).toBeNull();
  });

  it("las páginas responden 404 a quien no es admin", async () => {
    getSession.mockResolvedValue({ user: { id: "student" } });
    await expect(requireAdminPage()).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("triage de reportes", () => {
  it("una Server Action de admin NO se puede invocar como alumno", async () => {
    getSession.mockResolvedValue({ user: { id: "student" } });
    await expect(
      updateReportStatus({ kind: "bug", id: "bug_1", status: "resolved" }),
    ).rejects.toThrow(/acceso/i);
    expect(fake.table("bugReport")[0].status).toBe("open");
  });

  it("el admin resuelve y queda registrada la evidencia", async () => {
    getSession.mockResolvedValue({ user: { id: "admin" } });
    await updateReportStatus({
      kind: "bug",
      id: "bug_1",
      status: "resolved",
      resolutionNote: "Corregido el test 2",
      issueUrl: "https://github.com/org/repo/issues/1",
      prUrl: "https://github.com/org/repo/pull/2",
    });

    const row = fake.table("bugReport")[0];
    expect(row.status).toBe("resolved");
    expect(row.handledById).toBe("admin");
    expect(row.resolutionNote).toBe("Corregido el test 2");
    expect(row.issueUrl).toBe("https://github.com/org/repo/issues/1");
    expect(row.resolvedAt).toBeInstanceOf(Date);
    expect(row.triagedAt).toBeInstanceOf(Date);
  });

  it("rechaza URLs que no son https y no toca el reporte", async () => {
    getSession.mockResolvedValue({ user: { id: "admin" } });
    await expect(
      updateReportStatus({
        kind: "bug",
        id: "bug_1",
        status: "triaged",
        issueUrl: "javascript:alert(1)",
      }),
    ).rejects.toThrow();
    const row = fake.table("bugReport")[0];
    expect(row.status).toBe("open");
    expect(row.issueUrl).toBeUndefined();
  });

  it("reabrir limpia la fecha de cierre pero conserva el triage", async () => {
    getSession.mockResolvedValue({ user: { id: "admin" } });
    await updateReportStatus({ kind: "bug", id: "bug_1", status: "resolved" });
    const triagedAt = fake.table("bugReport")[0].triagedAt;
    await updateReportStatus({ kind: "bug", id: "bug_1", status: "open" });

    const row = fake.table("bugReport")[0];
    expect(row.status).toBe("open");
    expect(row.resolvedAt).toBeNull();
    expect(row.triagedAt).toEqual(triagedAt);
  });

  it("una actualización parcial no borra la evidencia ya guardada", async () => {
    getSession.mockResolvedValue({ user: { id: "admin" } });
    await updateReportStatus({
      kind: "bug",
      id: "bug_1",
      status: "resolved",
      resolutionNote: "Corregido",
      issueUrl: "https://github.com/org/repo/issues/1",
    });
    // Cambiar sólo el estado no puede tirar la nota ni el issue.
    await updateReportStatus({ kind: "bug", id: "bug_1", status: "triaged" });

    const row = fake.table("bugReport")[0];
    expect(row.resolutionNote).toBe("Corregido");
    expect(row.issueUrl).toBe("https://github.com/org/repo/issues/1");
  });

  it("un string vacío sí limpia el campo (borrado explícito desde la UI)", async () => {
    getSession.mockResolvedValue({ user: { id: "admin" } });
    await updateReportStatus({
      kind: "bug",
      id: "bug_1",
      status: "triaged",
      resolutionNote: "Nota vieja",
    });
    await updateReportStatus({
      kind: "bug",
      id: "bug_1",
      status: "triaged",
      resolutionNote: "",
    });
    expect(fake.table("bugReport")[0].resolutionNote).toBeNull();
  });

  it("un reporte inexistente no revienta con un error interno", async () => {
    getSession.mockResolvedValue({ user: { id: "admin" } });
    await expect(
      updateReportStatus({ kind: "bug", id: "nope", status: "resolved" }),
    ).rejects.toThrow(/no encontrado/i);
  });
});
