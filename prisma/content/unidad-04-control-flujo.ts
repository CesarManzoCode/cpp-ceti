import type { UnitDefinition } from "./types";

/**
 * Unidad 04 — Control de flujo
 *
 * El alumno aprende a tomar decisiones en código. Patrón por lección:
 *   code_example → fill_blank → (quiz opcional) → code_challenge.
 * Ejemplos anclados al CETI: calificaciones, aprobado/reprobado,
 * elección de carrera, semestre actual.
 */
export const unidad04: UnitDefinition = {
  slug: "control-de-flujo",
  title: "Control de flujo",
  description:
    "Haz que tu programa tome decisiones con if, else y switch. Pura práctica con casos del CETI.",
  icon: "🔀",
  published: true,
  lessons: [
    // =====================================================================
    // Lección 1: Comparaciones
    // =====================================================================
    {
      slug: "comparaciones",
      title: "Comparaciones que devuelven true o false",
      description:
        "Los 6 operadores de comparación y cómo se evalúan.",
      xpReward: 25,
      estimatedMinutes: 5,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int calificacion = 8;
  cout << (calificacion >= 7) << endl;  // 1 (true)
  cout << (calificacion == 10) << endl; // 0 (false)
  cout << (calificacion != 6) << endl;  // 1 (true)
  return 0;
}`,
          explanation:
            "Los operadores de comparación (`==`, `!=`, `<`, `>`, `<=`, `>=`) devuelven `1` si es cierto y `0` si no. Ojo: `==` compara, `=` asigna.",
          runnable: true,
          expectedOutput: `1
0
1`,
        },
        {
          type: "quiz",
          question:
            "¿Cuál es la diferencia entre `=` y `==` en C++?",
          options: [
            "Son iguales, da lo mismo cuál uses.",
            "`=` asigna un valor; `==` compara dos valores.",
            "`=` compara; `==` asigna.",
            "`==` solo funciona con strings.",
          ],
          correctIndex: 1,
          explanation:
            "`=` mete un valor en una variable (`x = 5`). `==` pregunta si dos cosas son iguales (`x == 5`). Confundirlos es uno de los bugs más comunes.",
        },
        {
          type: "fill_blank",
          template: `int promedio = 9;
bool aprobado = promedio {{0}} 7;
bool excelente = promedio {{1}} 9;`,
          blanks: [
            { answer: ">=", hint: "Mayor o igual." },
            { answer: "==", hint: "Comparación exacta (no asignación)." },
          ],
          explanation:
            "`>=` para ‘mayor o igual a’. `==` para ‘exactamente igual a’. Cada uno devuelve un `bool`.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Estado de la calificación

Declara \`int calificacion = 7;\` e imprime tres líneas con el resultado de estas comparaciones (cada una imprime \`1\` o \`0\`):

\`\`\`
1
0
1
\`\`\`

En orden: \`calificacion >= 7\`, \`calificacion > 8\`, \`calificacion != 10\`.`,
            difficulty: "easy",
            xpReward: 20,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int calificacion = 7;
  // Imprime las 3 comparaciones, una por línea

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int calificacion = 7;
  cout << (calificacion >= 7) << endl;
  cout << (calificacion > 8) << endl;
  cout << (calificacion != 10) << endl;
  return 0;
}`,
            hints: [
              "Cada comparación va entre paréntesis dentro del `cout`.",
              "`>=` es mayor-o-igual; `>` es estrictamente mayor.",
              "Acuérdate del `endl` al final de cada línea.",
            ],
            testCases: [
              {
                expectedStdout: "1\n0\n1\n",
                visible: true,
                description: "Tres comparaciones en orden",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 2: if básico
    // =====================================================================
    {
      slug: "if-basico",
      title: "Tomar decisiones con if",
      description: "Ejecuta código solo cuando una condición es verdadera.",
      xpReward: 25,
      estimatedMinutes: 6,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int calificacion = 8;

  if (calificacion >= 7) {
    cout << "Aprobado" << endl;
  }

  return 0;
}`,
          explanation:
            "`if (condición) { ... }` ejecuta el bloque SOLO si la condición es verdadera. Si es falsa, lo salta y sigue con el resto.",
          runnable: true,
          expectedOutput: "Aprobado",
        },
        {
          type: "fill_blank",
          template: `int faltas = 2;

{{0}} (faltas {{1}} 3) {
  cout << "Aun puedes presentar" << endl;
}`,
          blanks: [
            { answer: "if", hint: "La palabra clave para condicional." },
            { answer: "<", hint: "Faltas menores a 3." },
          ],
          explanation:
            "`if` evalúa la condición y entra al bloque solo si es verdadera. Con `faltas = 2` y `< 3` el resultado es true.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## ¿Tienes beca?

Declara \`int promedio = 9;\`.

Si el promedio es **mayor o igual a 9**, imprime exactamente:

\`\`\`
Calificas para beca
\`\`\`

Si no, no imprimas nada.`,
            difficulty: "easy",
            xpReward: 20,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int promedio = 9;
  // Tu if aquí

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int promedio = 9;
  if (promedio >= 9) {
    cout << "Calificas para beca" << endl;
  }
  return 0;
}`,
            hints: [
              "Estructura: `if (condicion) { ... }`.",
              "La condición es `promedio >= 9`.",
              "El `cout` va DENTRO de las llaves `{ }`.",
            ],
            testCases: [
              {
                expectedStdout: "Calificas para beca\n",
                visible: true,
                description: "Promedio 9 cumple la condición",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 3: if-else
    // =====================================================================
    {
      slug: "if-else",
      title: "if y else: el camino alternativo",
      description: "Ejecuta una cosa cuando la condición es verdadera y otra cuando es falsa.",
      xpReward: 30,
      estimatedMinutes: 6,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int calificacion = 5;

  if (calificacion >= 7) {
    cout << "Aprobado" << endl;
  } else {
    cout << "Reprobado" << endl;
  }

  return 0;
}`,
          explanation:
            "`else` define qué pasa cuando el `if` es falso. Se ejecuta UNO de los dos bloques, nunca los dos.",
          runnable: true,
          expectedOutput: "Reprobado",
        },
        {
          type: "fill_blank",
          template: `int edad = 17;

if (edad >= 18) {
  cout << "Puedes inscribirte solo" << endl;
} {{0}} {
  cout << "Necesitas firma del tutor" << endl;
}`,
          blanks: [
            { answer: "else", hint: "Palabra clave que se ejecuta si el `if` fue falso." },
          ],
          explanation:
            "`else` va DESPUÉS del bloque `if` y NO lleva condición — atrapa todo lo que no cumplió el if.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Aprobado o reprobado

Declara \`int calificacion = 6;\`.

Si la calificación es **mayor o igual a 7**, imprime \`Aprobado\`.
Si no, imprime \`Reprobado\`.

Con \`calificacion = 6\` la salida esperada es:

\`\`\`
Reprobado
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int calificacion = 6;
  // if/else aquí

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int calificacion = 6;
  if (calificacion >= 7) {
    cout << "Aprobado" << endl;
  } else {
    cout << "Reprobado" << endl;
  }
  return 0;
}`,
            hints: [
              "Estructura: `if (cond) { ... } else { ... }`.",
              "Usa `>= 7` como condición.",
              "Cada bloque tiene su propio `cout`.",
            ],
            testCases: [
              {
                expectedStdout: "Reprobado\n",
                visible: true,
                description: "6 NO es ≥ 7, entra al else",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 4: else if (encadenamiento)
    // =====================================================================
    {
      slug: "else-if",
      title: "Encadenar condiciones con else if",
      description: "Cuando tienes más de dos caminos posibles.",
      xpReward: 35,
      estimatedMinutes: 7,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int calificacion = 8;

  if (calificacion == 10) {
    cout << "Excelente" << endl;
  } else if (calificacion >= 8) {
    cout << "Muy bien" << endl;
  } else if (calificacion >= 7) {
    cout << "Aprobado" << endl;
  } else {
    cout << "Reprobado" << endl;
  }

  return 0;
}`,
          explanation:
            "Los `else if` se evalúan en orden, de arriba a abajo. En cuanto uno cumple, se ejecuta y se ignora el resto. El `else` final atrapa todo lo demás.",
          runnable: true,
          expectedOutput: "Muy bien",
        },
        {
          type: "quiz",
          question:
            "Si `calificacion = 10`, ¿qué imprime el ejemplo anterior?",
          options: [
            "Excelente",
            "Excelente y Muy bien",
            "Muy bien",
            "Aprobado",
          ],
          correctIndex: 0,
          explanation:
            "El `if` se cumple primero (`== 10`), imprime `Excelente` y los demás `else if` ni se evalúan.",
        },
        {
          type: "fill_blank",
          template: `int semestre = 3;

if (semestre <= 2) {
  cout << "Tronco comun" << endl;
} {{0}} (semestre <= 4) {
  cout << "Mitad de carrera" << endl;
} else {
  cout << "Especialidad" << endl;
}`,
          blanks: [
            { answer: "else if", hint: "Dos palabras separadas por un espacio." },
          ],
          explanation:
            "`else if` es la forma de encadenar más condiciones. Se evalúa SOLO si el `if` anterior fue falso.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Clasificar la calificación

Declara \`int cal = 9;\` y clasifícala así:

- Si \`cal == 10\` → imprime \`Excelente\`
- Si \`cal >= 8\` → imprime \`Muy bien\`
- Si \`cal >= 7\` → imprime \`Aprobado\`
- En cualquier otro caso → imprime \`Reprobado\`

Con \`cal = 9\` la salida esperada es:

\`\`\`
Muy bien
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int cal = 9;
  // if / else if / else aquí

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int cal = 9;
  if (cal == 10) {
    cout << "Excelente" << endl;
  } else if (cal >= 8) {
    cout << "Muy bien" << endl;
  } else if (cal >= 7) {
    cout << "Aprobado" << endl;
  } else {
    cout << "Reprobado" << endl;
  }
  return 0;
}`,
            hints: [
              "Empieza por la condición MÁS estricta (`== 10`).",
              "Luego baja: `>= 8`, después `>= 7`.",
              "El `else` final no lleva condición.",
            ],
            testCases: [
              {
                expectedStdout: "Muy bien\n",
                visible: true,
                description: "9 cae en el rango ≥ 8",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 5: Operadores lógicos
    // =====================================================================
    {
      slug: "operadores-logicos",
      title: "Operadores lógicos: && || !",
      description:
        "Combina varias condiciones en una sola con AND, OR y NOT.",
      xpReward: 35,
      estimatedMinutes: 7,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int promedio = 9;
  int faltas = 1;

  // AND: ambas deben ser verdaderas
  if (promedio >= 9 && faltas <= 2) {
    cout << "Tienes beca" << endl;
  }

  // OR: con que UNA sea verdadera basta
  if (promedio == 10 || faltas == 0) {
    cout << "Mencion especial" << endl;
  }

  // NOT: invierte el valor
  bool inscrito = false;
  if (!inscrito) {
    cout << "Aun no estas inscrito" << endl;
  }

  return 0;
}`,
          explanation:
            "`&&` (AND) pide que **ambas** condiciones sean verdaderas. `||` (OR) basta con **una**. `!` (NOT) invierte: convierte true en false.",
          runnable: true,
          expectedOutput: `Tienes beca
Aun no estas inscrito`,
        },
        {
          type: "quiz",
          question:
            "Con `int x = 5;`, ¿cuál evalúa a `true`?",
          options: [
            "`x > 10 && x < 3`",
            "`x > 0 || x < -100`",
            "`!(x == 5)`",
            "`x == 5 && x != 5`",
          ],
          correctIndex: 1,
          explanation:
            "`x > 0` es true → `||` corta y devuelve true sin importar la segunda parte. Esto se llama ‘evaluación de corto-circuito’.",
        },
        {
          type: "fill_blank",
          template: `int edad = 18;
bool tutor_acepta = true;

if (edad >= 18 {{0}} tutor_acepta) {
  cout << "Puedes inscribirte" << endl;
}`,
          blanks: [
            { answer: "||", hint: "OR: con una basta." },
          ],
          explanation:
            "Con `||`, si ya eres mayor de edad NO necesitas firma; pero también puedes inscribirte si el tutor acepta aunque seas menor.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## ¿Promedio para beca?

Declara:
- \`int promedio = 9;\`
- \`int faltas = 1;\`

Imprime \`Beca\` SOLO si el promedio es **>= 9 Y** las faltas son **<= 2**. Si no se cumple, imprime \`Sin beca\`.

Con esos valores la salida esperada es:

\`\`\`
Beca
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int promedio = 9;
  int faltas = 1;
  // if/else con && aquí

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int promedio = 9;
  int faltas = 1;
  if (promedio >= 9 && faltas <= 2) {
    cout << "Beca" << endl;
  } else {
    cout << "Sin beca" << endl;
  }
  return 0;
}`,
            hints: [
              "Usa `&&` para unir las dos condiciones.",
              "La estructura es `if (cond1 && cond2) { ... } else { ... }`.",
              "Ambas condiciones tienen que cumplirse para entrar al if.",
            ],
            testCases: [
              {
                expectedStdout: "Beca\n",
                visible: true,
                description: "9 ≥ 9 y 1 ≤ 2 → ambas cumplen",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 6: switch
    // =====================================================================
    {
      slug: "switch",
      title: "switch / case: cuando hay muchos valores fijos",
      description:
        "Alternativa al if-else-if cuando comparas una variable contra valores constantes.",
      xpReward: 35,
      estimatedMinutes: 8,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int semestre = 3;

  switch (semestre) {
    case 1:
      cout << "Recien llegado" << endl;
      break;
    case 2:
    case 3:
      cout << "Tronco comun" << endl;
      break;
    case 4:
    case 5:
      cout << "Especialidad" << endl;
      break;
    default:
      cout << "Semestre fuera de rango" << endl;
  }

  return 0;
}`,
          explanation:
            "`switch` compara una variable contra varios `case`. **`break`** evita que ‘caiga’ al siguiente case. **`default`** atrapa lo que no coincidió.",
          runnable: true,
          expectedOutput: "Tronco comun",
        },
        {
          type: "quiz",
          question:
            "¿Qué pasa si olvidas el `break` en un `case`?",
          options: [
            "Compila pero no entra a ningún case.",
            "El programa se queda colgado.",
            "Cae al siguiente case y ejecuta su código también (fall-through).",
            "Da error de compilación.",
          ],
          correctIndex: 2,
          explanation:
            "Sin `break`, el switch sigue ejecutando los siguientes cases hasta encontrar uno con break. A veces es a propósito (como agrupar 2 y 3 arriba), a veces es un bug.",
        },
        {
          type: "fill_blank",
          template: `char grupo = 'B';

switch (grupo) {
  case 'A':
    cout << "Mañana" << endl;
    {{0}};
  case 'B':
    cout << "Tarde" << endl;
    {{0}};
  {{1}}:
    cout << "Grupo desconocido" << endl;
}`,
          blanks: [
            { answer: "break", hint: "Lo que termina el case actual." },
            { answer: "default", hint: "El caso ‘ninguno de los anteriores’." },
          ],
          explanation:
            "Cada `case` necesita su `break`. `default` atrapa cualquier valor que no haya hecho match.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Día de la semana

Declara \`int dia = 3;\` y usa un \`switch\` para imprimir el nombre del día (lunes = 1, martes = 2, miércoles = 3, ..., domingo = 7). Para cualquier otro valor, imprime \`Dia invalido\`.

Con \`dia = 3\` la salida esperada es:

\`\`\`
miercoles
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int dia = 3;
  // switch / case aquí

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int dia = 3;
  switch (dia) {
    case 1: cout << "lunes" << endl; break;
    case 2: cout << "martes" << endl; break;
    case 3: cout << "miercoles" << endl; break;
    case 4: cout << "jueves" << endl; break;
    case 5: cout << "viernes" << endl; break;
    case 6: cout << "sabado" << endl; break;
    case 7: cout << "domingo" << endl; break;
    default: cout << "Dia invalido" << endl;
  }
  return 0;
}`,
            hints: [
              "Un `case` por cada día del 1 al 7.",
              "Cada case necesita su `break` para no caer al siguiente.",
              "Termina con `default:` para valores fuera del rango.",
            ],
            testCases: [
              {
                expectedStdout: "miercoles\n",
                visible: true,
                description: "Día 3 imprime miercoles",
              },
            ],
          },
        },
      ],
    },
  ],
};
