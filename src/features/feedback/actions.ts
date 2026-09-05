"use server";

import { z } from "zod";

import { withActionErrorHandling } from "@/lib/action-error";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/get-session";
import { enforceRateLimit } from "@/lib/rate-limit";
import { parseOrThrow } from "@/lib/validation";

import { FEEDBACK_MAX_LENGTH, resolveFeedbackContext } from "./context";

/**
 * Feedback general: "esto no corresponde con mi clase", "esto me confundió",
 * "estaría bueno que...", "me gustó".
 *
 * NO reemplaza a `BugReport`, que sigue siendo para contenido roto y apunta a
 * un paso/ejercicio concreto. Aquí el contexto (ruta, superficie, recurso —
 * incluida la unidad completa cuando el reporte es sobre una) lo DERIVA EL
 * SERVIDOR de la ruta: al alumno no se le pide que explique dónde estaba, y
 * tampoco se le cree ciegamente lo que manda.
 *
 * Lo único que se guarda del usuario es su mensaje y su id. Nada de user
 * agent, IP, resolución de pantalla ni contenido del editor. Nada de esto
 * crea un issue de GitHub: cae en la cola de triage interna
 * (`/app/admin/reportes`) para que un admin lo normalice si vale la pena.
 */
const feedbackSchema = z.object({
  kind: z.enum(["discrepancy", "confusing", "idea", "praise", "other"]),
  message: z
    .string()
    .trim()
    .min(5, "Cuéntanos un poco más (mínimo 5 caracteres)")
    .max(
      FEEDBACK_MAX_LENGTH,
      `Máximo ${FEEDBACK_MAX_LENGTH.toLocaleString("es-MX")} caracteres`,
    ),
  /** Ruta donde estaba el alumno; el servidor la limpia y la interpreta. */
  path: z.string().max(512).optional(),
});

export const submitFeedback = withActionErrorHandling(
  "submitFeedback",
  async (input: {
    kind: "discrepancy" | "confusing" | "idea" | "praise" | "other";
    message: string;
    path?: string;
  }): Promise<{ ok: true }> => {
    const { kind, message, path } = parseOrThrow(feedbackSchema, input);
    const session = await requireSession();
    const userId = session.user.id;
    await enforceRateLimit(userId, "feedback");

    const context = await resolveFeedbackContext(db, path);

    await db.feedback.create({
      data: {
        userId,
        kind,
        message,
        path: context.path,
        surface: context.surface,
        unitId: context.unitId,
        lessonId: context.lessonId,
        practiceExerciseId: context.practiceExerciseId,
      },
    });

    return { ok: true };
  },
);
