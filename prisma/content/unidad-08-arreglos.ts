import type { UnitDefinition } from "./types";

/**
 * Unidad 08 — Arreglos
 *
 * Etapa AVANZADA del curso. Curva de autonomía notoria:
 * starter code mínimo, 2-3 code_challenges por lección
 * (fácil → medio → difícil). El alumno escribe el `int main()`,
 * los includes ya están pero todo el cuerpo es suyo.
 *
 * I/O con printf/scanf (esta unidad va después de la 07 de printf/scanf,
 * a partir de la cual el CETI deja de usar cout/cin). Doubles con %.2f.
 * Patrón estable: code_example → quiz → fill_blank → challenge × N.
 * Ejemplos del CETI: notas, edades, asistencias, número de control.
 */
export const unidad08: UnitDefinition = {
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
          code: `#include <stdio.h>

int main() {
  int notas[5];      // declara un arreglo de 5 enteros
  notas[0] = 8;
  notas[1] = 9;
  notas[2] = 7;
  notas[3] = 10;
  notas[4] = 6;

  printf("Primera: %i\\n", notas[0]);
  printf("Ultima: %i\\n", notas[4]);
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
          prompt: "Declara el arreglo de tamaño `4` y asigna por índice: primero `0`, tercero `2`, último `3`.",
          template: `// Boletín de 4 calificaciones
int notas[{{0}}];

notas[{{1}}] = 8;        // primer indice
notas[1] = {{2}};        // valor 9
notas[{{3}}] = 7;        // tercera posicion
notas[3] = {{4}};        // valor 10

printf("Primera: %i\\n", notas[{{5}}]);
printf("Ultima:   %i\\n", notas[{{6}}]);`,
          blanks: [
            { answer: "4", hint: "El arreglo guarda 4 calificaciones." },
            { answer: "0", hint: "El PRIMER índice." },
            { answer: "9", hint: "El valor que indica el comentario." },
            { answer: "2", hint: "Tercera posición — índice 2 (recuerda: empieza en 0)." },
            { answer: "10", hint: "El valor que indica el comentario." },
            { answer: "0", hint: "Primer índice del arreglo." },
            { answer: "3", hint: "Último índice de un arreglo de tamaño 4." },
          ],
          explanation:
            "Para asignar usas `notas[i] = valor;` — el corchete es el índice (0 a tamaño − 1).",
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
3. Imprima cada valor en una línea distinta (con \`printf\` y \`%i\`).

Salida esperada:

\`\`\`
7
9
8
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int notas[3];
  notas[0] = 7;
  notas[1] = 9;
  notas[2] = 8;
  printf("%i\\n", notas[0]);
  printf("%i\\n", notas[1]);
  printf("%i\\n", notas[2]);
  return 0;
}`,
            hints: [
              "Declara `int notas[3];` dentro de main.",
              "Asigna uno por uno con `notas[0] = 7;` etc.",
              "Tres `printf(\"%i\\n\", notas[i]);` — uno por elemento.",
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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  v[0] = 10;
  v[1] = 20;
  v[2] = 30;
  v[3] = 40;
  v[4] = 50;

  v[2] = 999;

  printf("%i\\n", v[0]);
  printf("%i\\n", v[1]);
  printf("%i\\n", v[2]);
  printf("%i\\n", v[3]);
  printf("%i\\n", v[4]);
  return 0;
}`,
            hints: [
              "Sí, te tocó escribir el `int main() { ... return 0; }` completo.",
              "Asignas los 5 valores, después sobreescribes `v[2] = 999;`.",
              "5 `printf` separados — uno por elemento, todos con `%i`.",
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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int a[4];
  a[0] = 1;
  a[1] = 2;
  a[2] = 3;
  a[3] = 4;

  int tmp = a[0];
  a[0] = a[3];
  a[3] = tmp;

  printf("%i\\n", a[0]);
  printf("%i\\n", a[1]);
  printf("%i\\n", a[2]);
  printf("%i\\n", a[3]);
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
          code: `#include <stdio.h>

int main() {
  int notas[5] = {7, 9, 8, 10, 6};

  printf("%i\\n", notas[0]);
  printf("%i\\n", notas[3]);
  return 0;
}`,
          explanation:
            "Con `{}` defines TODOS los valores al declarar. El tamaño entre `[]` y la cantidad de elementos en `{}` deben coincidir. Mucho menos código que asignar uno por uno.",
          runnable: true,
          expectedOutput: "7\n10",
        },
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  // Si dejas [] vacíos, el compilador cuenta los elementos
  int dias[] = {31, 28, 31, 30, 31, 30, 31};

  printf("%i\\n", dias[6]);   // ultimo elemento, julio
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
          prompt: "Inicializa con llaves `{}` los días de enero a mayo (`31, 28, 31, 30, 31`) y accede por índice base `0`.",
          template: `// Inicializa días del mes para enero, febrero, marzo, abril, mayo
{{0}} dias[5] = { {{1}}, {{2}}, 31, {{3}}, {{4}} };

printf("Enero:   %i\\n", dias[0]);
printf("Febrero: %i\\n", dias[{{5}}]);
printf("Mayo:    %i\\n", dias[{{6}}]);`,
          blanks: [
            { answer: "int", hint: "Tipo de cada elemento (enteros)." },
            { answer: "31", hint: "Días que tiene enero." },
            { answer: "28", hint: "Días que tiene febrero (año no bisiesto)." },
            { answer: "30", hint: "Días que tiene abril." },
            { answer: "31", hint: "Días que tiene mayo." },
            { answer: "1", hint: "Índice de febrero (segundo del arreglo)." },
            { answer: "4", hint: "Índice de mayo (quinto del arreglo)." },
          ],
          explanation:
            "Con `{}` defines TODOS los valores al declarar. La cantidad de valores debe coincidir con el tamaño entre `[]` (o dejar `[]` vacíos para que el compilador cuente).",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Arreglo de strings con %s
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Fin de semana

Declara un arreglo de cadenas con \`const char* fin[2] = {"Sabado", "Domingo"};\`
e imprime cada elemento en una línea separada usando \`printf\` con el
especificador **\`%s\`** (para cadenas).

Salida esperada:

\`\`\`
Sabado
Domingo
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  const char* fin[2] = {"Sabado", "Domingo"};
  printf("%s\\n", fin[0]);
  printf("%s\\n", fin[1]);
  return 0;
}`,
            hints: [
              "Falta el `int main() { ... return 0; }`.",
              "Para arreglos de cadenas en estilo C usa `const char*` (no `string`).",
              "`%s` es el especificador para imprimir cadenas con `printf`.",
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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[] = {10, 20, 30, 40, 50};
  printf("%i\\n", v[0] + v[4]);
  return 0;
}`,
            hints: [
              "Inicializa con `int v[] = {10, 20, 30, 40, 50};`.",
              "El último índice es 4 (no 5).",
              "Imprime `v[0] + v[4]` con `printf(\"%i\\n\", v[0] + v[4]);`.",
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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int tabla[5] = {5, 10, 15, 20, 25};
  printf("%i\\n", tabla[0]);
  printf("%i\\n", tabla[1]);
  printf("%i\\n", tabla[2]);
  printf("%i\\n", tabla[3]);
  printf("%i\\n", tabla[4]);
  return 0;
}`,
            hints: [
              "Vía rápida: `int tabla[5] = {5, 10, 15, 20, 25};`.",
              "5 `printf` separados — uno por índice.",
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
          code: `#include <stdio.h>

int main() {
  int notas[5] = {7, 9, 8, 10, 6};

  // Recorre los 5 elementos
  for (int i = 0; i < 5; i++) {
    printf("%i\\n", notas[i]);
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
          prompt: "Completa el `for` con índice inicial `0`, condición `< 5`, `++` y acumula en `suma` con `+=`.",
          template: `int v[5] = {10, 20, 30, 40, 50};
int suma = {{0}};

{{1}} (int i = {{2}}; i {{3}} 5; i{{4}}) {
  printf("%i\\n", v[i]);
  suma {{5}} v[i];
}

printf("Total: %i\\n", {{6}});`,
          blanks: [
            { answer: "0", hint: "El acumulador empieza en cero." },
            { answer: "for", hint: "El ciclo que recorre arreglos por índice." },
            { answer: "0", hint: "Primer índice del arreglo." },
            { answer: "<", hint: "Estrictamente menor que el tamaño." },
            { answer: "++", hint: "Incrementa el contador en uno por vuelta." },
            { answer: "+=", hint: "Atajo de `suma = suma + v[i]`." },
            { answer: "suma", hint: "La variable acumulada que declaraste arriba." },
          ],
          explanation:
            "El for canónico recorre desde 0 hasta tamaño − 1. Dentro puedes hacer varias cosas a la vez: imprimir, sumar, comparar... siempre con `v[i]` (el `i` cambia en cada vuelta).",
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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[6] = {2, 4, 6, 8, 10, 12};
  for (int i = 0; i < 6; i++) {
    printf("%i\\n", v[i]);
  }
  return 0;
}`,
            hints: [
              "Te toca escribir todo el main desde cero.",
              "El for es `for (int i = 0; i < 6; i++)`.",
              "Dentro: `printf(\"%i\\n\", v[i]);`.",
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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[5] = {1, 2, 3, 4, 5};
  for (int i = 4; i >= 0; i--) {
    printf("%i\\n", v[i]);
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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[6] = {10, 11, 20, 21, 30, 31};
  for (int i = 0; i < 6; i++) {
    if (i % 2 == 0) {
      printf("%i\\n", v[i]);
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
    // Lección 4: Llenar arreglo con scanf
    // =====================================================================
    {
      slug: "leer-arreglo",
      title: "Llenar un arreglo desde el teclado",
      description:
        "Combina `scanf` con un `for` para que el usuario meta los datos.",
      xpReward: 40,
      estimatedMinutes: 11,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>

int main() {
  int notas[3];

  // Pide los 3 valores
  for (int i = 0; i < 3; i++) {
    scanf("%i", &notas[i]);
  }

  // Imprime los 3
  for (int i = 0; i < 3; i++) {
    printf("%i\\n", notas[i]);
  }
  return 0;
}`,
          explanation:
            "Dos `for` separados: uno para leer, otro para imprimir. `scanf(\"%i\", &notas[i])` mete el siguiente número en la casilla `i`. NO olvides el `&` antes de `notas[i]`.",
          runnable: true,
          expectedOutput: "",
        },
        {
          type: "quiz",
          question:
            "Si el usuario escribe `10 20 30` y haces `scanf(\"%i\", &v[i])` en un for de 0 a 2, ¿qué guarda `v[1]`?",
          options: ["10", "20", "30", "Nada"],
          correctIndex: 1,
          explanation:
            "El primer `scanf` se lleva `10` a `v[0]`, el segundo se lleva `20` a `v[1]`, el tercero `30` a `v[2]`. Los espacios y saltos de línea separan los valores.",
        },
        {
          type: "fill_blank",
          prompt: "Lee con `scanf` usando `&notas[i]`, luego imprime al revés con `for` de `4` a `0` y `i--`.",
          template: `// Lee 5 calificaciones y luego imprímelas en orden inverso
int notas[{{0}}];

// Lectura
for ({{1}} i = 0; i < 5; i++) {
  scanf("%i", {{2}}notas[{{3}}]);
}

// Impresión invertida
for (int i = {{4}}; i {{5}} 0; i--) {
  printf("%i\\n", notas[{{6}}]);
}`,
          blanks: [
            { answer: "5", hint: "Tamaño del arreglo." },
            { answer: "int", hint: "Tipo del contador del for." },
            { answer: "&", hint: "Símbolo OBLIGATORIO antes del lugar donde guardar." },
            { answer: "i", hint: "El índice variable que cambia en cada vuelta." },
            { answer: "4", hint: "Último índice (tamaño − 1)." },
            { answer: ">=", hint: "Sigue mientras el índice siga siendo válido (incluye 0)." },
            { answer: "i", hint: "El índice variable, igual que arriba." },
          ],
          explanation:
            "Dos `for` distintos: uno para leer (0 → 4) y otro para imprimir invertido (4 → 0). El `&notas[i]` en scanf es indispensable — sin el `&` el programa crashea.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Eco del arreglo
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Eco del arreglo

Lee **5 enteros** desde \`scanf\` y guárdalos en un arreglo \`int v[5];\`.
Luego imprímelos con \`printf\` en el MISMO orden, uno por línea.

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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
  }
  for (int i = 0; i < 5; i++) {
    printf("%i\\n", v[i]);
  }
  return 0;
}`,
            hints: [
              "Primer for: `scanf(\"%i\", &v[i]);` — no olvides el `&`.",
              "Segundo for (igualito): `printf(\"%i\\n\", v[i]);`.",
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

Lee **5 enteros** desde \`scanf\` y guárdalos en un arreglo. Imprime los
valores **en orden inverso**, uno por línea.

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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
  }
  for (int i = 4; i >= 0; i--) {
    printf("%i\\n", v[i]);
  }
  return 0;
}`,
            hints: [
              "Primer for `0..4` para leer con `&v[i]`.",
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

Lee **5 enteros** desde \`scanf\`, guárdalos en un arreglo, **multiplícalos
por 2** (modificando el arreglo en su lugar) y después imprime los nuevos
valores en orden, uno por línea.

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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
  }
  for (int i = 0; i < 5; i++) {
    v[i] = v[i] * 2;
  }
  for (int i = 0; i < 5; i++) {
    printf("%i\\n", v[i]);
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
          code: `#include <stdio.h>

int main() {
  int notas[5] = {8, 9, 7, 10, 6};
  int suma = 0;                // acumulador FUERA del for

  for (int i = 0; i < 5; i++) {
    suma += notas[i];          // suma cada elemento
  }

  double promedio = suma / 5.0;
  printf("Suma: %i\\n", suma);
  printf("Promedio: %.2f\\n", promedio);
  return 0;
}`,
          explanation:
            "Combinas dos patrones que ya conoces: **acumulador** (suma = 0 antes, += dentro) + **recorrido** del arreglo. Para el promedio divides entre `5.0` (con punto), no entre `5`, para que dé decimales. Lo imprimes con `%.2f` (2 decimales).",
          runnable: true,
          expectedOutput: "Suma: 40\nPromedio: 8.00",
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
          prompt: "Acumula con `suma += notas[i]` y calcula el promedio como `double` dividiendo entre `5.0`.",
          template: `int notas[5];
for (int i = 0; i < 5; i++) {
  scanf("%i", &notas[i]);
}

// Acumulador para la suma
int suma = {{0}};

for (int i = 0; i {{1}} 5; i{{2}}) {
  suma {{3}} notas[i];
}

// Promedio con decimales
{{4}} promedio = suma / {{5}};

printf("Suma: %i\\n", {{6}});
printf("Promedio: %.2f\\n", promedio);`,
          blanks: [
            { answer: "0", hint: "Acumulador empieza en cero." },
            { answer: "<", hint: "Estrictamente menor que el tamaño." },
            { answer: "++", hint: "Incremento de uno por vuelta." },
            { answer: "+=", hint: "Atajo de `suma = suma + notas[i]`." },
            { answer: "double", hint: "Tipo con decimales para el promedio." },
            { answer: "5.0", hint: "Forza división con decimales (no entero)." },
            { answer: "suma", hint: "La variable acumulada que declaraste arriba." },
          ],
          explanation:
            "Acumulador FUERA del for, `+=` DENTRO del for, división entre `5.0` (con punto) para conservar decimales. Para imprimir int → `%i`, para double → `%.2f`.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Suma
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Suma de 5 enteros

Lee **5 enteros** con \`scanf\`, guárdalos en un arreglo y calcula su
**suma**. Imprime SOLO la suma, sin texto.

Para el test, el sistema enviará: \`2 4 6 8 10\` (suma = 30).

Salida esperada:

\`\`\`
30
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
  }

  int suma = 0;
  for (int i = 0; i < 5; i++) {
    suma += v[i];
  }

  printf("%i\\n", suma);
  return 0;
}`,
            hints: [
              "Un for para leer con `scanf`, otro para sumar (o combínalos en uno).",
              "Acumulador `suma = 0` ANTES del for que suma.",
              "Solo imprime el total final con `printf(\"%i\\n\", suma);`, sin texto.",
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
imprime el promedio (dividiendo entre \`5.0\`) con **2 decimales**.

Para el test, el sistema enviará: \`8 9 7 10 6\` (promedio = 8.00).

Salida esperada:

\`\`\`
8.00
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int notas[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &notas[i]);
  }

  int suma = 0;
  for (int i = 0; i < 5; i++) {
    suma += notas[i];
  }

  double promedio = suma / 5.0;
  printf("%.2f\\n", promedio);
  return 0;
}`,
            hints: [
              "Tres bloques: lectura con scanf, suma, impresión.",
              "Acumulador `suma = 0` ANTES del for que suma.",
              "Divide entre `5.0` (con punto) e imprime con `%.2f`.",
            ],
            testCases: [
              {
                stdin: "8 9 7 10 6\n",
                expectedStdout: "8.00\n",
                visible: true,
                description: "Promedio exacto, 2 decimales",
              },
              {
                stdin: "10 10 10 10 5\n",
                expectedStdout: "9.00\n",
                visible: false,
                description: "Promedio 9.0",
              },
              {
                stdin: "8 5 10 7 4\n",
                expectedStdout: "6.80\n",
                visible: false,
                description: "Promedio con decimal: 6.80",
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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
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
  printf("%i\\n", cuenta);
  return 0;
}`,
            hints: [
              "Necesitas 3 fors: leer, sumar (para promedio), contar.",
              "Compara con `>` (estricto), no con `>=`.",
              "Imprime SOLO `cuenta` con `%i`, sin texto.",
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
          code: `#include <stdio.h>

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

  printf("El mayor es %i\\n", mayor);
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
          prompt: "Inicializa `mayor` y `menor` con `v[0]`, arranca el `for` en `1` y compara con `>` y `<`.",
          template: `int v[5];
for (int i = 0; i < 5; i++) {
  scanf("%i", &v[i]);
}

// Inicializa AMBAS con el primer elemento
int mayor = v[{{0}}];
int menor = v[{{1}}];

// Arranca del SEGUNDO (ya consideraste el primero)
for (int i = {{2}}; i < 5; i++) {
  if (v[i] {{3}} mayor) {
    {{4}} = v[i];
  }
  if (v[i] {{5}} menor) {
    menor = v[i];
  }
}

printf("Mayor: %i\\n", {{6}});
printf("Menor: %i\\n", menor);`,
          blanks: [
            { answer: "0", hint: "Primer índice." },
            { answer: "0", hint: "Primer índice (mismo que mayor)." },
            { answer: "1", hint: "El segundo elemento; el primero ya está considerado." },
            { answer: ">", hint: "Para MAYOR, estrictamente mayor." },
            { answer: "mayor", hint: "La variable que va guardando el máximo." },
            { answer: "<", hint: "Para MENOR, estrictamente menor." },
            { answer: "mayor", hint: "Variable del máximo, para el printf." },
          ],
          explanation:
            "Truco: una sola pasada calcula el máximo Y el mínimo. Cada `if` actualiza una variable independiente. Inicializa AMBAS con `v[0]` para que funcionen aunque todos los valores sean negativos.",
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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
  }

  int mayor = v[0];
  for (int i = 1; i < 5; i++) {
    if (v[i] > mayor) mayor = v[i];
  }
  printf("%i\\n", mayor);
  return 0;
}`,
            hints: [
              "Inicializa `mayor = v[0]` después de leer.",
              "El for arranca en `i = 1` (ya consideraste el 0).",
              "Solo imprime `mayor` con `%i`, sin texto.",
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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
  }

  int menor = v[0];
  for (int i = 1; i < 5; i++) {
    if (v[i] < menor) menor = v[i];
  }
  printf("%i\\n", menor);
  return 0;
}`,
            hints: [
              "Cambia `>` por `<` y el nombre de la variable a `menor`.",
              "Sigue arrancando con `menor = v[0];`.",
              "Sin texto, solo el número con `%i`.",
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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
  }

  int idx = 0;
  for (int i = 1; i < 5; i++) {
    if (v[i] > v[idx]) {
      idx = i;
    }
  }
  printf("%i\\n", idx);
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
          code: `#include <stdio.h>

int main() {
  int notas[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &notas[i]);
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
  printf("Promedio: %.2f\\n", promedio);
  printf("Mayor: %i\\n", mayor);
  printf("Aprobados: %i\\n", aprobados);
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
          prompt: "En una pasada acumula `suma += notas[i]`, actualiza `mayor` y cuenta `aprobados++` cuando la nota sea `>= 7`.",
          template: `int notas[5];
for (int i = 0; i < 5; i++) {
  scanf("%i", &notas[{{0}}]);
}

int suma      = 0;
int mayor     = notas[0];
int aprobados = {{1}};
int reprobados = 0;

// UNA sola pasada calcula 4 cosas
for (int i = 0; i < 5; i++) {
  suma {{2}} notas[i];

  if (notas[i] > {{3}}) {
    mayor = notas[i];
  }

  if (notas[i] {{4}} 7) {
    aprobados{{5}};
  } else {
    reprobados++;
  }
}

double promedio = suma / {{6}};
printf("Promedio: %.2f\\n", promedio);
printf("Mayor: %i\\n", mayor);
printf("Aprobados: %i\\n", aprobados);
printf("Reprobados: %i\\n", reprobados);`,
          blanks: [
            { answer: "i", hint: "Índice variable que cambia con el for." },
            { answer: "0", hint: "El contador parte de cero." },
            { answer: "+=", hint: "Atajo de acumulación." },
            { answer: "mayor", hint: "El candidato actual al máximo." },
            { answer: ">=", hint: "Aprueba con 7 o más (incluye el 7)." },
            { answer: "++", hint: "Sube el contador en uno." },
            { answer: "5.0", hint: "Para conservar decimales en el promedio." },
          ],
          explanation:
            "Patrón profesional: declarar TODOS los acumuladores fuera del for, hacer una sola pasada que actualice todos. Aprobados (`>= 7`) y reprobados (`< 7`) se cuentan en un solo `if/else`.",
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

1. \`Promedio: <p>\` con \`<p>\` = suma / 5.0 **con 2 decimales** (\`%.2f\`)
2. \`Mayor: <m>\` (la más alta, entero)
3. \`Aprobados: <a>\` (cuántas son \`>= 7\`)

Para el test, el sistema enviará: \`8 5 10 7 4\` (Suma=34, Promedio=6.80,
Mayor=10, Aprobados=3).

Salida esperada:

\`\`\`
Promedio: 6.80
Mayor: 10
Aprobados: 3
\`\`\``,
            difficulty: "medium",
            xpReward: 45,
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int notas[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &notas[i]);
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
  printf("Promedio: %.2f\\n", promedio);
  printf("Mayor: %i\\n", mayor);
  printf("Aprobados: %i\\n", aprobados);
  return 0;
}`,
            hints: [
              "Tres acumuladores ANTES del for: `suma`, `mayor` (en `notas[0]`), `aprobados`.",
              "Un solo for hace todo en una pasada.",
              "Promedio con `%.2f`, los enteros con `%i`.",
            ],
            testCases: [
              {
                stdin: "8 5 10 7 4\n",
                expectedStdout: "Promedio: 6.80\nMayor: 10\nAprobados: 3\n",
                visible: true,
                description: "Caso típico",
              },
              {
                stdin: "10 10 10 10 10\n",
                expectedStdout: "Promedio: 10.00\nMayor: 10\nAprobados: 5\n",
                visible: false,
                description: "Todos 10",
              },
              {
                stdin: "0 0 0 0 0\n",
                expectedStdout: "Promedio: 0.00\nMayor: 0\nAprobados: 0\n",
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
            starterCode: `#include <stdio.h>
`,
            solutionCode: `#include <stdio.h>

int main() {
  int v[5];
  for (int i = 0; i < 5; i++) {
    scanf("%i", &v[i]);
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

  printf("Minimo: %i\\n", menor);
  printf("Maximo: %i\\n", mayor);
  printf("Rango: %i\\n", rango);
  printf("Suma sin extremos: %i\\n", sinExtremos);
  return 0;
}`,
            hints: [
              "Un solo for con tres updates en cada vuelta: suma += v[i], comparar con menor, comparar con mayor.",
              "Inicializa `menor = v[0]` y `mayor = v[0]` antes del for.",
              "Rango = mayor − menor. Suma sin extremos = suma − menor − mayor. Todo entero → `%i`.",
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
