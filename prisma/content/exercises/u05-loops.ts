import type { PracticeUnitSetDefinition } from "./types";

/**
 * Ejercicios de práctica — Unidad 05: Ciclos (loops)
 *
 * Conceptos disponibles (acumulados):
 *   - U1-U4
 *   - U5: while, for, do-while, break, continue, loops anidados,
 *         acumuladores
 *
 * NO disponibles: funciones (U6), arreglos (U8), printf/scanf (U7).
 *
 * Calibración:
 *   easy   — starter con includes + main + leer variable + comentario
 *   medium — starter con includes + main shell vacío
 *   hard   — starter con solo includes
 */
export const u05LoopsExercises: PracticeUnitSetDefinition = {
  unitSlug: "loops",
  unitTitle: "Ciclos: repetir sin escribir cien veces",
  unitIcon: "🔁",
  exercises: [
    // -----------------------------------------------------------------
    // EASY × 3
    // -----------------------------------------------------------------
    {
      slug: "u05-contar-hasta-n",
      title: "Contar de 1 a N",
      description: "Imprime los números del 1 a N (leído por cin), uno por línea.",
      difficulty: "easy",
      xpReward: 14,
      prompt: `## Contar de 1 a N

Lee \`int n\`. Imprime los números del **1 a n** (inclusive), uno por línea.

Para el test, el sistema enviará: \`5\`.

Salida esperada:

\`\`\`
1
2
3
4
5
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  // for que imprima de 1 a n

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  for (int i = 1; i <= n; i++) {
    cout << i << endl;
  }
  return 0;
}`,
      hints: [
        "Patrón: `for (int i = 1; i <= n; i++) { ... }`.",
        "Dentro del for: `cout << i << endl;`.",
        "Usa `<=` para que el último número (n) también se imprima.",
      ],
      testCases: [
        {
          stdin: "5\n",
          expectedStdout: "1\n2\n3\n4\n5\n",
          visible: true,
          description: "Caso ejemplo",
        },
        {
          stdin: "1\n",
          expectedStdout: "1\n",
          visible: false,
          description: "Solo el 1",
        },
        {
          stdin: "10\n",
          expectedStdout: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n",
          visible: false,
          description: "Del 1 al 10",
        },
      ],
    },
    {
      slug: "u05-tabla-multiplicar",
      title: "Tabla de multiplicar del N",
      description: "Lee N y imprime su tabla del 1 al 10.",
      difficulty: "easy",
      xpReward: 16,
      prompt: `## Tabla del N

Lee \`int n\` del usuario. Imprime la tabla de multiplicar del \`n\` del 1 al
10, formato:

\`\`\`
<n> x 1 = <n*1>
<n> x 2 = <n*2>
...
<n> x 10 = <n*10>
\`\`\`

Para el test, el sistema enviará: \`7\`.

Salida esperada:

\`\`\`
7 x 1 = 7
7 x 2 = 14
7 x 3 = 21
7 x 4 = 28
7 x 5 = 35
7 x 6 = 42
7 x 7 = 49
7 x 8 = 56
7 x 9 = 63
7 x 10 = 70
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  // for de 1 a 10 que imprime "n x i = n*i"

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  for (int i = 1; i <= 10; i++) {
    cout << n << " x " << i << " = " << n * i << endl;
  }
  return 0;
}`,
      hints: [
        "Lee `n` con `cin >> n;` antes del for.",
        "Un solo for de 1 a 10; encadena `n`, `i` y `n * i` en el cout.",
        "El espacio en `\" x \"` y `\" = \"` importa.",
      ],
      testCases: [
        {
          stdin: "7\n",
          expectedStdout:
            "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70\n",
          visible: true,
          description: "Tabla del 7",
        },
        {
          stdin: "3\n",
          expectedStdout:
            "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30\n",
          visible: false,
          description: "Tabla del 3",
        },
        {
          stdin: "1\n",
          expectedStdout:
            "1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10\n",
          visible: false,
          description: "Tabla del 1",
        },
      ],
    },
    {
      slug: "u05-contar-pares",
      title: "Pares del 2 al N",
      description: "Imprime solo los números pares desde 2 hasta N.",
      difficulty: "easy",
      xpReward: 16,
      prompt: `## Pares del 2 al N

Lee \`int n\`. Imprime los números pares desde \`2\` hasta \`n\` (inclusive si
\`n\` es par), uno por línea.

Para el test, el sistema enviará: \`10\`.

Salida esperada:

\`\`\`
2
4
6
8
10
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  // for empezando en 2 con paso de 2

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  for (int i = 2; i <= n; i += 2) {
    cout << i << endl;
  }
  return 0;
}`,
      hints: [
        "Arranca en `i = 2` y avanza con `i += 2`.",
        "El `i += 2` es atajo de `i = i + 2`.",
        "Si `n` es impar, el último par será `n - 1`.",
      ],
      testCases: [
        {
          stdin: "10\n",
          expectedStdout: "2\n4\n6\n8\n10\n",
          visible: true,
          description: "Pares hasta 10",
        },
        {
          stdin: "9\n",
          expectedStdout: "2\n4\n6\n8\n",
          visible: false,
          description: "Pares hasta 9 (último es 8)",
        },
        {
          stdin: "1\n",
          expectedStdout: "",
          visible: false,
          description: "No hay pares hasta 1",
        },
      ],
    },

    // -----------------------------------------------------------------
    // MEDIUM × 3
    // -----------------------------------------------------------------
    {
      slug: "u05-suma-1-a-n",
      title: "Suma de 1 a N",
      description: "Acumulador clásico — suma 1+2+...+n.",
      difficulty: "medium",
      xpReward: 20,
      prompt: `## Suma de 1 a N

Lee \`int n\`. Calcula la suma \`1 + 2 + 3 + ... + n\` y muéstrala (sin texto,
solo el número).

Para el test, el sistema enviará: \`10\` → suma = 55.

Salida esperada:

\`\`\`
55
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  int suma = 0;
  for (int i = 1; i <= n; i++) {
    suma += i;
  }
  cout << suma << endl;
  return 0;
}`,
      hints: [
        "Patrón acumulador: variable en 0 ANTES del for, `+=` dentro.",
        "El cout va DESPUÉS del for, no dentro.",
      ],
      testCases: [
        {
          stdin: "10\n",
          expectedStdout: "55\n",
          visible: true,
          description: "1+2+...+10 = 55",
        },
        {
          stdin: "5\n",
          expectedStdout: "15\n",
          visible: false,
          description: "1+2+3+4+5 = 15",
        },
        {
          stdin: "1\n",
          expectedStdout: "1\n",
          visible: false,
          description: "Solo 1",
        },
      ],
    },
    {
      slug: "u05-factorial",
      title: "Factorial",
      description: "Calcula n! con un for.",
      difficulty: "medium",
      xpReward: 22,
      prompt: `## Factorial

Lee \`int n\`. Calcula \`n!\` (el factorial: \`1 * 2 * 3 * ... * n\`).

Por convención, \`0! = 1\`.

Para el test, el sistema enviará: \`5\` → 5! = 120.

Salida esperada:

\`\`\`
120
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  int fact = 1;
  for (int i = 2; i <= n; i++) {
    fact *= i;
  }
  cout << fact << endl;
  return 0;
}`,
      hints: [
        "Acumulador multiplicativo: empieza en `1` (no en 0) y usa `*=`.",
        "El for puede empezar en `2` para evitar multiplicar por 1 inútilmente.",
      ],
      testCases: [
        {
          stdin: "5\n",
          expectedStdout: "120\n",
          visible: true,
          description: "5! = 120",
        },
        {
          stdin: "0\n",
          expectedStdout: "1\n",
          visible: false,
          description: "0! = 1 por convención",
        },
        {
          stdin: "1\n",
          expectedStdout: "1\n",
          visible: false,
          description: "1! = 1",
        },
        {
          stdin: "7\n",
          expectedStdout: "5040\n",
          visible: false,
          description: "7! = 5040",
        },
      ],
    },
    {
      slug: "u05-contar-digitos",
      title: "Contar dígitos",
      description: "Cuenta cuántos dígitos tiene un entero positivo.",
      difficulty: "medium",
      xpReward: 22,
      prompt: `## Contar dígitos

Lee \`int n\` (positivo). Cuenta cuántos dígitos tiene usando un \`while\`:
divides entre 10 hasta que llegue a 0.

Para el test, el sistema enviará: \`12345\` → 5 dígitos.

Salida esperada:

\`\`\`
5
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  int cuenta = 0;
  while (n > 0) {
    n = n / 10;
    cuenta++;
  }
  cout << cuenta << endl;
  return 0;
}`,
      hints: [
        "Usa `while (n > 0)` — cada vuelta divides `n` entre 10.",
        "Contador empieza en 0; súbelo con `cuenta++` cada vez que pase por el while.",
      ],
      testCases: [
        {
          stdin: "12345\n",
          expectedStdout: "5\n",
          visible: true,
          description: "5 dígitos",
        },
        {
          stdin: "9\n",
          expectedStdout: "1\n",
          visible: false,
          description: "Un solo dígito",
        },
        {
          stdin: "100\n",
          expectedStdout: "3\n",
          visible: false,
          description: "Con ceros",
        },
        {
          stdin: "1000000\n",
          expectedStdout: "7\n",
          visible: false,
          description: "Un millón",
        },
      ],
    },

    // -----------------------------------------------------------------
    // HARD × 2
    // -----------------------------------------------------------------
    {
      slug: "u05-piramide-asteriscos",
      title: "Pirámide de asteriscos",
      description: "Loops anidados para imprimir filas crecientes de `*`.",
      difficulty: "hard",
      xpReward: 28,
      prompt: `## Pirámide de asteriscos

Lee \`int alto\`. Imprime una pirámide rectangular: la fila \`i\` tiene
\`i\` asteriscos.

Para el test, el sistema enviará: \`4\`.

Salida esperada:

\`\`\`
*
**
***
****
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;
`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int alto;
  cin >> alto;
  for (int i = 1; i <= alto; i++) {
    for (int j = 1; j <= i; j++) {
      cout << "*";
    }
    cout << endl;
  }
  return 0;
}`,
      hints: [
        "Loops anidados: el externo controla filas, el interno controla cuántos `*`.",
        "Después del for interno, un `cout << endl;` cierra la fila.",
      ],
      testCases: [
        {
          stdin: "4\n",
          expectedStdout: "*\n**\n***\n****\n",
          visible: true,
          description: "Pirámide de altura 4",
        },
        {
          stdin: "1\n",
          expectedStdout: "*\n",
          visible: false,
          description: "Una sola fila",
        },
        {
          stdin: "6\n",
          expectedStdout: "*\n**\n***\n****\n*****\n******\n",
          visible: false,
          description: "Altura 6",
        },
      ],
    },
    {
      slug: "u05-invertir-numero",
      title: "Invertir un número",
      description: "Lee un entero y muestra su inverso (12345 → 54321).",
      difficulty: "hard",
      xpReward: 30,
      prompt: `## Invertir un número

Lee \`int n\` (positivo). Imprime sus dígitos al revés, todos en una sola
línea pegados.

Algoritmo: usa \`% 10\` para sacar el último dígito y \`/ 10\` para quitarlo.
Imprime el dígito en cada paso.

Para el test, el sistema enviará: \`12345\` → 54321.

Salida esperada:

\`\`\`
54321
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;
`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  while (n > 0) {
    cout << n % 10;
    n = n / 10;
  }
  cout << endl;
  return 0;
}`,
      hints: [
        "`n % 10` te da el último dígito; `n / 10` te quita el último.",
        "Imprime SIN `endl` dentro del while; un solo `endl` al final.",
      ],
      testCases: [
        {
          stdin: "12345\n",
          expectedStdout: "54321\n",
          visible: true,
          description: "Invierte 12345",
        },
        {
          stdin: "7\n",
          expectedStdout: "7\n",
          visible: false,
          description: "Un dígito queda igual",
        },
        {
          stdin: "100\n",
          expectedStdout: "001\n",
          visible: false,
          description: "Con ceros al final original",
        },
        {
          stdin: "9876\n",
          expectedStdout: "6789\n",
          visible: false,
          description: "Cuatro dígitos",
        },
      ],
    },
  ],
};
