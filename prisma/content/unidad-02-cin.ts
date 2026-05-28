import type { UnitDefinition } from "./types";

/**
 * Unidad 02 — Leer datos con cin
 *
 * En el CETI cin se enseña inmediatamente después de cout — el programa
 * deja de solo hablar y empieza a escuchar. Patrón estable:
 *   code_example → fill_blank → (quiz) → code_challenge.
 * Ejemplos del CETI: pedir nombre, edad, calificación, número de control.
 */
export const unidad02: UnitDefinition = {
  slug: "leer-datos",
  title: "Leer datos del usuario con cin",
  description:
    "Tu programa ahora puede escuchar al usuario. cin, getline y la validación básica.",
  icon: "⌨️",
  published: true,
  lessons: [
    // =====================================================================
    // Lección 1: cin básico (un entero)
    // =====================================================================
    {
      slug: "cin-basico",
      title: "Tu primer cin",
      description: "Pídele al usuario un número y guárdalo en una variable.",
      xpReward: 30,
      estimatedMinutes: 6,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int edad;
  cout << "Cuantos anios tienes? ";
  cin >> edad;
  cout << "Tienes " << edad << " anios" << endl;
  return 0;
}`,
          explanation:
            "`cin >> variable` lee un valor desde el teclado y lo guarda en la variable. Fíjate que el operador apunta hacia la variable (`>>`), al revés que `cout`.",
          runnable: true,
          expectedOutput: "Cuantos anios tienes?",
        },
        {
          type: "quiz",
          question:
            "¿En qué dirección apunta el operador de `cin`?",
          options: [
            "`cin << var` (igual que cout).",
            "`cin >> var` (al revés de cout).",
            "`cin = var`.",
            "Da lo mismo, los dos funcionan.",
          ],
          correctIndex: 1,
          explanation:
            "`cout <<` saca datos; `cin >>` mete datos. La flecha siempre indica el flujo: hacia la consola (cout) o desde la consola hacia la variable (cin).",
        },
        {
          type: "fill_blank",
          template: `int calificacion;
cout << "Tu calificacion: ";
{{0}} {{1}} calificacion;
cout << "Anotado: " << calificacion << endl;`,
          blanks: [
            { answer: "cin", hint: "Lo opuesto a cout." },
            { answer: ">>", hint: "Apunta hacia la variable que recibe." },
          ],
          explanation:
            "`cin >> calificacion;` toma un número del teclado y lo guarda en la variable.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Eco del número

Lee un entero del usuario y luego imprímelo así:

\`\`\`
Tu numero es <n>
\`\`\`

Para el test, el sistema enviará el número **42** como entrada.

Salida esperada:

\`\`\`
Tu numero es 42
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  // Lee n con cin y luego imprime

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  cout << "Tu numero es " << n << endl;
  return 0;
}`,
            hints: [
              "Primero `cin >> n;` para leer.",
              "Luego `cout << \"Tu numero es \" << n << endl;`.",
              "No imprimas ningún prompt antes del cin — para que el test funcione, solo el resultado.",
            ],
            testCases: [
              {
                stdin: "42\n",
                expectedStdout: "Tu numero es 42\n",
                visible: true,
                description: "Lee 42 e imprime el mensaje",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 2: cin con múltiples variables
    // =====================================================================
    {
      slug: "cin-multiples",
      title: "Leer varios valores de un jalón",
      description:
        "Encadena varios `>>` para leer varias variables seguidas.",
      xpReward: 30,
      estimatedMinutes: 6,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int edad;
  double promedio;
  cin >> edad >> promedio;
  cout << edad << " anios, promedio " << promedio << endl;
  return 0;
}`,
          explanation:
            "Igual que con `cout`, puedes encadenar `cin >> a >> b >> c;`. El usuario los separa con espacios o saltos de línea — `cin` toma uno por variable, en orden.",
          runnable: true,
          expectedOutput: "",
        },
        {
          type: "quiz",
          question:
            "Si el usuario escribe `5 9.2` y la línea es `cin >> a >> b;`, ¿qué valor toma `b`?",
          options: ["5", "9.2", "Nada, b queda sin valor", "Error de lectura"],
          correctIndex: 1,
          explanation:
            "El espacio separa los valores: la primera variable se lleva `5`, la segunda `9.2`. Funciona también si el usuario los escribe en líneas distintas.",
        },
        {
          type: "fill_blank",
          template: `int a, b;
cin {{0}} a {{1}} b;
cout << "Suma: " << a + b << endl;`,
          blanks: [
            { answer: ">>", hint: "Mismo operador que para una sola variable." },
            { answer: ">>", hint: "El mismo operador, encadenado para la segunda variable." },
          ],
          explanation:
            "Cada `>>` lee una variable más. El usuario puede separar los valores con espacio o enter.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Suma de dos enteros

Lee **dos enteros** en una sola línea con \`cin\` e imprime su suma así:

\`\`\`
Suma: <a+b>
\`\`\`

Para el test, el sistema enviará: \`7 5\`.

Salida esperada:

\`\`\`
Suma: 12
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int a, b;
  // Lee a y b en una línea, imprime la suma

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int a, b;
  cin >> a >> b;
  cout << "Suma: " << a + b << endl;
  return 0;
}`,
            hints: [
              "`cin >> a >> b;` lee los dos valores separados por espacio.",
              "Imprime con `cout << \"Suma: \" << a + b << endl;`.",
              "No imprimas prompts.",
            ],
            testCases: [
              {
                stdin: "7 5\n",
                expectedStdout: "Suma: 12\n",
                visible: true,
                description: "Lee 7 y 5, suma da 12",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 3: cin con string (una palabra)
    // =====================================================================
    {
      slug: "cin-string",
      title: "Leer una palabra con cin",
      description:
        "`cin >> texto` lee hasta el primer espacio. Útil para nombres simples o IDs.",
      xpReward: 30,
      estimatedMinutes: 6,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombre;
  cout << "Tu nombre: ";
  cin >> nombre;
  cout << "Hola " << nombre << endl;
  return 0;
}`,
          explanation:
            "Con `cin >> string` lees una sola palabra: cuando aparece un espacio, `cin` deja de leer. Por eso `Aurora García` solo guardaría `Aurora`.",
          runnable: true,
          expectedOutput: "Tu nombre:",
        },
        {
          type: "quiz",
          question:
            "Si el usuario escribe `Aurora Garcia` y haces `cin >> nombre;`, ¿qué guarda `nombre`?",
          options: [
            "`Aurora Garcia` completo.",
            "`Aurora` (se corta en el espacio).",
            "`Garcia`.",
            "Da error porque hay un espacio.",
          ],
          correctIndex: 1,
          explanation:
            "`cin >>` corta en cualquier espacio, tab o salto de línea. Para leer la línea completa se usa `getline` (siguiente lección).",
        },
        {
          type: "fill_blank",
          template: `#include <iostream>
#include {{0}}
using namespace std;

int main() {
  string materia;
  cin >> materia;
  cout << "Materia: " << materia << endl;
  return 0;
}`,
          blanks: [
            { answer: "<string>", hint: "El header necesario para usar string." },
          ],
          explanation:
            "Para usar `string` necesitas `#include <string>` además de `<iostream>`.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Eco de número de control

Lee una palabra (el número de control del alumno) con \`cin\` y respóndele:

\`\`\`
Control: <input>
\`\`\`

Para el test, el sistema enviará: \`23110567\`.

Salida esperada:

\`\`\`
Control: 23110567
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string control;
  // cin + cout

  return 0;
}`,
            solutionCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string control;
  cin >> control;
  cout << "Control: " << control << endl;
  return 0;
}`,
            hints: [
              "No olvides el `#include <string>`.",
              "Una palabra sin espacios funciona perfecto con `cin >> control;`.",
              "Imprime con el formato exacto: `Control: ` seguido del valor.",
            ],
            testCases: [
              {
                stdin: "23110567\n",
                expectedStdout: "Control: 23110567\n",
                visible: true,
                description: "Eco del número de control",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 4: getline (línea completa con espacios)
    // =====================================================================
    {
      slug: "getline",
      title: "Leer una línea completa con getline",
      description:
        "Cuando necesitas espacios en la entrada (nombres compuestos, oraciones).",
      xpReward: 35,
      estimatedMinutes: 7,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombreCompleto;
  cout << "Tu nombre completo: ";
  getline(cin, nombreCompleto);
  cout << "Hola " << nombreCompleto << endl;
  return 0;
}`,
          explanation:
            "`getline(cin, variable)` lee TODO lo que el usuario escriba hasta presionar Enter, incluyendo espacios. Ideal para nombres como ‘Aurora García López’.",
          runnable: true,
          expectedOutput: "Tu nombre completo:",
        },
        {
          type: "fill_blank",
          template: `string carrera;
{{0}}(cin, {{1}});
cout << "Estudias: " << carrera << endl;`,
          blanks: [
            { answer: "getline", hint: "Función que lee la línea completa." },
            { answer: "carrera", hint: "La variable string donde se guarda." },
          ],
          explanation:
            "La sintaxis es `getline(cin, variable);` — dos argumentos: la fuente (`cin`) y dónde guardar el resultado.",
        },
        {
          type: "quiz",
          question:
            "¿Cuál es la diferencia clave entre `cin >> s` y `getline(cin, s)`?",
          options: [
            "Son lo mismo, distinta sintaxis.",
            "`cin >>` lee hasta el primer espacio; `getline` lee toda la línea.",
            "`getline` solo lee números.",
            "`cin >>` es para texto y `getline` para enteros.",
          ],
          correctIndex: 1,
          explanation:
            "`cin >>` corta en espacios; `getline` corta en el salto de línea. Cada uno para distinto propósito.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Saludo personalizado

Lee el nombre COMPLETO del alumno (puede tener espacios) y respóndele:

\`\`\`
Bienvenido <nombre completo>
\`\`\`

Para el test, el sistema enviará: \`Aurora Garcia Lopez\`.

Salida esperada:

\`\`\`
Bienvenido Aurora Garcia Lopez
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombre;
  // Usa getline para leer la línea completa

  return 0;
}`,
            solutionCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombre;
  getline(cin, nombre);
  cout << "Bienvenido " << nombre << endl;
  return 0;
}`,
            hints: [
              "Usa `getline(cin, nombre);` (NO `cin >> nombre;` porque cortaría en el primer espacio).",
              "Después: `cout << \"Bienvenido \" << nombre << endl;`.",
              "Cuida el espacio después de `Bienvenido`.",
            ],
            testCases: [
              {
                stdin: "Aurora Garcia Lopez\n",
                expectedStdout: "Bienvenido Aurora Garcia Lopez\n",
                visible: true,
                description: "Lee nombre con espacios",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 5: cin con operaciones (sin if — eso se ve en U4)
    // =====================================================================
    {
      slug: "cin-operaciones",
      title: "Hacer cuentas con los datos leídos",
      description:
        "Lee números del usuario y haz cálculos antes de imprimir el resultado.",
      xpReward: 35,
      estimatedMinutes: 7,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int a, b;
  cin >> a >> b;

  // Imprime varias operaciones sobre los datos leídos
  cout << "Suma: " << a + b << endl;
  cout << "Resta: " << a - b << endl;
  cout << "Producto: " << a * b << endl;
  return 0;
}`,
          explanation:
            "Después de leer con `cin`, puedes meter los valores en cualquier operación. Aquí `a + b`, `a - b`, `a * b` se calculan en el momento, sin guardarlos en otra variable.",
          runnable: true,
          expectedOutput: "",
        },
        {
          type: "fill_blank",
          template: `int base, altura;
cin {{0}} base {{1}} altura;

// Área del rectángulo = base * altura
cout << "Area: " << base {{2}} altura << endl;`,
          blanks: [
            { answer: ">>", hint: "Operador para leer del usuario." },
            { answer: ">>", hint: "Mismo operador encadenado." },
            { answer: "*", hint: "Operador de multiplicación." },
          ],
          explanation:
            "Lees dos valores y los multiplicas directo dentro del `cout`, sin necesidad de variable auxiliar.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Promedio de tres calificaciones

Lee **tres calificaciones enteras** en una sola línea (con \`cin >> a >> b >> c;\`).
Calcula el promedio dividiendo entre **3.0** (con punto, para que dé decimales)
e imprime:

\`\`\`
Promedio: <p>
\`\`\`

Para el test, el sistema enviará: \`8 9 10\` (promedio = 9).

Salida esperada:

\`\`\`
Promedio: 9
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int a, b, c;
  // Lee a, b, c
  // Imprime "Promedio: " seguido de (a+b+c)/3.0

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int a, b, c;
  cin >> a >> b >> c;
  cout << "Promedio: " << (a + b + c) / 3.0 << endl;
  return 0;
}`,
            hints: [
              "Lee con `cin >> a >> b >> c;`.",
              "Para el cálculo: `(a + b + c) / 3.0` — los paréntesis y el `3.0` son importantes.",
              "Un solo `cout`: `cout << \"Promedio: \" << (a + b + c) / 3.0 << endl;`.",
            ],
            testCases: [
              {
                stdin: "8 9 10\n",
                expectedStdout: "Promedio: 9\n",
                visible: true,
                description: "Promedio entero",
              },
              {
                stdin: "10 10 10\n",
                expectedStdout: "Promedio: 10\n",
                visible: false,
                description: "Todos perfectos",
              },
            ],
          },
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Ticket de cafetería

Lee dos valores en una sola línea con \`cin\`:
- Un **entero** \`cantidad\` (cuántos cafés).
- Un **double** \`precio\` (precio unitario).

Imprime EXACTAMENTE:

\`\`\`
Subtotal: <cantidad*precio>
\`\`\`

Para el test, el sistema enviará: \`3 25.5\` (subtotal = 76.5).

Salida esperada:

\`\`\`
Subtotal: 76.5
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int cantidad;
  double precio;
  // Lee cantidad y precio, imprime el subtotal

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int cantidad;
  double precio;
  cin >> cantidad >> precio;
  cout << "Subtotal: " << cantidad * precio << endl;
  return 0;
}`,
            hints: [
              "Encadena dos lecturas: `cin >> cantidad >> precio;`.",
              "Multiplica directo dentro del cout: `cantidad * precio`.",
              "Cuida el espacio después de `Subtotal:`.",
            ],
            testCases: [
              {
                stdin: "3 25.5\n",
                expectedStdout: "Subtotal: 76.5\n",
                visible: true,
                description: "Caso típico",
              },
              {
                stdin: "10 9.99\n",
                expectedStdout: "Subtotal: 99.9\n",
                visible: false,
                description: "Otro caso",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 6: Integrador (sin funciones — eso se ve en U6)
    // =====================================================================
    {
      slug: "integrador-cin",
      title: "Integrador: ficha del alumno",
      description:
        "Combina cin, getline y cout para armar un programa con varios tipos de datos.",
      xpReward: 45,
      estimatedMinutes: 10,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombre;
  int edad;
  double promedio;

  // 1) Nombre completo (puede llevar espacios)
  getline(cin, nombre);

  // 2) Edad y promedio en la misma línea
  cin >> edad >> promedio;

  // 3) Imprime la ficha
  cout << "Alumno: " << nombre << endl;
  cout << "Edad: " << edad << " anios" << endl;
  cout << "Promedio: " << promedio << endl;
  return 0;
}`,
          explanation:
            "Patrón completo: una variable por dato (string, int, double), una lectura por tipo (`getline` para texto con espacios, `cin >>` para números), y `cout` con texto fijo + valores para el reporte final.",
          runnable: true,
          expectedOutput: "",
        },
        {
          type: "fill_blank",
          template: `#include <iostream>
#include {{0}}
using namespace std;

int main() {
  {{1}} carrera;       // texto que puede tener espacios
  int semestre;

  {{2}}(cin, carrera);  // línea completa
  cin {{3}} semestre;   // solo un número

  cout << "Carrera: " << carrera << endl;
  cout << "Semestre: " << semestre << endl;
  return 0;
}`,
          blanks: [
            { answer: "<string>", hint: "Header necesario para usar `string`." },
            { answer: "string", hint: "Tipo de texto." },
            { answer: "getline", hint: "Función para leer la línea completa (con espacios)." },
            { answer: ">>", hint: "Operador para leer un número del teclado." },
          ],
          explanation:
            "Para texto con espacios usa `getline`. Para números usa `cin >> variable`.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Ficha del alumno

Lee del usuario (en este orden):
1. El **nombre completo** (puede tener espacios) → \`getline(cin, ...)\`.
2. La **edad** (entero) y el **promedio** (double) en la misma línea → \`cin >> ... >> ...;\`.

Imprime exactamente:

\`\`\`
Alumno: <nombre>
Edad: <edad>
Promedio: <promedio>
\`\`\`

Para el test, el sistema enviará:

\`\`\`
Aurora Garcia Lopez
19 8.7
\`\`\`

Salida esperada:

\`\`\`
Alumno: Aurora Garcia Lopez
Edad: 19
Promedio: 8.7
\`\`\``,
            difficulty: "hard",
            xpReward: 40,
            starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombre;
  int edad;
  double promedio;

  // 1) Lee el nombre completo (con espacios) usando getline.
  // 2) Lee edad y promedio en una sola línea con cin.
  // 3) Imprime las 3 líneas de la ficha en orden.

  return 0;
}`,
            solutionCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombre;
  int edad;
  double promedio;

  getline(cin, nombre);
  cin >> edad >> promedio;

  cout << "Alumno: " << nombre << endl;
  cout << "Edad: " << edad << endl;
  cout << "Promedio: " << promedio << endl;
  return 0;
}`,
            hints: [
              "Para el nombre con espacios: `getline(cin, nombre);`.",
              "Para edad y promedio juntos: `cin >> edad >> promedio;`.",
              "Tres `cout` distintos, uno por línea, con los prefijos exactos.",
            ],
            testCases: [
              {
                stdin: "Aurora Garcia Lopez\n19 8.7\n",
                expectedStdout: "Alumno: Aurora Garcia Lopez\nEdad: 19\nPromedio: 8.7\n",
                visible: true,
                description: "Ficha completa",
              },
              {
                stdin: "Mario Lopez\n20 7.5\n",
                expectedStdout: "Alumno: Mario Lopez\nEdad: 20\nPromedio: 7.5\n",
                visible: false,
                description: "Otro caso",
              },
            ],
          },
        },
      ],
    },
  ],
};
