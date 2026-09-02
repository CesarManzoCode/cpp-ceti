import { cache } from "react";

import { db } from "@/lib/db";

export interface AcademicOfferingOption {
  id: string;
  campusId: string;
  campusCode: string;
  campusName: string;
  programId: string;
  programCode: string;
  programName: string;
  semesterCount: number;
}

/**
 * Ofertas académicas activas (campus × programa) para el selector de
 * perfil. El cliente elige entre ESTAS combinaciones reales — nunca puede
 * mandar un `academicOfferingId` inventado, porque el servidor siempre
 * revalida contra esta misma tabla en `updateAcademicProfile`.
 */
export const getAcademicOptions = cache(async (): Promise<AcademicOfferingOption[]> => {
  const offerings = await db.academicOffering.findMany({
    where: { active: true, campus: { active: true }, program: { active: true } },
    select: {
      id: true,
      semesterCount: true,
      campus: { select: { id: true, code: true, name: true, sortOrder: true } },
      program: { select: { id: true, code: true, name: true } },
    },
    orderBy: [{ campus: { sortOrder: "asc" } }, { program: { name: "asc" } }],
  });

  return offerings.map((o) => ({
    id: o.id,
    campusId: o.campus.id,
    campusCode: o.campus.code,
    campusName: o.campus.name,
    programId: o.program.id,
    programCode: o.program.code,
    programName: o.program.name,
    semesterCount: o.semesterCount,
  }));
});

export interface AcademicProfile {
  offering: { id: string; campusName: string; programName: string; semesterCount: number } | null;
  semester: number | null;
  group: string | null;
  promptDismissedAt: Date | null;
}

/** Perfil académico del usuario actual (self — siempre incluye el grupo exacto). */
export const getOwnAcademicProfile = cache(
  async (userId: string): Promise<AcademicProfile> => {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        academicSemester: true,
        academicGroup: true,
        academicPromptDismissedAt: true,
        academicOffering: {
          select: {
            id: true,
            semesterCount: true,
            campus: { select: { name: true } },
            program: { select: { name: true } },
          },
        },
      },
    });
    if (!user) {
      return { offering: null, semester: null, group: null, promptDismissedAt: null };
    }
    return {
      offering: user.academicOffering
        ? {
            id: user.academicOffering.id,
            campusName: user.academicOffering.campus.name,
            programName: user.academicOffering.program.name,
            semesterCount: user.academicOffering.semesterCount,
          }
        : null,
      semester: user.academicSemester,
      group: user.academicGroup,
      promptDismissedAt: user.academicPromptDismissedAt,
    };
  },
);
