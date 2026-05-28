import type { PracticeUnitSetDefinition } from "./types";

/**
 * Ejercicios de práctica — Unidad 03: Variables y tipos
 *
 * Conceptos disponibles:
 *   - int, double, char, bool, string
 *   - const
 *   - operadores aritméticos: + - * / %
 *   - cout, cin, getline (de U1-U2)
 *
 * NO disponibles:
 *   - if/else (U4), loops (U5), funciones (U6), arreglos (U8)
 *
 * Calibración (RELATIVA a U3):
 *   easy   — starter con includes + main + variables + comentario
 *   medium — starter con includes + main shell vacío
 *   hard   — starter con solo includes + using
 */
export const u03VariablesExercises: PracticeUnitSetDefinition = {
  unitSlug: "variables-y-tipos",
  unitTitle: "Variables y tipos de datos",
  unitIcon: "📦",
  exercises: [
    // -----------------------------------------------------------------
    // EASY × 3
    // -----------------------------------------------------------------
    {
      slug: "u03-tres-variables",
      title: "Tres tipos básicos",
      description: "Declara una variable de cada tipo: int, double y char.",
      difficulty: "easy",
      xpReward: 12,
      prompt: `## Tres tipos básicos

Declara estas tres variables con los valores indicados:

- \`int edad = 19\`
- \`double promedio = 8.5\`
- \`char grupo = 'B'\`

Imprime cada una en una línea separada, en ese orden.

Salida esperada:

\`\`\`
19
8.5
B
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  // Declara las 3 variables aquí, una por tipo

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int edad = 19;
  double promedio = 8.5;
  char grupo = 'B';
  cout << edad << endl;
  cout << promedio << endl;
  cout << grupo << endl;
  return 0;
}`,
      hints: [
        "Tres declaraciones, una por tipo: `int`, `double`, `char`.",
        "Para `char` usa comillas SIMPLES: `'B'`, no `\"B\"`.",
        "Tres `cout` separados con `endl`.",
      ],
      testCases: [
        {
          expectedStdout: "19\n8.5\nB\n",
          visible: true,
          description: "Tres tipos básicos impresos en orden",
        },
      ],
    },
    {
      slug: "u03-cuadrado-numero",
      title: "Cuadrado de un número",
      description: "Lee un entero, guarda su cuadrado en una variable, imprime.",
      difficulty: "easy",
      xpReward: 12,
      prompt: `## Cuadrado de un número

Lee un \`int n\` del usuario. Guarda el cuadrado (\`n * n\`) en una variable
llamada \`cuadrado\`. Imprime:

\`\`\`
<n> al cuadrado es <cuadrado>
\`\`\`

Para el test, el sistema enviará: \`6\`.

Salida esperada:

\`\`\`
6 al cuadrado es 36
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  // Lee n, calcula el cuadrado en una variable e imprime

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  int cuadrado = n * n;
  cout << n << " al cuadrado es " << cuadrado << endl;
  return 0;
}`,
      hints: [
        "Lee con `cin >> n;`.",
        "Declara `int cuadrado = n * n;` DESPUÉS de leer.",
        "Encadena con `<<` para mezclar texto y variables.",
      ],
      testCases: [
        {
          stdin: "6\n",
          expectedStdout: "6 al cuadrado es 36\n",
          visible: true,
          description: "6² = 36",
        },
        {
          stdin: "12\n",
          expectedStdout: "12 al cuadrado es 144\n",
          visible: false,
          description: "12² = 144",
        },
        {
          stdin: "0\n",
          expectedStdout: "0 al cuadrado es 0\n",
          visible: false,
          description: "Cero al cuadrado",
        },
      ],
    },
    {
      slug: "u03-bool-estado",
      title: "Estado del alumno con bool",
      description: "Declara dos bool y muéstralos (se imprimen como 1 o 0).",
      difficulty: "easy",
      xpReward: 14,
      prompt: `## Estado del alumno con bool

Declara estas dos variables:

- \`bool inscrito = true\`
- \`bool deuda = false\`

Imprime EXACTAMENTE:

\`\`\`
Inscrito: 1
Deuda: 0
\`\`\`

(Los \`bool\` se imprimen como \`1\` (true) o \`0\` (false) con \`cout\`.)`,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  // Declara las 2 variables bool e imprímelas con el prefijo correcto

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  bool inscrito = true;
  bool deuda = false;
  cout << "Inscrito: " << inscrito << endl;
  cout << "Deuda: " << deuda << endl;
  return 0;
}`,
      hints: [
        "Las palabras `true` y `false` van SIN comillas, todo minúsculas.",
        "Imprime las variables — `cout` las convierte a `1` o `0`.",
        "Cuida el espacio después de los `:`.",
      ],
      testCases: [
        {
          expectedStdout: "Inscrito: 1\nDeuda: 0\n",
          visible: true,
          description: "true→1, false→0",
        },
      ],
    },

    // -----------------------------------------------------------------
    // MEDIUM × 3
    // -----------------------------------------------------------------
    {
      slug: "u03-precio-iva-const",
      title: "Precio con IVA constante",
      description: "Usa `const` para el IVA y calcula el total.",
      difficulty: "medium",
      xpReward: 18,
      prompt: `## Precio con IVA constante

Declara una **constante** para el IVA al 16%:

\`\`\`cpp
const double IVA = 0.16;
\`\`\`

Lee un \`double precio\` del usuario. Calcula el total a pagar
(\`precio + precio * IVA\`) e imprime **3 líneas**:

\`\`\`
Precio: <p>
IVA: <p * IVA>
Total: <p + p * IVA>
\`\`\`

Para el test, el sistema enviará: \`250\`.

Salida esperada:

\`\`\`
Precio: 250
IVA: 40
Total: 290
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  const double IVA = 0.16;
  double precio;
  cin >> precio;
  cout << "Precio: " << precio << endl;
  cout << "IVA: " << precio * IVA << endl;
  cout << "Total: " << precio + precio * IVA << endl;
  return 0;
}`,
      hints: [
        "La constante va con `const double IVA = 0.16;` (en MAYÚSCULAS por convención).",
        "Después declara el `double precio;` y léelo con `cin`.",
      ],
      testCases: [
        {
          stdin: "250\n",
          expectedStdout: "Precio: 250\nIVA: 40\nTotal: 290\n",
          visible: true,
          description: "$250 + 16% = $290",
        },
        {
          stdin: "100\n",
          expectedStdout: "Precio: 100\nIVA: 16\nTotal: 116\n",
          visible: false,
          description: "$100 caso simple",
        },
        {
          stdin: "500\n",
          expectedStdout: "Precio: 500\nIVA: 80\nTotal: 580\n",
          visible: false,
          description: "$500",
        },
      ],
    },
    {
      slug: "u03-saludo-concatenado",
      title: "Saludo concatenado con +",
      description: "Une dos strings con el operador + y muéstralo.",
      difficulty: "medium",
      xpReward: 18,
      prompt: `## Saludo concatenado

Lee **dos strings** del usuario (en líneas distintas con \`cin >>\`):
\`nombre\` y \`apellido\`.

Concatena un saludo en una variable usando el operador \`+\`:

\`\`\`cpp
string saludo = "Hola " + nombre + " " + apellido + "!";
\`\`\`

Imprime el saludo en una sola línea.

Para el test, el sistema enviará: \`Aurora Garcia\`.

Salida esperada:

\`\`\`
Hola Aurora Garcia!
\`\`\``,
      starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombre, apellido;
  cin >> nombre >> apellido;
  string saludo = "Hola " + nombre + " " + apellido + "!";
  cout << saludo << endl;
  return 0;
}`,
      hints: [
        "Lee con `cin >> nombre >> apellido;` (no usa getline porque son palabras separadas).",
        "El `+` concatena strings — los literales `\"...\"` se unen igual.",
      ],
      testCases: [
        {
          stdin: "Aurora Garcia\n",
          expectedStdout: "Hola Aurora Garcia!\n",
          visible: true,
          description: "Caso ejemplo",
        },
        {
          stdin: "Mario Lopez\n",
          expectedStdout: "Hola Mario Lopez!\n",
          visible: false,
          description: "Otro nombre",
        },
      ],
    },
    {
      slug: "u03-anios-a-dias",
      title: "Años a días",
      description: "Convierte años a días (multiplicando por 365).",
      difficulty: "medium",
      xpReward: 18,
      prompt: `## Años a días

Lee un \`int anios\` del usuario. Calcula los días equivalentes
(\`anios * 365\`) y guárdalos en una variable \`int dias\`.

Imprime EXACTAMENTE:

\`\`\`
<anios> anios son <dias> dias
\`\`\`

Para el test, el sistema enviará: \`19\` → 19 × 365 = 6935.

Salida esperada:

\`\`\`
19 anios son 6935 dias
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int anios;
  cin >> anios;
  int dias = anios * 365;
  cout << anios << " anios son " << dias << " dias" << endl;
  return 0;
}`,
      hints: [
        "Lee `int anios;` con `cin`.",
        "Calcula `int dias = anios * 365;`.",
        "Un solo cout encadenado.",
      ],
      testCases: [
        {
          stdin: "19\n",
          expectedStdout: "19 anios son 6935 dias\n",
          visible: true,
          description: "19 × 365 = 6935",
        },
        {
          stdin: "1\n",
          expectedStdout: "1 anios son 365 dias\n",
          visible: false,
          description: "Un año",
        },
        {
          stdin: "0\n",
          expectedStdout: "0 anios son 0 dias\n",
          visible: false,
          description: "Cero años",
        },
      ],
    },

    // -----------------------------------------------------------------
    // HARD × 2
    // -----------------------------------------------------------------
    {
      slug: "u03-celsius-fahrenheit",
      title: "Celsius a Fahrenheit",
      description: "Convierte temperatura usando la fórmula.",
      difficulty: "hard",
      xpReward: 25,
      prompt: `## Celsius a Fahrenheit

Lee un \`double celsius\` del usuario. Conviértelo a Fahrenheit con la fórmula:

\`\`\`
F = C * 9.0 / 5.0 + 32
\`\`\`

Imprime EXACTAMENTE:

\`\`\`
<C> C = <F> F
\`\`\`

Para el test, el sistema enviará: \`100\` → 100 × 9/5 + 32 = 212.

Salida esperada:

\`\`\`
100 C = 212 F
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;
`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  double celsius;
  cin >> celsius;
  double fahrenheit = celsius * 9.0 / 5.0 + 32;
  cout << celsius << " C = " << fahrenheit << " F" << endl;
  return 0;
}`,
      hints: [
        "Usa `9.0` y `5.0` con punto para asegurar división con decimales.",
        "Te toca escribir el `int main()` y todo el cuerpo.",
      ],
      testCases: [
        {
          stdin: "100\n",
          expectedStdout: "100 C = 212 F\n",
          visible: true,
          description: "Punto de ebullición",
        },
        {
          stdin: "0\n",
          expectedStdout: "0 C = 32 F\n",
          visible: false,
          description: "Punto de congelación",
        },
        {
          stdin: "37\n",
          expectedStdout: "37 C = 98.6 F\n",
          visible: false,
          description: "Temperatura corporal",
        },
      ],
    },
    {
      slug: "u03-tarjeta-credito",
      title: "Pago con tarjeta",
      description: "Constante de interés + cálculo a pagar. Desde cero.",
      difficulty: "hard",
      xpReward: 28,
      prompt: `## Pago con tarjeta

