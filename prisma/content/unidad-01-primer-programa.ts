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
            { answer: '"Hola"', hint: "Cualquier texto, entre comillas dobles." },
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
    // Lección 3: Cada línea hace algo
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
    // Lección 4: Comentarios
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
    // Lección 5: Imprimir varias cosas
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
    // Lección 6: Saltos de línea
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
  ],
};
