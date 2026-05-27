import type { UnitDefinition } from "./types";

/**
 * Unidad 07 — Arreglos
 *
 * Etapa AVANZADA del curso. Curva de autonomía notoria:
 * starter code mínimo, 2-3 code_challenges por lección
 * (fácil → medio → difícil). El alumno escribe el `int main()`,
 * los includes ya están pero todo el cuerpo es suyo.
 *
 * Patrón estable: code_example → quiz → fill_blank → challenge × N.
 * Ejemplos del CETI: notas, edades, asistencias, número de control.
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
      xpReward: 35,
      estimatedMinutes: 10,
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
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Las tres notas
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Las tres notas

Escribe un programa que:

1. Declare un arreglo \`int notas[3];\`.
2. Asigne **7, 9, 8** en orden (a \`notas[0]\`, \`notas[1]\`, \`notas[2]\`).
3. Imprima cada valor en una línea distinta.

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
              "Declara `int notas[3];` dentro de main.",
              "Asigna uno por uno con `notas[0] = 7;` etc.",
              "Tres `cout` distintos, uno por elemento.",
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
        // -----------------------------------------------------------------
        // Reto 2 (medio): Cambiar el del medio
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Cambiar el del medio

Declara \`int v[5];\` y asigna estos valores:

| Índice | Valor |
|--------|-------|
| 0      | 10    |
| 1      | 20    |
| 2      | 30    |
| 3      | 40    |
| 4      | 50    |

Después, **cambia** \`v[2]\` por el valor **999**. Imprime los 5 elementos del
arreglo en orden, **uno por línea**.

Salida esperada:

\`\`\`
10
20
999
40
50
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[5];
  v[0] = 10;
  v[1] = 20;
  v[2] = 30;
  v[3] = 40;
  v[4] = 50;

  v[2] = 999;

  cout << v[0] << endl;
  cout << v[1] << endl;
  cout << v[2] << endl;
  cout << v[3] << endl;
  cout << v[4] << endl;
  return 0;
}`,
            hints: [
              "Sí, te tocó escribir el `int main() { ... return 0; }` completo.",
              "Asignas los 5 valores, después sobreescribes `v[2] = 999;`.",
              "5 `cout` separados — uno por elemento.",
            ],
            testCases: [
              {
                expectedStdout: "10\n20\n999\n40\n50\n",
                visible: true,
                description: "Sustituye el del medio y conserva el resto",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Intercambio
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Intercambia primero y último

Declara \`int a[4];\` con los valores **1, 2, 3, 4** en orden. Después
**intercambia** \`a[0]\` con \`a[3]\` usando una variable auxiliar. Imprime
los cuatro elementos en orden, uno por línea.

> Pista: el truco clásico:
> \`int tmp = a[0]; a[0] = a[3]; a[3] = tmp;\`

Salida esperada:

\`\`\`
4
2
3
1
\`\`\``,
            difficulty: "hard",
            xpReward: 40,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int a[4];
  a[0] = 1;
  a[1] = 2;
  a[2] = 3;
  a[3] = 4;

  int tmp = a[0];
  a[0] = a[3];
  a[3] = tmp;

  cout << a[0] << endl;
  cout << a[1] << endl;
  cout << a[2] << endl;
  cout << a[3] << endl;
  return 0;
}`,
            hints: [
              "Empieza escribiendo el `int main()` y declarando `int a[4];`.",
              "Asigna los 4 valores uno por uno.",
              "El intercambio necesita una variable temporal — si sólo haces `a[0]=a[3]; a[3]=a[0];` pierdes el primer valor.",
            ],
            testCases: [
              {
                expectedStdout: "4\n2\n3\n1\n",
                visible: true,
                description: "Primero y último quedan intercambiados",
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
      xpReward: 35,
      estimatedMinutes: 9,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int main() {
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
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Días del fin de semana
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Fin de semana

Declara un arreglo de \`string\` con los nombres **Sabado** y **Domingo** (en
ese orden, sin acentos) e imprime cada uno en una línea separada.

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
`,
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
              "Falta el `int main() { ... return 0; }`.",
              "`string fin[2] = {\"Sabado\", \"Domingo\"};` inicializa todo en una línea.",
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
        // -----------------------------------------------------------------
        // Reto 2 (medio): Suma de extremos
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Suma de extremos

Inicializa \`int v[] = {10, 20, 30, 40, 50};\` (sin escribir el tamaño;
el compilador lo cuenta).

Imprime UNA sola línea con la suma del **primer** y **último** elemento.

Para este arreglo la suma es \`10 + 50 = 60\`.

Salida esperada:

\`\`\`
60
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[] = {10, 20, 30, 40, 50};
  cout << v[0] + v[4] << endl;
  return 0;
}`,
            hints: [
              "Inicializa con `int v[] = {10, 20, 30, 40, 50};`.",
              "El último índice es 4 (no 5).",
              "Imprime `v[0] + v[4]` directamente, sin variable auxiliar.",
            ],
            testCases: [
              {
                expectedStdout: "60\n",
                visible: true,
                description: "10 + 50 = 60",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Tabla del 5
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Tabla del 5

Sin pedirle nada al usuario, crea un arreglo de **5 enteros** que contenga
los primeros 5 múltiplos de 5: \`5, 10, 15, 20, 25\` (asígnalos como quieras:
con llaves o uno por uno).

Imprime los 5 elementos, uno por línea.

Salida esperada:

\`\`\`
5
10
15
20
25
\`\`\``,
            difficulty: "hard",
            xpReward: 35,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int tabla[5] = {5, 10, 15, 20, 25};
  cout << tabla[0] << endl;
  cout << tabla[1] << endl;
  cout << tabla[2] << endl;
  cout << tabla[3] << endl;
  cout << tabla[4] << endl;
  return 0;
}`,
            hints: [
              "Vía rápida: `int tabla[5] = {5, 10, 15, 20, 25};`.",
              "5 `cout` separados — uno por índice.",
              "Mañana lo harás con un for; hoy nos toca a mano para fijar el patrón.",
            ],
            testCases: [
              {
                expectedStdout: "5\n10\n15\n20\n25\n",
                visible: true,
                description: "Múltiplos de 5",
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
      xpReward: 40,
      estimatedMinutes: 11,
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
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Imprimir en orden
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Recorrido directo

Inicializa \`int v[6] = {2, 4, 6, 8, 10, 12};\`. Usa **un solo for** para
imprimir los 6 elementos en orden, uno por línea.

Salida esperada:

\`\`\`
2
4
6
8
10
12
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[6] = {2, 4, 6, 8, 10, 12};
  for (int i = 0; i < 6; i++) {
    cout << v[i] << endl;
  }
  return 0;
}`,
            hints: [
              "Te toca escribir todo el main desde cero.",
              "El for es `for (int i = 0; i < 6; i++)`.",
              "Dentro: `cout << v[i] << endl;`.",
            ],
            testCases: [
              {
                expectedStdout: "2\n4\n6\n8\n10\n12\n",
                visible: true,
                description: "Recorrido directo del arreglo",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Imprimir al revés
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Al revés

Inicializa \`int v[5] = {1, 2, 3, 4, 5};\`. Usa un \`for\` para imprimir los
elementos **del último al primero**, uno por línea.

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
`,
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
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Solo pares
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Solo posiciones pares

Inicializa \`int v[6] = {10, 11, 20, 21, 30, 31};\`.

Recorre el arreglo con un **único** for e imprime SOLO los elementos cuya
**posición** (índice) sea par (\`0, 2, 4\`).

Pista: dentro del for, usa un \`if (i % 2 == 0)\` para decidir si imprimes.

Salida esperada:

\`\`\`
10
20
30
\`\`\``,
            difficulty: "hard",
            xpReward: 40,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[6] = {10, 11, 20, 21, 30, 31};
  for (int i = 0; i < 6; i++) {
    if (i % 2 == 0) {
      cout << v[i] << endl;
    }
  }
  return 0;
}`,
            hints: [
              "El for sigue recorriendo TODOS los índices (0..5).",
              "Dentro pones `if (i % 2 == 0)` para imprimir solo cuando el índice es par.",
              "Otra opción: usar `i += 2` y arrancar en 0 — también vale.",
            ],
            testCases: [
              {
                expectedStdout: "10\n20\n30\n",
                visible: true,
                description: "Solo imprime v[0], v[2], v[4]",
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
      xpReward: 40,
      estimatedMinutes: 11,
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
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Eco del arreglo
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Eco del arreglo

Lee **5 enteros** desde \`cin\` y guárdalos en un arreglo \`int v[5];\`.
Luego imprímelos en el MISMO orden, uno por línea.

Para el test, el sistema enviará: \`3 1 4 1 5\`.

Salida esperada:

\`\`\`
3
1
4
1
5
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;
`,
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
              {
                stdin: "100 200 300 400 500\n",
                expectedStdout: "100\n200\n300\n400\n500\n",
                visible: false,
                description: "Funciona con valores grandes",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Leer e invertir
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Leer e invertir

Lee **5 enteros** desde \`cin\` y guárdalos en un arreglo. Imprime los valores
**en orden inverso**, uno por línea.

Para el test, el sistema enviará: \`10 20 30 40 50\`.

Salida esperada:

\`\`\`
50
40
30
20
10
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    cin >> v[i];
  }
  for (int i = 4; i >= 0; i--) {
    cout << v[i] << endl;
  }
  return 0;
}`,
            hints: [
              "Primer for `0..4` para leer.",
              "Segundo for `4..0` (decreciente) para imprimir invertido.",
              "No modifiques el arreglo — basta con recorrerlo al revés.",
            ],
            testCases: [
              {
                stdin: "10 20 30 40 50\n",
                expectedStdout: "50\n40\n30\n20\n10\n",
                visible: true,
                description: "Recorre invertido",
              },
              {
                stdin: "1 2 3 4 5\n",
                expectedStdout: "5\n4\n3\n2\n1\n",
                visible: false,
                description: "Caso de control",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Duplicar cada valor
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Duplicar cada valor

Lee **5 enteros** desde \`cin\`, guárdalos en un arreglo, **multiplícalos por
2** (modificando el arreglo en su lugar) y después imprime los nuevos valores
en orden, uno por línea.

Para el test, el sistema enviará: \`1 2 3 4 5\`.

Salida esperada:

\`\`\`
2
4
6
8
10
\`\`\``,
            difficulty: "hard",
            xpReward: 40,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    cin >> v[i];
  }
  for (int i = 0; i < 5; i++) {
    v[i] = v[i] * 2;
  }
  for (int i = 0; i < 5; i++) {
    cout << v[i] << endl;
  }
  return 0;
}`,
            hints: [
              "Puedes hacerlo con TRES fors (leer, multiplicar, imprimir) o combinar lectura y multiplicación.",
              "Para modificar en su lugar: `v[i] = v[i] * 2;` o `v[i] *= 2;`.",
              "Imprime DESPUÉS de multiplicar; si no, mostrarías los originales.",
            ],
            testCases: [
              {
                stdin: "1 2 3 4 5\n",
                expectedStdout: "2\n4\n6\n8\n10\n",
                visible: true,
                description: "Duplica cada uno",
              },
              {
                stdin: "0 7 13 20 25\n",
                expectedStdout: "0\n14\n26\n40\n50\n",
                visible: false,
                description: "Funciona con valores mixtos",
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
      xpReward: 45,
      estimatedMinutes: 12,
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
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Suma
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Suma de 5 enteros

Lee **5 enteros** con \`cin\`, guárdalos en un arreglo y calcula su **suma**.
Imprime SOLO la suma, sin texto.

Para el test, el sistema enviará: \`2 4 6 8 10\` (suma = 30).

Salida esperada:

\`\`\`
30
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    cin >> v[i];
  }

  int suma = 0;
  for (int i = 0; i < 5; i++) {
    suma += v[i];
  }

  cout << suma << endl;
  return 0;
}`,
            hints: [
              "Un for para leer, otro para sumar (o combínalos en uno).",
              "Acumulador `suma = 0` ANTES del for que suma.",
              "Solo imprime el total final, sin texto.",
            ],
            testCases: [
              {
                stdin: "2 4 6 8 10\n",
                expectedStdout: "30\n",
                visible: true,
                description: "Suma básica",
              },
              {
                stdin: "0 0 0 0 0\n",
                expectedStdout: "0\n",
                visible: false,
                description: "Todos ceros",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Promedio
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Promedio de 5 calificaciones

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
`,
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
                description: "Promedio entero",
              },
              {
                stdin: "10 10 10 10 5\n",
                expectedStdout: "9\n",
                visible: false,
                description: "Promedio con decimal redondeado por cout",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Contar mayores al promedio
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Cuántos superan el promedio

Lee **5 enteros** del usuario y guárdalos en un arreglo. Calcula el promedio
(\`suma / 5.0\`). Después cuenta CUÁNTOS de los 5 elementos son
**estrictamente mayores** que el promedio.

Imprime SOLO ese conteo.

Para el test, el sistema enviará: \`5 10 15 20 25\`.

- Promedio = \`75 / 5.0 = 15\`.
- Mayores estrictamente: \`20\` y \`25\` → **2**.

Salida esperada:

\`\`\`
2
\`\`\``,
            difficulty: "hard",
            xpReward: 45,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    cin >> v[i];
  }

  int suma = 0;
  for (int i = 0; i < 5; i++) {
    suma += v[i];
  }
  double promedio = suma / 5.0;

  int cuenta = 0;
  for (int i = 0; i < 5; i++) {
    if (v[i] > promedio) {
      cuenta++;
    }
  }
  cout << cuenta << endl;
  return 0;
}`,
            hints: [
              "Necesitas 3 fors: leer, sumar (para promedio), contar.",
              "Compara con `>` (estricto), no con `>=`.",
              "Imprime SOLO `cuenta`, sin texto.",
            ],
            testCases: [
              {
                stdin: "5 10 15 20 25\n",
                expectedStdout: "2\n",
                visible: true,
                description: "Caso ejemplo",
              },
              {
                stdin: "10 10 10 10 10\n",
                expectedStdout: "0\n",
                visible: false,
                description: "Todos iguales → 0 mayores",
              },
              {
                stdin: "1 2 3 4 100\n",
                expectedStdout: "1\n",
                visible: false,
                description: "Solo uno por encima",
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
      xpReward: 45,
      estimatedMinutes: 12,
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
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Máximo
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Máximo

Lee **5 enteros** del usuario y guárdalos en un arreglo. Imprime SOLO el
valor más alto.

Para el test, el sistema enviará: \`7 9 8 10 6\` (mayor = 10).

Salida esperada:

\`\`\`
10
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    cin >> v[i];
  }

  int mayor = v[0];
  for (int i = 1; i < 5; i++) {
    if (v[i] > mayor) mayor = v[i];
  }
  cout << mayor << endl;
  return 0;
}`,
            hints: [
              "Inicializa `mayor = v[0]` después de leer.",
              "El for arranca en `i = 1` (ya consideraste el 0).",
              "Solo imprime `mayor`, sin texto.",
            ],
            testCases: [
              {
                stdin: "7 9 8 10 6\n",
                expectedStdout: "10\n",
                visible: true,
                description: "Caso típico",
              },
              {
                stdin: "1 2 3 4 5\n",
                expectedStdout: "5\n",
                visible: false,
                description: "Creciente",
              },
              {
                stdin: "100 1 1 1 1\n",
                expectedStdout: "100\n",
                visible: false,
                description: "Máximo al inicio",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Mínimo
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Mínimo

Mismo input (5 enteros) que el reto anterior, pero ahora imprime el **menor**
valor del arreglo.

Para el test, el sistema enviará: \`7 9 3 10 6\`.

Salida esperada:

\`\`\`
3
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    cin >> v[i];
  }

  int menor = v[0];
  for (int i = 1; i < 5; i++) {
    if (v[i] < menor) menor = v[i];
  }
  cout << menor << endl;
  return 0;
}`,
            hints: [
              "Cambia `>` por `<` y el nombre de la variable a `menor`.",
              "Sigue arrancando con `menor = v[0];`.",
              "Sin texto, solo el número.",
            ],
            testCases: [
              {
                stdin: "7 9 3 10 6\n",
                expectedStdout: "3\n",
                visible: true,
                description: "Mínimo en el medio",
              },
              {
                stdin: "5 5 5 5 5\n",
                expectedStdout: "5\n",
                visible: false,
                description: "Todos iguales",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Posición del máximo
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Posición del máximo

Lee **5 enteros**. En lugar del valor, imprime la **posición (índice, base 0)**
del elemento más grande. Si hay empates, devuelve el índice de la **primera**
aparición (la más a la izquierda).

Para el test, el sistema enviará: \`7 9 8 10 6\`. El máximo es \`10\` y está en
índice **3**.

Salida esperada:

\`\`\`
3
\`\`\``,
            difficulty: "hard",
            xpReward: 45,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    cin >> v[i];
  }

  int idx = 0;
  for (int i = 1; i < 5; i++) {
    if (v[i] > v[idx]) {
      idx = i;
    }
  }
  cout << idx << endl;
  return 0;
}`,
            hints: [
              "Guarda el ÍNDICE, no el valor: `int idx = 0;`.",
              "Dentro del for, compara con `v[i] > v[idx]`.",
              "Para que empate gane el primero, usa `>` estricto, no `>=`.",
            ],
            testCases: [
              {
                stdin: "7 9 8 10 6\n",
                expectedStdout: "3\n",
                visible: true,
                description: "Máximo en posición 3",
              },
              {
                stdin: "5 5 5 5 5\n",
                expectedStdout: "0\n",
                visible: false,
                description: "Empate total → primera aparición",
              },
              {
                stdin: "1 2 3 4 5\n",
                expectedStdout: "4\n",
                visible: false,
                description: "Creciente, máximo al final",
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
        "Pides N notas y entregas promedio, máximo y cuántas aprobaron.",
      xpReward: 70,
      estimatedMinutes: 15,
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
        // -----------------------------------------------------------------
        // Reto 1 (medio): Boletín
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Boletín completo

Lee **5 calificaciones** enteras del 0 al 10. Imprime **tres líneas** en este
orden:

1. \`Promedio: <p>\` con \`<p>\` = suma / 5.0
2. \`Mayor: <m>\` (la más alta)
3. \`Aprobados: <a>\` (cuántas son \`>= 7\`)

Para el test, el sistema enviará: \`8 5 10 7 4\` (Suma=34, Promedio=6.8,
Mayor=10, Aprobados=3).

Salida esperada:

\`\`\`
Promedio: 6.8
Mayor: 10
Aprobados: 3
\`\`\``,
            difficulty: "medium",
            xpReward: 45,
            starterCode: `#include <iostream>
using namespace std;
`,
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
              "Un solo for hace todo en una pasada.",
              "Divide entre `5.0` para decimales.",
            ],
            testCases: [
              {
                stdin: "8 5 10 7 4\n",
                expectedStdout: "Promedio: 6.8\nMayor: 10\nAprobados: 3\n",
                visible: true,
                description: "Caso típico",
              },
              {
                stdin: "10 10 10 10 10\n",
                expectedStdout: "Promedio: 10\nMayor: 10\nAprobados: 5\n",
                visible: false,
                description: "Todos 10",
              },
              {
                stdin: "0 0 0 0 0\n",
                expectedStdout: "Promedio: 0\nMayor: 0\nAprobados: 0\n",
                visible: false,
                description: "Caso vacío de aprobados",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (difícil): Tres líneas con datos derivados del arreglo
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Estadísticas avanzadas

Lee **5 enteros** del usuario. Imprime **CUATRO líneas** exactamente en este
orden:

1. \`Minimo: <m>\` — el valor más pequeño del arreglo.
2. \`Maximo: <M>\` — el valor más grande.
3. \`Rango: <r>\` — diferencia \`Maximo − Minimo\`.
4. \`Suma sin extremos: <s>\` — suma de los 5 elementos **menos** el mínimo y
   menos el máximo (efectivamente: la suma de los 3 valores del medio).

Para el test, el sistema enviará: \`8 5 10 7 4\`.

- Mínimo = 4, Máximo = 10, Rango = 6.
- Suma total = 34. Sin mínimo (4) ni máximo (10) = **20**.

Salida esperada:

\`\`\`
Minimo: 4
Maximo: 10
Rango: 6
Suma sin extremos: 20
\`\`\``,
            difficulty: "hard",
            xpReward: 55,
            starterCode: `#include <iostream>
using namespace std;
`,
            solutionCode: `#include <iostream>
using namespace std;

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    cin >> v[i];
  }

  int suma = 0;
  int menor = v[0];
  int mayor = v[0];

  for (int i = 0; i < 5; i++) {
    suma += v[i];
    if (v[i] < menor) menor = v[i];
    if (v[i] > mayor) mayor = v[i];
  }

  int rango = mayor - menor;
  int sinExtremos = suma - menor - mayor;

  cout << "Minimo: " << menor << endl;
  cout << "Maximo: " << mayor << endl;
  cout << "Rango: " << rango << endl;
  cout << "Suma sin extremos: " << sinExtremos << endl;
  return 0;
}`,
            hints: [
              "Un solo for con tres updates en cada vuelta: suma += v[i], comparar con menor, comparar con mayor.",
              "Inicializa `menor = v[0]` y `mayor = v[0]` antes del for.",
              "Rango = mayor − menor. Suma sin extremos = suma − menor − mayor.",
            ],
            testCases: [
              {
                stdin: "8 5 10 7 4\n",
                expectedStdout: "Minimo: 4\nMaximo: 10\nRango: 6\nSuma sin extremos: 20\n",
                visible: true,
                description: "Caso típico",
              },
              {
                stdin: "1 2 3 4 5\n",
                expectedStdout: "Minimo: 1\nMaximo: 5\nRango: 4\nSuma sin extremos: 9\n",
                visible: false,
                description: "Creciente: 2+3+4 = 9",
              },
              {
                stdin: "7 7 7 7 7\n",
                expectedStdout: "Minimo: 7\nMaximo: 7\nRango: 0\nSuma sin extremos: 21\n",
                visible: false,
                description: "Todos iguales: rango 0, sin extremos = 35-7-7",
              },
            ],
          },
        },
      ],
    },
  ],
};
