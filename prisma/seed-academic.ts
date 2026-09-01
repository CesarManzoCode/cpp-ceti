import type { PrismaClient } from "@prisma/client";

/**
 * Catálogo académico del CETI Guadalajara — planteles y programas
 * Tecnólogo vigentes (8 semestres). Idempotente: upsert por `code`, nunca
 * borra progreso de usuarios ni combinaciones ya elegidas.
 *
 * Fuente: oferta educativa pública del CETI. Si el catálogo real cambia
 * (nuevo plantel, programa dado de baja), este archivo es la fuente de
 * verdad — no se edita en Supabase a mano.
 */

interface CampusSeed {
  code: string;
  name: string;
  sortOrder: number;
}

interface ProgramSeed {
  code: string;
  name: string;
  /** Códigos de plantel donde se ofrece. */
  campuses: string[];
}

const CAMPUSES: CampusSeed[] = [
  { code: "colomos", name: "Colomos", sortOrder: 1 },
  { code: "tonala", name: "Tonalá", sortOrder: 2 },
  { code: "rio-santiago", name: "Río Santiago", sortOrder: 3 },
];

/** Todos los programas listados son Tecnólogo: 8 semestres. */
const SEMESTER_COUNT = 8;

const PROGRAMS: ProgramSeed[] = [
  { code: "automatizacion-robotica", name: "Automatización y Robótica", campuses: ["colomos"] },
  { code: "calidad-productividad", name: "Calidad y Productividad", campuses: ["tonala", "rio-santiago"] },
  { code: "construccion", name: "Construcción", campuses: ["colomos"] },
  {
    code: "desarrollo-software",
    name: "Desarrollo de Software",
    campuses: ["colomos", "tonala", "rio-santiago"],
  },
  { code: "desarrollo-electronico", name: "Desarrollo Electrónico", campuses: ["tonala"] },
  {
    code: "diseno-mecanica-industrial",
    name: "Diseño y Mecánica Industrial",
    campuses: ["colomos"],
  },
  { code: "electromecanica", name: "Electromecánica", campuses: ["colomos"] },
  { code: "mecanica-automotriz", name: "Mecánica Automotriz", campuses: ["colomos"] },
  { code: "quimico-alimentos", name: "Químico en Alimentos", campuses: ["tonala"] },
  { code: "quimico-farmacos", name: "Químico en Fármacos", campuses: ["colomos", "tonala"] },
  {
    code: "quimico-procesos-biotecnologia",
    name: "Químico en Procesos y Biotecnología",
    campuses: ["tonala"],
  },
  {
    code: "sistemas-electronicos-telecomunicaciones",
    name: "Sistemas Electrónicos y Telecomunicaciones",
    campuses: ["colomos"],
  },
];

export async function seedAcademicCatalog(db: PrismaClient): Promise<void> {
  const campusIdByCode = new Map<string, string>();
  for (const c of CAMPUSES) {
    const row = await db.academicCampus.upsert({
      where: { code: c.code },
      update: { name: c.name, sortOrder: c.sortOrder, active: true },
      create: { code: c.code, name: c.name, sortOrder: c.sortOrder },
    });
    campusIdByCode.set(c.code, row.id);
  }

  let offeringCount = 0;
  for (const p of PROGRAMS) {
    const program = await db.academicProgram.upsert({
      where: { code: p.code },
      update: { name: p.name, active: true },
      create: { code: p.code, name: p.name },
    });

    for (const campusCode of p.campuses) {
      const campusId = campusIdByCode.get(campusCode);
      if (!campusId) {
        throw new Error(`Plantel desconocido en catálogo académico: ${campusCode}`);
      }
      await db.academicOffering.upsert({
        where: { campusId_programId: { campusId, programId: program.id } },
        update: { semesterCount: SEMESTER_COUNT, active: true },
        create: {
          campusId,
          programId: program.id,
          semesterCount: SEMESTER_COUNT,
          active: true,
        },
      });
      offeringCount++;
    }
  }

  console.log(
    `  ↳ catálogo académico: ${CAMPUSES.length} planteles, ${PROGRAMS.length} programas, ${offeringCount} ofertas`,
  );
}
