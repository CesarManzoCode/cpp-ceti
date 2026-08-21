# Cómo escribir contenido nuevo

Todo el curso vive en TypeScript tipado dentro de
[`prisma/content/`](../prisma/content). No hay CMS ni SQL a mano: se edita un archivo, se
corre el seed y listo. A cambio de eso hay autocompletado y errores en tiempo de
compilación —un `correctIndex` fuera de rango o un paso sin sus casos de prueba no llega
a la base.

```
prisma/content/
├── types.ts                    # la forma de todo lo de abajo
├── index.ts                    # registro de cursos y unidades
├── unidad-01-primer-programa.ts … unidad-10-matrices.ts
└── exercises/                  # ejercicios de práctica por unidad
```

## Agregar o cambiar una lección

1. Abre (o crea) la unidad en `prisma/content/unidad-XX-*.ts`.
2. Define su `LessonDefinition` con sus pasos.
3. Si es una unidad nueva, regístrala en `prisma/content/index.ts`.
4. Corre `npm run db:seed`.

El seed hace `upsert`: recargar el curso **no borra el progreso** de los usuarios; sólo
recrea los pasos de las lecciones que cambiaron.

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
