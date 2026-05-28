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
cin {{0}} a {{0}} b;
cout << "Suma: " << a + b << endl;`,
          blanks: [
            { answer: ">>", hint: "Mismo operador que para una sola variable, pero encadenado." },
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
    // Lección 5: Validar entrada con if
    // =====================================================================
    {
      slug: "validar-entrada",
      title: "Validar lo que el usuario escribió",
      description:
        "Combina cin con un if para responder distinto según el valor.",
      xpReward: 35,
      estimatedMinutes: 7,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int edad;
  cin >> edad;

  if (edad >= 18) {
    cout << "Mayor de edad" << endl;
  } else {
    cout << "Menor de edad" << endl;
  }
  return 0;
}`,
          explanation:
            "Lo más útil de leer datos es **decidir** algo con ellos. Lee primero, decide después con un `if/else`.",
          runnable: true,
          expectedOutput: "",
        },
        {
          type: "fill_blank",
          template: `int calificacion;
cin >> calificacion;

if (calificacion {{0}} 7) {
  cout << "Aprobado" << endl;
} else {
  cout << "Reprobado" << endl;
}`,
          blanks: [
            { answer: ">=", hint: "Mayor o igual a 7 para aprobar." },
          ],
          explanation:
            "Lees la variable y la comparas con `>=` en el `if`. Patrón clásico: input → decisión.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Diagnóstico de calificación

Lee una calificación entera del 0 al 10. Imprime:

- \`Excelente\` si \`>= 9\`
- \`Aprobado\` si \`>= 7\` (pero menor a 9)
- \`Reprobado\` en otro caso

Para el test, el sistema enviará: \`8\`.

Salida esperada:

\`\`\`
Aprobado
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int cal;
  cin >> cal;
  // if / else if / else

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int cal;
  cin >> cal;
  if (cal >= 9) {
    cout << "Excelente" << endl;
  } else if (cal >= 7) {
    cout << "Aprobado" << endl;
  } else {
    cout << "Reprobado" << endl;
  }
  return 0;
}`,
            hints: [
              "Empieza con la condición MÁS estricta (`>= 9`).",
              "Después `>= 7` para el rango aprobado.",
              "El `else` final atrapa los reprobados.",
            ],
            testCases: [
              {
                stdin: "8\n",
                expectedStdout: "Aprobado\n",
                visible: true,
                description: "8 cae en Aprobado",
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
      slug: "integrador-cin",
      title: "Integrador: calculadora de promedio",
      description:
        "Junta cin + funciones + control de flujo en un programa real.",
      xpReward: 50,
      estimatedMinutes: 10,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

double promedio(int a, int b, int c) {
  return (a + b + c) / 3.0;
}

int main() {
  int x, y, z;
  cin >> x >> y >> z;
  double p = promedio(x, y, z);
  cout << "Promedio: " << p << endl;
  return 0;
}`,
          explanation:
            "Patrón completo: una función pura que calcula + `cin` que recibe los datos + `cout` que entrega la respuesta. Es la estructura de la mayoría de programas reales.",
          runnable: true,
          expectedOutput: "",
        },
        {
          type: "fill_blank",
          template: `int leer_calificacion() {
  int cal;
  {{0}} >> cal;
  return cal;
}

int main() {
  int c = {{1}}();
  cout << c << endl;
  return 0;
}`,
          blanks: [
            { answer: "cin", hint: "El stream de entrada." },
            { answer: "leer_calificacion", hint: "El nombre de la función definida arriba." },
          ],
          explanation:
            "Una función puede contener un `cin` y devolver lo que leyó. Útil cuando vas a pedir el mismo tipo de dato varias veces.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Promedio + diagnóstico

Lee **tres** calificaciones enteras (una sola línea, separadas por espacios). Calcula el promedio (dividiendo entre \`3.0\`) e imprime DOS líneas:

\`\`\`
Promedio: <p>
<estado>
\`\`\`

Donde \`<estado>\` es:
- \`Aprobado\` si el promedio es \`>= 7\`
- \`Reprobado\` en otro caso

Para el test, el sistema enviará: \`8 9 7\` (promedio = 8 → Aprobado).

Salida esperada:

\`\`\`
Promedio: 8
Aprobado
\`\`\``,
            difficulty: "hard",
            xpReward: 40,
            starterCode: `#include <iostream>
using namespace std;

// Puedes definir una función promedio o calcularlo directo en main

int main() {
  int a, b, c;
  cin >> a >> b >> c;

  // calcula promedio e imprime el diagnóstico

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

double promedio(int a, int b, int c) {
  return (a + b + c) / 3.0;
}

int main() {
  int a, b, c;
  cin >> a >> b >> c;
  double p = promedio(a, b, c);
  cout << "Promedio: " << p << endl;
  if (p >= 7) {
    cout << "Aprobado" << endl;
  } else {
    cout << "Reprobado" << endl;
  }
  return 0;
}`,
            hints: [
              "Lee con `cin >> a >> b >> c;`.",
              "Calcula con `(a + b + c) / 3.0` (con `3.0`, no `3`).",
              "Dos `cout`: uno con el promedio, otro con el estado dentro del if/else.",
            ],
            testCases: [
              {
                stdin: "8 9 7\n",
                expectedStdout: "Promedio: 8\nAprobado\n",
                visible: true,
                description: "Promedio 8 → Aprobado",
              },
            ],
          },
        },
      ],
    },
  ],
};
