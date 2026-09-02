# Cómo escribir contenido nuevo

Todo el contenido vive en TypeScript tipado dentro de
[`prisma/content/`](../prisma/content). No hay CMS ni SQL a mano: se edita un archivo, se
corre el seed y listo. A cambio de eso hay autocompletado y errores en tiempo de
compilación —un `correctIndex` fuera de rango o un paso sin sus casos de prueba no llega
a la base.

```
prisma/content/
├── types.ts                    # la forma de una lección/unidad/curso (IR)
├── authoring.ts                # defineLesson / defineUnit / defineCourse / registry
├── validate.ts                 # validación semántica (sin DB, sin compiladores)
├── index.ts                    # re-exports legacy (cursoCpp, allCourses)
├── courses/
│   ├── index.ts                # EL REGISTRY ÚNICO — un curso nuevo se agrega aquí
│   ├── cpp-desde-cero/index.ts # ensambla el curso legacy de C++ (ver abajo)
│   └── csharp-poo-1/index.ts   # ensambla el curso legacy de C#
├── unidad-01-primer-programa.ts … unidad-10-matrices.ts   # curso de C++ (legacy)
├── csharp/                     # curso de POO I en C# (legacy)
│   ├── index.ts
│   └── unidad-01-modelar.ts … unidad-08-integrador.ts
└── exercises/                  # práctica por unidad
    ├── index.ts                # re-export legacy (allPracticeSets)
    ├── u01-…-u10-…             # banco de C++ (legacy)
    └── csharp/                 # banco de C# (legacy)
```

C++ y C# son contenido **legacy**: sus unidades y su práctica viven en los archivos
grandes de siempre y NO se movieron. `prisma/content/courses/cpp-desde-cero/index.ts` y
`.../csharp-poo-1/index.ts` sólo los ENSAMBLAN con `adaptLegacyUnits` + `defineCourse`
para que entren al mismo registry que un curso nuevo. No repitas ese layout para
contenido viejo — es sólo el punto de entrada.

## Agregar un curso NUEVO

Un curso nuevo SÍ usa el layout completo, con la práctica de cada unidad colocalizada
junto a sus lecciones:

```
prisma/content/courses/<course-slug>/
├── index.ts                    # defineCourse({...metadata, units})
└── units/
    └── 01-<unit-name>/
        ├── index.ts             # defineUnit({...metadata, lessons, practice})
        ├── practice.ts          # PracticeExerciseDefinition[] de la unidad
        └── lessons/
            ├── 01-<lesson>.ts   # defineLesson({...})
            ├── 02-<lesson>.ts
            └── ...
```

- `defineLesson` y `defineUnit` son identidad type-safe: no aplican defaults, no
  reordenan, no mutan lo que les pasas — sólo ayudan a que TypeScript infiera el tipo
  correcto.
- `practice` vive DENTRO de `AuthoredUnitDefinition` (colocalizada con la unidad, en vez
  de un registry aparte que hay que mantener sincronizado a mano). `defineCourse` la
  separa en su propio `PracticeUnitSetDefinition`, derivando `courseSlug`, `unitSlug`,
  `unitTitle` e `unitIcon` de la unidad — no los repitas.
- Registra el curso UNA sola vez, en el orden en que debe aparecer, en
  [`prisma/content/courses/index.ts`](../prisma/content/courses/index.ts):

  ```ts
  import { cppDesdeCero } from "./cpp-desde-cero";
  import { csharpPoo1 } from "./csharp-poo-1";
  import { miCursoNuevo } from "./mi-curso-nuevo";

  const packages = [cppDesdeCero, csharpPoo1, miCursoNuevo] satisfies
    readonly CoursePackageDefinition[];

  export const { allCourses, allPracticeSets } = buildContentRegistry(packages);
  ```

## Agrupar las unidades de un curso por semestre (`curriculum`)

