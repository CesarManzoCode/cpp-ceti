import type { CourseDefinition } from "../types";

import { unidad01 } from "./unidad-01-modelar";
import { unidad02 } from "./unidad-02-encapsular";
import { unidad03 } from "./unidad-03-uml";
import { unidad04 } from "./unidad-04-relaciones";
import { unidad05 } from "./unidad-05-herencia";
import { unidad06 } from "./unidad-06-diseno-robusto";
import { unidad07 } from "./unidad-07-gui";
import { unidad08 } from "./unidad-08-integrador";

/**
 * Programación Orientada a Objetos I — C#.
 *
 * Curso del Tecnólogo en Desarrollo de Software del CETI (3.er semestre,
 * 72 horas). Va de modelar objetos a entregar una aplicación de escritorio
 * con Windows Forms.
 *
 * Dos límites que NO se cruzan:
 *   · El temario de POO II (estructuras dinámicas, colecciones genéricas,
 *     ordenamiento, concurrencia, XML, sockets) queda fuera. Para varios
 *     objetos se usan arreglos de tamaño fijo.
 *   · Windows Forms NO se ejecuta en el navegador. Sus ejemplos son
 *     `runnable: false` y viven como laboratorio local en Visual Studio;
 *     el dominio que los alimenta sí se prueba aquí, como consola.
 *
 * El código ejecutable usa el subconjunto compatible con Mono 6.12
 * (`class Program` explícito, `static void Main()`, tipos explícitos):
 * sin top-level statements, records, constructores primarios, LINQ ni
 * colecciones genéricas. Es un perfil de compatibilidad, no un juicio
 * sobre C# moderno.
 */
export const cursoCsharpPoo1: CourseDefinition = {
  slug: "csharp-poo-1",
  title: "Programación Orientada a Objetos I con C#",
  description:
    "Modela, implementa y entrega aplicaciones orientadas a objetos en C#.",
  subjectName: "Programación Orientada a Objetos I",
  academicContext: "CETI · Tecnólogo en Desarrollo de Software · 72 horas",
  language: "csharp",
  executionProfile: "csharp-mono-6.12",
  units: [
    unidad01,
    unidad02,
    unidad03,
    unidad04,
    unidad05,
    unidad06,
    unidad07,
    unidad08,
  ],
};
