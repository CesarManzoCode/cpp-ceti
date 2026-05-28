import type { PracticeUnitSetDefinition } from "./types";

/**
 * Ejercicios de práctica — Unidad 10: Matrices
 *
 * I/O con printf/scanf (post-U7). Bucles anidados sobre matrices 2D.
 *
 * Conceptos disponibles (acumulados):
 *   - U1-U9 (variables, control, loops, funciones, printf/scanf, arreglos,
 *     archivos)
 *   - U10: declaración 2D, inicialización con `{{...}}`, recorrido con
 *     doble for, scanf en celdas, suma total / por fila, máximo,
 *     transpuesta
 *
 * Calibración (RELATIVA a U10):
 *   easy   — starter con includes + main + matriz declarada/parcial
 *   medium — starter con includes + main shell
 *   hard   — starter con solo includes
 */
export const u10MatricesExercises: PracticeUnitSetDefinition = {
  unitSlug: "matrices",
  unitTitle: "Matrices: arreglos 2D",
  unitIcon: "🧱",
  exercises: [
    // -----------------------------------------------------------------
    // EASY × 3
    // -----------------------------------------------------------------
    {
      slug: "u10-imprimir-3x3",
      title: "Leer y mostrar una matriz 3×3",
      description: "Lee 9 enteros con scanf y recórrelos con doble for.",
      difficulty: "easy",
      xpReward: 18,
      prompt: `## Leer e imprimir 3×3

Lee **9 enteros** del usuario con \`scanf\` y guárdalos en \`int m[3][3];\`
(fila por fila). Imprime los 9 elementos en orden de lectura, UNO POR LÍNEA.

Para el test, el sistema enviará: \`1 2 3 4 5 6 7 8 9\`.

Salida esperada:

\`\`\`
1
2
3
4
5
6
7
8
9
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {
  int m[3][3];
  // Un doble for para leer con scanf, otro para imprimir

  return 0;
}`,
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
      printf("%i\\n", m[i][j]);
    }
  }
  return 0;
}`,
      hints: [
        "Lectura: doble for con `scanf(\"%i\", &m[i][j]);`.",
        "Impresión: otro doble for con `printf(\"%i\\n\", m[i][j]);`.",
      ],
      testCases: [
        {
          stdin: "1 2 3 4 5 6 7 8 9\n",
          expectedStdout: "1\n2\n3\n4\n5\n6\n7\n8\n9\n",
          visible: true,
          description: "9 elementos en orden",
        },
        {
          stdin: "10 20 30 40 50 60 70 80 90\n",
          expectedStdout: "10\n20\n30\n40\n50\n60\n70\n80\n90\n",
          visible: false,
          description: "Otros valores",
        },
        {
          stdin: "9 8 7 6 5 4 3 2 1\n",
          expectedStdout: "9\n8\n7\n6\n5\n4\n3\n2\n1\n",
          visible: false,
          description: "Orden inverso",
        },
      ],
    },
    {
      slug: "u10-suma-2x2",
      title: "Suma de matriz 2×2 leída",
      description: "Lee 4 enteros en una matriz y suma todas las celdas.",
      difficulty: "easy",
      xpReward: 18,
      prompt: `## Suma de 2×2

Lee **4 enteros** con \`scanf\` en una matriz \`int m[2][2];\`. Calcula la
suma de las 4 celdas e imprímela SOLA (sin texto).

Para el test, el sistema enviará: \`10 20 30 40\` → 100.

Salida esperada:

\`\`\`
100
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {
  int m[2][2];
  // leer con doble for + acumulador + printf

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int m[2][2];
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
      scanf("%i", &m[i][j]);
    }
  }
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
        "Lee con doble for + `scanf(\"%i\", &m[i][j]);`.",
        "Acumulador `int suma = 0;`, suma en otro doble for, printf al final.",
      ],
      testCases: [
        {
          stdin: "10 20 30 40\n",
          expectedStdout: "100\n",
          visible: true,
          description: "Suma = 100",
        },
        {
          stdin: "1 1 1 1\n",
          expectedStdout: "4\n",
          visible: false,
          description: "Cuatro unos",
        },
        {
          stdin: "5 10 15 20\n",
          expectedStdout: "50\n",
          visible: false,
          description: "Otra suma",
        },
      ],
    },
    {
      slug: "u10-eco-2x2",
      title: "Leer y reimprimir 2×2",
      description: "scanf en doble for, después printf en doble for.",
      difficulty: "easy",
      xpReward: 18,
      prompt: `## Eco de 2×2

Lee **4 enteros** con scanf y guárdalos en \`int m[2][2];\` (orden:
\`m[0][0], m[0][1], m[1][0], m[1][1]\`). Imprime los 4 valores como rejilla
(separados por espacio, salto al final de cada fila).

Para el test, el sistema enviará: \`1 2 3 4\`.

Salida esperada:

\`\`\`
1 2
3 4
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {
  int m[2][2];
  // scanf en doble for + printf como rejilla

  return 0;
}`,
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
      if (j > 0) printf(" ");
      printf("%i", m[i][j]);
    }
    printf("\\n");
  }
  return 0;
}`,
      hints: [
        "scanf con `&m[i][j]` (el `&` es obligatorio).",
        "Para imprimir como rejilla: separa con espacio si `j > 0`, y `\\n` al final de cada fila.",
      ],
      testCases: [
        {
          stdin: "1 2 3 4\n",
          expectedStdout: "1 2\n3 4\n",
          visible: true,
          description: "Eco como rejilla",
        },
        {
          stdin: "10 20 30 40\n",
          expectedStdout: "10 20\n30 40\n",
          visible: false,
          description: "Otros valores",
        },
      ],
    },

    // -----------------------------------------------------------------
    // MEDIUM × 3
    // -----------------------------------------------------------------
    {
      slug: "u10-suma-por-columnas",
      title: "Suma por columnas (3×3)",
      description: "Recorrer columna por columna en vez de fila por fila.",
      difficulty: "medium",
      xpReward: 25,
      prompt: `## Suma por columnas

