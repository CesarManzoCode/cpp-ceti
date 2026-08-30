"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ActionError, withActionErrorHandling } from "@/lib/action-error";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { parseOrThrow } from "@/lib/validation";

/**
 * Triage de reportes y feedback.
 *
 * TODA acción llama `requireAdmin()` por su cuenta: proteger el layout no
 * protege una Server Action, que se puede invocar directamente por POST.
 *
 * La resolución guarda evidencia (nota, issue, PR y sellos de tiempo) para
 * que dentro de dos años se pueda reconstruir la cadena
 * feedback → decisión → issue/PR → cambio → resultado.
 */

const httpsUrl = z
  .string()
  .trim()
  .max(300)
  .refine(
    (value) => value === "" || /^https:\/\/[\w.-]+\/\S*$/.test(value),
    "Debe ser una URL https válida",
  );

const updateSchema = z.object({
  kind: z.enum(["bug", "feedback"]),
  id: z.string().min(1),
  status: z.enum(["open", "triaged", "resolved", "duplicate", "wontfix"]),
  resolutionNote: z.string().trim().max(1_000).optional(),
  issueUrl: httpsUrl.optional(),
  prUrl: httpsUrl.optional(),
});

export type ReportKind = "bug" | "feedback";
export type ReportStatusInput =
  | "open"
  | "triaged"
  | "resolved"
  | "duplicate"
  | "wontfix";

/** Estados que cierran un reporte (fijan `resolvedAt`). */
const CLOSING = new Set(["resolved", "duplicate", "wontfix"]);

export const updateReportStatus = withActionErrorHandling(
  "updateReportStatus",
  async (input: {
    kind: ReportKind;
    id: string;
    status: ReportStatusInput;
    resolutionNote?: string;
    issueUrl?: string;
    prUrl?: string;
  }): Promise<{ ok: true }> => {
    const parsed = parseOrThrow(updateSchema, input);
    const admin = await requireAdmin();

    const now = new Date();
    const data = {
      status: parsed.status,
      resolutionNote: emptyToNull(parsed.resolutionNote),
      issueUrl: emptyToNull(parsed.issueUrl),
      prUrl: emptyToNull(parsed.prUrl),
      handledById: admin.userId,
      // `triagedAt` marca la primera vez que alguien lo miró; no se pisa.
      ...(parsed.status === "open" ? {} : { triagedAt: now }),
      resolvedAt: CLOSING.has(parsed.status) ? now : null,
    };

    if (parsed.kind === "bug") {
      const existing = await db.bugReport.findUnique({
        where: { id: parsed.id },
        select: { triagedAt: true },
      });
      if (!existing) throw new ActionError("Reporte no encontrado");
      await db.bugReport.update({
        where: { id: parsed.id },
        data: { ...data, triagedAt: existing.triagedAt ?? data.triagedAt },
      });
    } else {
      const existing = await db.feedback.findUnique({
        where: { id: parsed.id },
        select: { triagedAt: true },
      });
      if (!existing) throw new ActionError("Feedback no encontrado");
      await db.feedback.update({
        where: { id: parsed.id },
        data: { ...data, triagedAt: existing.triagedAt ?? data.triagedAt },
      });
    }

    revalidatePath("/app/admin/reportes");
    return { ok: true };
  },
);

function emptyToNull(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
