import type { UnitDefinition } from "./types";

export const unidad02: UnitDefinition = {
  slug: "variables-y-tipos",
  title: "Variables y tipos de datos",
  description:
    "Las variables son cómo tu programa recuerda cosas. Los tipos le dicen al compilador qué clase de información guardas.",
  icon: "📦",
  published: true,
  lessons: [
    // =====================================================================
    // Lección 1: ¿Qué es una variable?
    // =====================================================================
    {
      slug: "que-es-variable",
      title: "¿Qué es una variable?",
      description: "Una caja con nombre que guarda un valor.",
      xpReward: 25,
      estimatedMinutes: 5,
      steps: [
        {
          type: "theory",
          markdown: `## Una caja con nombre

Imagina que tu programa necesita recordar tu edad. Una **variable** es una caja donde guardas ese dato, le pones un nombre, y después lo puedes usar.

\`\`\`cpp
int edad = 19;
\`\`\`

Eso dice:

- \`int\` — **tipo**: la caja guarda números enteros.
- \`edad\` — **nombre** de la caja.
- \`=\` — **asigna** el valor de la derecha a la caja.
- \`19\` — el **valor** que guardas.

Una vez declarada, puedes usar \`edad\` en cualquier lugar del programa:

\`\`\`cpp
cout << "Tengo " << edad << " años." << endl;
\`\`\``,
        },
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int edad = 19;
  cout << "Tengo " << edad << " años." << endl;
  return 0;
}`,
          explanation:
            "Fíjate cómo `edad` se imprime SIN comillas — porque es una variable, no texto literal.",
          runnable: true,
          expectedOutput: "Tengo 19 años.",
        },
        {
          type: "quiz",
          question:
            "En `int meses = 12;`, ¿qué es `12`?",
          options: [
            "El nombre de la variable.",
            "El tipo de la variable.",
            "El valor asignado.",
            "Un comentario.",
          ],
          correctIndex: 2,
          explanation:
            "`12` es el valor que se guarda en la variable `meses` de tipo `int`.",
        },
      ],
    },

    // =====================================================================
    // Lección 2: int, double y char
    // =====================================================================
    {
      slug: "tipos-basicos",
      title: "int, double y char",
      description: "Los 3 tipos básicos que vas a usar todo el tiempo.",
      xpReward: 30,
      estimatedMinutes: 7,
      steps: [
        {
          type: "theory",
          markdown: `## Los tipos esenciales

| Tipo     | Para qué sirve                  | Ejemplo                    |
|----------|---------------------------------|----------------------------|
| \`int\`    | Números enteros                 | \`int edad = 19;\`           |
| \`double\` | Números con decimales           | \`double precio = 199.99;\`  |
| \`char\`   | Un solo caracter                | \`char grado = 'A';\`        |

> ⚠️ Nota la diferencia: \`char\` usa **comillas simples** (\`'A'\`), no dobles. Si usaras \`"A"\` sería texto (string), no un caracter.`,
        },
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int edad = 19;
  double promedio = 8.7;
  char grupo = 'B';

  cout << "Edad: " << edad << endl;
  cout << "Promedio: " << promedio << endl;
  cout << "Grupo: " << grupo << endl;
  return 0;
}`,
          explanation:
            "Tres tipos distintos, tres líneas de impresión. Cada uno guarda su clase de dato.",
          runnable: true,
        },
        {
          type: "fill_blank",
          template: `{{0}} precio = 49.95;
{{1}} cantidad = 3;
{{2}} categoria = 'A';`,
          blanks: [
            { answer: "double", hint: "Tiene decimales." },
            { answer: "int", hint: "Es entero, sin punto decimal." },
            { answer: "char", hint: "Es un solo caracter entre comillas simples." },
          ],
          explanation:
            "El tipo debe coincidir con la naturaleza del valor: decimales → `double`, enteros → `int`, un caracter → `char`.",
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
            "`char letra = \"A\";` es incorrecto. Para `char` se usan comillas simples: `char letra = 'A';`. Las comillas dobles son para texto (strings), que tienen otro tipo.",
        },
      ],
    },

    // =====================================================================
    // Lección 3: Operaciones aritméticas
    // =====================================================================
    {
      slug: "operaciones",
      title: "Hacer matemáticas",
      description:
        "Suma, resta, multiplicación, división y módulo en C++.",
      xpReward: 30,
      estimatedMinutes: 7,
      steps: [
        {
          type: "theory",
          markdown: `## Los operadores aritméticos

| Operador | Significado     | Ejemplo       | Resultado |
|----------|-----------------|---------------|-----------|
| \`+\`      | Suma            | \`5 + 2\`       | \`7\`       |
| \`-\`      | Resta           | \`5 - 2\`       | \`3\`       |
| \`*\`      | Multiplicación  | \`5 * 2\`       | \`10\`      |
| \`/\`      | División        | \`5 / 2\`       | \`2\` ⚠️    |
| \`%\`      | Módulo (resto)  | \`5 % 2\`       | \`1\`       |

> ⚠️ **Cuidado con la división de enteros:** \`5 / 2\` es \`2\`, **no** \`2.5\`. Cuando ambos operandos son \`int\`, C++ trunca el resultado. Si quieres decimales, al menos uno debe ser \`double\`: \`5.0 / 2\` da \`2.5\`.`,
        },
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
  cout << a % b << endl;  // 1  (sobra 1)
  return 0;
}`,
          explanation:
            "Observa la división `7 / 3`: da `2`, no `2.33`. Si quisieras los decimales, declararías al menos una variable como `double`.",
          runnable: true,
        },
        {
          type: "quiz",
          question: "¿Cuánto vale `10 % 3`?",
          options: ["3", "1", "3.33", "0"],
          correctIndex: 1,
          explanation:
            "`%` es el operador módulo: devuelve el RESTO de la división. 10 entre 3 es 3 y sobra 1. Por eso `10 % 3 = 1`.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Calcula el promedio

Declara tres variables \`int\` con los valores **8**, **9** y **7** (representan calificaciones). Calcula el **promedio** y muéstralo.

**Importante:** Para que el promedio salga con decimales, divide entre \`3.0\` (no entre \`3\`).

Salida esperada:
\`\`\`
8
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int a = 8;
  int b = 9;
  int c = 7;

  // Calcula el promedio aquí y muéstralo

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int a = 8;
  int b = 9;
  int c = 7;
  double promedio = (a + b + c) / 3.0;
  cout << promedio << endl;
  return 0;
}`,
            hints: [
              "Suma los tres valores: `a + b + c`.",
              "Divide entre `3.0` (con decimal) para forzar la división en double.",
              "Usa paréntesis para que primero sume y luego divida: `(a + b + c) / 3.0`.",
            ],
            testCases: [
              {
                expectedStdout: "8\n",
                visible: true,
                description: "Promedio de 8, 9 y 7 es 8.0",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 4: string — texto en una variable
    // =====================================================================
    {
      slug: "strings",
      title: "Guardar texto: el tipo string",
      description: "Una variable que guarda palabras, frases o párrafos.",
      xpReward: 25,
      estimatedMinutes: 5,
      steps: [
        {
          type: "theory",
          markdown: `## Strings: texto en una variable

Para guardar texto en C++ usas el tipo \`string\`. Tienes que incluir la biblioteca \`<string>\`:

\`\`\`cpp
#include <string>
\`\`\`

(En muchos proyectos ya viene incluido a través de \`<iostream>\`, pero por buena práctica siempre lo agregamos cuando lo usas.)

\`\`\`cpp
string nombre = "Aurora";
cout << "Hola, " << nombre << "!" << endl;
\`\`\`

Igual que con \`char\`, lo importante es la diferencia de **comillas**:

- \`'A'\` → un solo caracter (\`char\`)
- \`"Aurora"\` → texto (\`string\`)`,
        },
        {
          type: "code_example",
          code: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string ciudad = "Guadalajara";
  string saludo = "Saludos desde " + ciudad + "!";
  cout << saludo << endl;
  return 0;
}`,
          explanation:
            "Los strings se pueden **concatenar** con `+`. Une trozos de texto fácilmente.",
          runnable: true,
          expectedOutput: "Saludos desde Guadalajara!",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Tu carta de presentación

Declara tres variables \`string\`:
- \`nombre\` con tu nombre (puede ser cualquiera, ej: "Aurora")
- \`escuela\` con \`"CETI"\`
- \`carrera\` con \`"Desarrollo de Software"\`

Imprime exactamente:
\`\`\`
Soy Aurora, estudio Desarrollo de Software en CETI.
\`\`\`

Reemplaza "Aurora" con el valor de tu variable.`,
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
              "Cuidado con los espacios entre las palabras dentro de las comillas.",
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
    // Lección 5: bool — verdadero o falso
    // =====================================================================
    {
      slug: "booleanos",
      title: "Verdadero o falso: el tipo bool",
      description:
        "Variables que solo guardan dos posibles valores: true o false.",
      xpReward: 20,
      estimatedMinutes: 4,
      steps: [
        {
          type: "theory",
          markdown: `## Booleanos

A veces solo necesitas guardar **una respuesta de sí o no**. Para eso existe \`bool\`:

\`\`\`cpp
bool esEstudiante = true;
bool aprobo = false;
\`\`\`

Un \`bool\` solo puede valer dos cosas: \`true\` (verdadero) o \`false\` (falso). Sin comillas.

Cuando imprimes un \`bool\`, por defecto C++ muestra:
- \`1\` para \`true\`
- \`0\` para \`false\``,
        },
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  bool inscrito = true;
  bool reprobo = false;

  cout << "Inscrito: " << inscrito << endl;  // 1
  cout << "Reprobó: " << reprobo << endl;    // 0
  return 0;
}`,
          explanation:
            "Verás `1` y `0`. Si quisieras ver `true`/`false` en texto, usarías `cout << boolalpha << ...` (lo verás más adelante).",
          runnable: true,
          expectedOutput: `Inscrito: 1
Reprobó: 0`,
        },
        {
          type: "quiz",
          question:
            "¿Cuál es el valor por defecto que C++ imprime cuando haces `cout << true;`?",
          options: ["true", "1", "True", "Sí"],
          correctIndex: 1,
          explanation:
            "Por defecto, `cout` imprime los `bool` como enteros: `1` para `true`, `0` para `false`.",
        },
      ],
    },

    // =====================================================================
    // Lección 6: Constantes con const
    // =====================================================================
    {
      slug: "constantes",
      title: "Constantes: valores que no cambian",
      description: "Cómo declarar valores que tu programa NO puede modificar.",
      xpReward: 20,
      estimatedMinutes: 5,
      steps: [
        {
          type: "theory",
          markdown: `## La palabra clave \`const\`

Si tienes un valor que **nunca debe cambiar** durante la ejecución del programa, marca la variable como \`const\`:

\`\`\`cpp
const double PI = 3.14159;
const int DIAS_SEMANA = 7;
\`\`\`

Si después intentas hacer:

\`\`\`cpp
PI = 3.14;  // ❌ ERROR — no puedes modificar una constante
\`\`\`

El compilador te detiene con un error. Esto **evita bugs**: estás dejando claro en el código que ese valor es sagrado.

> Convención: las constantes suelen escribirse en MAYÚSCULAS para distinguirlas a simple vista.`,
        },
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
            "`MAX_INTENTOS` se establece una sola vez y nadie puede modificarla en el resto del programa. Es un seguro contra errores tontos.",
          runnable: true,
          expectedOutput: "Intento 1 de 3",
        },
        {
          type: "quiz",
          question:
            "¿Qué pasa si intentas reasignar una variable `const`?",
          options: [
            "Se reasigna pero el programa se vuelve lento.",
            "El compilador da un error y no compila.",
            "Funciona, pero solo en modo debug.",
            "Se reasigna sin problema.",
          ],
          correctIndex: 1,
          explanation:
            "El compilador rechaza el código. Una `const` no se puede modificar después de declararla — esa es exactamente su razón de ser.",
        },
      ],
    },
  ],
};
