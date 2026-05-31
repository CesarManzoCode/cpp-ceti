import type { PracticeUnitSetDefinition } from "./types";

/**
 * Ejercicios de práctica — Unidad 02: Leer datos con cin
 *
 * Conceptos disponibles (no usar futuros):
 *   - cout, endl
 *   - cin >>, getline
 *   - int, double, string, char
 *   - operaciones aritméticas (+, -, *, /, %)
 *   - SIN if/else (eso es U4)
 *   - SIN loops, funciones, arreglos
 *
 * Calibración (RELATIVA a U2):
 *   easy   — starter con includes + main + variables + comentario
 *   medium — starter con includes + main shell vacío
 *   hard   — starter con solo `#include` y `using namespace std;`
 */
export const u02CinExercises: PracticeUnitSetDefinition = {
  unitSlug: "leer-datos",
  unitTitle: "Leer datos del usuario con cin",
  unitIcon: "⌨️",
  exercises: [
    // -----------------------------------------------------------------
    // EASY × 3
    // -----------------------------------------------------------------
    {
      slug: "u02-suma-resta",
      title: "Suma y resta",
      description: "Lee 2 enteros y muestra suma y resta en líneas separadas.",
      difficulty: "easy",
      xpReward: 12,
      prompt: `## Suma y resta

Lee **dos enteros** del usuario (en una sola línea, separados por espacio).
Imprime EXACTAMENTE estas 2 líneas:

\`\`\`
Suma: <a+b>
Resta: <a-b>
\`\`\`

Para el test, el sistema enviará: \`8 3\`.

Salida esperada:

\`\`\`
Suma: 11
Resta: 5
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  int a, b;
  // Lee a y b con cin
  // Imprime "Suma: " + (a+b) y "Resta: " + (a-b) en líneas separadas

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int a, b;
  cin >> a >> b;
  cout << "Suma: " << a + b << endl;
  cout << "Resta: " << a - b << endl;
  return 0;
}`,
      hints: [
        "Lee con `cin >> a >> b;` en una sola línea.",
        "Dos `cout` separados, uno para cada operación.",
        "Cuida el espacio después de `Suma:` y `Resta:`.",
      ],
      testCases: [
        {
          stdin: "8 3\n",
          expectedStdout: "Suma: 11\nResta: 5\n",
          visible: true,
          description: "Caso ejemplo",
        },
        {
          stdin: "10 7\n",
          expectedStdout: "Suma: 17\nResta: 3\n",
          visible: false,
          description: "Otro caso",
        },
      ],
    },
    {
      slug: "u02-calificacion-eco",
      title: "Eco de calificación",
      description: "Lee un entero y devuélvelo con un prefijo.",
      difficulty: "easy",
      xpReward: 12,
      prompt: `## Eco de calificación

Lee una calificación entera del usuario e imprime:

\`\`\`
Tu calificacion: <n>
\`\`\`

Para el test, el sistema enviará: \`9\`.

Salida esperada:

\`\`\`
Tu calificacion: 9
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  // Lee n con cin, después imprime el mensaje

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  cout << "Tu calificacion: " << n << endl;
  return 0;
}`,
      hints: [
        "Usa `cin >> n;` para leer.",
        "Después `cout << \"Tu calificacion: \" << n << endl;`.",
        "Sin acento en `calificacion`.",
      ],
      testCases: [
        {
          stdin: "9\n",
          expectedStdout: "Tu calificacion: 9\n",
          visible: true,
          description: "Caso típico",
        },
        {
          stdin: "10\n",
          expectedStdout: "Tu calificacion: 10\n",
          visible: false,
          description: "Calificación perfecta",
        },
      ],
    },
    {
      slug: "u02-bienvenida-getline",
      title: "Bienvenida personalizada",
      description: "Lee una línea con espacios usando getline.",
      difficulty: "easy",
      xpReward: 14,
      prompt: `## Bienvenida personalizada

Lee el **nombre completo** del alumno con \`getline\` (puede tener espacios)
e imprime:

\`\`\`
Bienvenido, <nombre>!
\`\`\`

Para el test, el sistema enviará: \`Aurora del Carmen\`.

Salida esperada:

\`\`\`
Bienvenido, Aurora del Carmen!
\`\`\``,
      starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombre;
  // Usa getline para que se lean también los espacios

  return 0;
}`,
      solutionCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string nombre;
  getline(cin, nombre);
  cout << "Bienvenido, " << nombre << "!" << endl;
  return 0;
}`,
      hints: [
        "Para una línea con espacios usa `getline(cin, nombre);`.",
        "Imprime con `cout << \"Bienvenido, \" << nombre << \"!\" << endl;`.",
        "El `!` va sin espacio antes — pegadito al nombre.",
      ],
      testCases: [
        {
          stdin: "Aurora del Carmen\n",
          expectedStdout: "Bienvenido, Aurora del Carmen!\n",
          visible: true,
          description: "Nombre con espacios",
        },
        {
          stdin: "Mario Lopez\n",
          expectedStdout: "Bienvenido, Mario Lopez!\n",
          visible: false,
          description: "Dos palabras",
        },
      ],
    },

    // -----------------------------------------------------------------
    // MEDIUM × 3
    // -----------------------------------------------------------------
    {
      slug: "u02-precio-iva",
      title: "Precio con IVA",
      description: "Lee un precio, calcula el IVA al 16% y el total.",
      difficulty: "medium",
      xpReward: 18,
      prompt: `## Precio con IVA

Lee un \`double precio\` del usuario. Calcula el **IVA al 16%** y el
**total** con IVA. Imprime **3 líneas**:

\`\`\`
Sin IVA: <precio>
IVA: <precio * 0.16>
Total: <precio + IVA>
\`\`\`

Para el test, el sistema enviará: \`100\`.

Salida esperada:

\`\`\`
Sin IVA: 100
IVA: 16
Total: 116
\`\`\`

> **Nota sobre formato:** Usa \`cout\` para imprimir (no \`printf\`).
> \`cout\` elimina los ceros innecesarios: \`cout << 100.0\` imprime \`100\`,
> \`cout << 16.0\` imprime \`16\`. Con \`printf("%f",...)\` obtendrías \`100.000000\`.`,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  double precio;
  cin >> precio;
  double iva = precio * 0.16;
  double total = precio + iva;
  cout << "Sin IVA: " << precio << endl;
  cout << "IVA: " << iva << endl;
  cout << "Total: " << total << endl;
  return 0;
}`,
      hints: [
        "Declara `double precio;` y léelo con `cin >> precio;`.",
        "IVA = `precio * 0.16`. Total = `precio + iva` (o calcúlalo dentro del cout).",
      ],
      testCases: [
        {
          stdin: "100\n",
          expectedStdout: "Sin IVA: 100\nIVA: 16\nTotal: 116\n",
          visible: true,
          description: "Caso ejemplo: $100",
        },
        {
          stdin: "250\n",
          expectedStdout: "Sin IVA: 250\nIVA: 40\nTotal: 290\n",
          visible: false,
          description: "$250 con IVA = 40",
        },
      ],
    },
    {
      slug: "u02-rectangulo",
      title: "Rectángulo: perímetro y área",
      description: "Lee base y altura, muestra perímetro y área.",
      difficulty: "medium",
      xpReward: 18,
      prompt: `## Rectángulo: perímetro y área

Lee \`int base\` y \`int altura\` en una sola línea (separados por espacio).
Calcula e imprime:

\`\`\`
Perimetro: <2*(base+altura)>
Area: <base*altura>
\`\`\`

Para el test, el sistema enviará: \`5 3\`.

Salida esperada:

\`\`\`
Perimetro: 16
Area: 15
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int base, altura;
  cin >> base >> altura;
  cout << "Perimetro: " << 2 * (base + altura) << endl;
  cout << "Area: " << base * altura << endl;
  return 0;
}`,
      hints: [
        "Perímetro de rectángulo = `2 * (base + altura)` — paréntesis para que sume primero.",
        "Área = `base * altura`. Sin acentos en los textos.",
      ],
      testCases: [
        {
          stdin: "5 3\n",
          expectedStdout: "Perimetro: 16\nArea: 15\n",
          visible: true,
          description: "5×3 → perímetro 16, área 15",
        },
        {
          stdin: "10 10\n",
          expectedStdout: "Perimetro: 40\nArea: 100\n",
          visible: false,
          description: "Cuadrado de 10×10",
        },
        {
          stdin: "7 2\n",
          expectedStdout: "Perimetro: 18\nArea: 14\n",
          visible: false,
          description: "Otro caso",
        },
      ],
    },
    {
      slug: "u02-promedio-cuatro",
      title: "Promedio de 4 calificaciones",
      description: "Lee 4 enteros y calcula el promedio con decimales.",
      difficulty: "medium",
      xpReward: 20,
      prompt: `## Promedio de 4 calificaciones

Lee **4 calificaciones enteras** en una sola línea (separadas por espacios).
Imprime el promedio dividiendo entre \`4.0\` (con punto, para que conserve
decimales):

\`\`\`
Promedio: <p>
\`\`\`

Para el test, el sistema enviará: \`8 9 7 10\` (promedio = 8.5).

Salida esperada:

\`\`\`
Promedio: 8.5
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int a, b, c, d;
  cin >> a >> b >> c >> d;
  cout << "Promedio: " << (a + b + c + d) / 4.0 << endl;
  return 0;
}`,
      hints: [
        "Encadena las 4 lecturas: `cin >> a >> b >> c >> d;`.",
        "Divide entre `4.0` (con punto) para obtener decimales.",
      ],
      testCases: [
        {
          stdin: "8 9 7 10\n",
          expectedStdout: "Promedio: 8.5\n",
          visible: true,
          description: "Caso ejemplo: promedio 8.5",
        },
        {
          stdin: "10 10 10 10\n",
          expectedStdout: "Promedio: 10\n",
          visible: false,
          description: "Todos 10",
        },
        {
          stdin: "5 5 5 5\n",
          expectedStdout: "Promedio: 5\n",
          visible: false,
          description: "Todos iguales",
        },
      ],
    },

    // -----------------------------------------------------------------
    // HARD × 2
    // -----------------------------------------------------------------
    {
      slug: "u02-minutos-a-horas",
      title: "Convertir minutos a horas",
      description: "Programa desde cero: lee minutos y conviértelos.",
      difficulty: "hard",
      xpReward: 25,
      prompt: `## Convertir minutos a horas

Lee un entero \`minutos\` del usuario. Conviértelo a horas y minutos
restantes, y imprime EXACTAMENTE:

\`\`\`
<h> horas y <m> minutos
\`\`\`

Donde \`<h>\` es la división entera por 60 y \`<m>\` es el resto.

Para el test, el sistema enviará: \`150\` → 2 horas y 30 minutos.

Salida esperada:

\`\`\`
2 horas y 30 minutos
\`\`\``,
      starterCode: `#include <iostream>
using namespace std;
`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int minutos;
  cin >> minutos;
  cout << minutos / 60 << " horas y " << minutos % 60 << " minutos" << endl;
  return 0;
}`,
      hints: [
        "Recuerda los operadores `/` (división entera) y `%` (resto).",
        "Un solo cout encadenado: cálculo + texto + cálculo + texto.",
      ],
      testCases: [
        {
          stdin: "150\n",
          expectedStdout: "2 horas y 30 minutos\n",
          visible: true,
          description: "150 min → 2h 30m",
        },
        {
          stdin: "60\n",
          expectedStdout: "1 horas y 0 minutos\n",
          visible: false,
          description: "60 min = exacto 1 hora",
        },
        {
          stdin: "125\n",
          expectedStdout: "2 horas y 5 minutos\n",
          visible: false,
          description: "125 min → 2h 5m",
        },
        {
          stdin: "45\n",
          expectedStdout: "0 horas y 45 minutos\n",
          visible: false,
          description: "Menos de una hora",
        },
      ],
    },
    {
      slug: "u02-recibo-cafeteria",
      title: "Recibo de cafetería",
      description: "Calcula subtotal, descuento y total. Solo includes.",
      difficulty: "hard",
      xpReward: 28,
      prompt: `## Recibo de cafetería

