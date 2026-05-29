import type { UnitDefinition } from "./types";

/**
 * Unidad 03 — Variables y tipos de datos
 *
 * Estructura por lección: code_example → fill_blank → code_challenge.
 * Sin theory steps puros. Ejercicios anclados al contexto CETI
 * (calificaciones, materias, semestre, grupos, créditos).
 */
export const unidad03: UnitDefinition = {
  slug: "variables-y-tipos",
  title: "Variables y tipos de datos",
  description:
    "Guarda valores en variables y elige el tipo correcto. Pura práctica con ejemplos del CETI.",
  icon: "📦",
  published: true,
  lessons: [
    // =====================================================================
    // Lección 1: ¿Qué es una variable?
    // =====================================================================
    {
      slug: "que-es-variable",
      title: "Declarar una variable",
      description: "Guarda un valor con nombre y úsalo después.",
      xpReward: 25,
      estimatedMinutes: 5,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int edad = 19;
  cout << "Tengo " << edad << " anios." << endl;
  return 0;
}`,
          explanation:
            "`int edad = 19;` declara una variable llamada `edad` de tipo entero con valor 19. Después puedes usar `edad` en cualquier lugar del programa.",
          runnable: true,
          expectedOutput: "Tengo 19 anios.",
        },
        {
          type: "fill_blank",
          template: `int {{0}} = 9;
cout << "Materias: " << {{1}} << endl;`,
          blanks: [
            {
              answer: "materias",
              hint: "Escribe exactamente: `materias` (minúsculas, sin acento).",
            },
            {
              answer: "materias",
              hint: "El mismo nombre exacto que escribiste arriba: `materias`.",
            },
          ],
          explanation:
            "El nombre que pones al declarar es el que usas después. Tiene que coincidir EXACTAMENTE (incluyendo mayúsculas/minúsculas).",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Tu semestre

Declara una variable \`int\` llamada \`semestre\` con valor **5** e imprime exactamente:

\`\`\`
Estoy en el semestre 5
\`\`\``,
            difficulty: "easy",
            xpReward: 20,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // Declara semestre y úsalo en el cout

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int semestre = 5;
  cout << "Estoy en el semestre " << semestre << endl;
  return 0;
}`,
            hints: [
              "Declara con `int semestre = 5;`.",
              "En el `cout`, usa la variable SIN comillas: `<< semestre <<`.",
              "Cuida el espacio antes del número en el texto.",
            ],
            testCases: [
              {
                expectedStdout: "Estoy en el semestre 5\n",
                visible: true,
                description: "Output con la variable interpolada",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 2: int, double y char
    // =====================================================================
    {
      slug: "tipos-basicos",
      title: "int, double y char",
      description: "Los 3 tipos básicos para guardar enteros, decimales y caracteres.",
      xpReward: 30,
      estimatedMinutes: 7,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int edad = 19;          // entero
  double promedio = 8.7;  // decimal
  char grupo = 'B';       // un solo caracter

  cout << edad << endl;
  cout << promedio << endl;
  cout << grupo << endl;
  return 0;
}`,
          explanation:
            "Cada tipo guarda algo distinto: `int` enteros, `double` decimales, `char` UN solo caracter entre comillas SIMPLES (`'B'`, no `\"B\"`).",
          runnable: true,
          expectedOutput: `19
8.7
B`,
        },
        {
          type: "fill_blank",
          template: `{{0}} creditos = 12;
{{1}} calificacion = 9.4;
{{2}} grupo = 'A';`,
          blanks: [
            { answer: "int", hint: "Es un número entero." },
            { answer: "double", hint: "Tiene punto decimal." },
            { answer: "char", hint: "Un solo caracter entre comillas simples." },
          ],
          explanation:
            "El tipo debe coincidir con el valor: entero → `int`, decimal → `double`, un caracter → `char`.",
        },
        {
          type: "quiz",
          question: "¿Cuál de estas declaraciones es INCORRECTA?",
          options: [
            "int edad = 20;",
            "double promedio = 8.5;",
            "char letra = \"A\";",
            "int año = 2026;",
          ],
          correctIndex: 2,
          explanation:
            "`char letra = \"A\";` usa comillas dobles, pero `char` necesita comillas SIMPLES: `char letra = 'A';`.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Datos de un alumno

Declara estas 3 variables con los valores indicados:

- \`int edad = 18\`
- \`double promedio = 9.2\`
- \`char grupo = 'C'\`

Imprime exactamente:

\`\`\`
18
9.2
C
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // Declara las 3 variables e imprímelas

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int edad = 18;
  double promedio = 9.2;
  char grupo = 'C';
  cout << edad << endl;
  cout << promedio << endl;
  cout << grupo << endl;
  return 0;
}`,
            hints: [
              "Tres declaraciones, una por variable.",
              "Imprime cada una en un `cout` separado con `endl`.",
              "Cuida las comillas: `'C'` para char, no `\"C\"`.",
            ],
            testCases: [
              {
                expectedStdout: "18\n9.2\nC\n",
                visible: true,
                description: "Las 3 variables en líneas separadas",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 3: Operaciones aritméticas
    // =====================================================================
    {
      slug: "operaciones",
      title: "Operaciones aritméticas",
      description:
        "Suma, resta, multiplicación, división y módulo en C++.",
      xpReward: 30,
      estimatedMinutes: 7,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int a = 7, b = 3;
  cout << a + b << endl;  // 10
  cout << a - b << endl;  // 4
  cout << a * b << endl;  // 21
  cout << a / b << endl;  // 2  (división entera)
  cout << a % b << endl;  // 1  (resto)
  return 0;
}`,
          explanation:
            "Los 5 operadores: `+`, `-`, `*`, `/`, `%`. **Cuidado:** si los dos operandos son `int`, la división se trunca (`7/3 = 2`, no `2.33`).",
          runnable: true,
          expectedOutput: `10
4
21
2
1`,
        },
        {
          type: "quiz",
          question: "¿Cuánto vale `10 % 3`?",
          options: ["3", "1", "3.33", "0"],
          correctIndex: 1,
          explanation:
            "`%` devuelve el resto: 10 ÷ 3 = 3 y sobra 1. Por eso `10 % 3 = 1`.",
        },
        {
          type: "fill_blank",
          template: `int total = 30;
int materias = 4;
int promedio = total {{0}} materias;`,
          blanks: [
            { answer: "/", hint: "El operador de división." },
          ],
          explanation:
            "`total / materias` calcula cuántas unidades caben en total. Como ambos son `int`, el resultado es entero (`30/4 = 7`).",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Promedio de 3 calificaciones

Declara tres \`int\`:
- \`mate = 7\`
- \`fisica = 8\`
- \`programacion = 9\`

Calcula el promedio y muéstralo con un decimal.

**Importante:** divide entre \`3.0\` (no entre \`3\`) para que conserve los decimales.

Usa esto para mostrar el resultado con 1 decimal:

\`\`\`cpp
cout << fixed << setprecision(1) << promedio << endl;
\`\`\`

(Necesitas \`#include <iomanip>\` para \`setprecision\`).

Salida esperada:
\`\`\`
8.0
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
  int mate = 7;
  int fisica = 8;
  int programacion = 9;

  // Calcula el promedio y muéstralo con 1 decimal

  return 0;
}`,
            solutionCode: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
  int mate = 7;
  int fisica = 8;
  int programacion = 9;
  double promedio = (mate + fisica + programacion) / 3.0;
  cout << fixed << setprecision(1) << promedio << endl;
  return 0;
}`,
            hints: [
              "Suma las 3 calificaciones primero: `mate + fisica + programacion`.",
              "Usa paréntesis para asegurar la precedencia: `(a + b + c) / 3.0`.",
              "Para forzar 1 decimal: `cout << fixed << setprecision(1) << promedio << endl;`.",
            ],
            testCases: [
              {
                expectedStdout: "8.0\n",
                visible: true,
                description: "Promedio de 7, 8 y 9 es 8.0 (con 1 decimal)",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 4: string
    // =====================================================================
    {
      slug: "strings",
      title: "Guardar texto: el tipo string",
      description: "Variables que guardan palabras o frases completas.",
      xpReward: 25,
      estimatedMinutes: 6,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombre = "Aurora";
  string ciudad = "Guadalajara";
  cout << "Soy " << nombre << " de " << ciudad << endl;
  return 0;
}`,
          explanation:
            "Para `string` necesitas `#include <string>`. El texto va entre comillas DOBLES (`\"...\"`, a diferencia de `char` que usa simples).",
          runnable: true,
          expectedOutput: "Soy Aurora de Guadalajara",
        },
        {
          type: "fill_blank",
          template: `string escuela = "CETI";
string carrera = "Desarrollo de Software";
string mensaje = escuela {{0}} " - " {{1}} carrera;`,
          blanks: [
            { answer: "+", hint: "El operador para unir strings." },
            { answer: "+", hint: "Mismo operador, otra vez." },
          ],
          explanation:
            "Los strings se concatenan (se unen) con `+`. Resultado: `CETI - Desarrollo de Software`.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Carta de presentación

Declara estas 3 variables \`string\`:

- \`nombre = "Aurora"\`
- \`escuela = "CETI"\`
- \`carrera = "Desarrollo de Software"\`

Imprime exactamente:

\`\`\`
Soy Aurora, estudio Desarrollo de Software en CETI.
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombre = "Aurora";
  string escuela = "CETI";
  string carrera = "Desarrollo de Software";

  // Imprime el mensaje aquí

  return 0;
}`,
            solutionCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombre = "Aurora";
  string escuela = "CETI";
  string carrera = "Desarrollo de Software";
  cout << "Soy " << nombre << ", estudio " << carrera
       << " en " << escuela << "." << endl;
  return 0;
}`,
            hints: [
              "Usa varios `<<` para encadenar texto literal con tus variables.",
              "Cuidado con los espacios DENTRO de las comillas (`\"Soy \"`).",
              "Termina con un punto antes del salto de línea.",
            ],
            testCases: [
              {
                expectedStdout:
                  "Soy Aurora, estudio Desarrollo de Software en CETI.\n",
                visible: true,
                description: "Mensaje exacto",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 5: bool
    // =====================================================================
    {
      slug: "booleanos",
      title: "Verdadero o falso: el tipo bool",
      description:
        "Variables que solo guardan dos valores: true o false.",
      xpReward: 25,
      estimatedMinutes: 5,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  bool inscrito = true;
  bool reprobo = false;

  cout << "Inscrito: " << inscrito << endl;  // 1
  cout << "Reprobo:  " << reprobo << endl;   // 0
  return 0;
}`,
          explanation:
            "`bool` solo guarda `true` o `false`. Por defecto se imprimen como `1` o `0`.",
          runnable: true,
          expectedOutput: `Inscrito: 1
Reprobo:  0`,
        },
        {
          type: "fill_blank",
          template: `bool aprobado = {{0}};
bool reprobado = {{1}};`,
          blanks: [
            { answer: "true", hint: "Sin comillas, en minúsculas." },
            { answer: "false", hint: "Sin comillas, en minúsculas." },
          ],
          explanation:
            "Los valores son `true` y `false` (sin comillas, todo minúsculas). NUNCA `True`, `\"true\"` o `1`.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Estado de inscripción

Declara dos \`bool\`:

- \`inscrito = true\`
- \`beca = false\`

Imprime exactamente:

\`\`\`
Inscrito: 1
Beca: 0
\`\`\``,
            difficulty: "easy",
            xpReward: 20,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // Declara los dos bool y luego los couts

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  bool inscrito = true;
  bool beca = false;
  cout << "Inscrito: " << inscrito << endl;
  cout << "Beca: " << beca << endl;
  return 0;
}`,
            hints: [
              "Declara con `bool nombre = true;` o `bool nombre = false;`.",
              "En el `cout` se imprimen como `1` o `0`.",
              "Cuida el espacio después de los `:`.",
            ],
            testCases: [
              {
                expectedStdout: "Inscrito: 1\nBeca: 0\n",
                visible: true,
                description: "Salida exacta con 1 y 0",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 6: Constantes con const
    // =====================================================================
    {
      slug: "constantes",
      title: "Constantes con const",
      description: "Cómo declarar valores que NO se pueden modificar.",
      xpReward: 25,
      estimatedMinutes: 5,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  const int MAX_INTENTOS = 3;
  int intento = 1;

  cout << "Intento " << intento << " de " << MAX_INTENTOS << endl;
  return 0;
}`,
          explanation:
            "`const` marca una variable como inmodificable. Si después intentas hacer `MAX_INTENTOS = 5;`, el compilador da error. Convención: las constantes se nombran en MAYÚSCULAS.",
          runnable: true,
          expectedOutput: "Intento 1 de 3",
        },
        {
          type: "fill_blank",
          template: `{{0}} double IVA = 0.16;
{{1}} int DIAS_PARCIAL = 28;`,
          blanks: [
            { answer: "const", hint: "Palabra clave que marca la variable como inmutable." },
            { answer: "const", hint: "La misma palabra clave; cada constante se declara con su propio `const`." },
          ],
          explanation:
            "`const` se pone ANTES del tipo. Cada variable lleva su propio `const`. Después de declararla, no puedes cambiar su valor.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Calificación mínima

Declara una constante:

\`\`\`cpp
const int MIN_APROBATORIA = 7;
\`\`\`

Y una variable normal:

\`\`\`cpp
int mi_calificacion = 8;
\`\`\`

Imprime exactamente:

\`\`\`
Mi calificacion: 8
Aprobatoria: 7
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // Declara la constante y la variable, luego imprime

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  const int MIN_APROBATORIA = 7;
  int mi_calificacion = 8;
  cout << "Mi calificacion: " << mi_calificacion << endl;
  cout << "Aprobatoria: " << MIN_APROBATORIA << endl;
  return 0;
}`,
            hints: [
              "La constante va con `const int ...` antes que la variable normal.",
              "Usa el nombre exacto `MIN_APROBATORIA` en MAYÚSCULAS.",
              "Dos `cout` separados con `endl` al final.",
            ],
            testCases: [
              {
                expectedStdout: "Mi calificacion: 8\nAprobatoria: 7\n",
                visible: true,
                description: "Las dos líneas exactas",
              },
            ],
          },
        },
      ],
    },
  ],
};
