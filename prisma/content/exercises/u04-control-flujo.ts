import type { PracticeUnitSetDefinition } from "./types";

/**
 * Ejercicios de práctica — Unidad 04: Control de flujo
 *
 * Conceptos disponibles (acumulados):
 *   - U1-U3: cout, cin, variables, const, aritmética
 *   - U4: if, else, else if, switch, operadores lógicos (&& || !)
 *
 * NO disponibles aún: loops (U5), funciones (U6), arreglos (U8).
 *
 * Calibración (RELATIVA a U4):
 *   easy   — starter con includes + main + algunos pasos hechos
 *   medium — starter con includes + main shell vacío
 *   hard   — starter con solo includes
 */
export const u04ControlFlujoExercises: PracticeUnitSetDefinition = {
  unitSlug: "control-de-flujo",
  unitTitle: "Control de flujo",
  unitIcon: "🔀",
  exercises: [
    // -----------------------------------------------------------------
    // EASY × 3
    // -----------------------------------------------------------------
    {
      slug: "u04-par-impar",
      title: "Par o impar",
      description: "Lee un entero y dice si es par o impar.",
      difficulty: "easy",
      xpReward: 14,
      prompt: `## Par o impar

Lee un entero \`n\`. Imprime:

- \`Par\` si \`n % 2 == 0\`
- \`Impar\` en otro caso

Para el test, el sistema enviará: \`8\`.

Salida esperada:

\`\`\`
Par
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  // if/else con el residuo

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  if (n % 2 == 0) {
    cout << "Par" << endl;
  } else {
    cout << "Impar" << endl;
  }
  return 0;
}`,
      hints: [
        "El operador `%` (módulo) devuelve el resto de la división.",
        "Un número es par si `n % 2 == 0`.",
        "Estructura: `if (cond) { ... } else { ... }`.",
      ],
      testCases: [
        {
          stdin: "8\n",
          expectedStdout: "Par\n",
          visible: true,
          description: "8 es par",
        },
        {
          stdin: "7\n",
          expectedStdout: "Impar\n",
          visible: false,
          description: "7 es impar",
        },
        {
          stdin: "0\n",
          expectedStdout: "Par\n",
          visible: false,
          description: "0 cuenta como par",
        },
        {
          stdin: "-3\n",
          expectedStdout: "Impar\n",
          visible: false,
          description: "Negativos también",
        },
      ],
    },
    {
      slug: "u04-aprobado",
      title: "Aprobado o reprobado",
      description: "Lee calificación, decide con un if simple.",
      difficulty: "easy",
      xpReward: 14,
      prompt: `## Aprobado o reprobado

Lee \`int calificacion\`. Imprime:

- \`Aprobado\` si \`calificacion >= 7\`
- \`Reprobado\` en otro caso

Para el test, el sistema enviará: \`9\`.

Salida esperada:

\`\`\`
Aprobado
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  int calificacion;
  cin >> calificacion;
  // if / else

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int calificacion;
  cin >> calificacion;
  if (calificacion >= 7) {
    cout << "Aprobado" << endl;
  } else {
    cout << "Reprobado" << endl;
  }
  return 0;
}`,
      hints: [
        "La condición es `calificacion >= 7` — incluye al 7.",
        "Dentro de cada bloque, un `cout` con el texto exacto.",
      ],
      testCases: [
        {
          stdin: "9\n",
          expectedStdout: "Aprobado\n",
          visible: true,
          description: "9 aprueba",
        },
        {
          stdin: "7\n",
          expectedStdout: "Aprobado\n",
          visible: false,
          description: "7 justo aprueba",
        },
        {
          stdin: "6\n",
          expectedStdout: "Reprobado\n",
          visible: false,
          description: "6 NO aprueba",
        },
      ],
    },
    {
      slug: "u04-mayor-de-dos",
      title: "Mayor de dos",
      description: "Lee dos enteros y muestra el mayor.",
      difficulty: "easy",
      xpReward: 16,
      prompt: `## Mayor de dos números

Lee dos enteros \`a\` y \`b\` en una sola línea. Imprime EXACTAMENTE:

\`\`\`
Mayor: <el mayor>
\`\`\`

Si son iguales, imprime cualquiera de los dos.

Para el test, el sistema enviará: \`15 9\`.

Salida esperada:

\`\`\`
Mayor: 15
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  int a, b;
  cin >> a >> b;
  // Decide cuál es mayor con un if

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int a, b;
  cin >> a >> b;
  if (a >= b) {
    cout << "Mayor: " << a << endl;
  } else {
    cout << "Mayor: " << b << endl;
  }
  return 0;
}`,
      hints: [
        "Compara con `>=` para que los empates devuelvan `a`.",
        "Imprime con el prefijo `Mayor: ` (con espacio).",
      ],
      testCases: [
        {
          stdin: "15 9\n",
          expectedStdout: "Mayor: 15\n",
          visible: true,
          description: "15 > 9",
        },
        {
          stdin: "3 100\n",
          expectedStdout: "Mayor: 100\n",
          visible: false,
          description: "El segundo es mayor",
        },
        {
          stdin: "7 7\n",
          expectedStdout: "Mayor: 7\n",
          visible: false,
          description: "Empate",
        },
      ],
    },

    // -----------------------------------------------------------------
    // MEDIUM × 3
    // -----------------------------------------------------------------
    {
      slug: "u04-clasificar-letra",
      title: "Letra de calificación",
      description: "Convierte un número a A/B/C/F con else if.",
      difficulty: "medium",
      xpReward: 20,
      prompt: `## Letra de calificación

Lee \`int cal\`. Imprime una letra según el rango:

| Rango     | Letra |
|-----------|-------|
| >= 9      | A     |
| >= 8      | B     |
| >= 7      | C     |
| < 7       | F     |

Para el test, el sistema enviará: \`8\`.

Salida esperada:

\`\`\`
B
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int cal;
  cin >> cal;
  if (cal >= 9) {
    cout << "A" << endl;
  } else if (cal >= 8) {
    cout << "B" << endl;
  } else if (cal >= 7) {
    cout << "C" << endl;
  } else {
    cout << "F" << endl;
  }
  return 0;
}`,
      hints: [
        "Empieza por la condición MÁS estricta (`>= 9`) y baja.",
        "Cuando un `else if` se cumple, los demás ya no se evalúan.",
      ],
      testCases: [
        {
          stdin: "8\n",
          expectedStdout: "B\n",
          visible: true,
          description: "8 → B",
        },
        {
          stdin: "10\n",
          expectedStdout: "A\n",
          visible: false,
          description: "10 → A",
        },
        {
          stdin: "7\n",
          expectedStdout: "C\n",
          visible: false,
          description: "7 → C",
        },
        {
          stdin: "5\n",
          expectedStdout: "F\n",
          visible: false,
          description: "5 → F",
        },
      ],
    },
    {
      slug: "u04-anio-bisiesto",
      title: "Año bisiesto",
      description: "Determina si un año es bisiesto con && y ||.",
      difficulty: "medium",
      xpReward: 22,
      prompt: `## Año bisiesto

Un año es bisiesto si:

- Es divisible entre 4 **Y** NO es divisible entre 100,
- **O** es divisible entre 400.

Es decir: \`(anio % 4 == 0 && anio % 100 != 0) || anio % 400 == 0\`.

Lee un \`int anio\` e imprime \`Bisiesto\` o \`No bisiesto\`.

Para el test, el sistema enviará: \`2024\`.

Salida esperada:

\`\`\`
Bisiesto
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int anio;
  cin >> anio;
  if ((anio % 4 == 0 && anio % 100 != 0) || anio % 400 == 0) {
    cout << "Bisiesto" << endl;
  } else {
    cout << "No bisiesto" << endl;
  }
  return 0;
}`,
      hints: [
        "Cuida los paréntesis alrededor del `&&` — sin ellos, el `||` cambia el sentido.",
        "Usa `%` (módulo) para verificar divisibilidad.",
      ],
      testCases: [
        {
          stdin: "2024\n",
          expectedStdout: "Bisiesto\n",
          visible: true,
          description: "2024 es bisiesto",
        },
        {
          stdin: "2023\n",
          expectedStdout: "No bisiesto\n",
          visible: false,
          description: "2023 no",
        },
        {
          stdin: "2000\n",
          expectedStdout: "Bisiesto\n",
          visible: false,
          description: "2000 sí (regla del 400)",
        },
        {
          stdin: "1900\n",
          expectedStdout: "No bisiesto\n",
          visible: false,
          description: "1900 NO (divisible entre 100 pero no entre 400)",
        },
      ],
    },
    {
      slug: "u04-dia-semana-switch",
      title: "Día de la semana con switch",
      description: "Convierte número 1-7 a nombre del día usando switch.",
      difficulty: "medium",
      xpReward: 22,
      prompt: `## Día de la semana

Lee un \`int dia\` (1 = lunes, 7 = domingo). Usa un **\`switch\`** para
imprimir el nombre:

\`\`\`
1 → Lunes
2 → Martes
3 → Miercoles
4 → Jueves
5 → Viernes
6 → Sabado
7 → Domingo
\`\`\`

Para cualquier otro valor imprime \`Invalido\`.

Para el test, el sistema enviará: \`3\`.

Salida esperada:

\`\`\`
Miercoles
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int dia;
  cin >> dia;
  switch (dia) {
    case 1: cout << "Lunes" << endl; break;
    case 2: cout << "Martes" << endl; break;
    case 3: cout << "Miercoles" << endl; break;
    case 4: cout << "Jueves" << endl; break;
    case 5: cout << "Viernes" << endl; break;
    case 6: cout << "Sabado" << endl; break;
    case 7: cout << "Domingo" << endl; break;
    default: cout << "Invalido" << endl;
  }
  return 0;
}`,
      hints: [
        "Sintaxis: `switch (variable) { case N: ...; break; ... default: ...; }`.",
        "Sin acentos en los nombres: `Miercoles`, `Sabado`.",
      ],
      testCases: [
        {
          stdin: "3\n",
          expectedStdout: "Miercoles\n",
          visible: true,
          description: "3 → Miércoles",
        },
        {
          stdin: "1\n",
          expectedStdout: "Lunes\n",
          visible: false,
          description: "1 → Lunes",
        },
        {
          stdin: "7\n",
          expectedStdout: "Domingo\n",
          visible: false,
          description: "7 → Domingo",
        },
        {
          stdin: "9\n",
          expectedStdout: "Invalido\n",
          visible: false,
          description: "Fuera de rango",
        },
      ],
    },

    // -----------------------------------------------------------------
    // HARD × 2
    // -----------------------------------------------------------------
    {
      slug: "u04-precio-con-descuento",
      title: "Precio con descuento por monto",
      description: "Aplica descuento según el rango del precio. Solo includes.",
      difficulty: "hard",
      xpReward: 28,
      prompt: `## Precio con descuento

Lee un \`double precio\`. Aplica descuento según el monto:

| Rango           | Descuento |
|-----------------|-----------|
| >= 1000         | 20 %      |
| >= 500          | 10 %      |
| >= 100          | 5 %       |
| < 100           | 0 %       |

Imprime **dos líneas**:

\`\`\`
Descuento: <porcentaje>%
Total: <precio - precio * descuento>
\`\`\`

Para el test, el sistema enviará: \`750\` → 10 %.

- Descuento = 0.10 → 75
- Total = 750 − 75 = 675

Salida esperada:

\`\`\`
Descuento: 10%
Total: 675
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;
`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  double precio;
  cin >> precio;
  double descuento;
  int porcentaje;
  if (precio >= 1000) {
    descuento = 0.20;
    porcentaje = 20;
  } else if (precio >= 500) {
    descuento = 0.10;
    porcentaje = 10;
  } else if (precio >= 100) {
    descuento = 0.05;
    porcentaje = 5;
  } else {
    descuento = 0;
    porcentaje = 0;
  }
  double total = precio - precio * descuento;
  cout << "Descuento: " << porcentaje << "%" << endl;
  cout << "Total: " << total << endl;
  return 0;
}`,
      hints: [
        "Cadena de `if / else if / else` de mayor a menor monto.",
        "Guarda el descuento (decimal) y el porcentaje (entero) en variables distintas.",
      ],
      testCases: [
        {
          stdin: "750\n",
          expectedStdout: "Descuento: 10%\nTotal: 675\n",
          visible: true,
          description: "Rango medio: 10%",
        },
        {
          stdin: "1500\n",
          expectedStdout: "Descuento: 20%\nTotal: 1200\n",
          visible: false,
          description: "Rango alto: 20%",
        },
        {
          stdin: "200\n",
          expectedStdout: "Descuento: 5%\nTotal: 190\n",
          visible: false,
          description: "Rango bajo: 5%",
        },
        {
          stdin: "50\n",
          expectedStdout: "Descuento: 0%\nTotal: 50\n",
          visible: false,
          description: "Sin descuento",
        },
      ],
    },
    {
      slug: "u04-calculadora-simple",
      title: "Mini calculadora",
      description: "Lee 2 números y un operador (+, -, *, /). Calcula y muestra.",
      difficulty: "hard",
      xpReward: 30,
      prompt: `## Mini calculadora

Lee, en este orden:
- \`double a\`
- \`char op\` (uno de \`+\`, \`-\`, \`*\`, \`/\`)
- \`double b\`

Imprime el resultado de \`a op b\`. Si \`op\` no es válido, imprime
\`Operacion invalida\`. Si \`op\` es \`/\` y \`b == 0\`, imprime
\`Division entre cero\`.

Para el test, el sistema enviará: \`8 * 4\`.

Salida esperada:

\`\`\`
32
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;
`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  double a, b;
  char op;
  cin >> a >> op >> b;

  if (op == '+') {
    cout << a + b << endl;
  } else if (op == '-') {
    cout << a - b << endl;
  } else if (op == '*') {
    cout << a * b << endl;
  } else if (op == '/') {
    if (b == 0) {
      cout << "Division entre cero" << endl;
    } else {
      cout << a / b << endl;
    }
  } else {
    cout << "Operacion invalida" << endl;
  }
  return 0;
}`,
      hints: [
        "Lee `cin >> a >> op >> b;` — `cin` se encarga de saltar espacios.",
        "Compara `char` con comillas SIMPLES: `if (op == '+')`.",
        "Para la división, valida `b == 0` ANTES de dividir.",
      ],
      testCases: [
        {
          stdin: "8 * 4\n",
          expectedStdout: "32\n",
          visible: true,
          description: "8 * 4 = 32",
        },
        {
          stdin: "10 + 5\n",
          expectedStdout: "15\n",
          visible: false,
          description: "Suma",
        },
        {
          stdin: "20 / 4\n",
          expectedStdout: "5\n",
          visible: false,
          description: "División",
        },
        {
          stdin: "10 / 0\n",
          expectedStdout: "Division entre cero\n",
          visible: false,
          description: "División entre 0",
        },
        {
          stdin: "5 ^ 2\n",
          expectedStdout: "Operacion invalida\n",
          visible: false,
          description: "Operador no soportado",
        },
      ],
    },
  ],
};
