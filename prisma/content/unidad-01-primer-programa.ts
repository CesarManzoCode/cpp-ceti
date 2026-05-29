import type { UnitDefinition } from "./types";

/**
 * Unidad 01 — Tu primer programa en C++
 *
 * Filosofía: 90% práctica, 10% teoría. Cada lección sigue el patrón
 *   ejemplo ejecutable → llenar espacios → escribir desde cero.
 * Sin contenido histórico/biográfico. Solo código que el alumno
 * lee, modifica, completa y escribe. Estilo CETI: directo al grano.
 */
export const unidad01: UnitDefinition = {
  slug: "primer-programa",
  title: "Tu primer programa en C++",
  description:
    "De cero a escribir, compilar y correr tu primer programa. Pura práctica en el navegador.",
  icon: "🚀",
  published: true,
  lessons: [
    // =====================================================================
    // Lección 1: Tu primer cout (reemplaza "Bienvenido a C++")
    // =====================================================================
    {
      slug: "bienvenido-a-cpp",
      title: "Tu primer cout",
      description: "Imprime texto en la consola con cout.",
      xpReward: 20,
      estimatedMinutes: 4,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  cout << "Hola desde el CETI";
  return 0;
}`,
          explanation:
            "`cout` imprime texto entre comillas en la consola. Pulsa **Ejecutar** y mira el resultado.",
          runnable: true,
          expectedOutput: "Hola desde el CETI",
        },
        {
          type: "fill_blank",
          template: `#include <iostream>
using namespace std;

int main() {
  {{0}} << {{1}};
  return 0;
}`,
          blanks: [
            { answer: "cout", hint: "Es el objeto que envía texto a la consola." },
            {
              answer: '"Hola"',
              // Acepta cualquier texto entre comillas dobles (sin comillas dobles
              // internas), tal como dice la pista.
              pattern: '"[^"]*"',
              hint: "Cualquier texto, entre comillas dobles.",
            },
          ],
          explanation:
            "`cout << \"...\"` envía un texto a la consola. El texto siempre va entre comillas dobles.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Imprime tu nombre

Escribe un programa que imprima tu nombre. Para los tests usa exactamente \`Aurora\`.

Salida esperada:
\`\`\`
Aurora
\`\`\``,
            difficulty: "easy",
            xpReward: 15,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // Imprime "Aurora" aquí

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Aurora";
  return 0;
}`,
            hints: [
              "Usa `cout << \"...\";` para imprimir.",
              "El texto va entre comillas dobles.",
              "No olvides el `;` al final de la línea.",
            ],
            testCases: [
              {
                expectedStdout: "Aurora",
                visible: true,
                description: "Imprime el nombre exacto",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 2: Hola, Mundo!
    // =====================================================================
    {
      slug: "hola-mundo",
      title: "Hola, Mundo! con salto de línea",
      description: "El clásico programa, ahora con endl para dejar el cursor en una nueva línea.",
      xpReward: 25,
      estimatedMinutes: 5,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  cout << "Hola, Mundo!" << endl;
  return 0;
}`,
          explanation:
            "`<< endl` agrega un salto de línea al final. Lo necesitas cuando vas a imprimir más de una línea seguida.",
          runnable: true,
          expectedOutput: "Hola, Mundo!",
        },
        {
          type: "fill_blank",
          template: `cout << "Hola, Mundo!" {{0}} {{1}};`,
          blanks: [
            { answer: "<<", hint: "El mismo operador para encadenar." },
            { answer: "endl", hint: "Sin comillas: es un identificador." },
          ],
          explanation:
            "`endl` se manda a `cout` con `<<`, igual que cualquier otro texto. Pero `endl` NO lleva comillas.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Tu primer Hola Mundo

Imprime exactamente:

\`\`\`
Hola, Mundo!
\`\`\`

Acuérdate de incluir el salto de línea al final.`,
            difficulty: "easy",
            xpReward: 15,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // Tu cout aquí

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Hola, Mundo!" << endl;
  return 0;
}`,
            hints: [
              "Usa `cout << \"...\" << endl;`.",
              "El texto exacto es `Hola, Mundo!` (con la coma y el signo de admiración).",
              "Termina con `endl` para el salto de línea.",
            ],
            testCases: [
              {
                expectedStdout: "Hola, Mundo!\n",
                visible: true,
                description: "Imprime el saludo exacto con salto de línea",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 3: ¿Qué es #include?
    // =====================================================================
    {
      slug: "que-es-include",
      title: "¿Qué es `#include`?",
      description:
        "La primera línea de cada programa: traer herramientas listas para usar.",
      xpReward: 35,
      estimatedMinutes: 8,
      steps: [
        {
          type: "theory",
          markdown: `# La línea más importante del archivo

\`\`\`cpp
#include <iostream>
\`\`\`

Esa línea **no se ejecuta** cuando corres el programa. Es una **directiva del preprocesador** — una instrucción para una fase que ocurre ANTES de que el compilador haga su trabajo.

Lo que hace es muy concreto: **copia el contenido completo** del archivo \`iostream\` justo en ese lugar de tu código. Es como si tú hubieras pegado miles de líneas ahí mismo.

\`iostream\` (de _**i**nput/**o**utput **stream**_) es un **header**: un archivo que ya viene con C++ y que define \`cout\`, \`cin\`, \`endl\`, etc. Sin esa línea, el compilador no tendría ni idea de qué es \`cout\`.

> Los signos \`<>\` significan _"búscalo en la librería estándar de C++"_. Cuando incluyas tus propios archivos vas a usar \`"comillas"\`. Por ahora, siempre \`<>\`.`,
        },
        {
          type: "code_example",
          code: `// ESTE PROGRAMA NO COMPILA: falta el #include
using namespace std;

int main() {
  cout << "Hola";   // error: 'cout' was not declared
  return 0;
}`,
          explanation:
            "Sin `#include <iostream>` el compilador grita _\"'cout' was not declared in this scope\"_. El header es lo que hace que `cout` exista en tu programa.",
        },
        {
          type: "quiz",
          question: "¿Cuándo se ejecuta la línea `#include <iostream>`?",
          options: [
            "Cuando el usuario corre el programa.",
            "Antes de la compilación, durante el preprocesador.",
            "Al final, junto con `return 0;`.",
            "Solo si tu programa imprime algo.",
          ],
          correctIndex: 1,
          explanation:
            "`#include` lo procesa el **preprocesador**, una fase ANTES de que el compilador convierta tu código a ejecutable. Para cuando arranca el programa, esa línea ya hizo su chamba.",
        },
        {
          type: "fill_blank",
          template: `{{0}} <iostream>   // para cout y cin
{{1}} <string>     // para usar string
using namespace std;

int main() {
  string nombre = "Aurora";
  cout << nombre << endl;
  return 0;
}`,
          blanks: [
            { answer: "#include", hint: "La directiva empieza con `#`." },
            { answer: "#include", hint: "Cada librería se incluye en su propia línea." },
          ],
          explanation:
            "Cada librería que uses necesita su propio `#include`. `<iostream>` te da `cout`/`cin`; `<string>` te da el tipo `string`.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Agrega la línea que falta

Al código de abajo le falta el \`#include\` para que el compilador entienda \`cout\`. Agrégalo y haz que el programa imprima exactamente:

\`\`\`
Compilo!
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `// Falta una línea aquí arriba — agrégala
using namespace std;

int main() {
  cout << "Compilo!" << endl;
  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Compilo!" << endl;
  return 0;
}`,
            hints: [
              "Necesitas `#include <iostream>` para que `cout` exista.",
              "Va en la primera línea del archivo.",
              "No olvides los `<>` alrededor del nombre del header.",
            ],
            testCases: [
              {
                expectedStdout: "Compilo!\n",
                visible: true,
                description: "Compila e imprime el mensaje",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 4: using namespace std — el atajo
    // =====================================================================
    {
      slug: "using-namespace-std",
      title: "`using namespace std` — el atajo",
      description:
        "Por qué casi siempre verás esta línea después del #include.",
      xpReward: 35,
      estimatedMinutes: 7,
      steps: [
        {
          type: "theory",
          markdown: `# \`std\` es la caja de la librería estándar

C++ tiene **cientos** de cosas listas para usar: \`cout\`, \`cin\`, \`endl\`, \`string\`, \`vector\`, \`getline\`... Todas viven dentro de un **namespace** (espacio de nombres) llamado \`std\` (de _standard_).

Eso significa que el nombre **completo** de \`cout\` es en realidad \`std::cout\`:

\`\`\`cpp
std::cout << "Hola" << std::endl;
\`\`\`

Esa es la forma "oficial". Funciona, pero se vuelve pesado repetir \`std::\` cada vez.

La línea \`using namespace std;\` le dice al compilador: _"déjame usar todo lo que está en \`std\` sin escribir \`std::\` cada vez"_. Es **solo un atajo** para no repetir el prefijo.

> En proyectos profesionales muchas veces se prefiere \`std::cout\` explícito para evitar conflictos con otras librerías. Para lo que estás aprendiendo y para los programas del CETI, \`using namespace std;\` está perfectamente bien.`,
        },
        {
          type: "code_example",
          code: `#include <iostream>

int main() {
  std::cout << "Sin atajo" << std::endl;
  return 0;
}`,
          explanation:
            "Sin la línea `using namespace std;`, tenemos que escribir `std::` delante de cada cosa de la librería estándar. El programa hace EXACTAMENTE lo mismo, solo escribes más.",
          runnable: true,
          expectedOutput: "Sin atajo",
        },
        {
          type: "quiz",
          question: "¿Qué hace exactamente `using namespace std;`?",
          options: [
            "Activa la librería estándar (sin ella no funciona `cout`).",
            "Te permite escribir `cout` en vez de `std::cout`.",
            "Cambia el idioma del compilador.",
            "Hace que el programa corra más rápido.",
          ],
          correctIndex: 1,
          explanation:
            "Lo que TRAE las herramientas es `#include <iostream>`. `using namespace std;` solo te ahorra escribir el prefijo `std::` cada vez.",
        },
        {
          type: "fill_blank",
          template: `#include <iostream>
// sin "using namespace std;" aquí

int main() {
  {{0}}cout << "Hola" << {{1}}endl;
  return 0;
}`,
          blanks: [
            { answer: "std::", hint: "El prefijo que evitas con `using namespace std;`." },
            { answer: "std::", hint: "Cada nombre de la librería estándar lo necesita." },
          ],
          explanation:
            "Sin la línea `using namespace std;`, cada cosa de la librería estándar lleva `std::` delante.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Sin atajos

Escribe un programa que imprima exactamente:

\`\`\`
Sin namespace
\`\`\`

**Restricción:** NO uses la línea \`using namespace std;\`. Tendrás que escribir \`std::cout\` y \`std::endl\` explícitamente.`,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>

int main() {
  // Imprime "Sin namespace" sin usar "using namespace std;"

  return 0;
}`,
            solutionCode: `#include <iostream>

int main() {
  std::cout << "Sin namespace" << std::endl;
  return 0;
}`,
            hints: [
              "Sin `using namespace std;` necesitas el prefijo `std::`.",
              "Va antes de `cout` y antes de `endl`.",
              "El texto exacto es `Sin namespace` (sin acentos).",
            ],
            testCases: [
              {
                expectedStdout: "Sin namespace\n",
                visible: true,
                description: "Imprime usando std::cout y std::endl",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 5: La función main y return 0
    // =====================================================================
    {
      slug: "main-y-return",
      title: "`int main()` y `return 0`",
      description:
        "Dónde empieza el programa y por qué siempre termina con un cero.",
      xpReward: 35,
      estimatedMinutes: 8,
      steps: [
        {
          type: "theory",
          markdown: `# \`main\` es la puerta de entrada

Cuando ejecutas tu programa, el sistema operativo busca una función llamada \`main\` y la corre. Es el **único** punto de entrada — no importa dónde la pongas en el archivo, ese es el lugar donde tu programa arranca.

\`\`\`cpp
int main() {
  // ← aquí empieza tu programa
  return 0;
  // ← aquí termina
}
\`\`\`

Cada pieza importa:

- **\`int\`** — el tipo de dato que \`main\` devuelve. SIEMPRE es \`int\` (no \`void\`, aunque algunos compiladores lo permitan: no es válido según el estándar).
- **\`main\`** — el nombre, fijo. No puede ser \`principal\` ni \`inicio\`.
- **\`()\`** — los paréntesis indican que es una **función**. Por ahora van vacíos.
- **\`{ ... }\`** — las llaves delimitan el _cuerpo_ de la función: el código que se ejecuta.
- **\`return 0;\`** — el \`0\` es lo que \`main\` le devuelve al sistema operativo. Es el **código de salida**: \`0\` significa _"todo bien"_, cualquier otro número significa _"hubo un error"_.`,
        },
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  cout << "Termina con error" << endl;
  return 1;   // ← le avisa al sistema: hubo un problema
}`,
          explanation:
            "El `return` final NO afecta lo que ves en consola — afecta el **exit code** que tu programa le reporta al sistema operativo. Aquí imprime normal, pero le avisa _\"terminé con un problema\"_. En la práctica casi siempre vas a poner `return 0;`.",
          runnable: true,
          expectedOutput: "Termina con error",
        },
        {
          type: "quiz",
          question: "¿Por qué `int main()` y no `void main()`?",
          options: [
            "Porque siempre devuelve un entero — el código de salida.",
            "Es solo convención, daría lo mismo.",
            "Porque `main` imprime enteros.",
            "Para usar `cin` con enteros.",
          ],
          correctIndex: 0,
          explanation:
            "El estándar de C++ exige que `main` devuelva `int`. Algunos compiladores aceptan `void main`, pero NO es portable — tu código podría no compilar en otra máquina.",
        },
        {
          type: "fill_blank",
          template: `#include <iostream>
using namespace std;

{{0}} main() {
  cout << "Adios" << endl;
  {{1}} 0;
}`,
          blanks: [
            { answer: "int", hint: "El tipo que devuelve la función main." },
            { answer: "return", hint: "Marca el fin de la función y entrega el código de salida." },
          ],
          explanation:
            "`int main()` declara una función que devuelve un entero. `return 0;` es ese entero y le dice al sistema operativo: _\"terminé sin errores\"_.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Programa que termina bien

Escribe un programa **completo** que imprima exactamente:

\`\`\`
Listo
\`\`\`

Tu programa debe:
1. Incluir \`<iostream>\` y usar \`using namespace std;\`.
2. Definir \`int main()\` con su bloque.
3. Terminar con \`return 0;\` (éxito).`,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `// Escribe el programa completo desde aquí
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Listo" << endl;
  return 0;
}`,
            hints: [
              "Primero el `#include <iostream>`, luego `using namespace std;`.",
              "`int main() { ... }` es la firma + el bloque.",
              "Dentro: un solo `cout` y al final `return 0;`.",
            ],
            testCases: [
              {
                expectedStdout: "Listo\n",
                visible: true,
                description: "Programa completo que termina con éxito",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 6: ; y {} — la puntuación de C++
    // =====================================================================
    {
      slug: "sintaxis-basica",
      title: "`;` y `{}` — la puntuación de C++",
      description:
        "Por qué cada renglón termina en `;` y para qué sirven las llaves.",
      xpReward: 35,
      estimatedMinutes: 7,
      steps: [
        {
          type: "theory",
          markdown: `# La puntuación del lenguaje

C++ **no** usa los saltos de línea para separar instrucciones. Lo que separa una de otra es el **punto y coma \`;\`**, y lo que las agrupa es **\`{ }\`**.

## El \`;\` cierra cada sentencia

Una **sentencia** (statement) es una instrucción completa. **Toda** sentencia termina en \`;\`:

\`\`\`cpp
cout << "Hola" << endl;   // ✅ termina en ;
return 0;                  // ✅
\`\`\`

Olvidar un \`;\` es uno de los errores más comunes al empezar. El compilador grita _"expected ';' before ..."_.

## Las \`{ }\` agrupan en bloques

Lo que está entre \`{\` y \`}\` es un **bloque** de código. El cuerpo de \`main\` es un bloque. Más adelante los \`if\`, los \`for\` y las funciones que escribas también van a usar bloques.

> **Indentación.** El compilador **no se fija** en los espacios al principio de cada línea — esos son SOLO para que tu código sea legible. Por convención: 2 espacios por cada nivel de \`{ }\`.`,
        },
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main(){cout<<"Funciona igual";return 0;}`,
          explanation:
            "Este programa **sí compila** y hace lo mismo que uno bien indentado. Para el compilador solo importan los `;` y las `{}` — el espaciado lo escribes para que tú (y tus compañeros) puedan leerlo en una semana.",
          runnable: true,
          expectedOutput: "Funciona igual",
        },
        {
          type: "quiz",
          question:
            "¿Qué le falta a este código?\n\n```cpp\ncout << \"Hola\"\nreturn 0;\n```",
          options: [
            "Le falta el `<<` final.",
            "Le falta el `;` después de `\"Hola\"`.",
            "Le sobra el espacio.",
            "Le falta `endl`.",
          ],
          correctIndex: 1,
          explanation:
            "Cada sentencia debe terminar en `;`. Sin el punto y coma después de `\"Hola\"`, el compilador no sabe dónde acaba el `cout` y dónde empieza el `return`.",
        },
        {
          type: "fill_blank",
          template: `#include <iostream>
using namespace std;

int main() {{0}}
  cout << "Compila" << endl{{1}}
  return 0{{2}}
{{3}}`,
          blanks: [
            { answer: "{", hint: "Abre el bloque de main." },
            { answer: ";", hint: "Termina la sentencia del cout." },
            { answer: ";", hint: "Termina la sentencia del return." },
            { answer: "}", hint: "Cierra el bloque de main." },
          ],
          explanation:
            "Cada sentencia termina en `;`. El bloque de la función abre con `{` y cierra con `}`.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Tres sentencias, tres punto y coma

Imprime exactamente:

\`\`\`
Uno
Dos
Tres
\`\`\`

Usa **tres** \`cout\` distintos (uno por línea). Cada sentencia debe terminar en \`;\` y todas viven dentro del bloque de \`main\`.`,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // Tres cout, uno por línea

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Uno" << endl;
  cout << "Dos" << endl;
  cout << "Tres" << endl;
  return 0;
}`,
            hints: [
              "Tres líneas con `cout << \"...\" << endl;`.",
              "Cada una termina en `;`.",
              "Todas van DENTRO de las `{}` de main.",
            ],
            testCases: [
              {
                expectedStdout: "Uno\nDos\nTres\n",
                visible: true,
                description: "Tres líneas, una por cout",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 7: Cada línea hace algo
    // =====================================================================
    {
      slug: "anatomia",
      title: "Cada línea hace algo",
      description:
        "Identifica el propósito de cada línea de un programa C++.",
      xpReward: 30,
      estimatedMinutes: 7,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>     // herramientas de entrada/salida
using namespace std;    // permite usar cout sin std::

int main() {            // punto de entrada del programa
  cout << "Listo";      // imprime un mensaje
  return 0;             // termina sin errores
}`,
          explanation:
            "Cada línea del programa tiene una función específica. Lee los comentarios a la derecha y luego corre el código para ver el resultado.",
          runnable: true,
          expectedOutput: "Listo",
        },
        {
          type: "quiz",
          question:
            "¿Dónde empieza a ejecutarse cualquier programa de C++?",
          options: [
            "En la primera línea del archivo.",
            "Donde tú decidas con `start`.",
            "En la función `main`.",
            "Donde esté el primer `cout`.",
          ],
          correctIndex: 2,
          explanation:
            "C++ siempre arranca dentro de `main`. Si tu programa no tiene `main`, no compila.",
        },
        {
          type: "fill_blank",
          template: `#include <iostream>
using namespace std;

{{0}} main() {
  cout << "Hola";
  {{1}} 0;
}`,
          blanks: [
            { answer: "int", hint: "Es el tipo de dato que devuelve la función." },
            { answer: "return", hint: "Marca el fin del programa." },
          ],
          explanation:
            "`int main()` significa que `main` devuelve un entero. `return 0;` es ese entero y significa “terminé bien”.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reconstruye el programa

Escribe un programa C++ **completo** que imprima:

\`\`\`
Curso de C++
\`\`\`

Necesitas incluir TODAS las partes: \`#include\`, \`using namespace\`, \`int main()\` y \`return 0;\`.`,
            difficulty: "easy",
            xpReward: 20,
            starterCode: `// Escribe el programa completo desde aquí
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Curso de C++" << endl;
  return 0;
}`,
            hints: [
              "Empieza con `#include <iostream>` y `using namespace std;`.",
              "Después declara `int main() { ... }`.",
              "Dentro del main: `cout << \"Curso de C++\" << endl;` y `return 0;`.",
            ],
            testCases: [
              {
                expectedStdout: "Curso de C++\n",
                visible: true,
                description: "Programa C++ completo y compilable",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 8: Comentarios
    // =====================================================================
    {
      slug: "comentarios",
      title: "Comentarios",
      description:
        "Cómo dejar notas en tu código sin afectar la ejecución.",
      xpReward: 20,
      estimatedMinutes: 4,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  // Comentario de UNA línea (el compilador lo ignora)
  cout << "Hola" << endl;

  /* Comentario
     de varias
     líneas */
  return 0;
}`,
          explanation:
            "Hay dos formas: `//` para una línea y `/* ... */` para varias. El compilador los ignora — solo sirven para ti y para tus compañeros.",
          runnable: true,
          expectedOutput: "Hola",
        },
        {
          type: "fill_blank",
          template: `#include <iostream>
using namespace std;

int main() {
  {{0}} Imprimimos un saludo
  cout << "Hola CETI" << endl;
  return 0;
}`,
          blanks: [
            { answer: "//", hint: "Dos barras inclinadas inician un comentario de una línea." },
          ],
          explanation:
            "`//` convierte el resto de la línea en comentario. El compilador lo ignora.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Programa documentado

Escribe un programa que imprima:

\`\`\`
Aurora · 5to semestre
\`\`\`

**Requisito:** incluye al menos **un comentario** explicando qué hace el \`cout\`. El comentario no afecta el output, solo tiene que estar en el código.`,
            difficulty: "easy",
            xpReward: 20,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // Tu programa aquí (con al menos un comentario)

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  // Imprime el nombre y semestre del alumno
  cout << "Aurora · 5to semestre" << endl;
  return 0;
}`,
            hints: [
              "Agrega un comentario con `//` antes o después de tu `cout`.",
              "El texto exacto es `Aurora · 5to semestre` (con el separador `·`).",
              "Recuerda el salto de línea con `endl`.",
            ],
            testCases: [
              {
                expectedStdout: "Aurora · 5to semestre\n",
                visible: true,
                description: "Output exacto",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 9: Imprimir varias cosas
    // =====================================================================
    {
      slug: "imprimir-varias-cosas",
      title: "Imprimir varias cosas",
      description:
        "Encadena texto y números en un solo cout con el operador <<.",
      xpReward: 25,
      estimatedMinutes: 5,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  cout << "Mi nombre es " << "Aurora" << ".";
  cout << " Tengo " << 19 << " anios.";
  return 0;
}`,
          explanation:
            "Cada `<<` empuja la siguiente cosa a la consola. Los números NO llevan comillas; el texto sí.",
          runnable: true,
          expectedOutput: "Mi nombre es Aurora. Tengo 19 anios.",
        },
        {
          type: "fill_blank",
          template: `cout << "Tengo " {{0}} 8 {{1}} " materias" << endl;`,
          blanks: [
            { answer: "<<", hint: "Necesitas el operador entre cada cosa." },
            { answer: "<<", hint: "El mismo operador." },
          ],
          explanation:
            "`<<` va entre CADA pedazo que mandes a `cout`. Sin él, no compila.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Tu ficha de alumno

Usando un solo \`cout\`, imprime exactamente:

\`\`\`
Aurora · 19 anios · 8.7 de promedio
\`\`\`

Combina texto con los números **19** y **8.7** dentro del mismo \`cout\` (no en variables — directo en el cout).`,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // Un solo cout encadenado

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Aurora · " << 19 << " anios · " << 8.7 << " de promedio" << endl;
  return 0;
}`,
            hints: [
              "Encadena con `<<`: texto, número, texto, número, etc.",
              "Los números van SIN comillas: `<< 19 <<` no `<< \"19\" <<`.",
              "Cuida los espacios DENTRO de las comillas: `\" anios · \"`.",
            ],
            testCases: [
              {
                expectedStdout: "Aurora · 19 anios · 8.7 de promedio\n",
                visible: true,
                description: "Output con texto + números encadenados",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 10: Saltos de línea
    // =====================================================================
    {
      slug: "saltos-de-linea",
      title: "Saltos de línea: endl vs \\n",
      description:
        "Dos formas de pasar a la siguiente línea. Cuándo usar cada una.",
      xpReward: 25,
      estimatedMinutes: 5,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  cout << "Linea 1" << endl;
  cout << "Linea 2" << "\\n";
  cout << "Linea 3" << endl;
  return 0;
}`,
          explanation:
            "`endl` y `\"\\n\"` hacen lo mismo visualmente: saltar de línea. Para empezar, usa la que prefieras.",
          runnable: true,
          expectedOutput: `Linea 1
Linea 2
Linea 3`,
        },
        {
          type: "fill_blank",
          template: `cout << "Alumno: Aurora" {{0}};
cout << "Grupo: 5DSM" {{1}};`,
          blanks: [
            { answer: "<< endl", hint: "Salto de línea con endl." },
            { answer: '<< "\\n"', hint: "Salto de línea con \\n entre comillas." },
          ],
          explanation:
            "Las dos formas dan el mismo resultado visual. `endl` es un identificador, `\"\\n\"` es texto con un caracter especial.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Datos del alumno

Imprime exactamente estas 3 líneas:

\`\`\`
Nombre: Aurora
Carrera: Desarrollo de Software
CETI Colomos
\`\`\`

Usa el salto de línea que quieras (endl o \\n).`,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // 3 líneas exactas

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Nombre: Aurora" << endl;
  cout << "Carrera: Desarrollo de Software" << endl;
  cout << "CETI Colomos" << endl;
  return 0;
}`,
            hints: [
              "Usa tres `cout` separados, uno por línea.",
              "Termina cada uno con `<< endl;` o `<< \"\\n\";`.",
              "Cuida los espacios después de los `:`.",
            ],
            testCases: [
              {
                expectedStdout:
                  "Nombre: Aurora\nCarrera: Desarrollo de Software\nCETI Colomos\n",
                visible: true,
                description: "Las 3 líneas exactas",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 11: Caracteres especiales (escape sequences)
    // =====================================================================
    {
      slug: "caracteres-especiales",
      title: "Caracteres especiales — secuencias de escape",
      description:
        "Cómo meter tabuladores, comillas y diagonales dentro de un string.",
      xpReward: 30,
      estimatedMinutes: 6,
      steps: [
        {
          type: "theory",
          markdown: `# La diagonal invertida es mágica dentro de un string

Hay caracteres que **no** puedes meter directamente entre comillas:

- Una **comilla doble \`"\`** terminaría el string si la pones tal cual.
- Un **salto de línea** no cabe en una sola línea de código.
- Un **tabulador** sería invisible si lo escribes con espacios.

Para esos casos C++ usa **secuencias de escape**: una diagonal invertida \`\\\` seguida de un carácter le dice al compilador _"el siguiente carácter es especial"_.

Las más útiles:

- \`\\n\` — salto de línea
- \`\\t\` — tabulador (espacio grande)
- \`\\"\` — una comilla doble dentro del string
- \`\\\\\` — una sola diagonal invertida

> Sin la diagonal, C++ leería \`"Ella dijo "hola""\` como tres strings pegados y el compilador se confundiría. Con \`"Ella dijo \\"hola\\""\` lo entiende como un solo string con comillas internas.`,
        },
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  cout << "Tab:\\there" << endl;
  cout << "Cita: \\"al CETI\\"" << endl;
  cout << "Ruta: C:\\\\Users\\\\Aurora" << endl;
  return 0;
}`,
          explanation:
            "El compilador interpreta `\\t`, `\\n`, `\\\"` y `\\\\` como un solo carácter especial. Regla práctica: en el código pones DOS diagonales para que en pantalla salga UNA.",
          runnable: true,
          expectedOutput: `Tab:\there
Cita: "al CETI"
Ruta: C:\\Users\\Aurora`,
        },
        {
          type: "fill_blank",
          template: `cout << "Aurora{{0}}5to semestre" << endl;
cout << "Cita: {{1}}sin miedo{{2}}" << endl;`,
          blanks: [
            { answer: "\\t", hint: "Un tabulador para separar columnas." },
            { answer: "\\\"", hint: "Una comilla doble escapada (abre el texto)." },
            { answer: "\\\"", hint: "La misma comilla escapada del otro lado." },
          ],
          explanation:
            "Cada secuencia lleva una diagonal invertida que avisa al compilador que el siguiente carácter es especial. Sin esa diagonal, las comillas internas romperían el string.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Cita textual

Imprime exactamente:

\`\`\`
El alumno dijo: "Aprobado"
\`\`\`

Las **comillas internas** alrededor de \`Aprobado\` deben aparecer en el output. Para meterlas dentro del string de C++ tienes que escaparlas con \`\\"\`.`,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // Usa \\" para meter comillas dentro de comillas

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "El alumno dijo: \\"Aprobado\\"" << endl;
  return 0;
}`,
            hints: [
              "Para meter una comilla dentro del string usa `\\\"`.",
              "Es UN solo cout con UN solo string que contiene comillas escapadas.",
              "No olvides el `endl` al final.",
            ],
            testCases: [
              {
                expectedStdout: "El alumno dijo: \"Aprobado\"\n",
                visible: true,
                description: "Imprime la cita con comillas internas",
              },
            ],
          },
        },
      ],
    },
  ],
};
