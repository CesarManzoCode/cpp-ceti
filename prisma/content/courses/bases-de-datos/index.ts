import { defineCourse } from "../../authoring";

import { bd1Fundamentos } from "./units/01-fundamentos-sgbd";
import { bd1Requerimientos } from "./units/02-requerimientos-informacion";
import { bd1ModeloEr } from "./units/03-modelo-er";
import { bd1ModeloRelacional } from "./units/04-modelo-relacional";
import { bd1Normalizacion } from "./units/05-normalizacion";
import { bd1AlgebraRelacional } from "./units/06-algebra-relacional";
import { bd1Ddl } from "./units/07-ddl";
import { bd1Dml } from "./units/08-dml";
import { bd1ConsultasReportes } from "./units/09-consultas-reportes";
import { bd1RespaldoIntegrador } from "./units/10-respaldo-integrador";

// =====================================================================
// Paquete de curso: Bases de datos (Base de Datos I, S4).
//
// Curso nuevo y lenguaje nuevo de plataforma: `sql`, perfil
// `sql-sqlite3-wandbox` (ver TECHNICAL_CONTRACT del paquete de contenido
// `bd1-ceti-content-pack`). El SQL didáctico usa el subconjunto relacional
// portable compatible con SQLite; backup/restore real y la GUI de
// escritorio que pide el programa oficial quedan como laboratorio local.
//
// 10 unidades, una sola CurriculumSection semestral, las 10 nacen
// `published: true` — sin release gate para esta entrega.
// =====================================================================

export const basesDeDatos = defineCourse({
  slug: "bases-de-datos",
  title: "Bases de datos",
  description:
    "Diseña bases relacionales desde necesidades reales, normalízalas y consulta información con SQL.",
  subjectName: "Bases de datos",
  academicContext: "CETI · Tecnólogo en Desarrollo de Software",
  language: "sql",
  executionProfile: "sql-sqlite3-wandbox",
  curriculum: [
    {
      key: "s4-base-de-datos-1",
      semester: 4,
      subjectName: "Base de Datos I",
      units: [
        bd1Fundamentos,
        bd1Requerimientos,
        bd1ModeloEr,
        bd1ModeloRelacional,
        bd1Normalizacion,
        bd1AlgebraRelacional,
        bd1Ddl,
        bd1Dml,
        bd1ConsultasReportes,
        bd1RespaldoIntegrador,
      ],
    },
  ],
});
