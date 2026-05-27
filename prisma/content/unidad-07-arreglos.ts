import type { UnitDefinition } from "./types";

/**
 * Unidad 07 — Arreglos
 *
 * En el CETI los arreglos llegan justo después de cin: por fin tenemos
 * dónde guardar muchos datos del mismo tipo (calificaciones, alumnos,
 * mediciones). Cada lección es práctica primero, teoría después.
 * Patrón estable:
 *   code_example → quiz/fill_blank → code_challenge.
 * Ejemplos del CETI: notas, edades de grupo, asistencias, lista de IDs.
 */
export const unidad07: UnitDefinition = {
  slug: "arreglos",
  title: "Arreglos: muchos valores en una sola variable",
  description:
    "Cuando 5 calificaciones ya no caben en 5 variables sueltas. Declarar, recorrer, sumar, buscar.",
  icon: "🧮",
  published: true,
  lessons: [
    // =====================================================================
    // Lección 1: Qué es un arreglo
    // =====================================================================
    {
      slug: "arreglo-basico",
      title: "Tu primer arreglo",
      description:
        "Una sola variable que guarda varios valores del mismo tipo, numerados desde 0.",
      xpReward: 30,
      estimatedMinutes: 7,
      steps: [
        {
          type: "theory",
          markdown: `## Por qué existen los arreglos

Imagínate que tienes que guardar las 5 calificaciones de un alumno. Sin arreglos
te tocaría:

\`\`\`cpp
int cal1, cal2, cal3, cal4, cal5;
\`\`\`

Y si fueran 100... ya valió. Un **arreglo** es UNA sola variable que tiene
varios "compartimentos" (llamados **elementos**), todos del mismo tipo.

\`\`\`cpp
int notas[5];   // arreglo de 5 enteros, índices 0..4
\`\`\`

Los compartimentos se numeran **empezando en 0**. Para acceder a uno usas
\`notas[indice]\`.`,
        },
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int notas[5];      // declara un arreglo de 5 enteros
  notas[0] = 8;
  notas[1] = 9;
  notas[2] = 7;
  notas[3] = 10;
  notas[4] = 6;

  cout << "Primera: " << notas[0] << endl;
  cout << "Ultima: "  << notas[4] << endl;
  return 0;
}`,
          explanation:
            "`int notas[5];` reserva espacio para 5 enteros. Los accedes con `notas[0]` hasta `notas[4]`. **Nunca** `notas[5]` — ese índice no existe (el último válido es tamaño−1).",
          runnable: true,
          expectedOutput: "Primera: 8\nUltima: 6",
        },
        {
          type: "quiz",
          question:
            "Si declaras `int v[5];`, ¿cuál es el ÚLTIMO índice válido?",
          options: ["5", "4", "0", "Depende del compilador"],
          correctIndex: 1,
          explanation:
            "Un arreglo de tamaño 5 tiene índices `0, 1, 2, 3, 4`. El 5 ya está fuera — acceder a `v[5]` es un error clásico que da basura o crashea.",
        },
        {
          type: "fill_blank",
          template: `int edades[3];
edades[{{0}}] = 18;
edades[1] = 19;
edades[{{1}}] = 20;
cout << edades[2] << endl;`,
          blanks: [
            { answer: "0", hint: "El PRIMER índice." },
            { answer: "2", hint: "El ÚLTIMO índice de un arreglo de tamaño 3." },
          ],
          explanation:
            "Los índices van de `0` a `tamaño − 1`. Para `int edades[3];` son `0, 1, 2`.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Las tres notas

Declara un arreglo \`int notas[3];\`. Asigna los valores **7, 9 y 8** en ese
orden. Imprime cada uno en una línea distinta.

Salida esperada:

\`\`\`
7
9
8
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int notas[3];
  // asigna 7, 9, 8 en orden e imprime cada uno

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int notas[3];
  notas[0] = 7;
  notas[1] = 9;
  notas[2] = 8;
  cout << notas[0] << endl;
  cout << notas[1] << endl;
  cout << notas[2] << endl;
  return 0;
}`,
            hints: [
              "Empieza por `notas[0] = 7;` y baja desde ahí.",
              "Tres `cout` distintos, uno por elemento.",
              "Recuerda: el primer índice es 0, no 1.",
            ],
            testCases: [
              {
                expectedStdout: "7\n9\n8\n",
                visible: true,
                description: "Imprime los tres elementos en orden",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 2: Inicializar al declarar
    // =====================================================================
    {
      slug: "inicializar",
      title: "Inicializar el arreglo al declararlo",
      description:
        "Con llaves `{}` puedes llenar el arreglo en una sola línea.",
      xpReward: 30,
      estimatedMinutes: 6,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  // Inicialización en una línea
  int notas[5] = {7, 9, 8, 10, 6};

  cout << notas[0] << endl;
  cout << notas[3] << endl;
  return 0;
}`,
          explanation:
            "Con `{}` defines TODOS los valores al declarar. El tamaño entre `[]` y la cantidad de elementos en `{}` deben coincidir. Mucho menos código que asignar uno por uno.",
          runnable: true,
          expectedOutput: "7\n10",
        },
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  // Si dejas [] vacíos, el compilador cuenta los elementos
  int dias[] = {31, 28, 31, 30, 31, 30, 31};

  cout << dias[6] << endl;  // ultimo elemento, julio
  return 0;
}`,
          explanation:
            "Si dejas los corchetes **vacíos** (`int dias[]`), el compilador deduce el tamaño contando los elementos de `{}`. Aquí son 7.",
          runnable: true,
          expectedOutput: "31",
        },
        {
          type: "quiz",
          question:
            "¿Qué pasa con `int v[5] = {1, 2};`?",
          options: [
            "Error de compilación.",
            "Los 3 elementos restantes quedan en 0.",
            "Los 3 elementos restantes contienen basura.",
            "Solo crea un arreglo de tamaño 2.",
          ],
          correctIndex: 1,
          explanation:
            "Cuando das MENOS valores de los que caben, los faltantes se inicializan a `0` (en arreglos de enteros). Truco común: `int v[100] = {0};` para empezar todo en cero.",
        },
        {
          type: "fill_blank",
          template: `int asistencias[{{0}}] = {15, 18, 12, 20};
cout << asistencias[{{1}}] << endl;  // imprime 20`,
          blanks: [
            { answer: "4", hint: "Hay 4 valores entre llaves." },
            { answer: "3", hint: "El ÚLTIMO índice del arreglo." },
          ],
          explanation:
            "Cuatro valores → tamaño 4 → índices `0..3`. El último es `[3]`.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Días del fin de semana

Declara un arreglo \`string\` con los nombres **Sabado** y **Domingo** (en ese
orden) y imprímelos cada uno en una línea.

Salida esperada:

\`\`\`
Sabado
Domingo
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
  // declara el arreglo de strings e imprime los dos elementos

  return 0;
}`,
            solutionCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string fin[2] = {"Sabado", "Domingo"};
  cout << fin[0] << endl;
  cout << fin[1] << endl;
  return 0;
}`,
            hints: [
              "No olvides `#include <string>`.",
              "Usa `string fin[2] = {\"Sabado\", \"Domingo\"};`.",
              "Dos `cout`, uno por índice.",
            ],
            testCases: [
              {
                expectedStdout: "Sabado\nDomingo\n",
                visible: true,
                description: "Imprime los dos días",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 3: Recorrer con for
    // =====================================================================
    {
      slug: "recorrer-arreglo",
      title: "Recorrer un arreglo con for",
      description:
        "El verdadero poder de los arreglos: tocarlos todos con UN solo ciclo.",
      xpReward: 35,
      estimatedMinutes: 8,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int notas[5] = {7, 9, 8, 10, 6};

  // Recorre los 5 elementos
  for (int i = 0; i < 5; i++) {
    cout << notas[i] << endl;
  }
  return 0;
}`,
          explanation:
            "El patrón clásico: `for (int i = 0; i < N; i++)` donde N es el tamaño del arreglo. En cada vuelta `i` toma 0, 1, 2... hasta `N − 1`. Usas `notas[i]` para tocar cada elemento.",
          runnable: true,
          expectedOutput: "7\n9\n8\n10\n6",
        },
        {
          type: "quiz",
          question:
            "¿Por qué la condición del for es `i < 5` y no `i <= 5`?",
          options: [
            "Por estética.",
            "Porque los índices válidos son 0..4. Con `i <= 5` accederías a `notas[5]`, que NO existe.",
            "Da lo mismo, ambas funcionan.",
            "Porque el for siempre usa `<`.",
          ],
          correctIndex: 1,
          explanation:
            "Si pones `i <= 5`, en la última vuelta `i = 5` y `notas[5]` está fuera del arreglo. Es un bug clásico llamado *off-by-one*.",
        },
        {
          type: "fill_blank",
          template: `int v[4] = {10, 20, 30, 40};
for (int i = 0; i {{0}} 4; i{{1}}) {
  cout << v[i] << endl;
}`,
          blanks: [
            { answer: "<", hint: "Estrictamente menor que el tamaño." },
            { answer: "++", hint: "Avanza uno en cada vuelta." },
          ],
          explanation:
            "El for canónico para arreglos: empieza en `0`, condición `i < tamaño`, incremento `i++`.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Imprimir al revés

Tienes un arreglo \`int v[5] = {1, 2, 3, 4, 5};\`. Usa un \`for\` para imprimir
los elementos **del último al primero**, uno por línea.

Salida esperada:

\`\`\`
5
4
3
2
1
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int v[5] = {1, 2, 3, 4, 5};
  // for que recorra del 4 al 0

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[5] = {1, 2, 3, 4, 5};
  for (int i = 4; i >= 0; i--) {
    cout << v[i] << endl;
  }
  return 0;
}`,
            hints: [
              "Inicia el contador en `4` (último índice).",
              "Condición: `i >= 0` (hasta llegar al primero).",
              "Decremento: `i--` en lugar de `i++`.",
            ],
            testCases: [
              {
                expectedStdout: "5\n4\n3\n2\n1\n",
                visible: true,
                description: "Recorre el arreglo al revés",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 4: Llenar arreglo con cin
    // =====================================================================
    {
      slug: "leer-arreglo",
      title: "Llenar un arreglo desde el teclado",
      description:
        "Combina `cin` con un `for` para que el usuario meta los datos.",
      xpReward: 35,
      estimatedMinutes: 8,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int notas[3];

  // Pide los 3 valores
  for (int i = 0; i < 3; i++) {
    cin >> notas[i];
  }

  // Imprime los 3
  for (int i = 0; i < 3; i++) {
    cout << notas[i] << endl;
  }
  return 0;
}`,
          explanation:
            "Dos `for` separados: uno para leer, otro para imprimir. `cin >> notas[i]` mete el siguiente número en la casilla `i`.",
          runnable: true,
          expectedOutput: "",
        },
        {
          type: "quiz",
          question:
            "Si el usuario escribe `10 20 30` y haces `cin >> v[i]` en un for de 0 a 2, ¿qué guarda `v[1]`?",
          options: ["10", "20", "30", "Nada"],
          correctIndex: 1,
          explanation:
            "El primer `cin` se lleva `10` a `v[0]`, el segundo se lleva `20` a `v[1]`, el tercero `30` a `v[2]`. Los espacios separan los valores.",
        },
        {
          type: "fill_blank",
          template: `int n[4];
for (int i = 0; i < {{0}}; i++) {
  cin >> n[{{1}}];
}`,
          blanks: [
            { answer: "4", hint: "Tamaño del arreglo." },
            { answer: "i", hint: "El índice que va cambiando con el for." },
          ],
          explanation:
            "El truco está en que `i` cambia en cada vuelta: primero `n[0]`, después `n[1]`, etc. Sin la `i` no funcionaría — siempre escribirías sobre la misma casilla.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Eco del arreglo

Lee **5 enteros** del usuario y guárdalos en un arreglo. Luego imprímelos en
el MISMO orden, uno por línea.

Para el test, el sistema enviará: \`3 1 4 1 5\`.

Salida esperada:

\`\`\`
3
1
4
1
5
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int v[5];
  // un for para leer, otro para imprimir

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    cin >> v[i];
  }
  for (int i = 0; i < 5; i++) {
    cout << v[i] << endl;
  }
  return 0;
}`,
            hints: [
              "Primer for: `cin >> v[i];`",
              "Segundo for (igualito): `cout << v[i] << endl;`",
              "No combines en un solo for o se desordena la salida.",
            ],
            testCases: [
              {
                stdin: "3 1 4 1 5\n",
                expectedStdout: "3\n1\n4\n1\n5\n",
                visible: true,
                description: "Lee 5 valores e imprime cada uno",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 5: Suma y promedio
    // =====================================================================
    {
      slug: "suma-promedio",
      title: "Sumar y promediar un arreglo",
      description:
        "Acumulador + arreglo = todos los promedios del semestre.",
      xpReward: 35,
      estimatedMinutes: 8,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int notas[5] = {8, 9, 7, 10, 6};
  int suma = 0;                // acumulador FUERA del for

  for (int i = 0; i < 5; i++) {
    suma += notas[i];          // suma cada elemento
  }

  double promedio = suma / 5.0;
  cout << "Suma: " << suma << endl;
  cout << "Promedio: " << promedio << endl;
  return 0;
}`,
          explanation:
            "Combinas dos patrones que ya conoces: **acumulador** (suma = 0 antes, += dentro) + **recorrido** del arreglo. Para el promedio divides entre `5.0` (con punto), no entre `5`, para que dé decimales.",
          runnable: true,
          expectedOutput: "Suma: 40\nPromedio: 8",
        },
        {
          type: "quiz",
          question:
            "¿Por qué dividimos entre `5.0` y no entre `5`?",
          options: [
            "Por estética.",
            "Porque `suma / 5` da una división entera y se pierden los decimales.",
            "Porque `5.0` es más rápido.",
            "Da lo mismo, ambos dan el mismo resultado.",
          ],
          correctIndex: 1,
          explanation:
            "Si los dos operandos son enteros, C++ hace división entera: `7 / 2` da `3`, no `3.5`. Poner `5.0` fuerza a que sea división con decimales.",
        },
        {
          type: "fill_blank",
          template: `int v[4] = {2, 4, 6, 8};
int total = {{0}};
for (int i = 0; i < 4; i++) {
  total {{1}} v[i];
}
cout << total << endl;`,
          blanks: [
            { answer: "0", hint: "Acumulador empieza en cero." },
            { answer: "+=", hint: "Atajo de `total = total + v[i]`." },
          ],
          explanation:
            "Patrón fijo: acumulador en 0, dentro del for `total += v[i];`, cout DESPUÉS del for.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Promedio de 5 calificaciones

Lee **5 calificaciones enteras** del usuario, guárdalas en un arreglo, y
imprime el promedio (dividiendo entre \`5.0\`).

Para el test, el sistema enviará: \`8 9 7 10 6\` (promedio = 8).

Salida esperada:

\`\`\`
8
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int notas[5];
  // 1) lee los 5 valores
  // 2) súmalos en un acumulador
  // 3) imprime el promedio

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int notas[5];
  for (int i = 0; i < 5; i++) {
    cin >> notas[i];
  }

  int suma = 0;
  for (int i = 0; i < 5; i++) {
    suma += notas[i];
  }

  double promedio = suma / 5.0;
  cout << promedio << endl;
  return 0;
}`,
            hints: [
              "Tres bloques: lectura, suma, impresión.",
              "Acumulador `suma = 0` ANTES del for que suma.",
              "Divide entre `5.0` (con punto) para obtener decimales.",
            ],
            testCases: [
              {
                stdin: "8 9 7 10 6\n",
                expectedStdout: "8\n",
                visible: true,
                description: "Promedio de 8 9 7 10 6 es 8",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 6: Máximo (búsqueda)
    // =====================================================================
    {
      slug: "maximo",
      title: "Encontrar el mayor (y el menor)",
      description:
        "Otro patrón clásico: recorrer el arreglo recordando el mejor candidato.",
      xpReward: 40,
      estimatedMinutes: 9,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int notas[5] = {7, 9, 8, 10, 6};

  // Empieza suponiendo que el primero es el mayor
  int mayor = notas[0];

  // Recorre del segundo en adelante
  for (int i = 1; i < 5; i++) {
    if (notas[i] > mayor) {
      mayor = notas[i];
    }
  }

  cout << "El mayor es " << mayor << endl;
  return 0;
}`,
          explanation:
            "Estrategia: arranca asumiendo que el **primer** elemento es el mayor. Recorre del segundo (`i = 1`) en adelante: si encuentras uno más grande, lo guardas en `mayor`. Al final del for, `mayor` contiene el máximo real.",
          runnable: true,
          expectedOutput: "El mayor es 10",
        },
        {
          type: "quiz",
          question:
            "¿Qué problema tiene inicializar `int mayor = 0;` en lugar de `int mayor = notas[0];`?",
          options: [
            "Ninguno, los dos funcionan.",
            "Si todas las notas son negativas, `mayor` se queda en 0, que NO existe en el arreglo.",
            "C++ no permite asignar arreglo a entero.",
            "Es más lento.",
          ],
          correctIndex: 1,
          explanation:
            "Inicializar con `0` es un atajo peligroso: si todos los valores son negativos, el resultado sale mal. Siempre arranca con `notas[0]` para que `mayor` exista de verdad en el arreglo.",
        },
        {
          type: "fill_blank",
          template: `int v[4] = {3, 8, 5, 1};
int menor = v[{{0}}];
for (int i = 1; i < 4; i++) {
  if (v[i] {{1}} menor) {
    menor = v[i];
  }
}
cout << menor << endl;`,
          blanks: [
            { answer: "0", hint: "Arranca asumiendo que el primer elemento es el menor." },
            { answer: "<", hint: "Para MENOR, comparas si el actual es estrictamente más pequeño." },
          ],
          explanation:
            "Misma estructura que el máximo, solo cambias `>` por `<` y el nombre de la variable.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Máximo de calificaciones

Lee **5 calificaciones** del usuario y guárdalas en un arreglo. Imprime SOLO
la calificación más alta.

Para el test, el sistema enviará: \`7 9 8 10 6\`.

Salida esperada:

\`\`\`
10
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int notas[5];
  for (int i = 0; i < 5; i++) {
    cin >> notas[i];
  }

  // encuentra el mayor

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int notas[5];
  for (int i = 0; i < 5; i++) {
    cin >> notas[i];
  }

  int mayor = notas[0];
  for (int i = 1; i < 5; i++) {
    if (notas[i] > mayor) {
      mayor = notas[i];
    }
  }
  cout << mayor << endl;
  return 0;
}`,
            hints: [
              "Inicializa `int mayor = notas[0];`.",
              "El for arranca en `i = 1` (ya consideraste el 0).",
              "Dentro: `if (notas[i] > mayor) mayor = notas[i];`",
            ],
            testCases: [
              {
                stdin: "7 9 8 10 6\n",
                expectedStdout: "10\n",
                visible: true,
                description: "El máximo de [7,9,8,10,6] es 10",
              },
              {
                stdin: "1 2 3 4 5\n",
                expectedStdout: "5\n",
                visible: true,
                description: "Lista creciente, máximo al final",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 7: Integrador
    // =====================================================================
    {
      slug: "integrador-arreglos",
      title: "Integrador: boletín de calificaciones",
      description:
        "Pides 5 notas y entregas promedio, máximo y cuántas aprobaron.",
      xpReward: 55,
      estimatedMinutes: 12,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
  int notas[5];
  for (int i = 0; i < 5; i++) {
    cin >> notas[i];
  }

  int suma = 0;
  int mayor = notas[0];
  int aprobados = 0;

  for (int i = 0; i < 5; i++) {
    suma += notas[i];
    if (notas[i] > mayor) mayor = notas[i];
    if (notas[i] >= 7) aprobados++;
  }

  double promedio = suma / 5.0;
  cout << "Promedio: " << promedio << endl;
  cout << "Mayor: " << mayor << endl;
  cout << "Aprobados: " << aprobados << endl;
  return 0;
}`,
          explanation:
            "Truco profesional: **un solo recorrido** puede calcular muchas cosas a la vez. Aquí en una sola pasada se obtiene la suma, el máximo y el contador de aprobados. Cuando los arreglos son grandes, esto importa muchísimo.",
          runnable: true,
          expectedOutput: "",
        },
        {
          type: "quiz",
          question:
            "¿Qué necesita el contador `aprobados` para funcionar?",
          options: [
            "Declararse dentro del for con valor 0.",
            "Declararse fuera del for con valor 0 y hacerle `aprobados++` cuando se cumpla la condición.",
            "Ser un arreglo.",
            "No necesita inicializarse.",
          ],
          correctIndex: 1,
          explanation:
            "Igualito a la `suma`: el contador es un acumulador, debe vivir FUERA del for y empezar en 0. Dentro del for solo le sumas 1 (`aprobados++`) cuando la condición se cumple.",
        },
        {
          type: "fill_blank",
          template: `int reprobados = {{0}};
for (int i = 0; i < 5; i++) {
  if (notas[i] {{1}} 7) {
    reprobados++;
  }
}`,
          blanks: [
            { answer: "0", hint: "El contador parte de cero." },
            { answer: "<", hint: "Reprueba si la calificación es MENOR que 7." },
          ],
          explanation:
            "Mismo patrón que `aprobados`, pero con la condición invertida (`< 7`).",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Boletín completo

Lee **5 calificaciones** enteras del 0 al 10. Imprime **tres líneas** en este
orden:

1. \`Promedio: <p>\` (con \`<p>\` = suma / 5.0)
2. \`Mayor: <m>\` (la calificación más alta)
3. \`Aprobados: <a>\` (cuántas son \`>= 7\`)

Para el test, el sistema enviará: \`8 5 10 7 4\`.

- Suma = 34, promedio = 6.8
- Mayor = 10
- Aprobados = 3 (8, 10, 7)

Salida esperada:

\`\`\`
Promedio: 6.8
Mayor: 10
Aprobados: 3
\`\`\``,
            difficulty: "hard",
            xpReward: 45,
            starterCode: `#include <iostream>
using namespace std;

int main() {
  int notas[5];
  for (int i = 0; i < 5; i++) {
    cin >> notas[i];
  }

  // 1 acumulador para la suma
  // 1 variable para el mayor (inicia en notas[0])
  // 1 contador para los aprobados
  // un solo for resuelve todo

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int notas[5];
  for (int i = 0; i < 5; i++) {
    cin >> notas[i];
  }

  int suma = 0;
  int mayor = notas[0];
  int aprobados = 0;

  for (int i = 0; i < 5; i++) {
    suma += notas[i];
    if (notas[i] > mayor) mayor = notas[i];
    if (notas[i] >= 7) aprobados++;
  }

  double promedio = suma / 5.0;
  cout << "Promedio: " << promedio << endl;
  cout << "Mayor: " << mayor << endl;
  cout << "Aprobados: " << aprobados << endl;
  return 0;
}`,
            hints: [
              "Tres acumuladores ANTES del for: `suma`, `mayor` (en `notas[0]`), `aprobados`.",
              "Dentro del for, los tres se actualizan en la misma pasada.",
              "Divide entre `5.0` para que el promedio tenga decimales.",
            ],
            testCases: [
              {
                stdin: "8 5 10 7 4\n",
                expectedStdout: "Promedio: 6.8\nMayor: 10\nAprobados: 3\n",
                visible: true,
                description: "Caso típico: 3 aprobados, máximo 10",
              },
              {
                stdin: "10 10 10 10 10\n",
                expectedStdout: "Promedio: 10\nMayor: 10\nAprobados: 5\n",
                visible: true,
                description: "Todos 10: promedio 10, mayor 10, 5 aprobados",
              },
            ],
          },
        },
      ],
    },
  ],
};