Lee \`int m[3][3]\` (9 enteros con scanf). Calcula la suma de cada
COLUMNA e imprímelas en orden:

\`\`\`
Col 0: <s0>
Col 1: <s1>
Col 2: <s2>
\`\`\`

Para el test, el sistema enviará:

\`\`\`
1 2 3
4 5 6
7 8 9
\`\`\`

- Col 0: 1+4+7 = 12
- Col 1: 2+5+8 = 15
- Col 2: 3+6+9 = 18

Salida esperada:

\`\`\`
Col 0: 12
Col 1: 15
Col 2: 18
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int m[3][3];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      scanf("%i", &m[i][j]);
    }
  }
  for (int j = 0; j < 3; j++) {
    int suma = 0;
    for (int i = 0; i < 3; i++) {
      suma += m[i][j];
    }
    printf("Col %i: %i\\n", j, suma);
  }
  return 0;
}`,
      hints: [
        "Truco: el for EXTERNO recorre `j` (columnas) y el INTERNO recorre `i` (filas).",
        "El acumulador `suma` vive dentro del for externo (se reinicia por columna).",
      ],
      testCases: [
        {
          stdin: "1 2 3 4 5 6 7 8 9\n",
          expectedStdout: "Col 0: 12\nCol 1: 15\nCol 2: 18\n",
          visible: true,
          description: "Caso ejemplo",
        },
        {
          stdin: "1 1 1 1 1 1 1 1 1\n",
          expectedStdout: "Col 0: 3\nCol 1: 3\nCol 2: 3\n",
          visible: false,
          description: "Todos unos",
        },
        {
          stdin: "10 0 0 0 10 0 0 0 10\n",
          expectedStdout: "Col 0: 10\nCol 1: 10\nCol 2: 10\n",
          visible: false,
          description: "Solo diagonal con 10",
        },
      ],
    },
    {
      slug: "u10-cuenta-pares",
      title: "Contar pares en matriz",
      description: "Lee una matriz y cuenta cuántas celdas son pares.",
      difficulty: "medium",
      xpReward: 25,
      prompt: `## Contar pares

Lee \`int m[3][3]\` (9 enteros). Cuenta cuántas celdas tienen un valor PAR
(divisible entre 2) e imprime SOLO el conteo.

Para el test, el sistema enviará: \`1 2 3 4 5 6 7 8 9\`.

- Pares: 2, 4, 6, 8 → 4.

Salida esperada:

\`\`\`
4
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int m[3][3];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      scanf("%i", &m[i][j]);
    }
  }
  int cuenta = 0;
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      if (m[i][j] % 2 == 0) cuenta++;
    }
  }
  printf("%i\\n", cuenta);
  return 0;
}`,
      hints: [
        "Contador empieza en 0 antes del doble for.",
        "Un número es par cuando `m[i][j] % 2 == 0`.",
      ],
      testCases: [
        {
          stdin: "1 2 3 4 5 6 7 8 9\n",
          expectedStdout: "4\n",
          visible: true,
          description: "4 pares de 9",
        },
        {
          stdin: "2 4 6 8 10 12 14 16 18\n",
          expectedStdout: "9\n",
          visible: false,
          description: "Todos pares",
        },
        {
          stdin: "1 3 5 7 9 11 13 15 17\n",
          expectedStdout: "0\n",
          visible: false,
          description: "Ningún par",
        },
        {
          stdin: "0 0 0 0 0 0 0 0 0\n",
          expectedStdout: "9\n",
          visible: false,
          description: "Cero también es par",
        },
      ],
    },
    {
      slug: "u10-traza",
      title: "Traza de matriz (diagonal)",
      description: "Suma de la diagonal principal de una matriz cuadrada.",
      difficulty: "medium",
      xpReward: 26,
      prompt: `## Traza

La **traza** de una matriz cuadrada es la suma de los elementos de su
diagonal principal: \`m[0][0] + m[1][1] + m[2][2] + ...\`.

Lee \`int m[3][3]\` con scanf. Imprime SOLO la traza.

Para el test, el sistema enviará:

\`\`\`
1 2 3
4 5 6
7 8 9
\`\`\`

- Traza = 1 + 5 + 9 = 15.

Salida esperada:

\`\`\`
15
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int m[3][3];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      scanf("%i", &m[i][j]);
    }
  }
  int traza = 0;
  for (int k = 0; k < 3; k++) {
    traza += m[k][k];
  }
  printf("%i\\n", traza);
  return 0;
}`,
      hints: [
        "La diagonal son las celdas donde fila = columna: `m[0][0], m[1][1], m[2][2]`.",
        "Con UN solo for de 0 a 3 basta: usa el mismo índice para ambas posiciones.",
      ],
      testCases: [
        {
          stdin: "1 2 3 4 5 6 7 8 9\n",
          expectedStdout: "15\n",
          visible: true,
          description: "Caso ejemplo",
        },
        {
          stdin: "1 0 0 0 1 0 0 0 1\n",
          expectedStdout: "3\n",
          visible: false,
          description: "Identidad: traza = 3",
        },
        {
          stdin: "5 0 0 0 5 0 0 0 5\n",
          expectedStdout: "15\n",
          visible: false,
          description: "Múltiplo de identidad",
        },
        {
          stdin: "-1 2 3 4 -5 6 7 8 -9\n",
          expectedStdout: "-15\n",
          visible: false,
          description: "Negativos en diagonal",
        },
      ],
    },

    // -----------------------------------------------------------------
    // HARD × 2
    // -----------------------------------------------------------------
    {
      slug: "u10-transpuesta-4x4",
      title: "Transpuesta de matriz 4×4",
      description: "Lee, transpone, imprime. Solo includes.",
      difficulty: "hard",
      xpReward: 35,
      prompt: `## Transpuesta 4×4

Lee \`int m[4][4]\` (16 enteros con scanf). Construye una matriz nueva
\`int t[4][4]\` donde \`t[i][j] = m[j][i]\` (la **transpuesta**).

Imprime \`t\` como rejilla (espacios entre valores, \`\\n\` por fila).

Para el test, el sistema enviará:

\`\`\`
1 2 3 4
5 6 7 8
9 10 11 12
13 14 15 16
\`\`\`

Transpuesta:

\`\`\`
1 5 9 13
2 6 10 14
3 7 11 15
4 8 12 16
\`\`\`

Salida esperada:

\`\`\`
1 5 9 13
2 6 10 14
3 7 11 15
4 8 12 16
\`\`\``,
      starterCode: `#include <stdio.h>
`,
      solutionCode: `#include <stdio.h>

int main() {
  int m[4][4];
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      scanf("%i", &m[i][j]);
    }
  }
  int t[4][4];
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      t[i][j] = m[j][i];
    }
  }
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      if (j > 0) printf(" ");
      printf("%i", t[i][j]);
    }
    printf("\\n");
  }
  return 0;
}`,
      hints: [
        "Para transponer: `t[i][j] = m[j][i];` (índices invertidos).",
        "Tres bloques de doble for: leer, transponer, imprimir como rejilla.",
      ],
      testCases: [
        {
          stdin: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16\n",
          expectedStdout:
            "1 5 9 13\n2 6 10 14\n3 7 11 15\n4 8 12 16\n",
          visible: true,
          description: "Caso ejemplo",
        },
        {
          stdin: "1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1\n",
          expectedStdout:
            "1 0 0 0\n0 1 0 0\n0 0 1 0\n0 0 0 1\n",
          visible: false,
          description: "Identidad (transpuesta = identidad)",
        },
      ],
    },
    {
      slug: "u10-boletin-completo",
      title: "Boletín del grupo",
      description: "Promedios por alumno + máximo + mejor alumno. Desde cero.",
      difficulty: "hard",
      xpReward: 42,
      prompt: `## Boletín del grupo

Lee \`int notas[3][4]\` (3 alumnos × 4 materias = 12 enteros). Imprime
**EN ESTE ORDEN**:

1. Tres líneas con el promedio de cada alumno:
   \`\`\`
   Alumno 0: <p0>
   Alumno 1: <p1>
   Alumno 2: <p2>
   \`\`\`
   Con dos decimales.
2. Una línea con la calificación más alta de toda la matriz:
   \`\`\`
   Mayor: <c>
   \`\`\`
3. Una línea con el índice del mejor alumno (mayor promedio; en empate
   gana el primero):
   \`\`\`
   Mejor: <idx>
   \`\`\`

Para el test, el sistema enviará:

\`\`\`
8 9 7 10
6 5 8 9
10 10 10 10
\`\`\`

- Alumno 0: 8.50, Alumno 1: 7.00, Alumno 2: 10.00
- Mayor calificación = 10
- Mejor alumno = 2

Salida esperada:

\`\`\`
Alumno 0: 8.50
Alumno 1: 7.00
Alumno 2: 10.00
Mayor: 10
Mejor: 2
\`\`\``,
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

  int sumas[3] = {0, 0, 0};
  int mayor = notas[0][0];
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
      sumas[i] += notas[i][j];
      if (notas[i][j] > mayor) mayor = notas[i][j];
    }
  }

  for (int i = 0; i < 3; i++) {
    printf("Alumno %i: %.2f\\n", i, sumas[i] / 4.0);
  }

  int mejorIdx = 0;
  for (int i = 1; i < 3; i++) {
    if (sumas[i] > sumas[mejorIdx]) {
      mejorIdx = i;
    }
  }

  printf("Mayor: %i\\n", mayor);
  printf("Mejor: %i\\n", mejorIdx);
  return 0;
}`,
      hints: [
        "Guarda la suma de cada alumno en un arreglo `int sumas[3]` — esto evita recalcular.",
        "Una sola pasada por la matriz acumula `sumas[i]` y el máximo `mayor`.",
        "Para el mejor alumno, comparas las SUMAS (no los promedios) — el orden es el mismo y evitas hacer división.",
        "Cuida el orden EXACTO de las líneas y los prefijos.",
      ],
      testCases: [
        {
          stdin: "8 9 7 10 6 5 8 9 10 10 10 10\n",
          expectedStdout:
            "Alumno 0: 8.50\nAlumno 1: 7.00\nAlumno 2: 10.00\nMayor: 10\nMejor: 2\n",
          visible: true,
          description: "Caso ejemplo",
        },
        {
          stdin: "7 7 7 7 7 7 7 7 7 7 7 7\n",
          expectedStdout:
            "Alumno 0: 7.00\nAlumno 1: 7.00\nAlumno 2: 7.00\nMayor: 7\nMejor: 0\n",
          visible: false,
          description: "Todos iguales → primer alumno",
        },
        {
          stdin: "1 1 1 1 2 2 2 2 3 3 3 3\n",
          expectedStdout:
            "Alumno 0: 1.00\nAlumno 1: 2.00\nAlumno 2: 3.00\nMayor: 3\nMejor: 2\n",
          visible: false,
          description: "Crecimiento por fila",
        },
      ],
    },
  ],
};