Un `Course` puede tener 0, 1 o varias agrupaciones curriculares (p. ej. "1.er
semestre — Fundamentos de Desarrollo de Software"). Es organización, no identidad:
no crea rutas, no crea progreso ni XP propios, y `Unit.order` sigue siendo el único
orden real de navegación del curso — la agrupación sólo describe cómo se leen esas
unidades ya ordenadas.

`defineCourse` acepta exactamente uno de estos dos caminos (nunca ambos):

```ts
// CURSO GENERAL — sin agrupación curricular. Comportamiento de siempre.
defineCourse({
  ...metadata,
  units: [unidadA, unidadB, /* ... */],
});

// CURSO CURRICULAR — unidades agrupadas por sección.
defineCourse({
  ...metadata,
  curriculum: [
    {
      key: "s1-fundamentos-desarrollo-software", // identidad estable, NO va en URLs
      semester: 1,
      subjectName: "Fundamentos de Desarrollo de Software",
      units: [unidadA, unidadB, unidadC],
    },
    {
      key: "s2-programacion-estructurada",
      semester: 2,
      subjectName: "Programación Estructurada",
      units: [unidadD, unidadE],
    },
  ],
});
```

- El `order` de cada sección se deriva de su posición en el arreglo `curriculum`
  (base 1) — no se declara a mano.
- `defineCourse` APLANA las unidades de todas las secciones, en el orden en que
  aparecen, a `CourseDefinition.units`: ese aplanado es lo que el seed numera como
  `Unit.order`, el orden real de navegación del curso.
- `practice` sigue viviendo colocalizada dentro de cada `AuthoredUnitDefinition`,
  exactamente igual que en el camino sin `curriculum` — la agrupación curricular no
  cambia en nada cómo se autora la práctica.
- Un curso sin `curriculum` es tan válido como uno con una o varias secciones:
  `npm run content:validate` no lo exige.

- Antes de sembrar, corre `npm run content:validate`: valida TODO el contenido (slugs
  únicos, quiz/fill_blank/code_challenge bien formados, referencias de práctica, el par
  lenguaje/perfil, etc.) sin tocar la base ni compilar código. Si algo falla, imprime
  CADA problema con su `path` (ej. `courses[mi-curso].units[u1].lessons[l1].steps[3]`) y
  sale con código 1 — corre esto en vez de intentar depurar un `db:seed` a medias.

No hace falta migrar el contenido viejo a este layout: C++ y C# se quedan como están.

## El curso declara su lenguaje

Cada `CourseDefinition` trae `language` y `executionProfile`. **De ahí sale todo**:
el editor, el resaltado, las sugerencias, los diagnósticos y el compilador con el que se
califica. El par se valida contra el registro de `src/lib/code-languages` al sembrar, así
que un curso con un perfil que no le corresponde no llega a la base.

Los conjuntos de práctica declaran su `courseSlug`. El curso **nunca** se infiere de un
prefijo de slug: dos cursos pueden tener una unidad `arreglos` y un ejercicio con el
mismo nombre sin pisarse.

## Agregar o cambiar una lección

1. Abre (o crea) la unidad en `prisma/content/unidad-XX-*.ts` (C++) o
   `prisma/content/csharp/unidad-XX-*.ts` (C#).
2. Define su `LessonDefinition` con sus pasos.
3. Si es una unidad nueva, regístrala en el `index.ts` de su curso.
4. Corre `npm run db:seed`.
5. Corre `npx tsx scripts/verify-content.ts <slug-del-curso>`: compila y ejecuta todo el
   código nuevo contra sus casos de prueba, visibles y ocultos. Un enunciado se discute;
   una salida que no coincide es un hecho.

El seed hace `upsert`: recargar un curso **no borra el progreso** de los usuarios; sólo
recrea los pasos de las lecciones que cambiaron.

> El verificador usa toolchains LOCALES (`g++` para C++, `mcs`/`mono` para C#) y necesita
> locale UTF-8: `LANG=C.UTF-8 npx tsx scripts/verify-content.ts`. Sin eso, cualquier
> salida con acentos falla por el locale, no por el contenido.

## Código que no se ejecuta en el navegador

Un `code_example` con `runnable: false` no muestra control de ejecución y el servidor
rechaza cualquier intento de ejecutarlo. Cuando ese código sí corre en otro lado
—Windows Forms en Visual Studio, por ejemplo— **usa `localOnlyNote`** para decir dónde.
Un ejemplo sin salida y sin explicación de por qué no corre deja al alumno adivinando.

## Tipos de paso

| `type` | Qué es |
| --- | --- |
| `theory` | Markdown corto (negritas, listas, tablas, bloques ```cpp) |
| `code_example` | Código con explicación; con `runnable: true` se puede compilar y correr ahí mismo |
| `quiz` | Opción múltiple con explicación y, si quieres, un mensaje distinto por opción equivocada |
| `fill_blank` | Código con huecos `{{0}}`, `{{1}}`…, con respuesta exacta, regex o "el mismo identificador que el hueco N" |
| `code_challenge` | El reto: `prompt`, `starterCode`, `solutionCode`, `hints[]` y `testCases[]` |
| `matching` | Pareo de conceptos entre dos columnas, mezcladas visualmente |
| `code_completion` | Reordenar líneas mezcladas hasta dejar el programa correcto |

Un reto se define así:

```ts
{
  type: "code_challenge",
  exercise: {
    prompt: "## Promedio de tres calificaciones\n\nLee tres enteros…",
    starterCode: "#include <iostream>\n…",
    solutionCode: "#include <iostream>\n…",
    hints: ["¿Con qué operador lees tres valores seguidos?", "…"],
    difficulty: "easy",
    testCases: [
      { stdin: "7 8 10", expectedStdout: "Promedio: 8.3", visible: true,
        description: "Promedio con 1 decimal" },
      { stdin: "9 9 9", expectedStdout: "Promedio: 9.0" },   // oculto por defecto
    ],
  },
}
```

Los casos con `visible: true` se muestran como ejemplo en el enunciado. Los demás se
ejecutan igual, pero el estudiante no ve su entrada: sirven para que la solución no se
ajuste al ejemplo.

## Recomendaciones que ya aprendimos

- **Un paso, una idea.** Si una explicación necesita dos pantallas, probablemente son dos
  lecciones.
- **El enunciado manda sobre el código.** En `fill_blank`, escribe `prompt` siempre que la
  respuesta no sea obvia leyendo el fragmento.
- **Salida exacta.** Los tests comparan la salida completa (normalizando saltos de línea
  y espacios finales); pide en el enunciado el formato literal que esperas.
- **Pistas escalonadas.** Se revelan una por una; escribe la primera como pregunta, no
  como respuesta.
- Toma [`unidad-01-primer-programa.ts`](../prisma/content/unidad-01-primer-programa.ts)
  como referencia: es la unidad más trabajada.
