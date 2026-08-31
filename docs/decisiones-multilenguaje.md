# Decisiones de implementación — plataforma multilenguaje

Bitácora de las decisiones que el handoff dejó ambiguas o contradictorias, y
de los ajustes hechos al contenido. El contrato completo vive en
`docs/CETI_CSHARP_MULTILANGUAGE_HANDOFF.md`.

## 1. Metadatos de curso: dos versiones en el handoff

El handoff define los metadatos del curso en dos secciones con textos
distintos:

| Campo | «Course-level contract» | «Minimal durable multilanguage specification → Course/content contract» |
| --- | --- | --- |
| C# `title` | Programación Orientada a Objetos I | Programación Orientada a Objetos I con C# |
| C# `description` | Modela problemas con UML e implementa clases, relaciones, herencia y aplicaciones de escritorio en C#. | Modela, implementa y entrega aplicaciones orientadas a objetos en C#. |
| C# `academicContext` | Tecnólogo en Desarrollo de Software · 3.er semestre · CETI | CETI · Tecnólogo en Desarrollo de Software · 72 horas |
| C++ `subjectName` | Programación estructurada / fundamentos de programación | Programación en C++ |
| C++ `academicContext` | Primeros semestres · CETI | Curso introductorio CETI |

**Decisión:** se usan los valores de la *Minimal durable multilanguage
specification*. Es la sección normativa de implementación (la que define el
contrato de tipos y la migración), y es la que la migración SQL debe
reproducir literalmente en el backfill. La intención pedagógica es idéntica
en ambas versiones; sólo cambia la redacción.

## 2. Taxonomía de errores de compilación

El handoff sugiere categorías nuevas (`unknown_identifier`,
`argument_type_mismatch`, `missing_argument`). Se prefirió **reutilizar la
taxonomía histórica** siempre que C# tenga un equivalente semántico, para
poder comparar fricción entre lenguajes en vez de fragmentar la métrica:

| Diagnóstico C# | Categoría |
| --- | --- |
| `CS1002` (Roslyn) y `CS1525` "expecting `;`" (Mono) | `missing_semicolon` (existente) |
| `CS0103`, `CS0246`, `CS1061`, `CS0117` | `undeclared_identifier` (existente) |
| `CS0029`, `CS0030`, `CS0266`, `CS1503`, `CS0019` | `type_mismatch` (existente) |
| `CS1501`, `CS1502`, `CS1729` (Mono), `CS7036` (Roslyn) | `invalid_arguments` (existente) |
| `CS1513`, `CS1514`, `CS1519`, `CS1026`, `CS1525` "end-of-file" | `unbalanced_delimiters` (existente) |
| `CS5001`, `CS0017` | `linker_error` (existente) |
| `CS0534` | `abstract_member_not_implemented` (**nueva**) |

`CS0534` es el único caso sin equivalente en la taxonomía de GCC: "la clase
derivada no implementa un miembro abstracto" no existe como error en C++
(ahí es un error de instanciación de tipo abstracto, con otra semántica).

`CS0246` ("el tipo o namespace no se encontró") se mapea a
`undeclared_identifier` y no a `missing_include`: GCC agrupa igual el caso
equivalente —`'vector' was not declared in this scope` cuando falta el
`#include`— y `missing_include` está reservado en la taxonomía histórica al
error de ARCHIVO de cabecera (`no such file or directory`), que en C# no
existe.

**Discrepancia verificada contra el compilador real:** el handoff supone que
el punto y coma faltante es `CS1002`. Eso es Roslyn; Mono 6.x reporta
`CS1525: Unexpected symbol ... expecting ','  or ';'`. Se aceptan los dos, y
los fixtures de los tests son salida real de `mcs`.

Ver `docs/product-analytics.md` §8.1 y `src/lib/analytics/error-category.ts`.

## 3. Revisión de contenido y semántica de ejecución

`course.language` y `course.executionProfile` entran en el preimage del hash
de revisión de pasos, ejercicios y prácticas. Esto produce **una revisión
honesta de una sola vez** para todo el contenido C++ existente, porque la
semántica del ejecutor pasó de implícita a explícita. Las revisiones
anteriores se conservan (`content_revision` es append-only) y ningún
progreso se ve afectado. Verificado en el ensayo de migración: la segunda
corrida del seed no genera revisiones nuevas.

## 4. Recreación de test cases en el seed

El seed borra y recrea las filas hijas `test_case` / `practice_test_case` en
cada corrida (comportamiento preexistente de `main`, explícitamente
permitido por el change map del handoff: *"recreate only child test cases as
current contract permits"*). Por eso los IDs de esas dos tablas cambian
entre corridas aunque el conteo sea idéntico. Ninguna tabla de usuario
apunta a ellas: los intentos referencian el ejercicio, no el caso de prueba.

## 5. Aceptación de WinForms

Este entorno no tiene Windows ni Visual Studio, y montar Wine o una VM está
explícitamente fuera de alcance. Todo el contenido de WinForms se verifica
estáticamente y con tests (no ejecutable, nota local visible, sin control de
ejecución, rechazo del servidor ante peticiones forjadas). La reproducción
manual del laboratorio en Windows queda como
**PENDING MANUAL WINDOWS ACCEPTANCE**.

Mientras esa aceptación no ocurra, la **U7 (Windows Forms)** y la **U8
(proyecto integrador, que se entrega como app de escritorio) van
`published: false`**: existen en el contenido y en la base, pero no salen al
aire. Publicarlas es un cambio de una línea en cada
`prisma/content/csharp/unidad-0{7,8}-*.ts` más un `npm run db:seed`, y lo
hace quien haya corrido el laboratorio en Windows y lo dé por bueno.

Consecuencia en el servidor: `resolveExecutionTarget` rechaza también las
**prácticas** colgadas de una unidad despublicada. El seed marca toda
práctica como publicada, así que sin ese guarda las prácticas de U7/U8
seguirían siendo ejecutables por una petición directa aunque la unidad
estuviera fuera del aire. Fijado en `tests/lib/execution-target.test.ts`.

## 6. Ejecución real de C# durante el desarrollo

`wandbox.org` está bloqueado por la política de red de este entorno (el proxy
responde 403 al CONNECT; `emkc.org`, el Piston público, también), así que
**sigue sin poder hacerse un smoke test contra el proveedor real**. No es un
problema de código: es la política de red del entorno de desarrollo. La
verificación contra Wandbox tiene que correrla alguien con salida a
internet, o el propio despliegue.

Para no "confiar y seguir", todo el código ejecutable del curso y del banco
de prácticas se compila y ejecuta con un toolchain local — `g++ -std=c++17`
para C++ y **Mono (`mcs` / `mono`)** para C#, el mismo compilador del perfil
`csharp-mono-6.12` — y sus casos de prueba (visibles y ocultos) se comparan
automáticamente. Ver `scripts/verify-content.ts`:

```bash
LANG=C.UTF-8 npx tsx scripts/verify-content.ts            # todos los cursos
LANG=C.UTF-8 npx tsx scripts/verify-content.ts cpp-desde-cero
```

El locale UTF-8 no es opcional: sin él, cualquier salida con acentos falla
por el entorno y no por el contenido.
