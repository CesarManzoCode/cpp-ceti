"use server";

import { z } from "zod";

import {
  ActionError,
  withActionErrorHandling,
} from "@/lib/action-error";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/get-session";
import { logger } from "@/lib/logger";
import { BUG_REPORT_MAX_LENGTH, cuidSchema, parseOrThrow } from "@/lib/validation";

const targetSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("lesson_step"), lessonStepId: cuidSchema }),
  z.object({ kind: z.literal("exercise"), exerciseId: cuidSchema }),
  z.object({ kind: z.literal("practice"), practiceExerciseId: cuidSchema }),
]);

const reportBugSchema = z.object({
  target: targetSchema,
  message: z
    .string()
    .trim()
    .min(5, "Cuéntanos qué pasó (mínimo 5 caracteres)")
    .max(
      BUG_REPORT_MAX_LENGTH,
      `Máximo ${BUG_REPORT_MAX_LENGTH.toLocaleString("es-MX")} caracteres`,
    ),
});

export const reportContentBug = withActionErrorHandling(
  "reportContentBug",
  async (input: {
    target:
      | { kind: "lesson_step"; lessonStepId: string }
      | { kind: "exercise"; exerciseId: string }
      | { kind: "practice"; practiceExerciseId: string };
    message: string;
  }): Promise<{ ok: true }> => {
    const { target, message } = parseOrThrow(reportBugSchema, input);
    const session = await requireSession();
    const userId = session.user.id;

    // Verificar que el target exista antes de crear el reporte.
    if (target.kind === "lesson_step") {
      const exists = await db.lessonStep.findUnique({
        where: { id: target.lessonStepId },
        select: { id: true },
      });
      if (!exists) throw new ActionError("Paso no encontrado");
      await db.bugReport.create({
        data: { userId, lessonStepId: target.lessonStepId, message },
      });
    } else if (target.kind === "exercise") {
      const exists = await db.exercise.findUnique({
        where: { id: target.exerciseId },
        select: { id: true },
      });
      if (!exists) throw new ActionError("Ejercicio no encontrado");
      await db.bugReport.create({
        data: { userId, exerciseId: target.exerciseId, message },
      });
    } else {
      const exists = await db.practiceExercise.findUnique({
        where: { id: target.practiceExerciseId },
        select: { id: true },
      });
      if (!exists) throw new ActionError("Ejercicio de práctica no encontrado");
      await db.bugReport.create({
        data: {
          userId,
          practiceExerciseId: target.practiceExerciseId,
          message,
        },
      });
    }

    logger.info(
      { userId, target: target.kind },
      "bug report created",
    );

    return { ok: true };
  },
);
