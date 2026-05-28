import type { PracticeUnitSetDefinition } from "./types";

/**
 * Ejercicios de práctica — Unidad 06: Funciones
 *
 * Conceptos disponibles (acumulados):
 *   - U1-U5
 *   - U6: void, parámetros, return, prototipos, default params
 *
 * NO disponibles: printf/scanf (U7), arreglos (U8), archivos (U9).
 *
 * Calibración:
 *   easy   — starter con includes + main + prototipo o esqueleto
 *   medium — starter con includes + main shell vacío
 *   hard   — starter con solo includes
 */
export const u06FuncionesExercises: PracticeUnitSetDefinition = {
  unitSlug: "funciones",
  unitTitle: "Funciones: empaquetar tu código",
  unitIcon: "🧩",
  exercises: [
    // -----------------------------------------------------------------
    // EASY × 3
    // -----------------------------------------------------------------
    {
      slug: "u06-saludar",
      title: "Función saludar()",
      description: "Define una función void que imprime un saludo, llámala dos veces.",
      difficulty: "easy",
      xpReward: 14,
      prompt: `## Función saludar()

Define una función \`void saludar()\` que imprima exactamente:

\`\`\`
Hola CETI
\`\`\`

Desde \`main\`, llámala **tres veces seguidas**.

Salida esperada:

\`\`\`
Hola CETI
Hola CETI
Hola CETI
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

// Define saludar aquí

int main() {
  // Llama saludar() tres veces

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

void saludar() {
  cout << "Hola CETI" << endl;
}

int main() {
  saludar();
  saludar();
  saludar();
  return 0;
}`,
      hints: [
        "Define la función ANTES de `main`: `void saludar() { ... }`.",
        "Dentro: un `cout` con el texto.",
        "En main: `saludar();` con paréntesis y `;`, repetido 3 veces.",
      ],
      testCases: [
        {
          expectedStdout: "Hola CETI\nHola CETI\nHola CETI\n",
          visible: true,
          description: "Saludo 3 veces",
        },
      ],
    },
    {
      slug: "u06-funcion-suma",
      title: "Función suma(a, b)",
      description: "Define una función que devuelve la suma de dos enteros.",
      difficulty: "easy",
      xpReward: 16,
      prompt: `## Función suma(a, b)

Define una función \`int suma(int a, int b)\` que devuelva \`a + b\`.

Desde \`main\`, lee dos enteros del usuario y muestra:

\`\`\`
Suma: <a+b>
\`\`\`

Para el test, el sistema enviará: \`12 8\`.

Salida esperada:

\`\`\`
Suma: 20
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

// Define suma(int a, int b) aquí

int main() {
  int x, y;
  cin >> x >> y;
  // Llama a suma e imprime el resultado

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int suma(int a, int b) {
  return a + b;
}

int main() {
  int x, y;
  cin >> x >> y;
  cout << "Suma: " << suma(x, y) << endl;
  return 0;
}`,
      hints: [
        "Definición: `int suma(int a, int b) { return a + b; }`.",
        "En el cout: `cout << \"Suma: \" << suma(x, y) << endl;`.",
      ],
      testCases: [
        {
          stdin: "12 8\n",
          expectedStdout: "Suma: 20\n",
          visible: true,
          description: "12 + 8 = 20",
        },
        {
          stdin: "100 200\n",
          expectedStdout: "Suma: 300\n",
          visible: false,
          description: "Valores grandes",
        },
        {
          stdin: "-5 5\n",
          expectedStdout: "Suma: 0\n",
          visible: false,
          description: "Negativos también",
        },
      ],
    },
    {
      slug: "u06-funcion-cuadrado",
      title: "Función cuadrado(n)",
      description: "Devuelve el cuadrado de un entero.",
      difficulty: "easy",
      xpReward: 16,
      prompt: `## Función cuadrado(n)

Define \`int cuadrado(int n)\` que devuelva \`n * n\`. Desde \`main\` léelo y
muestra el resultado:

\`\`\`
<n>² = <cuadrado>
\`\`\`

> Nota: el carácter \`²\` es literal, escríbelo tal cual entre comillas.

Para el test, el sistema enviará: \`9\`.

Salida esperada:

\`\`\`
9² = 81
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

// Define cuadrado(int n) aquí

int main() {
  int n;
  cin >> n;
  // imprime el resultado

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int cuadrado(int n) {
  return n * n;
}

int main() {
  int n;
  cin >> n;
  cout << n << "² = " << cuadrado(n) << endl;
  return 0;
}`,
      hints: [
        "`int cuadrado(int n) { return n * n; }`.",
        "El `²` se imprime como cualquier otro carácter, entre comillas.",
      ],
      testCases: [
        {
          stdin: "9\n",
          expectedStdout: "9² = 81\n",
          visible: true,
          description: "9² = 81",
        },
        {
          stdin: "12\n",
          expectedStdout: "12² = 144\n",
          visible: false,
          description: "12² = 144",
        },
        {
          stdin: "0\n",
          expectedStdout: "0² = 0\n",
          visible: false,
          description: "Cero",
        },
      ],
    },

    // -----------------------------------------------------------------
    // MEDIUM × 3
    // -----------------------------------------------------------------
    {
      slug: "u06-es-par",
      title: "Función es_par(n) que devuelve bool",
      description: "Una función que devuelve true/false según paridad.",
      difficulty: "medium",
      xpReward: 22,
      prompt: `## es_par(n)

Define una función \`bool es_par(int n)\` que devuelva \`true\` si \`n\` es par
y \`false\` en otro caso. Úsala en \`main\` con un \`if\` para imprimir:

- \`Par\` si la función devuelve true.
- \`Impar\` si devuelve false.

Lee \`int n\` del usuario.

Para el test, el sistema enviará: \`14\`.

Salida esperada:

\`\`\`
Par
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

bool es_par(int n) {
  return n % 2 == 0;
}

int main() {
  int n;
  cin >> n;
  if (es_par(n)) {
    cout << "Par" << endl;
  } else {
    cout << "Impar" << endl;
  }
  return 0;
}`,
      hints: [
        "Dentro: `return n % 2 == 0;` — la expresión ya es un bool.",
        "Usa la función directamente en el `if`: `if (es_par(n))`.",
      ],
      testCases: [
        {
          stdin: "14\n",
          expectedStdout: "Par\n",
          visible: true,
          description: "14 es par",
        },
        {
          stdin: "13\n",
          expectedStdout: "Impar\n",
          visible: false,
          description: "13 es impar",
        },
        {
          stdin: "0\n",
          expectedStdout: "Par\n",
          visible: false,
          description: "0 es par",
        },
      ],
    },
    {
      slug: "u06-promedio-funcion",
      title: "Función promedio(a, b, c)",
      description: "Promedio de tres enteros con función que devuelve double.",
      difficulty: "medium",
      xpReward: 22,
      prompt: `## promedio(a, b, c)

Define \`double promedio(int a, int b, int c)\` que devuelva \`(a+b+c) / 3.0\`.

Desde \`main\`, lee 3 enteros e imprime:

\`\`\`
Promedio: <p>
\`\`\`

Para el test, el sistema enviará: \`8 9 10\`.

Salida esperada:

\`\`\`
Promedio: 9
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

double promedio(int a, int b, int c) {
  return (a + b + c) / 3.0;
}

int main() {
  int x, y, z;
  cin >> x >> y >> z;
  cout << "Promedio: " << promedio(x, y, z) << endl;
  return 0;
}`,
      hints: [
        "Tipo de retorno `double` porque el cálculo puede tener decimales.",
        "Divide entre `3.0` con punto.",
      ],
      testCases: [
        {
          stdin: "8 9 10\n",
          expectedStdout: "Promedio: 9\n",
          visible: true,
          description: "Promedio 9",
        },
        {
          stdin: "1 2 3\n",
          expectedStdout: "Promedio: 2\n",
          visible: false,
          description: "Promedio 2",
        },
        {
          stdin: "10 5 9\n",
          expectedStdout: "Promedio: 8\n",
          visible: false,
          description: "Promedio entero",
        },
      ],
    },
    {
      slug: "u06-funcion-default-iva",
      title: "Función con parámetro default",
      description: "calcular_total con IVA opcional (default 0.16).",
      difficulty: "medium",
      xpReward: 22,
      prompt: `## calcular_total con default

Define la función:

\`\`\`cpp
double calcular_total(double precio, double iva = 0.16);
\`\`\`

Que devuelve \`precio + precio * iva\`.

Desde \`main\`, **llámala dos veces**:
1. Con un solo argumento (\`precio = 100\`) — usa el default 16 %.
2. Con dos argumentos (\`precio = 100, iva = 0.08\`).

Imprime cada resultado en una línea:

\`\`\`
Con default: <t1>
Con 8%: <t2>
\`\`\`

Salida esperada:

\`\`\`
Con default: 116
Con 8%: 108
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

double calcular_total(double precio, double iva = 0.16) {
  return precio + precio * iva;
}

int main() {
  cout << "Con default: " << calcular_total(100) << endl;
  cout << "Con 8%: " << calcular_total(100, 0.08) << endl;
  return 0;
}`,
      hints: [
        "El default va en la firma: `double iva = 0.16`.",
        "Primera llamada con 1 arg, segunda con 2 args.",
      ],
      testCases: [
        {
          expectedStdout: "Con default: 116\nCon 8%: 108\n",
          visible: true,
          description: "Default vs explícito",
        },
      ],
    },

    // -----------------------------------------------------------------
    // HARD × 2
    // -----------------------------------------------------------------
    {
      slug: "u06-maximo-tres",
      title: "Máximo de 3 con función",
      description: "Función con varios if para encontrar el máximo. Solo includes.",
      difficulty: "hard",
      xpReward: 28,
      prompt: `## Máximo de 3

Define una función \`int maximo(int a, int b, int c)\` que devuelva el mayor
de los tres números. Usa varios \`if\` o un \`if/else if/else\` dentro de la
función.

Desde \`main\`, lee 3 enteros e imprime:

\`\`\`
Mayor: <m>
\`\`\`

Para el test, el sistema enviará: \`5 12 7\`.

Salida esperada:

\`\`\`
Mayor: 12
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;
`,
      solutionCode: `#include <iostream>
using namespace std;

int maximo(int a, int b, int c) {
  int m = a;
  if (b > m) m = b;
  if (c > m) m = c;
  return m;
}

int main() {
  int a, b, c;
  cin >> a >> b >> c;
  cout << "Mayor: " << maximo(a, b, c) << endl;
  return 0;
}`,
      hints: [
        "Empieza la búsqueda con `int m = a;` y compara contra los demás.",
        "Otra opción: encadenar ternarios o un `if/else if/else`.",
      ],
      testCases: [
        {
          stdin: "5 12 7\n",
          expectedStdout: "Mayor: 12\n",
          visible: true,
          description: "Máximo es 12",
        },
        {
          stdin: "10 10 10\n",
          expectedStdout: "Mayor: 10\n",
          visible: false,
          description: "Empate triple",
        },
        {
          stdin: "100 50 25\n",
          expectedStdout: "Mayor: 100\n",
          visible: false,
          description: "Máximo al inicio",
        },
        {
          stdin: "-5 -10 -3\n",
          expectedStdout: "Mayor: -3\n",
          visible: false,
          description: "Negativos",
        },
      ],
    },
    {
      slug: "u06-potencia",
      title: "Función potencia con loop",
      description: "Define potencia(base, exp) que use un for internamente.",
      difficulty: "hard",
      xpReward: 30,
      prompt: `## potencia(base, exp)

Define una función \`int potencia(int base, int exp)\` que devuelva
\`base^exp\` usando un loop (sin usar \`pow\` ni \`<cmath>\`). Por convención,
\`potencia(x, 0) == 1\`.

Desde \`main\`, lee dos enteros y muestra:

\`\`\`
<base>^<exp> = <r>
\`\`\`

Para el test, el sistema enviará: \`2 10\`.

- 2^10 = 1024

Salida esperada:

\`\`\`
2^10 = 1024
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;
`,
      solutionCode: `#include <iostream>
using namespace std;

int potencia(int base, int exp) {
  int r = 1;
  for (int i = 0; i < exp; i++) {
    r *= base;
  }
  return r;
}

int main() {
  int base, exp;
  cin >> base >> exp;
  cout << base << "^" << exp << " = " << potencia(base, exp) << endl;
  return 0;
}`,
      hints: [
        "Empieza con `r = 1` y multiplica `base` `exp` veces.",
        "Si `exp == 0`, el for no entra y el resultado se queda en 1 — correcto.",
      ],
      testCases: [
        {
          stdin: "2 10\n",
          expectedStdout: "2^10 = 1024\n",
          visible: true,
          description: "2^10 = 1024",
        },
        {
          stdin: "5 3\n",
          expectedStdout: "5^3 = 125\n",
          visible: false,
          description: "5^3 = 125",
        },
        {
          stdin: "7 0\n",
          expectedStdout: "7^0 = 1\n",
          visible: false,
          description: "Cualquier base elevado a 0",
        },
        {
          stdin: "1 100\n",
          expectedStdout: "1^100 = 1\n",
          visible: false,
          description: "1 a cualquier potencia",
        },
      ],
    },
  ],
};
