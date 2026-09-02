import { describe, expect, it } from "vitest";

import { allCourses } from "../../prisma/content";
import { allPracticeSets } from "../../prisma/content/exercises";
import type { StructureContract } from "../../prisma/content/types";
import { checkStructure } from "@/lib/structure";
import { structureContractSchema } from "@/lib/structure/contract";
import type { LanguageId } from "@/lib/code-languages";

/**
 * LEARN-01: los contratos estructurales publicados tienen que ser
 * verdaderos. Si una solución de referencia no satisface su propio
 * contrato, el reto sería imposible; si un contrato es inválido, dejaría
 * de calificar en silencio.
 */

interface PublishedChallenge {
  id: string;
  language: LanguageId;
  solutionCode: string;
  structure?: StructureContract;
}

function publishedChallenges(): PublishedChallenge[] {
  const out: PublishedChallenge[] = [];

  for (const course of allCourses) {
    for (const unit of course.units) {
      if (unit.published === false) continue;
      for (const lesson of unit.lessons) {
        if (lesson.published === false) continue;
        for (const step of lesson.steps) {
          if (step.type !== "code_challenge") continue;
          out.push({
            id: `${course.slug}/${unit.slug}/${lesson.slug}`,
            language: course.language,
            solutionCode: step.exercise.solutionCode,
            structure: step.exercise.structure,
          });
        }
      }
    }
  }

  const publishedUnit = new Map(
    allCourses.flatMap((c) =>
      c.units.map((u) => [`${c.slug}/${u.slug}`, u.published !== false] as const),
    ),
  );
  const languageOf = new Map(allCourses.map((c) => [c.slug, c.language]));

  for (const set of allPracticeSets) {
    if (!publishedUnit.get(`${set.courseSlug}/${set.unitSlug}`)) continue;
    for (const exercise of set.exercises) {
      out.push({
        id: `${set.courseSlug}/${set.unitSlug}/${exercise.slug}`,
        language: languageOf.get(set.courseSlug)!,
        solutionCode: exercise.solutionCode,
        structure: exercise.structure,
      });
    }
  }

  return out;
}

const challenges = publishedChallenges();
const withContract = challenges.filter((c) => c.structure !== undefined);

