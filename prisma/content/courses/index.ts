// =====================================================================
// REGISTRY ÚNICO de cursos.
//
// Un solo arreglo explícito, en el orden de presentación por default en
// el selector de curso. Sin discovery, sin glob, sin filesystem, sin
// codegen: agregar un curso nuevo es agregar una línea aquí.
//
// `buildContentRegistry` valida TODO el contenido (de todos los cursos)
// antes de que este módulo termine de importarse — un
// `ContentValidationError` aquí rompe el import, no llega silencioso a
// un seed o a un build.
// =====================================================================

import { buildContentRegistry } from "../authoring";
import type { CoursePackageDefinition } from "../authoring";

import { cppDesdeCero } from "./cpp-desde-cero";
import { csharpPoo1 } from "./csharp-poo-1";
import { modelosMetodosDesarrolloSoftware } from "./modelos-metodos-desarrollo-software";

const packages = [
  cppDesdeCero,
  csharpPoo1,
  modelosMetodosDesarrolloSoftware,
] satisfies readonly CoursePackageDefinition[];

export const { allCourses, allPracticeSets } = buildContentRegistry(packages);
