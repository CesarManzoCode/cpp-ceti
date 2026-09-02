"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ActionError, withActionErrorHandling } from "@/lib/action-error";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/get-session";
import { logger } from "@/lib/logger";
import { cuidSchema, parseOrThrow } from "@/lib/validation";

import { normalizeAcademicGroup } from "./lib/group";

const updateAcademicProfileSchema = z.object({
  // `null` limpia la identidad académica por completo.
  academicOfferingId: cuidSchema.nullable(),
  academicSemester: z.number().int().nullable(),
  academicGroup: z.string().max(60).nullable(),
});

/**
 * Actualiza (o limpia) la identidad académica del usuario actual. El
 * servidor SIEMPRE revalida `academicOfferingId` contra el catálogo real —
 * nunca confía en semesterCount ni en nombres que pudiera mandar el
 * cliente — y aplica las invariantes del contrato antes de tocar la fila:
 *
 *   - offering y semester van juntos (ambos null o ambos presentes)
 *   - semester en [1, offering.semesterCount]
 *   - group sólo con offering+semester, normalizado (trim/colapsa/upper/≤20)
 *
 * El CHECK de Postgres (`user_academic_*`) es la red de seguridad final,
 * pero estos mensajes son los que ve el alumno.
 */
export const updateAcademicProfile = withActionErrorHandling(
  "updateAcademicProfile",
  async (input: {
    academicOfferingId: string | null;
    academicSemester: number | null;
    academicGroup: string | null;
  }): Promise<{ ok: true }> => {
    const session = await requireSession();
    const parsed = parseOrThrow(updateAcademicProfileSchema, input);

    if (parsed.academicOfferingId === null) {
      await db.user.update({
        where: { id: session.user.id },
        data: {
          academicOfferingId: null,
          academicSemester: null,
          academicGroup: null,
        },
      });
      revalidatePath("/app/perfil");
      return { ok: true };
    }

    if (parsed.academicSemester === null) {
      throw new ActionError("Elige tu semestre");
    }

    const offering = await db.academicOffering.findUnique({
      where: { id: parsed.academicOfferingId },
      select: { id: true, active: true, semesterCount: true },
    });
    if (!offering || !offering.active) {
      throw new ActionError("Esa combinación de plantel y carrera no existe");
    }
    if (parsed.academicSemester < 1 || parsed.academicSemester > offering.semesterCount) {
      throw new ActionError(`El semestre debe estar entre 1 y ${offering.semesterCount}`);
    }

    const group = normalizeAcademicGroup(parsed.academicGroup);

    await db.user.update({
      where: { id: session.user.id },
      data: {
        academicOfferingId: offering.id,
        academicSemester: parsed.academicSemester,
        academicGroup: group,
      },
    });

    logger.info({ userId: session.user.id }, "academic profile updated");
    revalidatePath("/app/perfil");
    return { ok: true };
  },
);

/** Descarta el prompt "Encuentra a tus compañeros" sin llenar nada. */
export const dismissAcademicPrompt = withActionErrorHandling(
  "dismissAcademicPrompt",
  async (): Promise<{ ok: true }> => {
    const session = await requireSession();
    await db.user.update({
      where: { id: session.user.id },
      data: { academicPromptDismissedAt: new Date() },
    });
    return { ok: true };
  },
);