Declara una **constante**:

\`\`\`cpp
const double INTERES = 0.05;
\`\`\`

Lee un \`double monto\` del usuario (lo que la persona compró).

Calcula:
- **interes** = monto × INTERES
- **comision_fija** = 25 (cargo del banco)
- **total** = monto + interes + comision_fija

Imprime **4 líneas**:

\`\`\`
Monto: <monto>
Interes: <interes>
Comision: 25
Total: <total>
\`\`\`

Para el test, el sistema enviará: \`1000\`.

- Interés = 50
- Comisión = 25
- Total = 1075

Salida esperada:

\`\`\`
Monto: 1000
Interes: 50
Comision: 25
Total: 1075
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;
`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  const double INTERES = 0.05;
  double monto;
  cin >> monto;

  double interes = monto * INTERES;
  double comision_fija = 25;
  double total = monto + interes + comision_fija;

  cout << "Monto: " << monto << endl;
  cout << "Interes: " << interes << endl;
  cout << "Comision: " << comision_fija << endl;
  cout << "Total: " << total << endl;
  return 0;
}`,
      hints: [
        "Const al inicio. Después variable normal. Después cálculos.",
        "Cuatro `cout` distintos, en el orden exacto del enunciado.",
      ],
      testCases: [
        {
          stdin: "1000\n",
          expectedStdout: "Monto: 1000\nInteres: 50\nComision: 25\nTotal: 1075\n",
          visible: true,
          description: "Compra de $1000",
        },
        {
          stdin: "500\n",
          expectedStdout: "Monto: 500\nInteres: 25\nComision: 25\nTotal: 550\n",
          visible: false,
          description: "Compra de $500",
        },
        {
          stdin: "0\n",
          expectedStdout: "Monto: 0\nInteres: 0\nComision: 25\nTotal: 25\n",
          visible: false,
          description: "Sin compra, solo comisión",
        },
      ],
    },
  ],
};
