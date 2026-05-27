import type { CourseDefinition } from "./types";

import { unidad01 } from "./unidad-01-primer-programa";
import { unidad02 } from "./unidad-02-variables";

export const cursoCpp: CourseDefinition = {
  slug: "cpp-desde-cero",
  title: "C++ desde cero",
  description:
    "El curso completo de C++ pensado para estudiantes del CETI Guadalajara. " +
    "Cada concepto va seguido de práctica inmediata.",
  units: [unidad01, unidad02],
};

export const allCourses: CourseDefinition[] = [cursoCpp];