Lee, en este orden, **3 valores** separados por espacios:

1. \`int cantidad\` — cuántos cafés.
2. \`double precio\` — precio unitario.
3. \`double descuento\` — descuento como decimal (ej. \`0.1\` = 10%).

Calcula:
- **subtotal** = cantidad × precio
- **rebaja** = subtotal × descuento
- **total** = subtotal − rebaja

Imprime **3 líneas**:

\`\`\`
Subtotal: <subtotal>
Descuento: <rebaja>
Total: <total>
\`\`\`

Para el test, el sistema enviará: \`3 25.5 0.1\`.

- Subtotal = 76.5
- Rebaja = 7.65
- Total = 68.85

Salida esperada:

\`\`\`
Subtotal: 76.5
Descuento: 7.65
Total: 68.85
\`\`\`

> **Nota sobre formato:** Usa \`cout\` para imprimir (no \`printf\`).
> \`cout\` muestra solo los decimales que hacen falta: \`76.5\` imprime \`76.5\`,
> \`100.0\` imprime \`100\`. Si usaras \`printf("%f",...)\` obtendrías \`76.500000\`.`,
      starterCode: `#include <iostream>
using namespace std;
`,
      solutionCode: `#include <iostream>
using namespace std;

int main() {
  int cantidad;
  double precio, descuento;
  cin >> cantidad >> precio >> descuento;

  double subtotal = cantidad * precio;
  double rebaja = subtotal * descuento;
  double total = subtotal - rebaja;

  cout << "Subtotal: " << subtotal << endl;
  cout << "Descuento: " << rebaja << endl;
  cout << "Total: " << total << endl;
  return 0;
}`,
      hints: [
        "Lee los 3 valores con `cin >> cantidad >> precio >> descuento;`.",
        "Tres cálculos seguidos en variables, después 3 `cout` en orden.",
      ],
      testCases: [
        {
          stdin: "3 25.5 0.1\n",
          expectedStdout: "Subtotal: 76.5\nDescuento: 7.65\nTotal: 68.85\n",
          visible: true,
          description: "3 cafés a 25.50 con 10% off",
        },
        {
          stdin: "5 20 0.2\n",
          expectedStdout: "Subtotal: 100\nDescuento: 20\nTotal: 80\n",
          visible: false,
          description: "5 cafés con 20% off",
        },
        {
          stdin: "1 50 0\n",
          expectedStdout: "Subtotal: 50\nDescuento: 0\nTotal: 50\n",
          visible: false,
          description: "Sin descuento",
        },
      ],
    },
  ],
};
