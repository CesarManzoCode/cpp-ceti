# Cómo escribir contenido nuevo

Todo el contenido vive en TypeScript tipado dentro de
[`prisma/content/`](../prisma/content). No hay CMS ni SQL a mano: se edita un archivo, se
corre el seed y listo. A cambio de eso hay autocompletado y errores en tiempo de
compilación —un `correctIndex` fuera de rango o un paso sin sus casos de prueba no llega
a la base.

```
prisma/content/
├── types.ts                    # la forma de todo lo de abajo
├── index.ts                    # registro de CURSOS
├── unidad-01-primer-programa.ts … unidad-10-matrices.ts   # curso de C++
├── csharp/                     # curso de POO I en C#
│   ├── index.ts                # el curso y su lenguaje/perfil
│   └── unidad-01-modelar.ts … unidad-08-integrador.ts
└── exercises/                  # práctica por unidad
    ├── u01-…-u10-…             # banco de C++
    └── csharp/                 # banco de C#
```

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
