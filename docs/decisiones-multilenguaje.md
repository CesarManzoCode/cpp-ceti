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
| `CS1002` | `missing_semicolon` (existente) |
| `CS0103` | `undeclared_identifier` (existente) |
| `CS0246` | `unknown_type` (existente) |
| `CS1503` | `type_mismatch` (existente) |
| `CS7036` | `invalid_arguments` (existente) |
| `CS0534` | `abstract_member_not_implemented` (**nueva**) |

`CS0534` es el único caso sin equivalente en la taxonomía de GCC: "la clase
derivada no implementa un miembro abstracto" no existe como error en C++
(ahí es un error de instanciación de tipo abstracto, con otra semántica).
Ver `docs/product-analytics.md` y `src/lib/analytics/error-category.ts`.

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

## 6. Ejecución real de C# durante el desarrollo

`wandbox.org` está bloqueado por la política de red de este entorno, así que
no se pudo hacer un smoke test contra el proveedor real. Para no "confiar y
seguir", todo el código C# ejecutable del curso y del banco de prácticas se
compila y ejecuta localmente con **Mono 6.8 (`mcs` / `mono`)**, que es el
mismo compilador y una versión vecina del perfil `csharp-mono-6.12`, y sus
casos de prueba (visibles y ocultos) se verifican automáticamente. Ver
`scripts/verify-csharp-content.ts`.
