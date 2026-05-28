import type { UnitDefinition } from "./types";

/**
 * Unidad 10 — Matrices (arreglos 2D)
 *
 * Cierre del bloque de estructuras de datos lineales: una matriz es un
 * arreglo de arreglos. Todo lo que hicimos con arreglos en U8 ahora
 * sucede dentro de un BUCLE ANIDADO: filas × columnas.
 *
 * I/O con printf/scanf (post-U7).
 * Patrón estable de cada lección:
 *   code_example → quiz → fill_blank → challenge × N.
 *
 * Curva de autonomía igual a U8/U9: starter mínimo, alumno escribe el
 * `int main()` y todo el cuerpo.
 */
export const unidad10: UnitDefinition = {
  slug: "matrices",
  title: "Matrices: arreglos en dos dimensiones",
  description:
    "Filas y columnas. Doble for para recorrerlas, sumarlas y buscar dentro.",
  icon: "🧱",
  published: true,
  lessons: [
    // =====================================================================
    // Lección 1: Tu primera matriz
    // =====================================================================
    {
      slug: "declarar-matriz",
      title: "Tu primera matriz",
      description:
        "Declarar una matriz y acceder a sus elementos por [fila][columna].",
      xpReward: 35,
      estimatedMinutes: 9,
      steps: [
        {
          type: "theory",
          markdown: `## Qué es una matriz

Una **matriz** es un arreglo de arreglos: una rejilla de **filas × columnas**.
Sintaxis:

\`\`\`cpp
int m[3][4];   // 3 filas, 4 columnas = 12 enteros en total
\`\`\`

Para acceder a un elemento usas DOS índices: \`m[fila][columna]\`. Ambos
empiezan en 0.

Visualízala así (filas hacia abajo, columnas hacia los lados):

\`\`\`
            col 0   col 1   col 2   col 3
  fila 0    m[0][0] m[0][1] m[0][2] m[0][3]
  fila 1    m[1][0] m[1][1] m[1][2] m[1][3]
  fila 2    m[2][0] m[2][1] m[2][2] m[2][3]
\`\`\`

El primer índice = qué fila. El segundo = qué columna.`,
        },
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  int m[2][3];          // 2 filas, 3 columnas

  // Asignar manualmente cada celda
  m[0][0] = 1;  m[0][1] = 2;  m[0][2] = 3;
  m[1][0] = 4;  m[1][1] = 5;  m[1][2] = 6;

  printf("Esquina superior izquierda: %i\\n", m[0][0]);
  printf("Esquina inferior derecha:   %i\\n", m[1][2]);
  printf("Centro de la fila 0:        %i\\n", m[0][1]);
  return 0;
}`,
          explanation:
            "`int m[2][3];` reserva 6 enteros (2 filas × 3 columnas). Accedes con `m[fila][columna]`. El último índice válido en filas es `2 − 1 = 1`; en columnas `3 − 1 = 2`. Nunca `m[2][...]` ni `m[...][3]` — eso ya es fuera de la matriz.",
          runnable: true,
          expectedOutput:
            "Esquina superior izquierda: 1\nEsquina inferior derecha:   6\nCentro de la fila 0:        2",
        },
        {
          type: "quiz",
          question:
            "Una matriz `int m[3][4];` tiene cuántos elementos en total?",
          options: ["7", "12", "3", "Depende del compilador"],
          correctIndex: 1,
          explanation:
            "Total = filas × columnas = 3 × 4 = **12**. Cada combinación de fila y columna es una celda separada.",
        },
        {
          type: "fill_blank",
          template: `int m[2][2];

m[{{0}}][0] = 10;     // fila 0, columna 0
m[0][{{1}}] = 20;     // fila 0, columna 1
m[1][{{2}}] = 30;     // fila 1, columna 0
m[{{3}}][1] = 40;     // fila 1, columna 1

printf("%i\\n", m[{{4}}][{{5}}]);   // imprime el 30`,
          blanks: [
            { answer: "0", hint: "Primera fila." },
            { answer: "1", hint: "Segunda columna (índice 1)." },
            { answer: "0", hint: "Primera columna." },
            { answer: "1", hint: "Segunda fila (índice 1)." },
            { answer: "1", hint: "Para imprimir 30, la fila es la segunda." },
            { answer: "0", hint: "Para imprimir 30, la columna es la primera." },
          ],
          explanation:
            "El PRIMER corchete es la FILA, el SEGUNDO es la COLUMNA. Ambos parten de 0.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Las 4 esquinas
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Las 4 esquinas de una matriz 2×2

Declara \`int m[2][2];\` y asigna estos valores:

| Fila | Col 0 | Col 1 |
|------|-------|-------|
| 0    | 10    | 20    |
| 1    | 30    | 40    |

Imprime los 4 valores, **uno por línea**, en orden de lectura
(\`m[0][0]\`, \`m[0][1]\`, \`m[1][0]\`, \`m[1][1]\`).

Salida esperada:

\`\`\`
10
20
30
40
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[2][2];
  m[0][0] = 10;
  m[0][1] = 20;
  m[1][0] = 30;
  m[1][1] = 40;
  printf("%i\\n", m[0][0]);
  printf("%i\\n", m[0][1]);
  printf("%i\\n", m[1][0]);
  printf("%i\\n", m[1][1]);
  return 0;
}`,
            hints: [
              "Cuatro asignaciones, una por celda.",
              "Cuatro `printf` con `%i\\n`, en el orden de lectura (fila por fila).",
            ],
            testCases: [
              {
                expectedStdout: "10\n20\n30\n40\n",
                visible: true,
                description: "Las 4 celdas en orden",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Centro destacado
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Centro destacado

Declara \`int m[3][3];\` y asigna **0** en TODAS las celdas. Después
sobrescribe \`m[1][1]\` (la celda del centro) con el valor **99**.

Imprime los 9 valores en orden, uno por línea (recorriendo fila por fila).

Salida esperada:

\`\`\`
0
0
0
0
99
0
0
0
0
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[3][3];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      m[i][j] = 0;
    }
  }
  m[1][1] = 99;

  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      printf("%i\\n", m[i][j]);
    }
  }
  return 0;
}`,
            hints: [
              "Para llenar con 0 puedes usar dobles for: uno externo por fila, uno interno por columna.",
              "Después de llenar, una sola línea: `m[1][1] = 99;`.",
              "Para imprimir, mismo patrón de dobles for con `printf(\"%i\\n\", m[i][j]);`.",
            ],
            testCases: [
              {
                expectedStdout: "0\n0\n0\n0\n99\n0\n0\n0\n0\n",
                visible: true,
                description: "Solo el centro destacado",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Intercambio diagonal
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Intercambio diagonal

Declara una matriz \`int m[3][3];\` con estos valores:

\`\`\`
1 2 3
4 5 6
7 8 9
\`\`\`

Intercambia las dos esquinas de la diagonal principal: \`m[0][0]\` y
\`m[2][2]\` (usa una variable auxiliar \`tmp\`). Después imprime los 9 valores,
uno por línea.

Salida esperada:

\`\`\`
9
2
3
4
5
6
7
8
1
\`\`\``,
            difficulty: "hard",
            xpReward: 40,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[3][3];
  int valor = 1;
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      m[i][j] = valor;
      valor++;
    }
  }

  int tmp = m[0][0];
  m[0][0] = m[2][2];
  m[2][2] = tmp;

  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      printf("%i\\n", m[i][j]);
    }
  }
  return 0;
}`,
            hints: [
              "Para llenar con 1..9 puedes usar un contador `int valor = 1;` que aumenta dentro del doble for.",
              "El intercambio necesita variable temporal: `int tmp = m[0][0]; m[0][0] = m[2][2]; m[2][2] = tmp;`.",
              "El último doble for recorre y imprime con `%i\\n`.",
            ],
            testCases: [
              {
                expectedStdout: "9\n2\n3\n4\n5\n6\n7\n8\n1\n",
                visible: true,
                description: "Solo las dos esquinas intercambiadas",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 2: Inicializar al declarar
    // =====================================================================
    {
      slug: "inicializar-matriz",
      title: "Inicializar una matriz con llaves",
      description:
        "Asigna todos los valores en la declaración con `{{...},{...}}`.",
      xpReward: 35,
      estimatedMinutes: 9,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  int m[2][3] = {
    {10, 20, 30},   // fila 0
    {40, 50, 60},   // fila 1
  };

  printf("%i\\n", m[0][1]);  // 20
  printf("%i\\n", m[1][2]);  // 60
  return 0;
}`,
          explanation:
            "Con `{}` dentro de `{}` defines toda la matriz al declarar. La llave EXTERNA agrupa filas; cada llave INTERNA es una fila con sus columnas.",
          runnable: true,
          expectedOutput: "20\n60",
        },
        {
          type: "quiz",
          question:
            "¿Qué pasa si pones MENOS columnas de las declaradas? Ej: `int m[2][3] = {{1, 2}, {4}};`",
          options: [
            "Error de compilación.",
            "Las celdas que faltan se inicializan a 0.",
            "Las celdas que faltan contienen basura.",
            "Solo se crea una matriz 2×2.",
          ],
          correctIndex: 1,
          explanation:
            "Igual que con arreglos 1D: las celdas no especificadas se inicializan a `0`. Por eso `int m[10][10] = {0};` es un truco común para una matriz toda en ceros.",
        },
        {
          type: "fill_blank",
          template: `// Calificaciones de 2 alumnos en 3 materias
int notas[{{0}}][{{1}}] = {
  {8, 9, {{2}}},     // Aurora
  {{{3}}, 6, 7},     // Mario
};

printf("Aurora materia 0: %i\\n", notas[0][0]);
printf("Mario materia 2:  %i\\n", notas[{{4}}][{{5}}]);`,
          blanks: [
            { answer: "2", hint: "Cantidad de filas (alumnos)." },
            { answer: "3", hint: "Cantidad de columnas (materias)." },
            { answer: "10", hint: "Tercera materia de Aurora — completa el patrón {8, 9, ?}." },
            { answer: "5", hint: "Primera materia de Mario — completa {?, 6, 7}." },
            { answer: "1", hint: "Mario es la segunda fila → índice 1." },
            { answer: "2", hint: "La tercera materia → índice 2." },
          ],
          explanation:
            "Cada llave interna es una fila. Las dimensiones entre `[]` deben coincidir con la estructura de las llaves.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Calendario corto
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Cuatro semanas, dos meses

Inicializa la matriz \`int dias[2][4]\` con esta tabla (días de las primeras
4 semanas de dos meses):

\`\`\`
{7, 7, 7, 7}   // mes 0 (enero, semanas completas)
{7, 7, 7, 7}   // mes 1 (febrero, igual)
\`\`\`

Imprime los 8 valores en orden de lectura (uno por línea).

Salida esperada (8 líneas con \`7\`):

\`\`\`
7
7
7
7
7
7
7
7
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int dias[2][4] = {
    {7, 7, 7, 7},
    {7, 7, 7, 7},
  };
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 4; j++) {
      printf("%i\\n", dias[i][j]);
    }
  }
  return 0;
}`,
            hints: [
              "Inicializa con `{{7,7,7,7}, {7,7,7,7}}` dentro de las dimensiones `[2][4]`.",
              "Doble for con `printf(\"%i\\n\", dias[i][j]);`.",
            ],
            testCases: [
              {
                expectedStdout: "7\n7\n7\n7\n7\n7\n7\n7\n",
                visible: true,
                description: "Ocho sietes",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Identidad 3x3
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Matriz identidad 3×3

Inicializa \`int I[3][3]\` con la **matriz identidad** (1 en la diagonal,
0 fuera):

\`\`\`
{1, 0, 0}
{0, 1, 0}
{0, 0, 1}
\`\`\`

Recórrela con doble for e imprime cada elemento, uno por línea.

Salida esperada:

\`\`\`
1
0
0
0
1
0
0
0
1
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int I[3][3] = {
    {1, 0, 0},
    {0, 1, 0},
    {0, 0, 1},
  };
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      printf("%i\\n", I[i][j]);
    }
  }
  return 0;
}`,
            hints: [
              "Inicializa con las 3 filas explícitas — cada una con su 1 en la posición correspondiente.",
              "Doble for con `%i\\n` para imprimir uno por línea.",
            ],
            testCases: [
              {
                expectedStdout: "1\n0\n0\n0\n1\n0\n0\n0\n1\n",
                visible: true,
                description: "Identidad 3×3 leída fila por fila",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Tabla de multiplicar 4×4
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Tabla de multiplicar 4×4

Sin pedirle nada al usuario, **construye** una matriz \`int t[4][4]\` donde
\`t[i][j] = (i+1) * (j+1)\` — es la tabla de multiplicar del 1×1 al 4×4.

Después imprime los 16 valores, uno por línea, en orden de lectura.

Resultado esperado (en orden):

\`\`\`
1   2   3   4
2   4   6   8
3   6   9  12
4   8  12  16
\`\`\`

Salida esperada (lineal):

\`\`\`
1
2
3
4
2
4
6
8
3
6
9
12
4
8
12
16
\`\`\``,
            difficulty: "hard",
            xpReward: 40,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int t[4][4];
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      t[i][j] = (i + 1) * (j + 1);
    }
  }
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      printf("%i\\n", t[i][j]);
    }
  }
  return 0;
}`,
            hints: [
              "Llenado: doble for asignando `t[i][j] = (i+1) * (j+1);`.",
              "Impresión: otro doble for con `%i\\n`.",
            ],
            testCases: [
              {
                expectedStdout:
                  "1\n2\n3\n4\n2\n4\n6\n8\n3\n6\n9\n12\n4\n8\n12\n16\n",
                visible: true,
                description: "Tabla de multiplicar lineal",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 3: Imprimir matriz formato rejilla
    // =====================================================================
    {
      slug: "imprimir-matriz",
      title: "Imprimir matriz fila por fila",
      description:
        "Doble for: el externo controla filas, el interno columnas. Salto de línea al terminar cada fila.",
      xpReward: 40,
      estimatedMinutes: 10,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  int m[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9},
  };

  // Doble for: imprime tipo rejilla
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      if (j > 0) printf(" ");   // espacio ENTRE valores
      printf("%i", m[i][j]);
    }
    printf("\\n");               // salto al terminar la FILA
  }
  return 0;
}`,
          explanation:
            "Para ver la matriz como rejilla: imprime cada valor sin salto de línea, separa con espacios, y al terminar la fila (después del for interno) imprime un `\\n`. El `if (j > 0)` evita el espacio extra antes del primer valor de cada fila.",
          runnable: true,
          expectedOutput: "1 2 3\n4 5 6\n7 8 9",
        },
        {
          type: "quiz",
          question:
            "¿Qué pasa si pones el `printf(\"\\n\")` ANTES del for interno (no después)?",
          options: [
            "Lo mismo, ningún cambio.",
            "Cada elemento queda en su propia línea (no se ve la rejilla).",
            "Salto extra al inicio.",
            "Error de compilación.",
          ],
          correctIndex: 2,
          explanation:
            "Si pones `\\n` antes del for interno, cada nueva fila empieza con un salto innecesario al principio (antes de imprimir los valores). Lo correcto es DESPUÉS de imprimir todas las columnas de la fila.",
        },
        {
          type: "fill_blank",
          template: `int m[2][3] = {
  {10, 20, 30},
  {40, 50, 60},
};

for (int i = 0; i < {{0}}; i++) {
  for (int j = 0; j < {{1}}; j++) {
    if ({{2}} > 0) printf(" ");
    printf("%i", m[{{3}}][{{4}}]);
  }
  printf("{{5}}");
}`,
          blanks: [
            { answer: "2", hint: "Cantidad de filas." },
            { answer: "3", hint: "Cantidad de columnas." },
            { answer: "j", hint: "Sólo añadir espacio si NO es la primera columna." },
            { answer: "i", hint: "Fila variable: el contador externo." },
            { answer: "j", hint: "Columna variable: el contador interno." },
            { answer: "\\n", hint: "Salto al terminar cada fila." },
          ],
          explanation:
            "Estructura fija para imprimir tipo rejilla: doble for, espacio entre valores SI no es la primera columna, salto de línea al final de cada fila.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Imprimir rejilla 2x3
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Rejilla 2×3

Inicializa \`int m[2][3] = {{1,2,3},{4,5,6}};\` y muéstrala como rejilla
(valores en la misma fila separados por UN espacio, salto de línea al final
de cada fila).

Salida esperada:

\`\`\`
1 2 3
4 5 6
\`\`\``,
            difficulty: "easy",
            xpReward: 28,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 3; j++) {
      if (j > 0) printf(" ");
      printf("%i", m[i][j]);
    }
    printf("\\n");
  }
  return 0;
}`,
            hints: [
              "Doble for: externo de 0 a 2, interno de 0 a 3.",
              "Antes del valor, `if (j > 0) printf(\" \");` — pone espacio sólo a partir del segundo elemento.",
              "Después del for interno (todavía dentro del externo), `printf(\"\\n\");` cierra la fila.",
            ],
            testCases: [
              {
                expectedStdout: "1 2 3\n4 5 6\n",
                visible: true,
                description: "Rejilla 2×3",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Tabla de 5x5
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Tabla de sumas 5×5

Construye una matriz \`int s[5][5]\` donde \`s[i][j] = i + j\`. Imprímela
como rejilla.

Salida esperada:

\`\`\`
0 1 2 3 4
1 2 3 4 5
2 3 4 5 6
3 4 5 6 7
4 5 6 7 8
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int s[5][5];
  for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
      s[i][j] = i + j;
    }
  }
  for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
      if (j > 0) printf(" ");
      printf("%i", s[i][j]);
    }
    printf("\\n");
  }
  return 0;
}`,
            hints: [
              "Primero llena la matriz con `s[i][j] = i + j;` en doble for.",
              "Después imprime con el patrón de rejilla.",
            ],
            testCases: [
              {
                expectedStdout:
                  "0 1 2 3 4\n1 2 3 4 5\n2 3 4 5 6\n3 4 5 6 7\n4 5 6 7 8\n",
                visible: true,
                description: "Tabla de sumas i + j",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Transpuesta
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Transpuesta de una matriz 3×3

Inicializa una matriz \`int m[3][3]\` con valores **1..9** (fila por fila).

Construye una nueva matriz \`int t[3][3]\` donde \`t[i][j] = m[j][i]\` (la
**transpuesta**: intercambia filas y columnas).

Imprime \`t\` como rejilla.

Matriz original:

\`\`\`
1 2 3
4 5 6
7 8 9
\`\`\`

Transpuesta esperada:

\`\`\`
1 4 7
2 5 8
3 6 9
\`\`\``,
            difficulty: "hard",
            xpReward: 45,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[3][3];
  int v = 1;
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      m[i][j] = v;
      v++;
    }
  }

  int t[3][3];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      t[i][j] = m[j][i];
    }
  }

  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      if (j > 0) printf(" ");
      printf("%i", t[i][j]);
    }
    printf("\\n");
  }
  return 0;
}`,
            hints: [
              "Para llenar 1..9 usa un contador `int v = 1;` que sube dentro del doble for.",
              "La transpuesta es literalmente `t[i][j] = m[j][i];` — fíjate cómo los índices se invierten.",
              "Al imprimir, sigue el patrón de rejilla del ejemplo.",
            ],
            testCases: [
              {
                expectedStdout: "1 4 7\n2 5 8\n3 6 9\n",
                visible: true,
                description: "Transpuesta de la matriz 1..9",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 4: Leer matriz con scanf
    // =====================================================================
    {
      slug: "leer-matriz",
      title: "Llenar una matriz con scanf",
      description:
        "Bucles anidados + `scanf(\"%i\", &m[i][j])`. Igual que con arreglos pero con doble índice.",
      xpReward: 40,
      estimatedMinutes: 11,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  int m[2][2];

  // Llenado: el usuario teclea 4 valores
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
      scanf("%i", &m[i][j]);
    }
  }

  // Confirmación: imprime cada celda con sus índices
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
      printf("m[%i][%i] = %i\\n", i, j, m[i][j]);
    }
  }
  return 0;
}`,
          explanation:
            "Dos bucles anidados: el externo recorre filas, el interno columnas. `scanf(\"%i\", &m[i][j])` lee un entero al elemento `[i][j]`. **No olvides el `&`** — sin él el programa crashea.",
          runnable: true,
          expectedOutput: "",
        },
        {
          type: "quiz",
          question:
            "Si el usuario teclea `1 2 3 4` y haces `scanf` en doble for de 2×2, ¿qué valor toma `m[1][0]`?",
          options: [
            "1 (el primer valor).",
            "2 (el segundo).",
            "3 (el tercero).",
            "4 (el último).",
          ],
          correctIndex: 2,
          explanation:
            "El doble for asigna en este orden: `m[0][0]=1`, `m[0][1]=2`, `m[1][0]=3`, `m[1][1]=4`. La matriz se llena **fila por fila**: completa toda la fila 0 antes de pasar a la fila 1.",
        },
        {
          type: "fill_blank",
          template: `int m[3][3];

// Lectura: 9 enteros del usuario
for (int i = 0; i < {{0}}; i++) {
  for (int j = 0; j < {{1}}; j++) {
    scanf("%i", {{2}}m[{{3}}][{{4}}]);
  }
}

// Imprime SOLO la diagonal principal (m[0][0], m[1][1], m[2][2])
for (int k = 0; k < 3; k++) {
  printf("%i\\n", m[{{5}}][{{6}}]);
}`,
          blanks: [
            { answer: "3", hint: "Cantidad de filas." },
            { answer: "3", hint: "Cantidad de columnas." },
            { answer: "&", hint: "OBLIGATORIO antes del destino en scanf." },
            { answer: "i", hint: "Fila variable: contador externo." },
            { answer: "j", hint: "Columna variable: contador interno." },
            { answer: "k", hint: "Mismo índice para fila..." },
            { answer: "k", hint: "...y columna, en la diagonal." },
          ],
          explanation:
            "El `&m[i][j]` es indispensable. Para la diagonal principal, fila y columna son iguales: `m[k][k]`.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Eco 2x2
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Eco de 2×2

Lee **4 enteros** con \`scanf\` y guárdalos en \`int m[2][2];\` (orden:
\`m[0][0], m[0][1], m[1][0], m[1][1]\`). Imprime los 4 valores en el MISMO
orden, uno por línea.

Para el test, el sistema enviará: \`10 20 30 40\`.

Salida esperada:

\`\`\`
10
20
30
40
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[2][2];
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
      scanf("%i", &m[i][j]);
    }
  }
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
      printf("%i\\n", m[i][j]);
    }
  }
  return 0;
}`,
            hints: [
              "Lectura: doble for con `scanf(\"%i\", &m[i][j]);`. No olvides el `&`.",
              "Impresión: mismo doble for con `printf(\"%i\\n\", m[i][j]);`.",
            ],
            testCases: [
              {
                stdin: "10 20 30 40\n",
                expectedStdout: "10\n20\n30\n40\n",
                visible: true,
                description: "Eco de 4 valores",
              },
              {
                stdin: "1 2 3 4\n",
                expectedStdout: "1\n2\n3\n4\n",
                visible: false,
                description: "Otro caso",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Leer 3x3 e imprimir como rejilla
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Leer 3×3 e imprimir como rejilla

Lee **9 enteros** con \`scanf\` en una matriz \`int m[3][3];\`. Imprímelos
como rejilla (valores separados por UN espacio, salto de línea por fila).

Para el test, el sistema enviará: \`1 2 3 4 5 6 7 8 9\`.

Salida esperada:

\`\`\`
1 2 3
4 5 6
7 8 9
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[3][3];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      scanf("%i", &m[i][j]);
    }
  }
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      if (j > 0) printf(" ");
      printf("%i", m[i][j]);
    }
    printf("\\n");
  }
  return 0;
}`,
            hints: [
              "Lectura: doble for con scanf.",
              "Impresión tipo rejilla: separa con espacios sólo cuando `j > 0` y `\\n` al final de cada fila.",
            ],
            testCases: [
              {
                stdin: "1 2 3 4 5 6 7 8 9\n",
                expectedStdout: "1 2 3\n4 5 6\n7 8 9\n",
                visible: true,
                description: "Caso ejemplo",
              },
              {
                stdin: "10 20 30 40 50 60 70 80 90\n",
                expectedStdout: "10 20 30\n40 50 60\n70 80 90\n",
                visible: false,
                description: "Otro caso",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Doblar todos los valores
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Doblar cada celda

Lee una matriz **2×3** con scanf (6 enteros). **Multiplica cada elemento
por 2 dentro de la misma matriz** (sin matriz auxiliar). Imprime el
resultado como rejilla.

Para el test, el sistema enviará: \`1 2 3 4 5 6\`.

Salida esperada:

\`\`\`
2 4 6
8 10 12
\`\`\``,
            difficulty: "hard",
            xpReward: 45,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[2][3];
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 3; j++) {
      scanf("%i", &m[i][j]);
    }
  }
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 3; j++) {
      m[i][j] *= 2;
    }
  }
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 3; j++) {
      if (j > 0) printf(" ");
      printf("%i", m[i][j]);
    }
    printf("\\n");
  }
  return 0;
}`,
            hints: [
              "Tres bloques: leer, modificar (en lugar), imprimir.",
              "Para multiplicar en lugar: `m[i][j] *= 2;` o `m[i][j] = m[i][j] * 2;`.",
            ],
            testCases: [
              {
                stdin: "1 2 3 4 5 6\n",
                expectedStdout: "2 4 6\n8 10 12\n",
                visible: true,
                description: "Doble de 1..6",
              },
              {
                stdin: "0 5 10 15 20 25\n",
                expectedStdout: "0 10 20\n30 40 50\n",
                visible: false,
                description: "Mixto con cero",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 5: Suma total de la matriz
    // =====================================================================
    {
      slug: "suma-matriz",
      title: "Sumar todos los elementos",
      description: "Acumulador dentro de un doble for — patrón clásico.",
      xpReward: 40,
      estimatedMinutes: 10,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  int m[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9},
  };

  int suma = 0;                       // acumulador FUERA de los fors
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      suma += m[i][j];                // suma cada celda
    }
  }
  printf("Suma total: %i\\n", suma);  // 45
  return 0;
}`,
          explanation:
            "Igual que con arreglos 1D: variable acumuladora **antes** del doble for, `+=` dentro, `printf` después. Cada celda se visita una vez gracias al doble recorrido.",
          runnable: true,
          expectedOutput: "Suma total: 45",
        },
        {
          type: "quiz",
          question:
            "¿Dónde debe declararse e inicializarse el acumulador `suma`?",
          options: [
            "Dentro del for interno (se inicializa cada vez).",
            "Dentro del for externo (se reinicia por fila).",
            "ANTES de ambos fors, en 0 — para que sobreviva entre vueltas.",
            "Da lo mismo, todos funcionan.",
          ],
          correctIndex: 2,
          explanation:
            "Si lo declaras dentro de algún for, se reinicia y pierdes el valor acumulado. Tiene que vivir antes del doble for para acumular todas las visitas.",
        },
        {
          type: "fill_blank",
          template: `int v[2][3] = {
  {10, 20, 30},
  {40, 50, 60},
};

int suma = {{0}};

for (int i = 0; i < {{1}}; i++) {
  for (int j = 0; j < {{2}}; j++) {
    suma {{3}} v[i][j];
  }
}

printf("Total: %i\\n", {{4}});`,
          blanks: [
            { answer: "0", hint: "Valor inicial del acumulador." },
            { answer: "2", hint: "Cantidad de filas." },
            { answer: "3", hint: "Cantidad de columnas." },
            { answer: "+=", hint: "Atajo de `suma = suma + v[i][j]`." },
            { answer: "suma", hint: "La variable acumulada que declaraste arriba." },
          ],
          explanation:
            "Patrón fijo: acumulador en 0 ANTES del doble for, `+=` en cada celda, `printf` con la variable acumulada al final.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Suma de matriz fija
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Suma de matriz 2×2

Inicializa \`int m[2][2] = {{1, 2}, {3, 4}};\`. Calcula la suma de las 4
celdas e imprímela SOLA (sin texto).

Suma = 10.

Salida esperada:

\`\`\`
10
\`\`\``,
            difficulty: "easy",
            xpReward: 28,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[2][2] = {{1, 2}, {3, 4}};
  int suma = 0;
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
      suma += m[i][j];
    }
  }
  printf("%i\\n", suma);
  return 0;
}`,
            hints: [
              "Doble for + acumulador en 0.",
              "Imprime SOLO la suma con `printf(\"%i\\n\", suma);`.",
            ],
            testCases: [
              {
                expectedStdout: "10\n",
                visible: true,
                description: "1+2+3+4 = 10",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Suma leída 3x3
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Suma de 3×3 leída

Lee 9 enteros con scanf y guárdalos en \`int m[3][3];\`. Calcula y muestra
la suma de TODOS los elementos.

Para el test, el sistema enviará: \`1 2 3 4 5 6 7 8 9\` → 45.

Salida esperada:

\`\`\`
Suma: 45
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[3][3];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      scanf("%i", &m[i][j]);
    }
  }
  int suma = 0;
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      suma += m[i][j];
    }
  }
  printf("Suma: %i\\n", suma);
  return 0;
}`,
            hints: [
              "Tres bloques: lectura (doble for con scanf), acumulación (doble for con +=), impresión.",
              "Imprime con el prefijo exacto `Suma: ` y `%i`.",
            ],
            testCases: [
              {
                stdin: "1 2 3 4 5 6 7 8 9\n",
                expectedStdout: "Suma: 45\n",
                visible: true,
                description: "1..9 = 45",
              },
              {
                stdin: "0 0 0 0 0 0 0 0 0\n",
                expectedStdout: "Suma: 0\n",
                visible: false,
                description: "Toda en ceros",
              },
              {
                stdin: "10 10 10 10 10 10 10 10 10\n",
                expectedStdout: "Suma: 90\n",
                visible: false,
                description: "9 dieces",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Suma por filas
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Suma por filas

Lee una matriz \`int m[3][4]\` con scanf (12 enteros). Para CADA fila,
calcula su suma e imprímela así (una por línea):

\`\`\`
Fila 0: <s0>
Fila 1: <s1>
Fila 2: <s2>
\`\`\`

Para el test, el sistema enviará:

\`\`\`
1 2 3 4
5 6 7 8
9 10 11 12
\`\`\`

- Fila 0: 1+2+3+4 = **10**
- Fila 1: 5+6+7+8 = **26**
- Fila 2: 9+10+11+12 = **42**

Salida esperada:

\`\`\`
Fila 0: 10
Fila 1: 26
Fila 2: 42
\`\`\``,
            difficulty: "hard",
            xpReward: 45,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[3][4];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
      scanf("%i", &m[i][j]);
    }
  }
  for (int i = 0; i < 3; i++) {
    int suma = 0;
    for (int j = 0; j < 4; j++) {
      suma += m[i][j];
    }
    printf("Fila %i: %i\\n", i, suma);
  }
  return 0;
}`,
            hints: [
              "Truco: el acumulador `suma` se declara DENTRO del for externo (se reinicia para cada fila).",
              "El for interno suma toda la fila; al terminarlo, imprimes el total y pasas a la siguiente fila.",
              "El printf lleva DOS `%i`: el número de fila y la suma.",
            ],
            testCases: [
              {
                stdin: "1 2 3 4 5 6 7 8 9 10 11 12\n",
                expectedStdout: "Fila 0: 10\nFila 1: 26\nFila 2: 42\n",
                visible: true,
                description: "Caso ejemplo",
              },
              {
                stdin: "0 0 0 0 1 1 1 1 2 2 2 2\n",
                expectedStdout: "Fila 0: 0\nFila 1: 4\nFila 2: 8\n",
                visible: false,
                description: "Sumas pequeñas",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 6: Máximo de una matriz
    // =====================================================================
    {
      slug: "maximo-matriz",
      title: "Encontrar el mayor (y dónde está)",
      description:
        "Igual que en arreglos 1D pero con doble for. Arrancas con `m[0][0]` y comparas.",
      xpReward: 45,
      estimatedMinutes: 11,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  int m[2][3] = {
    {3, 8, 1},
    {9, 4, 6},
  };

  int mayor = m[0][0];  // arranca con el primer elemento

  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 3; j++) {
      if (m[i][j] > mayor) {
        mayor = m[i][j];
      }
    }
  }

  printf("El mayor es %i\\n", mayor);
  return 0;
}`,
          explanation:
            "Misma estrategia que con arreglos 1D: arranca asumiendo que el primer elemento (`m[0][0]`) es el mayor; recorre todas las celdas con doble for; cuando encuentras una mayor, actualiza.",
          runnable: true,
          expectedOutput: "El mayor es 9",
        },
        {
          type: "quiz",
          question:
            "¿Por qué inicializamos `mayor = m[0][0]` y no `mayor = 0`?",
          options: [
            "Por estética.",
            "Si todos los valores son negativos, `mayor = 0` daría 0 como resultado, que no existe en la matriz.",
            "C++ no permite inicializar con literales.",
            "Es más rápido.",
          ],
          correctIndex: 1,
          explanation:
            "Inicializar con `0` es un atajo peligroso. Siempre arranca con un valor que SÍ exista en la matriz (típicamente `m[0][0]`) para que tu respuesta sea correcta sin importar el rango de valores.",
        },
        {
          type: "fill_blank",
          template: `int m[3][3];

// Lectura
for (int i = 0; i < 3; i++) {
  for (int j = 0; j < 3; j++) {
    scanf("%i", &m[i][j]);
  }
}

int menor = m[{{0}}][{{1}}];   // arranca con la primera celda

for (int i = 0; i < 3; i++) {
  for (int j = 0; j < 3; j++) {
    if (m[i][j] {{2}} menor) {
      menor = m[i][j];
    }
  }
}

printf("Menor: %i\\n", {{3}});`,
          blanks: [
            { answer: "0", hint: "Fila del primer elemento." },
            { answer: "0", hint: "Columna del primer elemento." },
            { answer: "<", hint: "Para el MENOR, estrictamente menor que el actual." },
            { answer: "menor", hint: "La variable que guarda el mínimo, no la matriz." },
          ],
          explanation:
            "Para el mínimo es la misma estructura del máximo, sólo cambia `>` por `<` y el nombre de la variable.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Máximo de 2x3
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Máximo de 2×3 leída

Lee una matriz \`int m[2][3];\` (6 enteros) y muestra SOLO el valor más alto.

Para el test, el sistema enviará: \`3 8 1 9 4 6\` → 9.

Salida esperada:

\`\`\`
9
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[2][3];
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 3; j++) {
      scanf("%i", &m[i][j]);
    }
  }
  int mayor = m[0][0];
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 3; j++) {
      if (m[i][j] > mayor) mayor = m[i][j];
    }
  }
  printf("%i\\n", mayor);
  return 0;
}`,
            hints: [
              "Lee primero todas las celdas con doble for + scanf.",
              "Después, `int mayor = m[0][0];` y doble for con `if (m[i][j] > mayor) mayor = m[i][j];`.",
            ],
            testCases: [
              {
                stdin: "3 8 1 9 4 6\n",
                expectedStdout: "9\n",
                visible: true,
                description: "Máximo de 2×3",
              },
              {
                stdin: "-1 -5 -3 -2 -10 -7\n",
                expectedStdout: "-1\n",
                visible: false,
                description: "Negativos",
              },
              {
                stdin: "100 1 1 1 1 1\n",
                expectedStdout: "100\n",
                visible: false,
                description: "Máximo al inicio",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Máximo y mínimo
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Máximo y mínimo en una sola pasada

Lee \`int m[3][3];\` (9 enteros). En **una sola pasada** (un solo doble for),
calcula \`mayor\` Y \`menor\`. Imprime:

\`\`\`
Mayor: <m>
Menor: <n>
\`\`\`

Para el test, el sistema enviará: \`5 3 8 1 9 4 7 2 6\`.

- Mayor = 9, Menor = 1.

Salida esperada:

\`\`\`
Mayor: 9
Menor: 1
\`\`\``,
            difficulty: "medium",
            xpReward: 38,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[3][3];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      scanf("%i", &m[i][j]);
    }
  }
  int mayor = m[0][0];
  int menor = m[0][0];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      if (m[i][j] > mayor) mayor = m[i][j];
      if (m[i][j] < menor) menor = m[i][j];
    }
  }
  printf("Mayor: %i\\n", mayor);
  printf("Menor: %i\\n", menor);
  return 0;
}`,
            hints: [
              "Inicializa AMBAS variables con `m[0][0]`.",
              "Dentro del doble for: dos `if` independientes, uno para mayor y otro para menor.",
            ],
            testCases: [
              {
                stdin: "5 3 8 1 9 4 7 2 6\n",
                expectedStdout: "Mayor: 9\nMenor: 1\n",
                visible: true,
                description: "Caso ejemplo",
              },
              {
                stdin: "7 7 7 7 7 7 7 7 7\n",
                expectedStdout: "Mayor: 7\nMenor: 7\n",
                visible: false,
                description: "Todos iguales",
              },
              {
                stdin: "-1 -2 -3 -4 -5 -6 -7 -8 -9\n",
                expectedStdout: "Mayor: -1\nMenor: -9\n",
                visible: false,
                description: "Todos negativos",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Posición del máximo
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Posición del máximo

Lee \`int m[3][3];\` (9 enteros). Encuentra dónde está el valor MÁS GRANDE
y reporta su **fila y columna** (base 0). Si hay empate, devuelve la primera
posición encontrada (recorriendo fila por fila).

Imprime:

\`\`\`
Mayor: <valor>
Posicion: (<fila>, <columna>)
\`\`\`

Para el test, el sistema enviará: \`3 8 1 9 4 6 2 5 7\`.

- Mayor = 9, en \`m[1][0]\` → fila 1, columna 0.

Salida esperada:

\`\`\`
Mayor: 9
Posicion: (1, 0)
\`\`\``,
            difficulty: "hard",
            xpReward: 50,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int m[3][3];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      scanf("%i", &m[i][j]);
    }
  }
  int filaM = 0;
  int colM = 0;
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      if (m[i][j] > m[filaM][colM]) {
        filaM = i;
        colM = j;
      }
    }
  }
  printf("Mayor: %i\\n", m[filaM][colM]);
  printf("Posicion: (%i, %i)\\n", filaM, colM);
  return 0;
}`,
            hints: [
              "Guarda DOS índices: `filaM` y `colM`. Inicialízalos en 0.",
              "Dentro del doble for, compara con `m[filaM][colM]`. Si encuentras mayor, actualiza AMBOS índices.",
              "Para empates, usa `>` estricto (no `>=`) — así se queda la primera aparición.",
            ],
            testCases: [
              {
                stdin: "3 8 1 9 4 6 2 5 7\n",
                expectedStdout: "Mayor: 9\nPosicion: (1, 0)\n",
                visible: true,
                description: "Máximo en (1,0)",
              },
              {
                stdin: "1 2 3 4 5 6 7 8 9\n",
                expectedStdout: "Mayor: 9\nPosicion: (2, 2)\n",
                visible: false,
                description: "Máximo en la esquina (2,2)",
              },
              {
                stdin: "5 5 5 5 5 5 5 5 5\n",
                expectedStdout: "Mayor: 5\nPosicion: (0, 0)\n",
                visible: false,
                description: "Empate total → primera",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 7: Integrador — boletín por alumnos y materias
    // =====================================================================
    {
      slug: "integrador-matrices",
      title: "Integrador: boletín por filas y columnas",
      description:
        "Junta todo: leer una matriz, sumar por filas, promediar y encontrar al mejor.",
      xpReward: 70,
      estimatedMinutes: 15,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  // 3 alumnos (filas) × 4 materias (columnas)
  int notas[3][4];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
      scanf("%i", &notas[i][j]);
    }
  }

  // Promedio por alumno
  for (int i = 0; i < 3; i++) {
    int suma = 0;
    for (int j = 0; j < 4; j++) {
      suma += notas[i][j];
    }
    double prom = suma / 4.0;
    printf("Alumno %i promedio: %.2f\\n", i, prom);
  }
  return 0;
}`,
          explanation:
            "Patrón profesional: la matriz tiene un significado **semántico** — filas son alumnos, columnas son materias. Las operaciones se hacen agrupadas por la dimensión que corresponde (sumar por fila = sumar materias de un alumno).",
          runnable: true,
          expectedOutput: "",
        },
        {
          type: "quiz",
          question:
            "Si quisieras el promedio por MATERIA (no por alumno), ¿qué cambiaría?",
          options: [
            "Nada, es el mismo cálculo.",
            "El for externo recorre columnas y el interno filas — sumas por COLUMNA.",
            "Hay que cambiar el tipo de la matriz.",
            "Imposible: las matrices solo se recorren por filas.",
          ],
          correctIndex: 1,
          explanation:
            "El truco es invertir el orden de los fors: el externo controla la dimensión por la que agrupas; el interno suma. Para promediar por materia recorres `j` afuera, `i` adentro, y acumulas en `notas[i][j]`.",
        },
        {
          type: "fill_blank",
          template: `// Mejor alumno = el de mayor promedio en una matriz 3×4

int notas[3][4];
for (int i = 0; i < 3; i++) {
  for (int j = 0; j < 4; j++) {
    scanf("%i", &notas[i][j]);
  }
}

int mejorIdx = {{0}};       // empezamos asumiendo el primero
double mejorProm = -1;

for (int i = 0; i < {{1}}; i++) {
  int suma = {{2}};
  for (int j = 0; j < 4; j++) {
    suma {{3}} notas[i][j];
  }
  double prom = suma / {{4}};
  if (prom {{5}} mejorProm) {
    mejorProm = prom;
    mejorIdx = {{6}};
  }
}

printf("Mejor: alumno %i con %.2f\\n", mejorIdx, mejorProm);`,
          blanks: [
            { answer: "0", hint: "Suponemos que el alumno 0 es el mejor antes de comparar." },
            { answer: "3", hint: "Cantidad de alumnos (filas)." },
            { answer: "0", hint: "Acumulador de fila empieza en cero." },
            { answer: "+=", hint: "Acumulación dentro del for de columnas." },
            { answer: "4.0", hint: "Divide entre 4.0 (no 4) para decimales." },
            { answer: ">", hint: "Para MAYOR promedio, comparación estricta." },
            { answer: "i", hint: "Guarda el índice de la fila actual." },
          ],
          explanation:
            "Estructura combinada: doble for con acumulador POR FILA + comparación entre filas para encontrar la mejor.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (medio): Promedio por alumno
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Promedio por alumno (3×4)

Lee \`int notas[3][4]\` (12 enteros — son 3 alumnos × 4 materias). Para cada
alumno calcula su promedio (suma / 4.0) e imprime:

\`\`\`
Alumno 0: <p0>
Alumno 1: <p1>
Alumno 2: <p2>
\`\`\`

Cada promedio con **2 decimales** (\`%.2f\`).

Para el test, el sistema enviará:

\`\`\`
8 9 7 10
6 5 8 9
10 10 10 10
\`\`\`

- Alumno 0: 34/4 = 8.50
- Alumno 1: 28/4 = 7.00
- Alumno 2: 40/4 = 10.00

Salida esperada:

\`\`\`
Alumno 0: 8.50
Alumno 1: 7.00
Alumno 2: 10.00
\`\`\``,
            difficulty: "medium",
            xpReward: 45,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int notas[3][4];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
      scanf("%i", &notas[i][j]);
    }
  }
  for (int i = 0; i < 3; i++) {
    int suma = 0;
    for (int j = 0; j < 4; j++) {
      suma += notas[i][j];
    }
    printf("Alumno %i: %.2f\\n", i, suma / 4.0);
  }
  return 0;
}`,
            hints: [
              "Lee primero TODA la matriz con doble for + scanf.",
              "Después, otro doble for por alumno: acumulador interno por fila, printf al terminar cada fila.",
              "Divide entre `4.0` (con punto) para conservar decimales.",
            ],
            testCases: [
              {
                stdin: "8 9 7 10 6 5 8 9 10 10 10 10\n",
                expectedStdout:
                  "Alumno 0: 8.50\nAlumno 1: 7.00\nAlumno 2: 10.00\n",
                visible: true,
                description: "Caso ejemplo",
              },
              {
                stdin: "5 5 5 5 6 6 6 6 7 7 7 7\n",
                expectedStdout:
                  "Alumno 0: 5.00\nAlumno 1: 6.00\nAlumno 2: 7.00\n",
                visible: false,
                description: "Promedios enteros",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (difícil): Reporte completo
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Reporte completo del grupo

Lee \`int notas[3][4]\` (3 alumnos × 4 materias). Calcula e imprime
**EN ESTE ORDEN**:

1. **Suma total** del grupo (todas las celdas).
2. **Promedio general** = suma / 12.0 con 2 decimales.
3. **Mayor calificación individual** en toda la matriz.
4. **Mejor alumno**: el índice de la fila con mayor promedio (en empate, gana el primero).

Formato exacto:

\`\`\`
Suma total: <s>
Promedio general: <pg>
Mejor calificacion: <mc>
Mejor alumno: <indice>
\`\`\`

Para el test, el sistema enviará:

\`\`\`
8 9 7 10
6 5 8 9
10 10 10 10
\`\`\`

- Suma total = 102, Promedio = 8.50, Mejor calificación = 10
- Mejor alumno = 2 (promedio 10.00)

Salida esperada:

\`\`\`
Suma total: 102
Promedio general: 8.50
Mejor calificacion: 10
Mejor alumno: 2
\`\`\``,
            difficulty: "hard",
            xpReward: 60,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int notas[3][4];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
      scanf("%i", &notas[i][j]);
    }
  }

  // Suma total + máximo en una pasada
  int suma = 0;
  int mayor = notas[0][0];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
      suma += notas[i][j];
      if (notas[i][j] > mayor) mayor = notas[i][j];
    }
  }

  // Mejor alumno
  int mejorIdx = 0;
  int mejorSuma = -1;
  for (int i = 0; i < 3; i++) {
    int s = 0;
    for (int j = 0; j < 4; j++) {
      s += notas[i][j];
    }
    if (s > mejorSuma) {
      mejorSuma = s;
      mejorIdx = i;
    }
  }

  printf("Suma total: %i\\n", suma);
  printf("Promedio general: %.2f\\n", suma / 12.0);
  printf("Mejor calificacion: %i\\n", mayor);
  printf("Mejor alumno: %i\\n", mejorIdx);
  return 0;
}`,
            hints: [
              "Una primera pasada calcula suma total + máximo. Una segunda pasada (anidada distinta) compara sumas por fila.",
              "Para evitar dividir, compara las SUMAS por fila (no los promedios) para encontrar al mejor alumno — el orden es el mismo.",
              "Cuida el formato: 4 líneas exactas, con los prefijos y los formatos `%i` o `%.2f`.",
            ],
            testCases: [
              {
                stdin: "8 9 7 10 6 5 8 9 10 10 10 10\n",
                expectedStdout:
                  "Suma total: 102\nPromedio general: 8.50\nMejor calificacion: 10\nMejor alumno: 2\n",
                visible: true,
                description: "Caso ejemplo",
              },
              {
                stdin: "5 5 5 5 5 5 5 5 5 5 5 5\n",
                expectedStdout:
                  "Suma total: 60\nPromedio general: 5.00\nMejor calificacion: 5\nMejor alumno: 0\n",
                visible: false,
                description: "Todos iguales → primer alumno gana",
              },
              {
                stdin: "0 0 0 0 0 0 0 0 0 0 0 0\n",
                expectedStdout:
                  "Suma total: 0\nPromedio general: 0.00\nMejor calificacion: 0\nMejor alumno: 0\n",
                visible: false,
                description: "Todos en cero",
              },
            ],
          },
        },
      ],
    },
  ],
};
