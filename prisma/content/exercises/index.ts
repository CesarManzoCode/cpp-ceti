import type { PracticeUnitSetDefinition } from "./types";

import { allPracticeSets as canonicalAllPracticeSets } from "../courses";

/**
 * Registro de todos los conjuntos de ejercicios de práctica. Ahora se
 * construye en `../courses` a partir de `buildContentRegistry`; este
 * re-export existe para no romper a los consumidores actuales
 * (`prisma/seed-practice.ts`, tests, `scripts/verify-content.ts`).
 */
export const allPracticeSets: PracticeUnitSetDefinition[] = canonicalAllPracticeSets;
