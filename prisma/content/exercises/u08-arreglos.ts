import type { PracticeUnitSetDefinition } from "./types";

/**
 * Ejercicios de práctica — Unidad 08: Arreglos
 *
 * I/O con printf/scanf (a partir de U7 se dejó cout/cin).
 *
 * Conceptos disponibles (acumulados):
 *   - U1-U7
 *   - U8: declarar arreglos, índices, recorrer con for, leer con scanf,
 *         búsqueda, suma, máximo/mínimo
 *
 * Calibración:
 *   easy   — starter con includes + main + arreglo declarado/parcial
 *   medium — starter con includes + main shell
 *   hard   — starter con solo includes
 */
export const u08ArreglosExercises: PracticeUnitSetDefinition = {
  unitSlug: "arreglos",
  unitTitle: "Arreglos: muchos valores en una variable",
  unitIcon: "🧮",
  exercises: [
    // -----------------------------------------------------------------
    // EASY × 3
    // -----------------------------------------------------------------
    {
      slug: "u08-imprimir-arreglo",
      title: "Imprimir arreglo en orden",
      description: "Recorre un arreglo fijo con for + printf.",
      difficulty: "easy",
      xpReward: 14,
      prompt: `## Imprimir arreglo

Inicializa \`int v[5] = {10, 20, 30, 40, 50};\`. Imprime los 5 elementos en
orden, uno por línea, usando un \`for\`.

Salida esperada:

\`\`\`
10
20
30
40
50
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {
  int v[5] = {10, 20, 30, 40, 50};
  // for que imprima cada elemento

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int v[5] = {10, 20, 30, 40, 50};
  for (int i = 0; i < 5; i++) {
    printf("%i\\n", v[i]);
  }
  return 0;
}`,
      hints: [
        "El for clásico: `for (int i = 0; i < 5; i++)`.",
        "Dentro: `printf(\"%i\\n\", v[i]);`.",
      ],
      testCases: [
        {
          expectedStdout: "10\n20\n30\n40\n50\n",
          visible: true,
          description: "Cinco valores en orden",
        },
      ],
    },
    {
      slug: "u08-suma-fija",
      title: "Suma de arreglo fijo",
      description: "Suma los 5 elementos de un arreglo predefinido.",
      difficulty: "easy",
      xpReward: 16,
      prompt: `## Suma de arreglo

Inicializa \`int v[5] = {2, 4, 6, 8, 10};\`. Calcula la suma de todos y
muéstrala en una sola línea (sin texto, solo el número).

Suma = 30.

Salida esperada:

\`\`\`
30
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {
  int v[5] = {2, 4, 6, 8, 10};
  // acumulador + for

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int v[5] = {2, 4, 6, 8, 10};
  int suma = 0;
  for (int i = 0; i < 5; i++) {
    suma += v[i];
  }
  printf("%i\\n", suma);
  return 0;
}`,
      hints: [
        "Acumulador `int suma = 0;` ANTES del for.",
        "Dentro: `suma += v[i];`. printf DESPUÉS del for.",
      ],
      testCases: [
        {
          expectedStdout: "30\n",
          visible: true,
          description: "Suma 2+4+6+8+10",
        },
      ],
    },
    {
      slug: "u08-eco-arreglo",
      title: "Leer y reimprimir",
      description: "Lee 5 enteros con scanf y reimprime cada uno.",
      difficulty: "easy",
      xpReward: 16,
      prompt: `## Eco de arreglo

Lee **5 enteros** del usuario y guárdalos en un arreglo \`int v[5];\`.
Imprime cada uno en orden, una línea por valor.

Para el test, el sistema enviará: \`3 1 4 1 5\`.

Salida esperada:

\`\`\`
3
1
4
1
5
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {
  int v[5];
  // Un for para leer con scanf, otro para imprimir con printf

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
  }
  for (int i = 0; i < 5; i++) {
    printf("%i\\n", v[i]);
  }
  return 0;
}`,
      hints: [
        "scanf con `&v[i]` (no olvides el `&`).",
        "Dos fors separados — leer primero, imprimir después.",
      ],
      testCases: [
        {
          stdin: "3 1 4 1 5\n",
          expectedStdout: "3\n1\n4\n1\n5\n",
          visible: true,
          description: "Eco de 5 valores",
        },
        {
          stdin: "100 200 300 400 500\n",
          expectedStdout: "100\n200\n300\n400\n500\n",
          visible: false,
          description: "Valores grandes",
        },
      ],
    },

    // -----------------------------------------------------------------
    // MEDIUM × 3
    // -----------------------------------------------------------------
    {
      slug: "u08-promedio-leido",
      title: "Promedio de N leído",
      description: "Lee 5 enteros y calcula el promedio con %.2f.",
      difficulty: "medium",
      xpReward: 20,
      prompt: `## Promedio leído

Lee **5 enteros**. Guárdalos en un arreglo y calcula el promedio
(\`/ 5.0\`). Imprime con 2 decimales:

\`\`\`
Promedio: <p>
\`\`\`

Para el test, el sistema enviará: \`8 9 7 10 6\`.

- Suma = 40, promedio = 8.00.

Salida esperada:

\`\`\`
Promedio: 8.00
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
  }
  int suma = 0;
  for (int i = 0; i < 5; i++) {
    suma += v[i];
  }
  printf("Promedio: %.2f\\n", suma / 5.0);
  return 0;
}`,
      hints: [
        "Dos fors: uno para leer, otro para sumar (o combina si quieres).",
        "Divide entre `5.0` y formatea con `%.2f`.",
      ],
      testCases: [
        {
          stdin: "8 9 7 10 6\n",
          expectedStdout: "Promedio: 8.00\n",
          visible: true,
          description: "Promedio 8.0",
        },
        {
          stdin: "10 10 10 10 10\n",
          expectedStdout: "Promedio: 10.00\n",
          visible: false,
          description: "Todos 10",
        },
        {
          stdin: "1 2 3 4 5\n",
          expectedStdout: "Promedio: 3.00\n",
          visible: false,
          description: "1..5 → 3",
        },
      ],
    },
    {
      slug: "u08-maximo-arreglo",
      title: "Máximo del arreglo",
      description: "Encuentra el mayor de 5 enteros leídos.",
      difficulty: "medium",
      xpReward: 20,
      prompt: `## Máximo

Lee **5 enteros** y guárdalos en un arreglo. Imprime SOLO el mayor (sin
texto).

Para el test, el sistema enviará: \`7 9 8 10 6\`.

Salida esperada:

\`\`\`
10
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
  }
  int mayor = v[0];
  for (int i = 1; i < 5; i++) {
    if (v[i] > mayor) mayor = v[i];
  }
  printf("%i\\n", mayor);
  return 0;
}`,
      hints: [
        "Inicializa `mayor = v[0]` después de leer.",
        "El for comparativo arranca en `i = 1` (ya consideraste el 0).",
      ],
      testCases: [
        {
          stdin: "7 9 8 10 6\n",
          expectedStdout: "10\n",
          visible: true,
          description: "Máximo es 10",
        },
        {
          stdin: "100 1 1 1 1\n",
          expectedStdout: "100\n",
          visible: false,
          description: "Máximo al inicio",
        },
        {
          stdin: "-5 -10 -3 -1 -7\n",
          expectedStdout: "-1\n",
          visible: false,
          description: "Negativos",
        },
      ],
    },
    {
      slug: "u08-contar-aprobados",
      title: "Contar aprobados",
      description: "Cuenta cuántos valores son >= 7.",
      difficulty: "medium",
      xpReward: 22,
      prompt: `## Contar aprobados

Lee **5 calificaciones enteras**. Cuenta cuántas son \`>= 7\`. Imprime SOLO
el conteo.

Para el test, el sistema enviará: \`8 5 10 7 4\`.

- Aprobadas: 8, 10, 7 → **3**.

Salida esperada:

\`\`\`
3
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
  }
  int cuenta = 0;
  for (int i = 0; i < 5; i++) {
    if (v[i] >= 7) cuenta++;
  }
  printf("%i\\n", cuenta);
  return 0;
}`,
      hints: [
        "Contador empieza en 0 fuera del for.",
        "Dentro: `if (v[i] >= 7) cuenta++;`.",
      ],
      testCases: [
        {
          stdin: "8 5 10 7 4\n",
          expectedStdout: "3\n",
          visible: true,
          description: "3 aprobados",
        },
        {
          stdin: "10 10 10 10 10\n",
          expectedStdout: "5\n",
          visible: false,
          description: "Todos aprobados",
        },
        {
          stdin: "5 5 5 5 5\n",
          expectedStdout: "0\n",
          visible: false,
          description: "Ninguno",
        },
      ],
    },

    // -----------------------------------------------------------------
    // HARD × 2
    // -----------------------------------------------------------------
    {
      slug: "u08-invertir-en-lugar",
      title: "Invertir arreglo en lugar",
      description: "Lee 5 enteros, inviértelos sin usar otro arreglo, imprime.",
      difficulty: "hard",
      xpReward: 28,
      prompt: `## Invertir en lugar

Lee **5 enteros** y guárdalos en \`int v[5];\`. Invierte el arreglo
**dentro del mismo arreglo** (sin usar uno auxiliar — usa una variable
\`int tmp;\` para los swaps). Después imprime los 5 elementos en orden.

Para el test, el sistema enviará: \`1 2 3 4 5\`.

Salida esperada:

\`\`\`
5
4
3
2
1
\`\`\``,
      starterCode: `#include <stdio.h>
`,
      solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
  }
  for (int i = 0; i < 5 / 2; i++) {
    int tmp = v[i];
    v[i] = v[5 - 1 - i];
    v[5 - 1 - i] = tmp;
  }
  for (int i = 0; i < 5; i++) {
    printf("%i\\n", v[i]);
  }
  return 0;
}`,
      hints: [
        "Para invertir en lugar: intercambia `v[i]` con `v[5 - 1 - i]` mientras `i < 5/2`.",
        "Para no perder valores en el swap, usa `int tmp = v[i];` antes de sobrescribir.",
      ],
      testCases: [
        {
          stdin: "1 2 3 4 5\n",
          expectedStdout: "5\n4\n3\n2\n1\n",
          visible: true,
          description: "Inversión simple",
        },
        {
          stdin: "10 20 30 40 50\n",
          expectedStdout: "50\n40\n30\n20\n10\n",
          visible: false,
          description: "Otros valores",
        },
        {
          stdin: "7 7 7 7 7\n",
          expectedStdout: "7\n7\n7\n7\n7\n",
          visible: false,
          description: "Palíndromo trivial",
        },
      ],
    },
    {
      slug: "u08-estadisticas",
      title: "Estadísticas en una pasada",
      description: "Calcula suma, máximo y mínimo en un solo for.",
      difficulty: "hard",
      xpReward: 32,
      prompt: `## Estadísticas en una pasada

Lee **5 enteros**. En **una sola pasada**, calcula:
- **suma**
- **máximo**
- **mínimo**

Imprime **3 líneas**:

\`\`\`
Suma: <s>
Maximo: <m>
Minimo: <n>
\`\`\`

Para el test, el sistema enviará: \`8 5 10 7 4\`.

- Suma = 34, Máximo = 10, Mínimo = 4.

Salida esperada:

\`\`\`
Suma: 34
Maximo: 10
Minimo: 4
\`\`\``,
      starterCode: `#include <stdio.h>
`,
      solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
  }
  int suma = 0;
  int mayor = v[0];
  int menor = v[0];
  for (int i = 0; i < 5; i++) {
    suma += v[i];
    if (v[i] > mayor) mayor = v[i];
    if (v[i] < menor) menor = v[i];
  }
  printf("Suma: %i\\n", suma);
  printf("Maximo: %i\\n", mayor);
  printf("Minimo: %i\\n", menor);
  return 0;
}`,
      hints: [
        "Tres acumuladores antes del for: suma, mayor (en v[0]), menor (en v[0]).",
        "Un solo for actualiza los tres en cada vuelta.",
      ],
      testCases: [
        {
          stdin: "8 5 10 7 4\n",
          expectedStdout: "Suma: 34\nMaximo: 10\nMinimo: 4\n",
          visible: true,
          description: "Caso ejemplo",
        },
        {
          stdin: "1 1 1 1 1\n",
          expectedStdout: "Suma: 5\nMaximo: 1\nMinimo: 1\n",
          visible: false,
          description: "Todos iguales",
        },
        {
          stdin: "-3 -10 0 -1 -7\n",
          expectedStdout: "Suma: -21\nMaximo: 0\nMinimo: -10\n",
          visible: false,
          description: "Negativos",
        },
      ],
    },
  ],
};
