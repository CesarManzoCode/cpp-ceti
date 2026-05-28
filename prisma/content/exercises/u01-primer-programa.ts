import type { PracticeUnitSetDefinition } from "./types";

/**
 * Ejercicios de práctica — Unidad 01: Tu primer programa
 *
 * Solo se usan conceptos de la unidad: cout, endl, "\n", comentarios.
 * Sin variables, sin cin, sin condicionales.
 *
 * Calibración de dificultad (RELATIVA a U1):
 *   easy   — starter casi completo + 3 hints directas
 *   medium — starter con main shell vacío + 2 hints
 *   hard   — starter solo `#include` + 1-2 hints indicativas
 */
export const u01PrimerProgramaExercises: PracticeUnitSetDefinition = {
  unitSlug: "primer-programa",
  unitTitle: "Tu primer programa en C++",
  unitIcon: "🚀",
  exercises: [
    // -----------------------------------------------------------------
    // EASY × 3
    // -----------------------------------------------------------------
    {
      slug: "u01-firma",
      title: "Firma tu primer programa",
      description: "Imprime una sola línea con tu nombre.",
      difficulty: "easy",
      xpReward: 12,
      prompt: `## Firma

Imprime exactamente:

\`\`\`
Aurora Lopez
\`\`\`

Usa un solo \`cout\` con \`endl\` al final.`,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  // Imprime "Aurora Lopez" aquí

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Aurora Lopez" << endl;
  return 0;
}`,
      hints: [
        "Usa `cout << \"...\" << endl;` con el texto entre comillas dobles.",
        "El texto debe ser exactamente `Aurora Lopez` (sin acento).",
        "No olvides el `;` al final de la línea.",
      ],
      testCases: [
        {
          expectedStdout: "Aurora Lopez\n",
          visible: true,
          description: "Imprime la firma exacta",
        },
      ],
    },
    {
      slug: "u01-eco-doble",
      title: "Eco doble",
      description: "Imprime una misma frase dos veces en líneas separadas.",
      difficulty: "easy",
      xpReward: 12,
      prompt: `## Eco doble

Imprime exactamente:

\`\`\`
CETI Colomos
CETI Colomos
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  // Imprime "CETI Colomos" dos veces, una por línea

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "CETI Colomos" << endl;
  cout << "CETI Colomos" << endl;
  return 0;
}`,
      hints: [
        "Dos `cout` separados, uno por línea.",
        "Cada uno termina con `<< endl;`.",
        "El texto es idéntico en las dos líneas.",
      ],
      testCases: [
        {
          expectedStdout: "CETI Colomos\nCETI Colomos\n",
          visible: true,
          description: "Misma frase en dos líneas",
        },
      ],
    },
    {
      slug: "u01-tres-saludos",
      title: "Tres saludos",
      description: "Tres líneas distintas, una por cout.",
      difficulty: "easy",
      xpReward: 14,
      prompt: `## Tres saludos

Imprime exactamente:

\`\`\`
Hola
Hola Mundo
Hola CETI
\`\`\`

Una llamada a \`cout\` por línea.`,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  // 3 cout, uno por línea

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Hola" << endl;
  cout << "Hola Mundo" << endl;
  cout << "Hola CETI" << endl;
  return 0;
}`,
      hints: [
        "Tres `cout` distintos, en el orden exacto del enunciado.",
        "Cada uno con `<< endl;` al final.",
        "Cuida el espacio entre `Hola` y `Mundo` / `CETI`.",
      ],
      testCases: [
        {
          expectedStdout: "Hola\nHola Mundo\nHola CETI\n",
          visible: true,
          description: "Tres saludos en orden",
        },
      ],
    },

    // -----------------------------------------------------------------
    // MEDIUM × 3
    // -----------------------------------------------------------------
    {
      slug: "u01-ficha-alumno",
      title: "Ficha del alumno",
      description: "Imprime 4 líneas con datos personales.",
      difficulty: "medium",
      xpReward: 18,
      prompt: `## Ficha del alumno

Imprime EXACTAMENTE estas 4 líneas:

