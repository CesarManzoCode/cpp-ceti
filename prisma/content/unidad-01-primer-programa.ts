import type { UnitDefinition } from "./types";

export const unidad01: UnitDefinition = {
  slug: "primer-programa",
  title: "Tu primer programa en C++",
  description:
    "De cero a tu primer 'Hola Mundo'. Aprende qué es C++, cómo se ve un programa y por qué se compila antes de correr.",
  icon: "🚀",
  published: true,
  lessons: [
    // =====================================================================
    // Lección 1: Bienvenido a C++
    // =====================================================================
    {
      slug: "bienvenido-a-cpp",
      title: "Bienvenido a C++",
      description: "Qué es C++, para qué sirve y por qué lo aprendes.",
      xpReward: 20,
      estimatedMinutes: 4,
      steps: [
        {
          type: "theory",
          markdown: `## ¿Qué es C++?

**C++** es un lenguaje de programación creado en los 80s por **Bjarne Stroustrup** que sigue siendo de los más usados del mundo.

¿Por qué importa que TÚ lo aprendas?

- **Google, Facebook, Netflix, Microsoft** lo usan para sus partes más críticas.
- Los **videojuegos** (Unreal Engine, gran parte de Unity) corren sobre C++.
- Los **navegadores** que usas todos los días — Chrome, Firefox, Safari — están escritos en C++.
- En el **CETI**, C++ es la puerta a entender cómo funciona una computadora *de verdad*.

> En esta plataforma vas a *programar* C++, no a memorizarlo. Cada cosa que aprendas la vas a escribir tú mismo.`,
        },
        {
          type: "quiz",
          question: "¿Quién creó C++?",
          options: [
            "Linus Torvalds",
            "Bjarne Stroustrup",
            "Dennis Ritchie",
            "Guido van Rossum",
          ],
          correctIndex: 1,
          explanation:
            "Bjarne Stroustrup creó C++ en los Bell Labs a principios de los 80s. Dennis Ritchie creó C (su antecesor), Linus Torvalds creó Linux y Guido van Rossum creó Python.",
        },
        {
          type: "theory",
          markdown: `## ¿Cómo aprenderás aquí?

1. **Lees un concepto corto** (lo que estás haciendo ahora).
2. **Ves un ejemplo** y lo puedes correr en el navegador.
3. **Lo intentas tú** — con quizzes, completar código, y retos de programación.
4. **La plataforma te da feedback inmediato.**

No necesitas instalar nada. No necesitas un compilador en tu compu. **Todo corre aquí**.

Cuando termines una lección, ganas **XP** y tu **racha de días** aumenta. Es ridículamente satisfactorio.`,
        },
      ],
    },

    // =====================================================================
    // Lección 2: Hola, Mundo!
    // =====================================================================
    {
      slug: "hola-mundo",
      title: "Hola, Mundo!",
      description: "El clásico primer programa. Vamos a hacerlo correr.",
      xpReward: 30,
      estimatedMinutes: 6,
      steps: [
        {
          type: "theory",
          markdown: `## El programa más famoso del mundo

Por tradición, el primer programa que se escribe en cualquier lenguaje imprime el texto **"Hola, Mundo!"** en pantalla.

Suena tonto. Pero hacer esto te demuestra que:
1. Sabes escribir código C++ que **compila**.
2. Tu computadora puede **correr** ese código.
3. El programa **hace algo visible**.

Vamos a verlo y luego lo escribes tú.`,
        },
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  cout << "Hola, Mundo!" << endl;
  return 0;
}`,
          explanation: `Este programa imprime el texto **\`Hola, Mundo!\`** y luego termina.

No te preocupes si no entiendes cada línea — la siguiente lección te explica cada pedacito. Por ahora, **pulsa "Ejecutar"** y mira la salida en la consola de abajo.`,
          runnable: true,
        },
        {
          type: "fill_blank",
          template: `#include <iostream>
using namespace std;

int main() {
  {{0}} << "Hola, Mundo!" << endl;
  return 0;
}`,
          blanks: [
            {
              answer: "cout",
              hint: "Es la abreviación de 'console output' — lo que imprime en pantalla.",
            },
          ],
          explanation:
            "`cout` (console output) es el objeto que envía texto a la pantalla.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Tu primer programa

Escribe un programa que imprima exactamente:

\`\`\`
Hola, Mundo!
\`\`\`

Te dejamos el esqueleto. Solo necesitas completar la línea del \`cout\`.`,
            difficulty: "easy",
            xpReward: 15,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // Escribe tu cout aquí

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Hola, Mundo!" << endl;
  return 0;
}`,
            hints: [
              "Usa `cout << \"...\" << endl;` para imprimir y dar salto de línea.",
              "El texto va entre comillas dobles: `\"Hola, Mundo!\"`.",
              "No olvides el `;` al final de la línea.",
            ],
            testCases: [
              {
                expectedStdout: "Hola, Mundo!\n",
                visible: true,
                description: "Imprime el saludo exacto",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 3: Anatomía de un programa C++
    // =====================================================================
    {
      slug: "anatomia",
      title: "La anatomía de un programa C++",
      description:
        "¿Qué hace cada línea de un programa? Vamos a diseccionarlo.",
      xpReward: 30,
      estimatedMinutes: 8,
      steps: [
        {
          type: "theory",
          markdown: `## Línea por línea

Mira otra vez nuestro Hola Mundo:

\`\`\`cpp
#include <iostream>     // 1. Incluir herramientas
using namespace std;    // 2. Usar el "namespace" estándar
                        //
int main() {            // 3. Aquí EMPIEZA el programa
  cout << "Hola!";      // 4. Imprime un mensaje
  return 0;             // 5. Termina sin errores
}                       // 6. Cierra el main
\`\`\`

Cada línea tiene una razón de ser. Vamos a ver una a una.`,
        },
        {
          type: "theory",
          markdown: `### 1. \`#include <iostream>\`

Le dice al compilador: *"voy a usar las herramientas de entrada/salida"*.

\`iostream\` significa **"input/output stream"** (flujos de entrada/salida).
Sin ese \`#include\`, **\`cout\` no existiría** y tu programa no compilaría.

### 2. \`using namespace std;\`

Significa *"asumir que cuando diga \`cout\`, me refiero a \`std::cout\`"*.

Sin esto, tendrías que escribir todo con prefijo:

\`\`\`cpp
std::cout << "Hola!" << std::endl;
\`\`\`

### 3. \`int main() { ... }\`

Es **la puerta de entrada** del programa. C++ siempre empieza ejecutando lo que está adentro de \`main\`. Si tu programa no tiene un \`main\`, no compila.

### 4. \`return 0;\`

Le avisa al sistema operativo: *"terminé y todo salió bien"*. Por convención, \`0\` significa éxito.`,
        },
        {
          type: "quiz",
          question:
            "¿Qué pasa si quitas la línea `#include <iostream>` de un programa que usa `cout`?",
          options: [
            "El programa corre pero no imprime nada.",
            "El programa no compila — el compilador no reconoce `cout`.",
            "Imprime un error en rojo y luego corre.",
            "C++ asume `iostream` automáticamente.",
          ],
          correctIndex: 1,
          explanation:
            "`cout` está declarado dentro de `<iostream>`. Sin el `#include`, el compilador no sabe qué es `cout` y da un error de compilación.",
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
            "Sin importar cuántas funciones tengas, C++ siempre arranca en `main`. Es la única función que el sistema operativo sabe cómo llamar.",
        },
        {
          type: "fill_blank",
          template: `#include <iostream>
using namespace std;

{{0}} main() {
  cout << "Listo" << endl;
  {{1}} 0;
}`,
          blanks: [
            { answer: "int", hint: "Es el tipo de dato que devuelve la función." },
            { answer: "return", hint: "Le dice al sistema operativo que terminamos bien." },
          ],
          explanation:
            "`int main()` indica que la función devuelve un entero, y `return 0;` es ese entero (cero = éxito).",
        },
      ],
    },

    // =====================================================================
    // Lección 4: Comentarios
    // =====================================================================
    {
      slug: "comentarios",
      title: "Comentarios: hablar con el código",
      description:
        "Cómo dejar notas en tu código para tu yo del futuro (y para tus compañeros).",
      xpReward: 20,
      estimatedMinutes: 4,
      steps: [
        {
          type: "theory",
          markdown: `## Comentarios

Un **comentario** es texto que el compilador **ignora**. Sirve para explicarte a ti mismo (o a otra persona) **por qué** el código hace lo que hace.

En C++ hay dos formas:

\`\`\`cpp
// Esto es un comentario de UNA línea

/* Esto es un comentario
   que puede ocupar
   varias líneas */
\`\`\`

> ⚠️ Un buen comentario explica el **por qué**, no el *qué*. Si tu código necesita explicar *qué* hace, mejor renombra tus variables.`,
        },
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  // Saludamos al usuario
  cout << "Hola!" << endl;

  /* Próximamente:
     pedirle su nombre */
  return 0;
}`,
          explanation:
            "Compila y corre este código. Verás que los comentarios **no afectan** la salida — solo te ayudan a entender el código.",
          runnable: true,
          expectedOutput: "Hola!",
        },
        {
          type: "quiz",
          question:
            "¿Cuál de estos comentarios es válido en C++?",
          options: [
            "# este es un comentario",
            "<!-- comentario -->",
            "// comentario de una línea",
            "## comentario en bloque ##",
          ],
          correctIndex: 2,
          explanation:
            "C++ usa `//` para comentarios de una línea y `/* ... */` para varias líneas. `#` se usa al inicio para directivas como `#include`, no para comentarios. `<!-- -->` es de HTML.",
        },
      ],
    },

    // =====================================================================
    // Lección 5: Imprimir varias cosas
    // =====================================================================
    {
      slug: "imprimir-varias-cosas",
      title: "Imprimir varias cosas",
      description: "Cómo encadenar texto con `<<` y mostrar más de un mensaje.",
      xpReward: 25,
      estimatedMinutes: 5,
      steps: [
        {
          type: "theory",
          markdown: `## El operador \`<<\`

Pensar en \`<<\` como una **flecha que empuja datos hacia \`cout\`**:

\`\`\`cpp
cout << "Hola" << " " << "mundo!";
\`\`\`

Eso imprime: \`Hola mundo!\`

Puedes encadenar todo lo que quieras con \`<<\`. Cada \`<<\` empuja la siguiente cosa a la consola.`,
        },
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  cout << "Mi nombre es " << "Aurora" << ".";
  cout << " Tengo " << 19 << " años.";
  return 0;
}`,
          explanation:
            "Fíjate cómo encadenamos texto y número en la misma línea. **No necesitas comillas alrededor de los números**.",
          runnable: true,
          expectedOutput: "Mi nombre es Aurora. Tengo 19 años.",
        },
        {
          type: "fill_blank",
          template: `cout << "Hola, " {{0}} "soy" {{1}} " Aurora.";`,
          blanks: [
            { answer: "<<", hint: "Necesitas el operador de flujo dos veces más." },
            { answer: "<<", hint: "Es el mismo operador." },
          ],
          explanation: "`<<` se usa entre CADA pedazo que mandes a `cout`.",
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
        "Dos formas de hacer un salto de línea. Cuándo usar cada una.",
      xpReward: 25,
      estimatedMinutes: 5,
      steps: [
        {
          type: "theory",
          markdown: `## Dos formas, mismo resultado (casi)

Para hacer un salto de línea en la salida tienes dos opciones:

### Opción 1: \`endl\`
\`\`\`cpp
cout << "Línea 1" << endl;
cout << "Línea 2" << endl;
\`\`\`

### Opción 2: \`"\\n"\`
\`\`\`cpp
cout << "Línea 1\\n";
cout << "Línea 2\\n";
\`\`\`

**Las dos producen la misma salida.** La diferencia técnica es que \`endl\` además vacía el "buffer" (lo verás más adelante). Para empezar, **usa la que prefieras**.`,
        },
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  cout << "Hola," << endl;
  cout << "Esto es" << "\\n" << "otra línea.";
  return 0;
}`,
          explanation:
            "Mira la salida: hay un salto de línea entre \"Hola,\" y \"Esto es\", y otro entre \"Esto es\" y \"otra línea.\".",
          runnable: true,
          expectedOutput: `Hola,