describe("contratos estructurales publicados", () => {
  it("hay contratos declarados", () => {
    expect(withContract.length).toBeGreaterThan(0);
  });

  it.each(withContract.map((c) => [c.id, c] as const))(
    "%s: el contrato es válido y la solución de referencia lo satisface",
    (_id, challenge) => {
      expect(
        structureContractSchema.safeParse(challenge.structure).success,
      ).toBe(true);

      const result = checkStructure(
        challenge.structure,
        challenge.solutionCode,
        challenge.language,
      );
      expect(result.failures).toEqual([]);
    },
  );

  it("ningún reto de C++ declara contrato estructural", () => {
    const cpp = withContract.filter((c) => c.language === "cpp");
    expect(cpp).toEqual([]);
  });

  it("todo reto de lección de C# publicado declara su objetivo", () => {
    // "Declara su objetivo" = o tiene contrato (comportamiento + estructura)
    // o está en la lista de los que sólo evalúan comportamiento.
    const soloComportamiento = new Set<string>([
      // La clase ya viene completa y sin cambios: el reto evalúa que el
      // alumno EXTRAIGA el diagrama UML correcto como texto, no la
      // estructura de clases (que no escribe).
      "csharp-poo-1/csharp-poo-03-uml/csharp-poo-codigo-a-uml-pelicula",

      // S5 (modelos-metodos-desarrollo-software): el paquete curricular
      // declara `structure` SÓLO donde el objetivo del reto es diseño/UML
      // (unidades 3, 5, 8 y 10 — relaciones, propiedades, herencia,
      // abstracción). El resto del curso evalúa reglas de negocio, lógica
      // de estados y cálculos (requisitos, pruebas, mantenimiento,
      // incrementos, ISP) donde el objetivo declarado es comportamiento,
      // no estructura de clases — igual que el resto del contenido C# sin
      // contrato. Ver COURSE_CONTRACT.md / SONNET_PROMPT.md del paquete S5.
      "modelos-metodos-desarrollo-software/mm-02-requerimientos/problema-actores-alcance",
      "modelos-metodos-desarrollo-software/mm-02-requerimientos/requisitos-funcionales",
      "modelos-metodos-desarrollo-software/mm-02-requerimientos/requisitos-no-funcionales",
      "modelos-metodos-desarrollo-software/mm-02-requerimientos/criterios-aceptacion",
      "modelos-metodos-desarrollo-software/mm-02-requerimientos/cambio-de-alcance",
      "modelos-metodos-desarrollo-software/mm-05-planificacion-implementacion/descomponer-trabajo",
      "modelos-metodos-desarrollo-software/mm-05-planificacion-implementacion/dependencias-gantt",
      "modelos-metodos-desarrollo-software/mm-05-planificacion-implementacion/seguimiento-desviaciones",
      "modelos-metodos-desarrollo-software/mm-06-pruebas-calidad/verificacion-validacion",
      "modelos-metodos-desarrollo-software/mm-06-pruebas-calidad/tipos-prueba",
      "modelos-metodos-desarrollo-software/mm-06-pruebas-calidad/casos-fronteras",
      "modelos-metodos-desarrollo-software/mm-06-pruebas-calidad/regresion-resultados",
      "modelos-metodos-desarrollo-software/mm-07-mantenimiento/tipos-mantenimiento",
      "modelos-metodos-desarrollo-software/mm-07-mantenimiento/reproducir-antes-corregir",
      "modelos-metodos-desarrollo-software/mm-07-mantenimiento/impacto-regresion",
      "modelos-metodos-desarrollo-software/mm-07-mantenimiento/plan-mejora",
      "modelos-metodos-desarrollo-software/mm-08-solid/isp",
      "modelos-metodos-desarrollo-software/mm-09-incremental/modelo-incremental",
      "modelos-metodos-desarrollo-software/mm-09-incremental/iteracion-feedback",
      "modelos-metodos-desarrollo-software/mm-09-incremental/plan-incrementos",
      "modelos-metodos-desarrollo-software/mm-09-incremental/cronograma-entregas",
      "modelos-metodos-desarrollo-software/mm-10-integrador/entrega-evolucion",
      "modelos-metodos-desarrollo-software/mm-02-requerimientos/mm-requisitos-prioridad",
      "modelos-metodos-desarrollo-software/mm-02-requerimientos/mm-requisitos-sla",
      "modelos-metodos-desarrollo-software/mm-02-requerimientos/mm-requisitos-transicion",
      "modelos-metodos-desarrollo-software/mm-02-requerimientos/mm-requisitos-cambio",
      "modelos-metodos-desarrollo-software/mm-03-uml-diseno/mm-diseno-separar-reporte",
      "modelos-metodos-desarrollo-software/mm-03-uml-diseno/mm-diseno-historial",
      "modelos-metodos-desarrollo-software/mm-05-planificacion-implementacion/mm-plan-ruta",
      "modelos-metodos-desarrollo-software/mm-05-planificacion-implementacion/mm-plan-porcentaje",
      "modelos-metodos-desarrollo-software/mm-05-planificacion-implementacion/mm-plan-ticket",
      "modelos-metodos-desarrollo-software/mm-05-planificacion-implementacion/mm-plan-costo-cambio",
      "modelos-metodos-desarrollo-software/mm-06-pruebas-calidad/mm-test-rangos",
      "modelos-metodos-desarrollo-software/mm-06-pruebas-calidad/mm-test-intentos",
      "modelos-metodos-desarrollo-software/mm-06-pruebas-calidad/mm-test-regresion",
      "modelos-metodos-desarrollo-software/mm-06-pruebas-calidad/mm-test-matriz",
      "modelos-metodos-desarrollo-software/mm-07-mantenimiento/mm-mant-clasificar",
      "modelos-metodos-desarrollo-software/mm-07-mantenimiento/mm-mant-cero",
      "modelos-metodos-desarrollo-software/mm-07-mantenimiento/mm-mant-regresion",
      "modelos-metodos-desarrollo-software/mm-07-mantenimiento/mm-mant-prioridad",
      "modelos-metodos-desarrollo-software/mm-08-solid/mm-solid-srp",
      "modelos-metodos-desarrollo-software/mm-08-solid/mm-solid-ocp",
      "modelos-metodos-desarrollo-software/mm-08-solid/mm-solid-isp",
      "modelos-metodos-desarrollo-software/mm-08-solid/mm-solid-dip",
      "modelos-metodos-desarrollo-software/mm-09-incremental/mm-inc-disponibilidad",
      "modelos-metodos-desarrollo-software/mm-09-incremental/mm-inc-validacion",
      "modelos-metodos-desarrollo-software/mm-09-incremental/mm-inc-prioridad",
      "modelos-metodos-desarrollo-software/mm-09-incremental/mm-inc-fechas",
      "modelos-metodos-desarrollo-software/mm-10-integrador/mm-final-ticket",
      "modelos-metodos-desarrollo-software/mm-10-integrador/mm-final-autorizacion",
      "modelos-metodos-desarrollo-software/mm-10-integrador/mm-final-prioridad",
      "modelos-metodos-desarrollo-software/mm-10-integrador/mm-final-pausado",

      // S4 POO II (csharp-poo-1): el fix del sprint DB2 levanta el release
      // gate (published:false→true) de las 8 unidades 09..16, sin tocar su
      // contenido. Esas unidades ya declaraban `structure` SÓLO donde el
      // objetivo es diseño/modelado de datos (colecciones/09:
      // inventario-en-memoria, list-de-objetos; integrador/16:
      // requisitos-y-uml) — el resto evalúa comportamiento: operaciones de
      // colecciones/diccionarios, criterios de ordenamiento, serialización
      // XML, restricciones genéricas, exclusión mutua/concurrencia,
      // protocolo de mensajes/redes y el integrador de esas capacidades.
      // Ninguno de esos retos pide al alumno diseñar una estructura de
      // clases, así que "sin contrato" es su diseño original, no una
      // omisión de este sprint.
      "csharp-poo-1/csharp-poo2-01-colecciones/de-arreglos-a-colecciones",
      "csharp-poo-1/csharp-poo2-01-colecciones/stack-y-queue",
      "csharp-poo-1/csharp-poo2-01-colecciones/agregar-buscar-eliminar",
      "csharp-poo-1/csharp-poo2-02-diccionarios/clave-y-valor",
      "csharp-poo-1/csharp-poo2-02-diccionarios/dictionary-basico",
      "csharp-poo-1/csharp-poo2-02-diccionarios/buscar-seguro",
      "csharp-poo-1/csharp-poo2-02-diccionarios/actualizar-y-eliminar",
      "csharp-poo-1/csharp-poo2-02-diccionarios/elegir-coleccion",
      "csharp-poo-1/csharp-poo2-03-ordenamiento/criterio-de-orden",
      "csharp-poo-1/csharp-poo2-03-ordenamiento/burbuja-con-objetos",
      "csharp-poo-1/csharp-poo2-03-ordenamiento/insercion-con-objetos",
      "csharp-poo-1/csharp-poo2-03-ordenamiento/icomparer-e-icomparer",
      "csharp-poo-1/csharp-poo2-03-ordenamiento/buscar-objetos",
      "csharp-poo-1/csharp-poo2-04-xml/que-es-xml",
      "csharp-poo-1/csharp-poo2-04-xml/bien-formado-y-valido",
      "csharp-poo-1/csharp-poo2-04-xml/objetos-a-xml",
      "csharp-poo-1/csharp-poo2-04-xml/xml-a-objetos",
      "csharp-poo-1/csharp-poo2-04-xml/persistencia-xml",
      "csharp-poo-1/csharp-poo2-05-genericos/por-que-genericos",
      "csharp-poo-1/csharp-poo2-05-genericos/clase-generica",
      "csharp-poo-1/csharp-poo2-05-genericos/metodo-generico",
      "csharp-poo-1/csharp-poo2-05-genericos/restricciones-genericas",
      "csharp-poo-1/csharp-poo2-05-genericos/repositorio-generico",
      "csharp-poo-1/csharp-poo2-06-concurrencia/proceso-hilo-concurrencia",
      "csharp-poo-1/csharp-poo2-06-concurrencia/thread-y-join",
      "csharp-poo-1/csharp-poo2-06-concurrencia/lock-y-exclusion-mutua",
      "csharp-poo-1/csharp-poo2-06-concurrencia/errores-en-hilos",
      "csharp-poo-1/csharp-poo2-07-redes/protocolo-mensaje-socket",
      "csharp-poo-1/csharp-poo2-07-redes/ip-puerto-endpoint",
      "csharp-poo-1/csharp-poo2-07-redes/cliente-servidor-tcp",
      "csharp-poo-1/csharp-poo2-07-redes/udp-y-mensajes",
      "csharp-poo-1/csharp-poo2-07-redes/seguridad-del-mensaje",
      "csharp-poo-1/csharp-poo2-08-integrador/arquitectura-del-proyecto",
      "csharp-poo-1/csharp-poo2-08-integrador/integracion-concurrente",
      "csharp-poo-1/csharp-poo2-01-colecciones/csharp-poo2-lista-productos",
      "csharp-poo-1/csharp-poo2-01-colecciones/csharp-poo2-eliminar-agotados",
      "csharp-poo-1/csharp-poo2-01-colecciones/csharp-poo2-pila-historial",
      "csharp-poo-1/csharp-poo2-01-colecciones/csharp-poo2-cola-turnos",
      "csharp-poo-1/csharp-poo2-02-diccionarios/csharp-poo2-indice-productos",
      "csharp-poo-1/csharp-poo2-02-diccionarios/csharp-poo2-buscar-con-trygetvalue",
      "csharp-poo-1/csharp-poo2-02-diccionarios/csharp-poo2-actualizar-stock",
      "csharp-poo-1/csharp-poo2-02-diccionarios/csharp-poo2-directorio-clientes",
      "csharp-poo-1/csharp-poo2-03-ordenamiento/csharp-poo2-ordenar-productos-precio",
      "csharp-poo-1/csharp-poo2-03-ordenamiento/csharp-poo2-ordenar-alumnos-nombre",
      "csharp-poo-1/csharp-poo2-03-ordenamiento/csharp-poo2-comparador-existencias",
      "csharp-poo-1/csharp-poo2-03-ordenamiento/csharp-poo2-buscar-producto",
      "csharp-poo-1/csharp-poo2-04-xml/csharp-poo2-leer-productos-xml",
      "csharp-poo-1/csharp-poo2-04-xml/csharp-poo2-crear-xml-producto",
      "csharp-poo-1/csharp-poo2-04-xml/csharp-poo2-parsear-datos-xml",
      "csharp-poo-1/csharp-poo2-04-xml/csharp-poo2-inventario-xml",
      "csharp-poo-1/csharp-poo2-05-genericos/csharp-poo2-caja-generica",
      "csharp-poo-1/csharp-poo2-05-genericos/csharp-poo2-repositorio-productos",
      "csharp-poo-1/csharp-poo2-05-genericos/csharp-poo2-metodo-mostrar",
      "csharp-poo-1/csharp-poo2-05-genericos/csharp-poo2-repositorio-con-restriccion",
      "csharp-poo-1/csharp-poo2-06-concurrencia/csharp-poo2-hilo-calculo",
      "csharp-poo-1/csharp-poo2-06-concurrencia/csharp-poo2-dos-trabajadores",
      "csharp-poo-1/csharp-poo2-06-concurrencia/csharp-poo2-contador-protegido",
      "csharp-poo-1/csharp-poo2-06-concurrencia/csharp-poo2-error-en-worker",
      "csharp-poo-1/csharp-poo2-07-redes/csharp-poo2-crear-mensaje-protocolo",
      "csharp-poo-1/csharp-poo2-07-redes/csharp-poo2-parsear-mensaje",
      "csharp-poo-1/csharp-poo2-07-redes/csharp-poo2-validar-endpoint",
      "csharp-poo-1/csharp-poo2-07-redes/csharp-poo2-procesar-comando-remoto",
      "csharp-poo-1/csharp-poo2-08-integrador/csharp-poo2-modelo-inventario",
      "csharp-poo-1/csharp-poo2-08-integrador/csharp-poo2-repositorio-dominio",
      "csharp-poo-1/csharp-poo2-08-integrador/csharp-poo2-import-export-xml",
      "csharp-poo-1/csharp-poo2-08-integrador/csharp-poo2-comandos-thread-safe",
    ]);
    const sinContrato = challenges
      .filter((c) => c.language === "csharp" && c.structure === undefined)
      .map((c) => c.id)
      .filter((id) => !soloComportamiento.has(id));
    expect(sinContrato).toEqual([]);
  });
});
