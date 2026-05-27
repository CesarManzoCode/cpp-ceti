import type { CourseDefinition } from "./types";

import { unidad01 } from "./unidad-01-primer-programa";
import { unidad02 } from "./unidad-02-variables";
import { unidad03 } from "./unidad-03-control-flujo";
import { unidad04 } from "./unidad-04-loops";
import { unidad05 } from "./unidad-05-funciones";
import { unidad06 } from "./unidad-06-cin";
import { unidad07 } from "./unidad-07-arreglos";
import { unidad08 } from "./unidad-08-archivos";

export const cursoCpp: CourseDefinition = {
  slug: "cpp-desde-cero",
  title: "C++ desde cero",
  description:
    "El curso completo de C++ pensado para estudiantes del CETI Guadalajara. " +
    "Cada concepto va seguido de práctica inmediata.",
  units: [unidad01, unidad02, unidad03, unidad04, unidad05, unidad06, unidad07, unidad08],
};

export const allCourses: CourseDefinition[] = [cursoCpp];
