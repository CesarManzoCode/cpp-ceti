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

import { bd2Procedimientos } from "./units/11-procedimientos";
import { bd2TriggersJobs } from "./units/12-triggers-jobs";
import { bd2Transacciones } from "./units/13-transacciones";
import { bd2UsuariosPermisos } from "./units/14-usuarios-permisos";
import { bd2Mantenimiento } from "./units/15-mantenimiento";
import { bd2Conexiones } from "./units/16-conexiones";
import { bd2CrudInterfaz } from "./units/17-crud-interfaz";
import { bd2NosqlModelo } from "./units/18-nosql-modelo";
import { bd2MongodbCrud } from "./units/19-mongodb-crud";
import { bd2Integrador } from "./units/20-integrador";

// =====================================================================
// Paquete de curso: Bases de datos (Base de Datos I, S4 + Base de Datos
// II, S5).
//
// Curso nuevo y lenguaje nuevo de plataforma: `sql`, perfil
// `sql-sqlite3-wandbox` (ver TECHNICAL_CONTRACT del paquete de contenido
// `bd1-ceti-content-pack`). El SQL didáctico usa el subconjunto relacional
// portable compatible con SQLite; backup/restore real y la GUI de
// escritorio que pide el programa oficial quedan como laboratorio local.
//
// S5 (Base de Datos II, ver TECHNICAL_CONTRACT de `db2-ceti-content-pack`)
// extiende el MISMO Course con procedimientos, triggers/jobs,
// transacciones/ACID, usuarios/permisos, mantenimiento, conexión de
// aplicaciones, CRUD/vistas/informes, modelo documental, CRUD MongoDB y un
// integrador — sin agregar lenguaje, provider ni schema nuevos. Las
// capacidades que SQLite no soporta honestamente (CREATE PROCEDURE,
// Event Scheduler, GRANT/REVOKE, mantenimiento específico de MySQL,
// conexión C#↔MySQL y todo MongoDB) quedan como laboratorio local
// (`runnable:false` + `localOnlyNote`), nunca adaptadas artificialmente.
//
// 20 unidades en total (10 + 10), dos CurriculumSection semestrales; las
// 20 nacen `published: true` — sin release gate para esta entrega.
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
    {
      key: "s5-base-de-datos-2",
      semester: 5,
      subjectName: "Base de Datos II",
      units: [
        bd2Procedimientos,
        bd2TriggersJobs,
        bd2Transacciones,
        bd2UsuariosPermisos,
        bd2Mantenimiento,
        bd2Conexiones,
        bd2CrudInterfaz,
        bd2NosqlModelo,
        bd2MongodbCrud,
        bd2Integrador,
      ],
    },
  ],
});
