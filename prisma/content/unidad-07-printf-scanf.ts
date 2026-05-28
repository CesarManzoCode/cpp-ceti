import type { UnitDefinition } from "./types";

/**
 * Unidad 07 — printf y scanf
 *
 * Puente del estilo C++ (`cout`/`cin`) al estilo C (`printf`/`scanf`)
 * que pide el CETI a partir de cierto punto del curso. A partir de
 * esta unidad TODAS las lecciones siguientes usan `printf`/`scanf`.
 *
 * Decisiones:
 * - Header: `<stdio.h>` (lo que se ve en el CETI; `<cstdio>` también vale).
 * - Las salidas a consola en los retos NO usan `endl`; siempre `\n`.
 * - No introduzco strings con `%s` para no chocar con `std::string`
 *   visto en unidades anteriores. Solo `%i` y `%f` (suficiente para
 *   arreglos en la unidad 08).
 *
 * Patrón estable de cada lección: code_example → quiz → fill_blank →
 * code_challenge × 2-3 (easy → medium → hard). Starter mínimo.
 */
export const unidad07: UnitDefinition = {
  slug: "printf-scanf",
  title: "printf y scanf: la forma C de imprimir y leer",
  description:
    "En el CETI, después de funciones se cambia a printf/scanf. Aquí aprendes el cambio sin perder lo que ya sabías.",
  icon: "🖨️",
  published: true,
  lessons: [
    // =====================================================================
    // Lección 1: Tu primer printf
    // =====================================================================
    {
      slug: "primer-printf",
      title: "Tu primer printf",
      description:
        "Imprimir texto sin `cout`: el estilo C que vas a usar de aquí en adelante.",
      xpReward: 35,
      estimatedMinutes: 10,
      steps: [
        {
          type: "theory",
          markdown: `## El cambio que hace el CETI

Hasta ahora has usado \`cout <<\` para imprimir. A partir de esta unidad el
CETI te pide cambiar a **\`printf\`** — la forma original del lenguaje C que
sigue funcionando perfectamente dentro de C++.

\`\`\`cpp
// Antes (estilo C++)
cout << "Hola CETI" << endl;

// Ahora (estilo C)
printf("Hola CETI\\n");
\`\`\`

Tres diferencias clave:

| cout                                | printf                                  |
|-------------------------------------|-----------------------------------------|
| \`#include <iostream>\`               | \`#include <stdio.h>\`                    |
| \`using namespace std;\` para usarlo  | NO necesita namespace                   |
| \`endl\` o \`"\\n"\` para salto de línea | **siempre** lo escribes con \`\\n\`     |

A partir de aquí, **adiós a \`cout\` y \`endl\`**. Bienvenido \`printf\` y \`\\n\`.`,
        },
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  printf("Hola CETI\\n");
  printf("Soy estudiante\\n");
  return 0;
}`,
          explanation:
            "`printf` imprime el texto entre comillas tal cual. La secuencia `\\n` (backslash + n) es el salto de línea — sin ella todo sale en la misma línea. Fíjate que YA NO uses `using namespace std;` — `printf` viene de C, no del namespace `std`.",
          runnable: true,
          expectedOutput: "Hola CETI\nSoy estudiante",
        },
        {
          type: "quiz",
          question:
            "¿Qué header necesitas incluir para usar `printf`?",
          options: [
            "`<iostream>` (igual que cout).",
            "`<stdio.h>` (de C).",
            "`<printf>`.",
            "Ninguno, `printf` siempre está disponible.",
          ],
          correctIndex: 1,
          explanation:
            "`printf` viene del estándar C, así que se trae con `#include <stdio.h>` (o `<cstdio>`, su equivalente C++). `<iostream>` solo trae `cout`/`cin`.",
        },
        {
          type: "fill_blank",
          template: `// Cambia este programa de cout a printf
#include {{0}}

{{1}} main() {
  {{2}}("Bienvenido al CETI{{3}}");
  printf("Programando en C{{4}}");
  return {{5}};
}`,
          blanks: [
            { answer: "<stdio.h>", hint: "Header de printf (forma C)." },
            { answer: "int", hint: "Tipo de retorno de main." },
            { answer: "printf", hint: "La función para imprimir, estilo C." },
            { answer: "\\n", hint: "Secuencia para salto de línea." },
            { answer: "\\n", hint: "Otro salto de línea." },
            { answer: "0", hint: "Código de salida exitoso." },
          ],
          explanation:
            "Patrón: `#include <stdio.h>` + `printf(\"texto\\n\");` por cada línea. El `\\n` reemplaza al `endl` que usabas con `cout`.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Una línea
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Una sola línea

Escribe un programa que imprima EXACTAMENTE:

\`\`\`
Hola Mundo
\`\`\`

Usa \`printf\`. **No** uses \`cout\`.

Salida esperada:

\`\`\`
Hola Mundo
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  printf("Hola Mundo\\n");
  return 0;
}`,
            hints: [
              "Falta todo el `int main()`.",
              "Una sola línea de `printf(\"Hola Mundo\\n\");`.",
              "El `\\n` al final es indispensable para el salto de línea.",
            ],
            testCases: [
              {
                expectedStdout: "Hola Mundo\n",
                visible: true,
                description: "Imprime la línea con salto",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Tres líneas
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Datos del estudiante

Imprime EXACTAMENTE estas 3 líneas (con \`printf\`, una por llamada):

\`\`\`
Nombre: Aurora
Carrera: Mecatronica
Semestre: 5
\`\`\`

Salida esperada:

\`\`\`
Nombre: Aurora
Carrera: Mecatronica
Semestre: 5
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  printf("Nombre: Aurora\\n");
  printf("Carrera: Mecatronica\\n");
  printf("Semestre: 5\\n");
  return 0;
}`,
            hints: [
              "Tres `printf`, uno por línea.",
              "Cada string entre comillas dobles, terminado en `\\n`.",
              "No uses `cout`; ya no es válido en esta unidad.",
            ],
            testCases: [
              {
                expectedStdout: "Nombre: Aurora\nCarrera: Mecatronica\nSemestre: 5\n",
                visible: true,
                description: "Tres líneas en orden",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Mezclar saltos
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Una sola llamada, varias líneas

Reto: produce las mismas 4 líneas pero usando **un solo \`printf\`**.

\`\`\`
Linea 1
Linea 2
Linea 3
Linea 4
\`\`\`

Pista: dentro de un solo string puedes meter varios \`\\n\` para separar
líneas.

Salida esperada:

\`\`\`
Linea 1
Linea 2
Linea 3
Linea 4
\`\`\``,
            difficulty: "hard",
            xpReward: 40,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  printf("Linea 1\\nLinea 2\\nLinea 3\\nLinea 4\\n");
  return 0;
}`,
            hints: [
              "Un solo `printf(...)` con un solo string entre comillas.",
              "El `\\n` entre palabras separa las líneas como Enter.",
              "Recuerda cerrar con `\\n` al final para que la última línea quede bien.",
            ],
            testCases: [
              {
                expectedStdout: "Linea 1\nLinea 2\nLinea 3\nLinea 4\n",
                visible: true,
                description: "Cuatro líneas con una sola llamada",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 2: %i para enteros
    // =====================================================================
    {
      slug: "especificador-d",
      title: "%i: imprimir enteros con printf",
      description:
        "El truco real de printf: los especificadores. `%i` se reemplaza por el valor que le pasas.",
      xpReward: 40,
      estimatedMinutes: 11,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  int edad = 19;
  printf("Tengo %i anios\\n", edad);
  return 0;
}`,
          explanation:
            "El **`%i`** es un *placeholder* para un entero. Cuando `printf` lee `%i`, lo reemplaza por el valor que le pases DESPUÉS de la coma. Aquí imprime `Tengo 19 anios`.",
          runnable: true,
          expectedOutput: "Tengo 19 anios",
        },
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  int a = 5;
  int b = 3;
  // PUEDES meter varios %i en el mismo printf
  printf("%i + %i = %i\\n", a, b, a + b);
  return 0;
}`,
          explanation:
            "Cada `%i` consume UNA variable en orden. Aquí: el primer `%i` → `a`, el segundo → `b`, el tercero → `a + b`. El resultado es `5 + 3 = 8`.",
          runnable: true,
          expectedOutput: "5 + 3 = 8",
        },
        {
          type: "quiz",
          question:
            "Si haces `printf(\"%i %i\\n\", x);` (un solo argumento), ¿qué pasa?",
          options: [
            "Compila bien, imprime el valor de `x` dos veces.",
            "Compila pero imprime basura en el segundo `%i` — `printf` lee memoria que no le diste.",
            "Error de compilación.",
            "Imprime `0` automáticamente para el segundo.",
          ],
          correctIndex: 1,
          explanation:
            "`printf` confía en ti: si pones `%i` y no le pasas un valor, lee lo que sea que esté en la memoria. Es un bug clásico. Siempre cuadra: tantos `%i` como argumentos.",
        },
        {
          type: "fill_blank",
          template: `#include <stdio.h>

int main() {
  int edad = 18;
  int semestre = 3;
  int materias = 7;

  // Imprime: Edad 18, Semestre 3, Materias 7
  printf("Edad {{0}}, Semestre {{1}}, Materias {{2}}\\n", {{3}}, {{4}}, {{5}});

  // Imprime: Total: 28
  printf("Total: {{6}}\\n", edad + semestre + {{7}});
  return 0;
}`,
          blanks: [
            { answer: "%i", hint: "Placeholder para entero." },
            { answer: "%i", hint: "Otro placeholder para entero." },
            { answer: "%i", hint: "Tercero." },
            { answer: "edad", hint: "Primera variable que va al primer %i." },
            { answer: "semestre", hint: "Segunda variable." },
            { answer: "materias", hint: "Tercera variable." },
            { answer: "%i", hint: "Placeholder para el total (entero)." },
            { answer: "materias", hint: "La tercera variable que falta sumar." },
          ],
          explanation:
            "Patrón fijo: en el string van los `%i` (uno por valor); después de la coma van los valores en el MISMO orden.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Una variable
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Imprime un entero

Declara una variable \`int n = 42;\`. Imprime con \`printf\`:

\`\`\`
El numero es 42
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int n = 42;
  printf("El numero es %i\\n", n);
  return 0;
}`,
            hints: [
              "Un solo `printf` con `%i` para el placeholder.",
              "Sintaxis: `printf(\"texto %i texto\\n\", variable);`.",
              "No olvides el `\\n` al final.",
            ],
            testCases: [
              {
                expectedStdout: "El numero es 42\n",
                visible: true,
                description: "Imprime el número 42",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Suma de dos
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Suma de dos enteros

Declara \`int a = 7;\` y \`int b = 5;\`. Imprime en **una sola línea**:

\`\`\`
7 + 5 = 12
\`\`\`

Usa **un solo \`printf\`** con tres \`%i\`.`,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int a = 7;
  int b = 5;
  printf("%i + %i = %i\\n", a, b, a + b);
  return 0;
}`,
            hints: [
              "Un solo printf, tres `%i` separados por ` + ` y ` = `.",
              "Después de la coma, tres argumentos: `a, b, a + b`.",
              "El orden importa: cada `%i` toma el siguiente argumento.",
            ],
            testCases: [
              {
                expectedStdout: "7 + 5 = 12\n",
                visible: true,
                description: "Suma con tres placeholders",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Tabla
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Tres líneas con operaciones

Declara \`int x = 8;\` y \`int y = 3;\`. Imprime exactamente esto, usando un
\`printf\` distinto por línea:

\`\`\`
Suma: 8 + 3 = 11
Resta: 8 - 3 = 5
Producto: 8 * 3 = 24
\`\`\``,
            difficulty: "hard",
            xpReward: 40,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int x = 8;
  int y = 3;
  printf("Suma: %i + %i = %i\\n", x, y, x + y);
  printf("Resta: %i - %i = %i\\n", x, y, x - y);
  printf("Producto: %i * %i = %i\\n", x, y, x * y);
  return 0;
}`,
            hints: [
              "Tres `printf`, uno por línea.",
              "Cada uno con 3 `%i` y 3 argumentos: `x`, `y`, y el resultado.",
              "Cuida los textos exactos: `Suma:`, `Resta:`, `Producto:`.",
            ],
            testCases: [
              {
                expectedStdout: "Suma: 8 + 3 = 11\nResta: 8 - 3 = 5\nProducto: 8 * 3 = 24\n",
                visible: true,
                description: "Tres líneas con tres operaciones",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 3: %f para doubles
    // =====================================================================
    {
      slug: "especificador-f",
      title: "%f: imprimir números con decimales",
      description:
        "Para `double` usas `%f`. Y para controlar la cantidad de decimales, `%.2f`.",
      xpReward: 40,
      estimatedMinutes: 10,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  double promedio = 8.75;

  printf("Promedio: %f\\n", promedio);     // 8.750000 (6 decimales por defecto)
  printf("Promedio: %.2f\\n", promedio);   // 8.75 (controlado)
  return 0;
}`,
          explanation:
            "`%f` imprime un `double`. Por defecto muestra **6 decimales** — feo. Con `%.Nf` (donde N es un número) controlas cuántos decimales. `%.2f` es el más común para calificaciones y precios.",
          runnable: true,
          expectedOutput: "Promedio: 8.750000\nPromedio: 8.75",
        },
        {
          type: "quiz",
          question:
            "¿Qué imprime `printf(\"%.0f\\n\", 7.8);`?",
          options: [
            "`7.8`.",
            "`7` (sin decimales, redondea a entero).",
            "`8` (redondea al más cercano).",
            "Error: no se puede usar `%.0f`.",
          ],
          correctIndex: 2,
          explanation:
            "`%.0f` quiere decir “cero decimales”. `printf` redondea: `7.8` → `8`, `7.4` → `7`. Útil cuando un cálculo da decimales pero quieres mostrar un entero.",
        },
        {
          type: "fill_blank",
          template: `#include <stdio.h>

int main() {
  double precio = 125.5;
  double iva = 0.16;
  double total = precio * (1 + iva);

  printf("Precio base: {{0}}\\n", precio);          // formato libre
  printf("Precio base: {{1}}\\n", precio);          // 2 decimales
  printf("Total con IVA: {{2}}\\n", {{3}});         // 2 decimales con la variable
  printf("Total redondeado: {{4}}\\n", total);      // sin decimales
  return 0;
}`,
          blanks: [
            { answer: "%f", hint: "Formato por defecto (6 decimales)." },
            { answer: "%.2f", hint: "Dos decimales." },
            { answer: "%.2f", hint: "Dos decimales para total." },
            { answer: "total", hint: "La variable calculada arriba." },
            { answer: "%.0f", hint: "Sin decimales (redondeo a entero)." },
          ],
          explanation:
            "El patrón es `%.Nf` donde N es la cantidad de decimales. `%.2f` para dinero/calificaciones, `%.0f` para enteros que vienen de cálculos con doubles.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Imprimir un double
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Promedio con 2 decimales

Declara \`double promedio = 8.5;\`. Imprime:

\`\`\`
Promedio: 8.50
\`\`\`

(2 decimales obligatorios, aunque el valor sea exacto.)`,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  double promedio = 8.5;
  printf("Promedio: %.2f\\n", promedio);
  return 0;
}`,
            hints: [
              "Usa `%.2f` (dos decimales).",
              "Sintaxis: `printf(\"texto %.2f\\n\", variable);`.",
              "Con `%.2f`, `8.5` se imprime como `8.50`.",
            ],
            testCases: [
              {
                expectedStdout: "Promedio: 8.50\n",
                visible: true,
                description: "Dos decimales fijos",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Combinar %i y %f
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Ticket de cafetería

Declara:
- \`int cafes = 3;\`
- \`double precio = 25.5;\` (precio unitario)

Calcula \`double total = cafes * precio;\` e imprime:

\`\`\`
3 cafes x 25.50 = 76.50
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int cafes = 3;
  double precio = 25.5;
  double total = cafes * precio;
  printf("%i cafes x %.2f = %.2f\\n", cafes, precio, total);
  return 0;
}`,
            hints: [
              "Mezcla `%i` (para cafes) y `%.2f` (para precio y total).",
              "El orden de los argumentos: cafes, precio, total.",
              "Cuida el texto exacto: `cafes x` con espacio.",
            ],
            testCases: [
              {
                expectedStdout: "3 cafes x 25.50 = 76.50\n",
                visible: true,
                description: "Combina entero y decimales",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Calificaciones con redondeo
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Promedio con dos formatos

Declara las 3 calificaciones \`int c1 = 8, c2 = 9, c3 = 10;\`. Calcula el
promedio (\`/ 3.0\` para conservar decimales) e imprime **DOS líneas**:

\`\`\`
Promedio: 9.00
Aprobado con: 9
\`\`\`

- Primera línea: el promedio con **2 decimales**.
- Segunda línea: el promedio **redondeado a entero** (con \`%.0f\`).`,
            difficulty: "hard",
            xpReward: 45,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int c1 = 8, c2 = 9, c3 = 10;
  double promedio = (c1 + c2 + c3) / 3.0;
  printf("Promedio: %.2f\\n", promedio);
  printf("Aprobado con: %.0f\\n", promedio);
  return 0;
}`,
            hints: [
              "Calcula `promedio` con `(c1+c2+c3) / 3.0` (con 3.0, no 3).",
              "Línea 1: `%.2f`. Línea 2: `%.0f` (sin decimales, redondea).",
              "Misma variable `promedio`, distinto formato.",
            ],
            testCases: [
              {
                expectedStdout: "Promedio: 9.00\nAprobado con: 9\n",
                visible: true,
                description: "Dos formatos para el mismo valor",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 4: scanf básico (un entero) con &
    // =====================================================================
    {
      slug: "scanf-basico",
      title: "scanf: el reemplazo de cin",
      description:
        "Para leer del usuario en estilo C: `scanf` + el `&` obligatorio antes de la variable.",
      xpReward: 40,
      estimatedMinutes: 11,
      steps: [
        {
          type: "theory",
          markdown: `## Adiós cin, hola scanf

Igual que cambiaste \`cout\` por \`printf\`, ahora cambias \`cin\` por **\`scanf\`**:

\`\`\`cpp
// Antes (estilo C++)
int edad;
cin >> edad;

// Ahora (estilo C)
int edad;
scanf("%i", &edad);
\`\`\`

Dos cosas raras la primera vez:

1. El **especificador** va dentro del string (\`"%i"\`) — igual que en \`printf\`.
   - \`%i\` para entero, \`%f\` para double.
2. El **\`&\` (ampersand)** ANTES de la variable es **obligatorio**.
   - Le dice a \`scanf\` *dónde* guardar el valor (la dirección de la variable).
   - Si lo olvidas, el programa se rompe en runtime.`,
        },
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  int edad;
  printf("Cuantos anios tienes? ");
  scanf("%i", &edad);             // OJO: el & antes de edad
  printf("Tienes %i anios\\n", edad);
  return 0;
}`,
          explanation:
            "Tres partes: `printf` para preguntar → `scanf(\"%i\", &edad)` para leer el entero → `printf(\"...%i\\n\", edad)` para mostrar. El `&edad` significa *“la dirección de la variable edad”* (lo verás a fondo cuando veas punteros).",
          runnable: true,
          expectedOutput: "Cuantos anios tienes?",
        },
        {
          type: "quiz",
          question:
            "¿Qué error es más típico al usar `scanf`?",
          options: [
            "Poner el `%i` entre comillas.",
            "Olvidar el `&` antes de la variable: `scanf(\"%i\", edad);`.",
            "Poner el `;` al final.",
            "Pedir un entero cuando el usuario teclea un entero.",
          ],
          correctIndex: 1,
          explanation:
            "Olvidar el `&` no marca error de compilación (el compilador no se da cuenta), pero al ejecutarse el programa CRASHEA o se comporta raro. Acuérdate siempre: variable = `&variable` dentro de scanf.",
        },
        {
          type: "fill_blank",
          template: `#include <stdio.h>

int main() {
  int edad;
  double promedio;

  printf("Edad: ");
  scanf({{0}}, {{1}}edad);              // leer entero

  printf("Promedio: ");
  scanf({{2}}, {{3}}promedio);          // leer double

  printf("Tienes {{4}} anios y promedio {{5}}\\n", {{6}}, {{7}});
  return 0;
}`,
          blanks: [
            { answer: "\"%i\"", hint: "Especificador de entero entre comillas." },
            { answer: "&", hint: "Símbolo OBLIGATORIO antes de la variable en scanf." },
            { answer: "\"%f\"", hint: "Especificador de double entre comillas." },
            { answer: "&", hint: "Mismo símbolo & antes de promedio." },
            { answer: "%i", hint: "Placeholder para entero (en printf, sin comillas extras)." },
            { answer: "%.2f", hint: "Placeholder para double con 2 decimales." },
            { answer: "edad", hint: "Primera variable (entero)." },
            { answer: "promedio", hint: "Segunda variable (double)." },
          ],
          explanation:
            "Patrón: `scanf(\"%i\", &variable);` para enteros, `scanf(\"%f\", &variable);` para doubles. En printf NO va el `&` — solo en scanf.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Eco de un entero
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Eco de un entero

Lee un entero del usuario con \`scanf\` y reimprímelo con \`printf\` así:

\`\`\`
Lei: <n>
\`\`\`

Para el test, el sistema enviará: \`42\`.

Salida esperada:

\`\`\`
Lei: 42
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int n;
  scanf("%i", &n);
  printf("Lei: %i\\n", n);
  return 0;
}`,
            hints: [
              "Declara `int n;`.",
              "`scanf(\"%i\", &n);` — NO olvides el `&`.",
              "`printf(\"Lei: %i\\n\", n);` para mostrar.",
            ],
            testCases: [
              {
                stdin: "42\n",
                expectedStdout: "Lei: 42\n",
                visible: true,
                description: "Eco de un entero",
              },
              {
                stdin: "999\n",
                expectedStdout: "Lei: 999\n",
                visible: false,
                description: "Funciona con cualquier entero",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Cuadrado
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Cuadrado de un número

Lee un entero \`n\` y calcula su cuadrado (\`n * n\`). Imprime:

\`\`\`
<n> al cuadrado es <n*n>
\`\`\`

Para el test, el sistema enviará: \`7\` (cuadrado = 49).

Salida esperada:

\`\`\`
7 al cuadrado es 49
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int n;
  scanf("%i", &n);
  printf("%i al cuadrado es %i\\n", n, n * n);
  return 0;
}`,
            hints: [
              "Solo necesitas una variable `int n;`.",
              "Un solo `printf` con dos `%i`: el primero `n`, el segundo `n * n`.",
              "No imprimas prompt antes del scanf — el test no lo espera.",
            ],
            testCases: [
              {
                stdin: "7\n",
                expectedStdout: "7 al cuadrado es 49\n",
                visible: true,
                description: "Caso típico",
              },
              {
                stdin: "10\n",
                expectedStdout: "10 al cuadrado es 100\n",
                visible: false,
                description: "Cuadrado de 10",
              },
              {
                stdin: "0\n",
                expectedStdout: "0 al cuadrado es 0\n",
                visible: false,
                description: "Cuadrado de cero",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Double con precisión
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Calificación con decimales

Lee un \`double\` con \`scanf\` (usa \`%f\`) y reimprímelo con dos decimales:

\`\`\`
Calificacion: <d con 2 decimales>
\`\`\`

Para el test, el sistema enviará: \`8.5\`.

Salida esperada:

\`\`\`
Calificacion: 8.50
\`\`\``,
            difficulty: "hard",
            xpReward: 40,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  double cal;
  scanf("%lf", &cal);
  printf("Calificacion: %.2f\\n", cal);
  return 0;
}`,
            hints: [
              "Para `scanf` de `double` usa **`%lf`** (L minúscula + f).",
              "Para `printf` de `double` con 2 decimales: `%.2f`.",
              "Recuerda el `&` en el scanf.",
            ],
            testCases: [
              {
                stdin: "8.5\n",
                expectedStdout: "Calificacion: 8.50\n",
                visible: true,
                description: "Lectura de double con %lf",
              },
              {
                stdin: "9.123\n",
                expectedStdout: "Calificacion: 9.12\n",
                visible: false,
                description: "Trunca a 2 decimales",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 5: scanf de varios valores
    // =====================================================================
    {
      slug: "scanf-multiple",
      title: "scanf de varios valores a la vez",
      description:
        "Igual que con `cin >> a >> b`, puedes leer varios datos en una sola llamada a `scanf`.",
      xpReward: 40,
      estimatedMinutes: 11,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  int a, b;
  // El usuario teclea: 5 3
  scanf("%i %i", &a, &b);
  printf("a = %i, b = %i\\n", a, b);
  printf("Suma: %i\\n", a + b);
  return 0;
}`,
          explanation:
            "Dentro del string del `scanf` pones tantos `%i` como variables quieras leer; después, pasas tantos `&variable` como `%i` haya. El usuario separa los valores con espacio o salto de línea — `scanf` se encarga.",
          runnable: true,
          expectedOutput: "",
        },
        {
          type: "quiz",
          question:
            "Si el usuario escribe `10 20 30` y haces `scanf(\"%i %i\", &a, &b);`, ¿qué pasa con el `30`?",
          options: [
            "Se pierde — el scanf ya terminó.",
            "Se guarda en una variable invisible.",
            "Causa error de ejecución.",
            "Se queda en el buffer; si después haces otro `scanf(\"%i\", &c);` se lo lleva.",
          ],
          correctIndex: 3,
          explanation:
            "El input que sobra se queda esperando en el *buffer*. El siguiente `scanf` lo recoge. Por eso a veces hay que tener cuidado: si pides 2 enteros y el usuario teclea 3, el tercero queda colgado.",
        },
        {
          type: "fill_blank",
          template: `#include <stdio.h>

int main() {
  int a, b, c;

  // Lee 3 enteros en una sola llamada
  scanf({{0}}, {{1}}a, {{2}}b, {{3}}c);

  printf("a = {{4}}, b = {{4}}, c = {{4}}\\n", a, b, c);
  printf("Suma de los tres: {{5}}\\n", a + b + c);
  return 0;
}`,
          blanks: [
            { answer: "\"%i %i %i\"", hint: "Tres %i separados por espacio, entre comillas." },
            { answer: "&", hint: "& antes de la primera variable." },
            { answer: "&", hint: "& antes de la segunda." },
            { answer: "&", hint: "& antes de la tercera." },
            { answer: "%i", hint: "Placeholder usado tres veces para los 3 enteros." },
            { answer: "%i", hint: "Placeholder para la suma." },
          ],
          explanation:
            "Cuando lees varios valores: 1) tantos `%i` como variables en el string, 2) tantos `&variable` después de la coma. El espacio dentro del string es opcional — `\"%i %i\"` y `\"%i%i\"` funcionan igual.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Suma de dos enteros
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Suma de dos

Lee **dos enteros** del usuario con un solo \`scanf\` e imprime su suma:

\`\`\`
Suma: <a+b>
\`\`\`

Para el test, el sistema enviará: \`7 5\` (suma = 12).

Salida esperada:

\`\`\`
Suma: 12
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int a, b;
  scanf("%i %i", &a, &b);
  printf("Suma: %i\\n", a + b);
  return 0;
}`,
            hints: [
              "Una sola llamada a scanf con `\"%i %i\"`.",
              "Dos `&` después de la coma: `&a, &b`.",
              "Imprime con `printf(\"Suma: %i\\n\", a + b);`.",
            ],
            testCases: [
              {
                stdin: "7 5\n",
                expectedStdout: "Suma: 12\n",
                visible: true,
                description: "Caso típico",
              },
              {
                stdin: "100 200\n",
                expectedStdout: "Suma: 300\n",
                visible: false,
                description: "Funciona con valores mayores",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Promedio de tres
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Promedio de tres

Lee **tres enteros** en una sola llamada a \`scanf\`. Calcula su promedio
dividiendo entre \`3.0\` (para conservar decimales) e imprime con 2 decimales:

\`\`\`
Promedio: <p con 2 decimales>
\`\`\`

Para el test, el sistema enviará: \`8 9 10\` (promedio = 9.00).

Salida esperada:

\`\`\`
Promedio: 9.00
\`\`\``,
            difficulty: "medium",
            xpReward: 40,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int a, b, c;
  scanf("%i %i %i", &a, &b, &c);
  double promedio = (a + b + c) / 3.0;
  printf("Promedio: %.2f\\n", promedio);
  return 0;
}`,
            hints: [
              "Lee con `scanf(\"%i %i %i\", &a, &b, &c);`.",
              "Calcula `(a + b + c) / 3.0` (con punto, no 3 entero).",
              "Imprime con `%.2f` para 2 decimales.",
            ],
            testCases: [
              {
                stdin: "8 9 10\n",
                expectedStdout: "Promedio: 9.00\n",
                visible: true,
                description: "Promedio entero",
              },
              {
                stdin: "7 8 9\n",
                expectedStdout: "Promedio: 8.00\n",
                visible: false,
                description: "Otro caso",
              },
              {
                stdin: "10 5 6\n",
                expectedStdout: "Promedio: 7.00\n",
                visible: false,
                description: "21/3 = 7",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Mezcla %i y %lf
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Total de carrito

Lee, en una sola llamada a \`scanf\`:
- Un **entero** (cantidad de productos)
- Un **double** (precio unitario)

Imprime:

\`\`\`
<cantidad> productos x <precio con 2 decimales> = <total con 2 decimales>
\`\`\`

Para el test, el sistema enviará: \`4 12.5\` (total = 50.00).

Salida esperada:

\`\`\`
4 productos x 12.50 = 50.00
\`\`\``,
            difficulty: "hard",
            xpReward: 45,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int cantidad;
  double precio;
  scanf("%i %lf", &cantidad, &precio);
  double total = cantidad * precio;
  printf("%i productos x %.2f = %.2f\\n", cantidad, precio, total);
  return 0;
}`,
            hints: [
              "Mezcla en el scanf: `\"%i %lf\"` (entero y double).",
              "`scanf` para `double` usa **`%lf`** (NO `%f`).",
              "En el `printf` el double sí lleva `%.2f` (sin la `l`).",
            ],
            testCases: [
              {
                stdin: "4 12.5\n",
                expectedStdout: "4 productos x 12.50 = 50.00\n",
                visible: true,
                description: "Caso típico",
              },
              {
                stdin: "10 9.99\n",
                expectedStdout: "10 productos x 9.99 = 99.90\n",
                visible: false,
                description: "Decimal exacto",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 6: Integrador
    // =====================================================================
    {
      slug: "integrador-printf-scanf",
      title: "Integrador: programa completo con printf y scanf",
      description:
        "Pones todo junto: leer varios datos, calcular, e imprimir con formato.",
      xpReward: 65,
      estimatedMinutes: 14,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>

// Función pura — no hace I/O
double promedio(int a, int b, int c) {
  return (a + b + c) / 3.0;
}

int main() {
  int n1, n2, n3;
  scanf("%i %i %i", &n1, &n2, &n3);

  double p = promedio(n1, n2, n3);
  printf("Promedio: %.2f\\n", p);

  if (p >= 7.0) {
    printf("Aprobado\\n");
  } else {
    printf("Reprobado\\n");
  }
  return 0;
}`,
          explanation:
            "Patrón profesional: la **función** hace el cálculo puro (sin I/O), y `main` orquesta `scanf` → llamada → `printf`. Mantener las funciones limpias de I/O las hace fáciles de probar y reusar.",
          runnable: true,
          expectedOutput: "",
        },
        {
          type: "quiz",
          question:
            "¿Por qué la función `promedio` NO usa printf ni scanf?",
          options: [
            "Porque las funciones no pueden hacer I/O.",
            "Por buena práctica: separar cálculo de I/O hace la función reusable y probable.",
            "Es lo mismo, ponerlo dentro o fuera.",
            "Porque scanf no compila en funciones.",
          ],
          correctIndex: 1,
          explanation:
            "Si la función `promedio` pidiera input por scanf, no la podrías reusar con valores ya calculados. Mantén funciones de **cálculo puro** y deja la I/O en `main` o en funciones específicas de I/O.",
        },
        {
          type: "fill_blank",
          template: `#include <stdio.h>

// Función pura: calcula área del rectángulo
double area(double base, double altura) {
  return base {{0}} altura;
}

int main() {
  double b, h;
  scanf({{1}}, {{2}}b, {{2}}h);

  double a = {{3}}(b, h);
  printf("Base: {{4}}\\n", b);
  printf("Altura: {{4}}\\n", h);
  printf("Area: {{5}}\\n", a);

  return {{6}};
}`,
          blanks: [
            { answer: "*", hint: "Operador de multiplicación." },
            { answer: "\"%lf %lf\"", hint: "Dos doubles separados; %lf en scanf." },
            { answer: "&", hint: "& antes de cada variable en scanf." },
            { answer: "area", hint: "Nombre de la función definida arriba." },
            { answer: "%.2f", hint: "Formato de double con 2 decimales." },
            { answer: "%.2f", hint: "Mismo formato para el área." },
            { answer: "0", hint: "Código de salida exitoso." },
          ],
          explanation:
            "Estructura completa: includes → función pura → main que hace I/O y llama a la función. Es el esquema más común y profesional.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (medio): IMC
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — IMC (índice de masa corporal)

Lee desde \`scanf\`:
- Un \`double\` peso (en kg)
- Un \`double\` altura (en metros)

Calcula el IMC con \`peso / (altura * altura)\` e imprime:

\`\`\`
IMC: <imc con 2 decimales>
\`\`\`

Para el test, el sistema enviará: \`70 1.75\` (IMC = 22.86).

Salida esperada:

\`\`\`
IMC: 22.86
\`\`\``,
            difficulty: "medium",
            xpReward: 45,
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
              "Para `double` en scanf usa `%lf`.",
              "La fórmula: `imc = peso / (altura * altura);` — con paréntesis.",
              "Imprime con `%.2f`.",
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
                description: "Persona más pequeña",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (difícil): Boletín completo
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Boletín de 3 calificaciones

Lee **3 enteros** del usuario en una sola llamada a \`scanf\`. Imprime
**TRES líneas exactamente**:

1. \`Promedio: <p con 2 decimales>\` — el promedio dividiendo entre \`3.0\`.
2. \`Mayor: <m>\` — la mayor de las 3 calificaciones (entero).
3. \`<Aprobado o Reprobado>\` — según si el promedio es \`>= 7.0\`.

Para el test, el sistema enviará: \`8 5 10\`.

- Promedio = 7.67, Mayor = 10, Estado = Aprobado.

Salida esperada:

\`\`\`
Promedio: 7.67
Mayor: 10
Aprobado
\`\`\``,
            difficulty: "hard",
            xpReward: 60,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int a, b, c;
  scanf("%i %i %i", &a, &b, &c);

  double prom = (a + b + c) / 3.0;

  int mayor = a;
  if (b > mayor) mayor = b;
  if (c > mayor) mayor = c;

  printf("Promedio: %.2f\\n", prom);
  printf("Mayor: %i\\n", mayor);
  if (prom >= 7.0) {
    printf("Aprobado\\n");
  } else {
    printf("Reprobado\\n");
  }
  return 0;
}`,
            hints: [
              "Patrón de máximo: arranca `mayor = a;`, después dos `if` para comparar con `b` y `c`.",
              "Promedio: dividir entre `3.0` para mantener decimales.",
              "Tres `printf` distintos; el último depende del `if`.",
            ],
            testCases: [
              {
                stdin: "8 5 10\n",
                expectedStdout: "Promedio: 7.67\nMayor: 10\nAprobado\n",
                visible: true,
                description: "Caso ejemplo",
              },
              {
                stdin: "5 5 5\n",
                expectedStdout: "Promedio: 5.00\nMayor: 5\nReprobado\n",
                visible: false,
                description: "Todos iguales, reprobado",
              },
              {
                stdin: "10 10 10\n",
                expectedStdout: "Promedio: 10.00\nMayor: 10\nAprobado\n",
                visible: false,
                description: "Todos perfectos",
              },
              {
                stdin: "9 8 7\n",
                expectedStdout: "Promedio: 8.00\nMayor: 9\nAprobado\n",
                visible: false,
                description: "Decreciente",
              },
            ],
          },
        },
      ],
    },
  ],
};