Esto es
otra línea.`,
        },
        {
          type: "quiz",
          question:
            "¿Qué imprime esto?\n```cpp\ncout << \"a\" << endl << \"b\";\n```",
          options: [
            "ab",
            "a b",
            "a\\nb (en dos líneas)",
            "a endl b",
          ],
          correctIndex: 2,
          explanation:
            "`endl` inserta un salto de línea. La salida es:\n```\na\nb\n```",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Un poema de 3 líneas

Imprime exactamente este poema, con los saltos de línea correctos:

\`\`\`
Rosas son rojas,
violetas azules,
C++ es genial!
\`\`\``,
            difficulty: "easy",
            xpReward: 20,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // Escribe los 3 couts aquí

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Rosas son rojas," << endl;
  cout << "violetas azules," << endl;
  cout << "C++ es genial!" << endl;
  return 0;
}`,
            hints: [
              "Usa tres `cout` distintos, uno por línea.",
              "Termina cada uno con `<< endl;` para que haya salto de línea.",
              "Cuida la puntuación exacta: las comas en las primeras dos líneas y el signo de admiración al final.",
            ],
            testCases: [
              {
                expectedStdout: "Rosas son rojas,\nvioletas azules,\nC++ es genial!\n",
                visible: true,
                description: "Imprime las 3 líneas exactas del poema",
              },
            ],
          },
        },
      ],
    },
  ],
};
