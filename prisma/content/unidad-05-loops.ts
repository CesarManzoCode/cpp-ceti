import type { UnitDefinition } from "./types";

/**
 * Unidad 05 — Ciclos (loops)
 *
 * Por qué importa: repetir tareas es el verdadero salto del estudiante
 * que “sabe imprimir” al que “sabe programar”. Cada lección es
 *   code_example → fill_blank → (quiz) → code_challenge.
 * Ejemplos del CETI: pasar lista, sumar calificaciones, contar materias.
 */
export const unidad05: UnitDefinition = {
  slug: "loops",
  title: "Ciclos: repetir sin escribir cien veces",
  description:
    "while, for y do-while. Aprende a repetir tareas en lugar de copiar-pegar código.",
  icon: "🔁",
  published: true,
  lessons: [
    // =====================================================================
    // Lección 1: while
    // =====================================================================
    {
      slug: "while",
      title: "while: repetir mientras se cumpla una condición",
      description: "El ciclo más sencillo: repite mientras la condición sea verdadera.",
      xpReward: 30,
      estimatedMinutes: 6,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int contador = 1;
  while (contador <= 3) {
    cout << "Pase de lista " << contador << endl;
    contador++;
  }
  return 0;
}`,
          explanation:
            "`while (cond)` revisa la condición ANTES de cada repetición. `contador++` suma 1 a la variable; sin eso el ciclo sería infinito.",
          runnable: true,
          expectedOutput: `Pase de lista 1
Pase de lista 2
Pase de lista 3`,
        },
        {
          type: "quiz",
          question:
            "¿Qué pasa si olvidas el `contador++` en un while?",
          options: [
            "El programa imprime una sola vez y termina.",
            "Da error de compilación.",
            "Entra en ciclo infinito (loop sin fin).",
            "Salta el while completo.",
          ],
          correctIndex: 2,
          explanation:
            "Sin actualizar la variable de la condición, la condición nunca se vuelve falsa y el ciclo no termina. Bug clásico.",
        },
        {
          type: "fill_blank",
          template: `int materia = 1;
while ({{0}} <= 5) {
  cout << "Materia " << materia << endl;
  materia{{1}};
}`,
          blanks: [
            { answer: "materia", hint: "La misma variable que vas a actualizar." },
            { answer: "++", hint: "El operador que suma 1." },
          ],
          explanation:
            "La variable de la condición y la que actualizas deben ser la MISMA. Sin el `++` sería ciclo infinito.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Cuenta regresiva del semestre

Usa un \`while\` para imprimir del **5 al 1** (en orden descendente), uno por línea:

\`\`\`
5
4
3
2
1
\`\`\`

Pista: en lugar de \`++\` usa \`--\` para restar.`,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int n = 5;
  // while que imprima 5..1

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int n = 5;
  while (n >= 1) {
    cout << n << endl;
    n--;
  }
  return 0;
}`,
            hints: [
              "Empieza con `n = 5` y la condición `n >= 1`.",
              "Dentro del while: `cout << n` y luego `n--`.",
              "`n--` resta 1 (lo opuesto a `n++`).",
            ],
            testCases: [
              {
                expectedStdout: "5\n4\n3\n2\n1\n",
                visible: true,
                description: "Cuenta regresiva del 5 al 1",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 2: for
    // =====================================================================
    {
      slug: "for",
      title: "for: el ciclo cuando sabes cuántas veces",
      description:
        "Inicialización, condición y actualización en una sola línea.",
      xpReward: 30,
      estimatedMinutes: 7,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  for (int i = 1; i <= 5; i++) {
    cout << "Alumno #" << i << endl;
  }
  return 0;
}`,
          explanation:
            "`for (inicio; condición; paso)` reúne las 3 partes del while en una línea. Se lee: ‘empieza i en 1, mientras i ≤ 5, súmale 1 cada vuelta’.",
          runnable: true,
          expectedOutput: `Alumno #1
Alumno #2
Alumno #3
Alumno #4
Alumno #5`,
        },
        {
          type: "quiz",
          question:
            "¿Cuántas veces imprime este for?\n\n`for (int i = 0; i < 4; i++) { cout << i; }`",
          options: ["3 veces", "4 veces", "5 veces", "Infinitas"],
          correctIndex: 1,
          explanation:
            "Imprime con i = 0, 1, 2, 3 → cuatro veces. En 4 la condición `i < 4` ya es falsa y termina.",
        },
        {
          type: "fill_blank",
          template: `for (int i = 1; {{0}}; i++) {
  cout << i << endl;
}`,
          blanks: [
            { answer: "i <= 3", hint: "Condición para imprimir solo 1, 2 y 3." },
          ],
          explanation:
            "`i <= 3` corta cuando i pasa de 3. Si pusieras `i < 3`, solo imprimiría 1 y 2.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Lista de materias

Usa un \`for\` para imprimir:

\`\`\`
Materia 1
Materia 2
Materia 3
Materia 4
Materia 5
Materia 6
\`\`\`

(6 líneas, una por cada materia.)`,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // for de 1 a 6

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  for (int i = 1; i <= 6; i++) {
    cout << "Materia " << i << endl;
  }
  return 0;
}`,
            hints: [
              "Empieza con `int i = 1` y termina con `i <= 6`.",
              "Dentro del for: `cout << \"Materia \" << i << endl;`.",
              "Cuida el espacio antes del número (después de ‘Materia ’).",
            ],
            testCases: [
              {
                expectedStdout:
                  "Materia 1\nMateria 2\nMateria 3\nMateria 4\nMateria 5\nMateria 6\n",
                visible: true,
                description: "Las 6 materias en orden",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 3: do-while
    // =====================================================================
    {
      slug: "do-while",
      title: "do-while: al menos una vez",
      description:
        "Ejecuta el bloque primero y luego revisa la condición.",
      xpReward: 25,
      estimatedMinutes: 5,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int intento = 0;
  do {
    intento++;
    cout << "Intento " << intento << endl;
  } while (intento < 3);

  return 0;
}`,
          explanation:
            "`do { ... } while (cond);` ejecuta el bloque PRIMERO y después revisa la condición. Garantiza al menos UNA ejecución. Ojo al `;` final.",
          runnable: true,
          expectedOutput: `Intento 1
Intento 2
Intento 3`,
        },
        {
          type: "quiz",
          question:
            "Si la condición de un `do-while` es falsa desde el inicio, ¿cuántas veces se ejecuta el bloque?",
          options: ["0 veces", "1 vez", "Depende del compilador", "Infinitas"],
          correctIndex: 1,
          explanation:
            "El bloque se ejecuta ANTES de evaluar la condición. Por eso un `do-while` siempre corre al menos una vez.",
        },
        {
          type: "fill_blank",
          template: `int n = 10;
{{0}} {
  cout << n << endl;
  n--;
} {{1}} (n > 7);`,
          blanks: [
            { answer: "do", hint: "Palabra clave que abre el bloque." },
            { answer: "while", hint: "Va al final con la condición." },
          ],
          explanation:
            "El bloque va dentro de `do { ... }` y la condición va en el `while ( ... );` al final, con punto y coma.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Cuenta del 1 al 5 con do-while

Usa un \`do-while\` para imprimir del 1 al 5:

\`\`\`
1
2
3
4
5
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int i = 1;
  // do-while aquí

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int i = 1;
  do {
    cout << i << endl;
    i++;
  } while (i <= 5);
  return 0;
}`,
            hints: [
              "Estructura: `do { ... } while (cond);`.",
              "Dentro: imprime `i` y luego `i++`.",
              "La condición es `i <= 5`. No olvides el `;` al final.",
            ],
            testCases: [
              {
                expectedStdout: "1\n2\n3\n4\n5\n",
                visible: true,
                description: "Cuenta del 1 al 5",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 4: break y continue
    // =====================================================================
    {
      slug: "break-continue",
      title: "break y continue: salir o saltar",
      description:
        "Dos palabras para controlar el flujo dentro de un ciclo.",
      xpReward: 30,
      estimatedMinutes: 7,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  // break: sale del ciclo apenas se cumple
  for (int i = 1; i <= 10; i++) {
    if (i == 4) break;
    cout << i << endl;
  }

  cout << "---" << endl;

  // continue: salta esta vuelta y sigue con la siguiente
  for (int i = 1; i <= 5; i++) {
    if (i == 3) continue;
    cout << i << endl;
  }
  return 0;
}`,
          explanation:
            "`break` corta el ciclo de golpe. `continue` salta lo que falta de ESTA vuelta y va a la siguiente. Útiles para casos especiales sin anidar más ifs.",
          runnable: true,
          expectedOutput: `1
2
3
---
1
2
4
5`,
        },
        {
          type: "quiz",
          question:
            "¿Cuál es la diferencia entre `break` y `continue`?",
          options: [
            "Hacen lo mismo, son sinónimos.",
            "`break` salta una vuelta; `continue` sale del ciclo.",
            "`break` sale del ciclo; `continue` salta a la siguiente vuelta.",
            "Solo funcionan con `while`, no con `for`.",
          ],
          correctIndex: 2,
          explanation:
            "`break` termina el ciclo. `continue` se brinca lo que queda de la vuelta y va a la siguiente iteración.",
        },
        {
          type: "fill_blank",
          template: `for (int alumno = 1; alumno <= 10; alumno++) {
  if (alumno == 5) {
    {{0}};
  }
  cout << "Pase: " << alumno << endl;
}`,
          blanks: [
            { answer: "break", hint: "Detiene el ciclo por completo al llegar al 5." },
          ],
          explanation:
            "Con `break`, al llegar a 5 termina el ciclo. Solo imprime del 1 al 4.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Saltar el día de descanso

Usa un \`for\` del 1 al 7 (días de la semana). Con \`continue\`, **salta el día 4** (no lo imprimas). Para los demás, imprime el número.

Salida esperada:

\`\`\`
1
2
3
5
6
7
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // for con continue cuando i == 4

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  for (int i = 1; i <= 7; i++) {
    if (i == 4) continue;
    cout << i << endl;
  }
  return 0;
}`,
            hints: [
              "Dentro del for, primero el `if (i == 4) continue;`.",
              "Después imprime `cout << i << endl;`.",
              "Con `continue` saltas al `i++` sin imprimir.",
            ],
            testCases: [
              {
                expectedStdout: "1\n2\n3\n5\n6\n7\n",
                visible: true,
                description: "Imprime 1-7 sin el 4",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 5: Loops anidados
    // =====================================================================
    {
      slug: "loops-anidados",
      title: "Loops anidados: un ciclo dentro de otro",
      description:
        "Para tablas, rejillas y combinaciones (filas × columnas).",
      xpReward: 35,
      estimatedMinutes: 8,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  // 3 grupos × 2 alumnos cada uno
  for (int grupo = 1; grupo <= 3; grupo++) {
    for (int alumno = 1; alumno <= 2; alumno++) {
      cout << "G" << grupo << "-A" << alumno << " ";
    }
    cout << endl;
  }
  return 0;
}`,
          explanation:
            "Cada iteración del ciclo exterior ejecuta TODO el ciclo interior. Resultado: filas (grupo) × columnas (alumno).",
          runnable: true,
          expectedOutput: `G1-A1 G1-A2
G2-A1 G2-A2
G3-A1 G3-A2 `,
        },
        {
          type: "quiz",
          question:
            "Si el ciclo exterior corre 4 veces y el interior 3, ¿cuántas veces total se ejecuta el cuerpo del interior?",
          options: ["4", "3", "7", "12"],
          correctIndex: 3,
          explanation:
            "Multiplicas: 4 × 3 = 12. Por cada vuelta del exterior, el interior arranca de cero.",
        },
        {
          type: "fill_blank",
          template: `for (int i = 1; i <= 3; i++) {
  for (int j = 1; j <= 3; j++) {
    cout << i {{0}} j << " ";
  }
  cout << {{1}};
}`,
          blanks: [
            { answer: "*", hint: "Operador de multiplicación." },
            { answer: "endl", hint: "Salto de línea entre filas." },
          ],
          explanation:
            "`i * j` imprime la tabla. El `endl` AL TERMINAR el ciclo interior cambia de fila.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Tabla del 2

Usa dos \`for\` anidados (o uno solo con multiplicación, como prefieras) para imprimir las primeras 5 multiplicaciones de la tabla del 2:

\`\`\`
2 x 1 = 2
2 x 2 = 4
2 x 3 = 6
2 x 4 = 8
2 x 5 = 10
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  // for que imprima la tabla del 2, multiplicaciones 1 a 5

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  for (int i = 1; i <= 5; i++) {
    cout << "2 x " << i << " = " << 2 * i << endl;
  }
  return 0;
}`,
            hints: [
              "Con un solo `for` de 1 a 5 te basta.",
              "Encadena en el cout: texto, número, texto, multiplicación.",
              "La multiplicación es `2 * i` (sin comillas).",
            ],
            testCases: [
              {
                expectedStdout:
                  "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n",
                visible: true,
                description: "Tabla del 2 del 1 al 5",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 6: Acumuladores
    // =====================================================================
    {
      slug: "acumuladores",
      title: "Acumuladores: sumar y contar dentro de un ciclo",
      description:
        "Patrón clásico para totales, promedios y contadores.",
      xpReward: 40,
      estimatedMinutes: 8,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int suma = 0;            // empieza en 0 ANTES del ciclo
  for (int i = 1; i <= 10; i++) {
    suma = suma + i;       // o equivalente: suma += i;
  }
  cout << "Total: " << suma << endl;
  return 0;
}`,
          explanation:
            "Patrón acumulador: declara una variable fuera del ciclo, súmale algo en cada vuelta. `suma += i;` es atajo para `suma = suma + i;`.",
          runnable: true,
          expectedOutput: "Total: 55",
        },
        {
          type: "quiz",
          question:
            "¿Por qué la variable `suma` se declara FUERA del for?",
          options: [
            "Por estética nada más.",
            "Si la declaras dentro, se reinicia a 0 en cada vuelta y nunca acumula.",
            "C++ no permite declarar variables dentro de un for.",
            "Para que sea visible solo dentro del for.",
          ],
          correctIndex: 1,
          explanation:
            "Una variable declarada dentro del bloque del for se crea de nuevo cada iteración. Para acumular, tiene que existir desde antes y sobrevivir entre vueltas.",
        },
        {
          type: "fill_blank",
          template: `int contador = {{0}};
for (int i = 1; i <= 5; i++) {
  contador {{1}} 1;
}
cout << contador << endl;`,
          blanks: [
            { answer: "0", hint: "Valor inicial del contador." },
            { answer: "+=", hint: "Atajo para `contador = contador + 1`." },
          ],
          explanation:
            "Empezar en `0` e ir sumando `1` por vuelta cuenta cuántas veces dio la vuelta el ciclo. `+=` es el atajo común.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Suma de calificaciones

Usa un \`for\` del 1 al 5 y, dentro, suma cada \`i\` a un acumulador. Imprime SOLO el total final.

La suma de 1+2+3+4+5 es 15, así que la salida esperada es:

\`\`\`
15
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int suma = 0;
  // for que sume 1..5 en suma

  cout << suma << endl;
  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int suma = 0;
  for (int i = 1; i <= 5; i++) {
    suma += i;
  }
  cout << suma << endl;
  return 0;
}`,
            hints: [
              "`suma` ya está declarada fuera con valor 0.",
              "Dentro del for: `suma += i;` (o `suma = suma + i;`).",
              "El cout va DESPUÉS del for, no dentro.",
            ],
            testCases: [
              {
                expectedStdout: "15\n",
                visible: true,
                description: "1+2+3+4+5 = 15",
              },
            ],
          },
        },
      ],
    },
  ],
};
