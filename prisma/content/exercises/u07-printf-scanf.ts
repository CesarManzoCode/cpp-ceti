import type { PracticeUnitSetDefinition } from "./types";

/**
 * Ejercicios de práctica — Unidad 07: printf y scanf
 *
 * A partir de esta unidad NO se usa cout/cin. Todo I/O con printf/scanf.
 *
 * Conceptos disponibles (acumulados):
 *   - U1-U6 (variables, control flujo, loops, funciones)
 *   - U7: printf con %i, %f, %.2f, %s, \\n. scanf con %i, %lf, &.
 *
 * Calibración:
 *   easy   — starter con includes + main + variables + comentario
 *   medium — starter con includes + main shell
 *   hard   — starter con solo includes
 */
export const u07PrintfScanfExercises: PracticeUnitSetDefinition = {
  unitSlug: "printf-scanf",
  unitTitle: "printf y scanf: la forma C",
  unitIcon: "🖨️",
  exercises: [
    // -----------------------------------------------------------------
    // EASY × 3
    // -----------------------------------------------------------------
    {
      slug: "u07-eco-entero",
      title: "Eco de un entero (scanf + printf)",
      description: "Lee un entero con scanf y muéstralo con printf.",
      difficulty: "easy",
      xpReward: 14,
      prompt: `## Eco con printf/scanf

Lee un entero con \`scanf\` (recuerda el \`&\` antes de la variable).
Imprime con \`printf\` y \`%i\`:

\`\`\`
El numero es <n>
\`\`\`

Para el test, el sistema enviará: \`42\`.

Salida esperada:

\`\`\`
El numero es 42
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {
  int n;
  // scanf + printf

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int n;
  scanf("%i", &n);
  printf("El numero es %i\\n", n);
  return 0;
}`,
      hints: [
        "Lee con `scanf(\"%i\", &n);` — el `&` es obligatorio.",
        "Imprime con `printf(\"El numero es %i\\n\", n);`.",
        "No olvides el `\\n` al final del string.",
      ],
      testCases: [
        {
          stdin: "42\n",
          expectedStdout: "El numero es 42\n",
          visible: true,
          description: "Eco de 42",
        },
        {
          stdin: "-5\n",
          expectedStdout: "El numero es -5\n",
          visible: false,
          description: "Negativos también",
        },
      ],
    },
    {
      slug: "u07-suma-dos-printf",
      title: "Suma de dos (printf/scanf)",
      description: "Lee 2 enteros con scanf, muestra suma con printf.",
      difficulty: "easy",
      xpReward: 14,
      prompt: `## Suma de dos con printf/scanf

Lee dos enteros \`a\` y \`b\` en una sola línea (con scanf encadenado).
Imprime exactamente:

\`\`\`
Suma: <a+b>
\`\`\`

Para el test, el sistema enviará: \`15 25\`.

Salida esperada:

\`\`\`
Suma: 40
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {
  int a, b;
  // scanf de dos enteros, printf con la suma

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int a, b;
  scanf("%i %i", &a, &b);
  printf("Suma: %i\\n", a + b);
  return 0;
}`,
      hints: [
        "scanf con dos `%i`: `scanf(\"%i %i\", &a, &b);` — `&` antes de cada.",
        "printf con texto + un solo `%i` que recibe `a + b`.",
      ],
      testCases: [
        {
          stdin: "15 25\n",
          expectedStdout: "Suma: 40\n",
          visible: true,
          description: "15 + 25 = 40",
        },
        {
          stdin: "100 200\n",
          expectedStdout: "Suma: 300\n",
          visible: false,
          description: "Valores grandes",
        },
      ],
    },
    {
      slug: "u07-cuadrado-double",
      title: "Cuadrado con double y %.2f",
      description: "Lee un double, muestra su cuadrado con 2 decimales.",
      difficulty: "easy",
      xpReward: 16,
      prompt: `## Cuadrado con %.2f

Lee un \`double n\` con \`scanf\` (usa **\`%lf\`** — l minúscula + f).
Calcula \`n * n\` y muéstralo con dos decimales fijos:

\`\`\`
Cuadrado: <n*n con 2 decimales>
\`\`\`

Para el test, el sistema enviará: \`2.5\`.

- 2.5² = 6.25

Salida esperada:

\`\`\`
Cuadrado: 6.25
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {
  double n;
  // scanf con %lf y printf con %.2f

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  double n;
  scanf("%lf", &n);
  printf("Cuadrado: %.2f\\n", n * n);
  return 0;
}`,
      hints: [
        "scanf para `double` usa **`%lf`** (no `%f`).",
        "printf con `%.2f` para 2 decimales fijos.",
        "Puedes hacer la multiplicación dentro del printf: `n * n`.",
      ],
      testCases: [
        {
          stdin: "2.5\n",
          expectedStdout: "Cuadrado: 6.25\n",
          visible: true,
          description: "2.5² = 6.25",
        },
        {
          stdin: "3\n",
          expectedStdout: "Cuadrado: 9.00\n",
          visible: false,
          description: "Entero, pero %.2f fuerza decimales",
        },
        {
          stdin: "10\n",
          expectedStdout: "Cuadrado: 100.00\n",
          visible: false,
          description: "10² = 100",
        },
      ],
    },

    // -----------------------------------------------------------------
    // MEDIUM × 3
    // -----------------------------------------------------------------
    {
      slug: "u07-promedio-3",
      title: "Promedio de 3 con formato",
      description: "Lee 3 enteros, calcula promedio y muestra con 2 decimales.",
      difficulty: "medium",
      xpReward: 20,
      prompt: `## Promedio de 3 con %.2f

Lee **3 enteros** del usuario en una sola línea. Calcula el promedio
dividiendo entre \`3.0\`. Imprime:

\`\`\`
Promedio: <p con 2 decimales>
\`\`\`

Para el test, el sistema enviará: \`8 9 10\`.

Salida esperada:

\`\`\`
Promedio: 9.00
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int a, b, c;
  scanf("%i %i %i", &a, &b, &c);
  double promedio = (a + b + c) / 3.0;
  printf("Promedio: %.2f\\n", promedio);
  return 0;
}`,
      hints: [
        "scanf con 3 `%i` y 3 `&` para los enteros.",
        "Divide entre `3.0` (no `3`) e imprime con `%.2f`.",
      ],
      testCases: [
        {
          stdin: "8 9 10\n",
          expectedStdout: "Promedio: 9.00\n",
          visible: true,
          description: "Promedio exacto",
        },
        {
          stdin: "10 8 9\n",
          expectedStdout: "Promedio: 9.00\n",
          visible: false,
          description: "Mismo promedio, distinto orden",
        },
        {
          stdin: "5 6 8\n",
          expectedStdout: "Promedio: 6.33\n",
          visible: false,
          description: "Promedio 6.33",
        },
      ],
    },
    {
      slug: "u07-tabla-multiplicar",
      title: "Tabla con for + printf",
      description: "Tabla del N (leído) usando un for y printf.",
      difficulty: "medium",
      xpReward: 22,
      prompt: `## Tabla con printf

Lee \`int n\`. Imprime la tabla del \`n\` del 1 al 10, formato:

\`\`\`
<n> x 1 = <n*1>
<n> x 2 = <n*2>
...
<n> x 10 = <n*10>
\`\`\`

Para el test, el sistema enviará: \`3\`.

Salida esperada:

\`\`\`
3 x 1 = 3
3 x 2 = 6
3 x 3 = 9
3 x 4 = 12
3 x 5 = 15
3 x 6 = 18
3 x 7 = 21
3 x 8 = 24
3 x 9 = 27
3 x 10 = 30
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int n;
  scanf("%i", &n);
  for (int i = 1; i <= 10; i++) {
    printf("%i x %i = %i\\n", n, i, n * i);
  }
  return 0;
}`,
      hints: [
        "for de 1 a 10, dentro un solo printf con 3 `%i`.",
        "Los argumentos del printf van en el orden de los `%i`: `n, i, n*i`.",
      ],
      testCases: [
        {
          stdin: "3\n",
          expectedStdout:
            "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30\n",
          visible: true,
          description: "Tabla del 3",
        },
        {
          stdin: "1\n",
          expectedStdout:
            "1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10\n",
          visible: false,
          description: "Tabla del 1",
        },
      ],
    },
    {
      slug: "u07-promedio-formatos",
      title: "Promedio en dos formatos",
      description: "Muestra el mismo promedio con %.2f y con %.0f.",
      difficulty: "medium",
      xpReward: 22,
      prompt: `## Promedio en dos formatos

Lee **4 calificaciones enteras** del usuario. Calcula el promedio
(dividiendo entre \`4.0\`) e imprime **dos líneas**:

1. Con dos decimales (\`%.2f\`).
2. Redondeado a entero (\`%.0f\`).

\`\`\`
Exacto: <p con 2 dec>
Redondeado: <p con 0 dec>
\`\`\`

Para el test, el sistema enviará: \`8 9 7 10\` → 8.50 / 9.

Salida esperada:

\`\`\`
Exacto: 8.50
Redondeado: 8
\`\`\``,
      starterCode: `#include <stdio.h>

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
  int a, b, c, d;
  scanf("%i %i %i %i", &a, &b, &c, &d);
  double prom = (a + b + c + d) / 4.0;
  printf("Exacto: %.2f\\n", prom);
  printf("Redondeado: %.0f\\n", prom);
  return 0;
}`,
      hints: [
        "Misma variable `prom`, dos `printf` con distinto formato.",
        "`%.0f` redondea al entero más cercano (no trunca).",
      ],
      testCases: [
        {
          stdin: "8 9 7 10\n",
          expectedStdout: "Exacto: 8.50\nRedondeado: 8\n",
          visible: true,
          description: "Promedio 8.5",
        },
        {
          stdin: "7 7 7 7\n",
          expectedStdout: "Exacto: 7.00\nRedondeado: 7\n",
          visible: false,
          description: "Promedio entero",
        },
        {
          stdin: "9 10 10 10\n",
          expectedStdout: "Exacto: 9.75\nRedondeado: 10\n",
          visible: false,
          description: "Redondeo hacia arriba",
        },
      ],
    },

    // -----------------------------------------------------------------
    // HARD × 2
    // -----------------------------------------------------------------
    {
      slug: "u07-imc",
      title: "IMC (Índice de Masa Corporal)",
      description: "Lee peso y altura, calcula IMC con printf formateado.",
      difficulty: "hard",
      xpReward: 28,
      prompt: `## IMC

Lee dos \`double\` en una sola línea: \`peso\` (kg) y \`altura\` (m).
Calcula el IMC: \`peso / (altura * altura)\`. Imprime con 2 decimales:

\`\`\`
IMC: <imc>
\`\`\`

Para el test, el sistema enviará: \`70 1.75\`.

- IMC = 70 / (1.75 × 1.75) = 22.86 (aprox).

Salida esperada:

\`\`\`
IMC: 22.86
\`\`\``,
      starterCode: `#include <stdio.h>
`,
      solutionCode: `#include <stdio.h>

int main() {
  double peso, altura;
  scanf("%lf %lf", &peso, &altura);
  double imc = peso / (altura * altura);
  printf("IMC: %.2f\\n", imc);
  return 0;
}`,
      hints: [
        "Ambos son `double`, ambos se leen con `%lf` en scanf.",
        "Cuida los paréntesis: `peso / (altura * altura)`.",
      ],
      testCases: [
        {
          stdin: "70 1.75\n",
          expectedStdout: "IMC: 22.86\n",
          visible: true,
          description: "Caso de referencia",
        },
        {
          stdin: "80 1.80\n",
          expectedStdout: "IMC: 24.69\n",
          visible: false,
          description: "Otro caso",
        },
        {
          stdin: "50 1.50\n",
          expectedStdout: "IMC: 22.22\n",
          visible: false,
          description: "Persona pequeña",
        },
      ],
    },
    {
      slug: "u07-boletin-3-notas",
      title: "Boletín con if y printf",
      description: "Lee 3 notas, calcula promedio, decide aprobado/reprobado.",
      difficulty: "hard",
      xpReward: 32,
      prompt: `## Boletín con printf

Lee **3 calificaciones enteras** en una sola línea. Calcula el promedio
(\`/3.0\`). Imprime **3 líneas**:

1. \`Promedio: <p>\` con 2 decimales.
2. \`Aprobado\` si el promedio es \`>= 7.0\`, o \`Reprobado\` en otro caso.
3. \`Excelente\` si el promedio es \`>= 9.0\`, o \`Bueno\` si está entre 7 y 9,
   o \`Insuficiente\` si es \`< 7\`.

Para el test, el sistema enviará: \`9 10 8\` → promedio = 9.00.

Salida esperada:

\`\`\`
Promedio: 9.00
Aprobado
Excelente
\`\`\``,
      starterCode: `#include <stdio.h>
`,
      solutionCode: `#include <stdio.h>

int main() {
  int a, b, c;
  scanf("%i %i %i", &a, &b, &c);
  double prom = (a + b + c) / 3.0;
  printf("Promedio: %.2f\\n", prom);
  if (prom >= 7.0) {
    printf("Aprobado\\n");
  } else {
    printf("Reprobado\\n");
  }
  if (prom >= 9.0) {
    printf("Excelente\\n");
  } else if (prom >= 7.0) {
    printf("Bueno\\n");
  } else {
    printf("Insuficiente\\n");
  }
  return 0;
}`,
      hints: [
        "Tres `printf`, uno por línea, en el orden exacto del enunciado.",
        "Usa `>= 9.0` antes que `>= 7.0` para que el más estricto gane.",
      ],
      testCases: [
        {
          stdin: "9 10 8\n",
          expectedStdout: "Promedio: 9.00\nAprobado\nExcelente\n",
          visible: true,
          description: "Promedio 9 → excelente",
        },
        {
          stdin: "8 7 7\n",
          expectedStdout: "Promedio: 7.33\nAprobado\nBueno\n",
          visible: false,
          description: "Rango bueno",
        },
        {
          stdin: "5 6 6\n",
          expectedStdout: "Promedio: 5.67\nReprobado\nInsuficiente\n",
          visible: false,
          description: "Reprobado",
        },
      ],
    },
  ],
};