\`\`\`
Nombre: Aurora
Carrera: Desarrollo de Software
Semestre: 5
CETI Colomos
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Nombre: Aurora" << endl;
  cout << "Carrera: Desarrollo de Software" << endl;
  cout << "Semestre: 5" << endl;
  cout << "CETI Colomos" << endl;
  return 0;
}`,
      hints: [
        "Cuatro `cout` distintos, uno por línea.",
        "Cuida los `:` con el espacio después y los textos exactos.",
      ],
      testCases: [
        {
          expectedStdout:
            "Nombre: Aurora\nCarrera: Desarrollo de Software\nSemestre: 5\nCETI Colomos\n",
          visible: true,
          description: "Las 4 líneas en orden",
        },
      ],
    },
    {
      slug: "u01-encadena-frase",
      title: "Frase encadenada",
      description: "Un solo cout que mezcla texto y números literales.",
      difficulty: "medium",
      xpReward: 18,
      prompt: `## Frase encadenada

Usando **UN solo \`cout\`**, imprime:

\`\`\`
Tengo 19 anios y curso el semestre 5 con 8.7 de promedio
\`\`\`

Los números **19**, **5** y **8.7** van como literales numéricos (sin comillas), encadenados con \`<<\`.`,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "Tengo " << 19 << " anios y curso el semestre " << 5
       << " con " << 8.7 << " de promedio" << endl;
  return 0;
}`,
      hints: [
        "Encadena con `<<`: texto, número, texto, número... siempre con `<<` entre cada cosa.",
        "Los números SIN comillas (`<< 19 <<`, no `<< \"19\" <<`).",
      ],
      testCases: [
        {
          expectedStdout:
            "Tengo 19 anios y curso el semestre 5 con 8.7 de promedio\n",
          visible: true,
          description: "Texto + números literales encadenados",
        },
      ],
    },
    {
      slug: "u01-marco-ascii",
      title: "Marco ASCII",
      description: "Imprime una pequeña caja con texto en el medio.",
      difficulty: "medium",
      xpReward: 20,
      prompt: `## Marco ASCII

Imprime exactamente esta caja:

\`\`\`
+-------------+
| CETI 2026 |
+-------------+
\`\`\`

Cuida los espacios — la segunda línea es \`| CETI 2026 |\` (un espacio dentro de las barras).`,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "+-------------+" << endl;
  cout << "| CETI 2026 |" << endl;
  cout << "+-------------+" << endl;
  return 0;
}`,
      hints: [
        "Tres `cout` separados, las dos líneas de borde son idénticas.",
        "Cuenta los caracteres: cada línea de borde lleva exactamente 13 `-`.",
      ],
      testCases: [
        {
          expectedStdout:
            "+-------------+\n| CETI 2026 |\n+-------------+\n",
          visible: true,
          description: "Caja con borde superior e inferior",
        },
      ],
    },

    // -----------------------------------------------------------------
    // HARD × 2
    // -----------------------------------------------------------------
    {
      slug: "u01-tarjeta-semestre",
      title: "Tarjeta del semestre",
      description: "Programa completo desde cero — solo tienes los includes.",
      difficulty: "hard",
      xpReward: 25,
      prompt: `## Tarjeta del semestre

Imprime esta tarjeta exactamente (incluyendo los saltos en blanco):

\`\`\`
====================
   CETI Colomos
====================
Carrera: Mecatronica
Semestre: 5
Anio: 2026
\`\`\`

Notas:
- La línea \`====================\` tiene **20** signos de igual.
- Hay 3 líneas de encabezado y 3 líneas de datos.`,
      starterCode: `#include <iostream>
using namespace std;
`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "====================" << endl;
  cout << "   CETI Colomos" << endl;
  cout << "====================" << endl;
  cout << "Carrera: Mecatronica" << endl;
  cout << "Semestre: 5" << endl;
  cout << "Anio: 2026" << endl;
  return 0;
}`,
      hints: [
        "Te toca escribir `int main()` y el `return 0;`.",
        "Seis `cout`, uno por línea, en el orden exacto.",
      ],
      testCases: [
        {
          expectedStdout:
            "====================\n   CETI Colomos\n====================\nCarrera: Mecatronica\nSemestre: 5\nAnio: 2026\n",
          visible: true,
          description: "Tarjeta de 6 líneas",
        },
      ],
    },
    {
      slug: "u01-banner-cpp",
      title: "Banner C++",
      description: "Construye un banner ASCII desde cero.",
      difficulty: "hard",
      xpReward: 28,
      prompt: `## Banner ASCII de C++

Imprime EXACTAMENTE este banner:

\`\`\`
###  ###  ###
 #    #    #
 #    #    #
###  ###  ###

Bienvenido al curso
\`\`\`

Detalles:
- 4 líneas del banner.
- Una **línea en blanco**.
- Una línea final \`Bienvenido al curso\`.

Tip: para una línea en blanco, basta \`cout << endl;\` (sin texto).`,
      starterCode: `#include <iostream>
using namespace std;
`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  cout << "###  ###  ###" << endl;
  cout << " #    #    #" << endl;
  cout << " #    #    #" << endl;
  cout << "###  ###  ###" << endl;
  cout << endl;
  cout << "Bienvenido al curso" << endl;
  return 0;
}`,
      hints: [
        "La línea en blanco se imprime con `cout << endl;` (sin texto).",
        "Cuenta los espacios al inicio de las líneas 2 y 3 — un espacio antes de cada `#`.",
      ],
      testCases: [
        {
          expectedStdout:
            "###  ###  ###\n #    #    #\n #    #    #\n###  ###  ###\n\nBienvenido al curso\n",
          visible: true,
          description: "Banner + línea vacía + saludo",
        },
      ],
    },
  ],
};
