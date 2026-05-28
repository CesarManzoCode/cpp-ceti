import type { CourseDefinition } from "./types";

import { unidad01 } from "./unidad-01-primer-programa";
import { unidad02 } from "./unidad-02-cin";
import { unidad03 } from "./unidad-03-variables";
import { unidad04 } from "./unidad-04-control-flujo";
import { unidad05 } from "./unidad-05-loops";
import { unidad06 } from "./unidad-06-funciones";
import { unidad07 } from "./unidad-07-printf-scanf";
import { unidad08 } from "./unidad-08-arreglos";
import { unidad09 } from "./unidad-09-archivos";

export const cursoCpp: CourseDefinition = {
  slug: "cpp-desde-cero",
  title: "C++ desde cero",
  description:
    "El curso completo de C++ pensado para estudiantes del CETI Guadalajara. " +
    "Cada concepto va seguido de práctica inmediata.",
  units: [
    unidad01,
    unidad02,
    unidad03,
    unidad04,
    unidad05,
    unidad06,
    unidad07,
    unidad08,
    unidad09,
  ],
};

export const allCourses: CourseDefinition[] = [cursoCpp];
