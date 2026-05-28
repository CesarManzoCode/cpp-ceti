import type { PracticeUnitSetDefinition } from "./types";

/**
 * Ejercicios de práctica — Unidad 09: Archivos
 *
 * Mix CETI-style:
 *   - File I/O con ofstream / ifstream + << / >> / endl
 *   - Terminal I/O con printf / scanf
 *   - Para imprimir un std::string con printf: `s.c_str()` y `%s`.
 *
 * NOTA importante para los tests: todos los retos siguen el patrón
 * "escribir al archivo → leer del mismo archivo → printf lo leído",
 * porque las pruebas validan stdout — no leen el archivo.
 *
 * Calibración:
 *   easy   — starter con includes + main + parcial
 *   medium — starter con includes + main shell
 *   hard   — starter con solo includes
 */
export const u09ArchivosExercises: PracticeUnitSetDefinition = {
  unitSlug: "archivos",
  unitTitle: "Archivos: guardar y leer del disco",
  unitIcon: "📂",
  exercises: [
    // -----------------------------------------------------------------
    // EASY × 3
    // -----------------------------------------------------------------
    {
      slug: "u09-escribir-numero",
      title: "Escribir un número y reimprimirlo",
      description: "Escribe 99 al archivo, vuelve a leerlo y muéstralo.",
      difficulty: "easy",
      xpReward: 16,
      prompt: `## Escribir y leer un número

Tu programa debe:

1. Abrir \`dato.txt\` con \`ofstream\` y escribirle el número **99**.
2. Cerrar el archivo.
3. Abrirlo con \`ifstream\`, leer el entero y mostrarlo con \`printf\`.

Salida esperada:

\`\`\`
99
\`\`\``,
      starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  // 1) ofstream: escribir 99 al archivo
  // 2) ifstream: leer el entero
  // 3) printf

  return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  ofstream salida("dato.txt");
  salida << 99 << endl;
  salida.close();

  ifstream entrada("dato.txt");
  int n;
  entrada >> n;
  entrada.close();

  printf("%i\\n", n);
  return 0;
}`,
      hints: [
        "Para el archivo usa `<<` y `endl` (estilo stream).",
        "Para la terminal usa `printf` con `%i`.",
        "Acuérdate de cerrar ambos streams.",
      ],
      testCases: [
        {
          expectedStdout: "99\n",
          visible: true,
          description: "Reimprime 99",
        },
      ],
    },
    {
      slug: "u09-tres-lineas-archivo",
      title: "Tres líneas al archivo",
      description: "Escribe 3 líneas, léelas con getline y reimprimelas.",
      difficulty: "easy",
      xpReward: 16,
      prompt: `## Tres líneas

Crea \`materias.txt\` con estas 3 líneas en orden:

\`\`\`
Calculo
Fisica
Quimica
\`\`\`

Cierra y vuelve a abrir el archivo con \`ifstream\`. Léelo línea por línea
con \`getline\` y muestra cada línea con \`printf\` (recuerda \`.c_str()\`
para imprimir un \`std::string\` con \`%s\`).

Salida esperada:

\`\`\`
Calculo
Fisica
Quimica
\`\`\``,
      starterCode: `#include <stdio.h>
#include <fstream>
#include <string>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <fstream>
#include <string>
using namespace std;

int main() {
  ofstream salida("materias.txt");
  salida << "Calculo" << endl;
  salida << "Fisica" << endl;
  salida << "Quimica" << endl;
  salida.close();

  ifstream entrada("materias.txt");
  string linea;
  while (getline(entrada, linea)) {
    printf("%s\\n", linea.c_str());
  }
  entrada.close();
  return 0;
}`,
      hints: [
        "Bloque 1: tres `salida << \"...\" << endl;`.",
        "Bloque 2: `while (getline(entrada, linea)) printf(\"%s\\n\", linea.c_str());`.",
      ],
      testCases: [
        {
          expectedStdout: "Calculo\nFisica\nQuimica\n",
          visible: true,
          description: "Tres materias",
        },
      ],
    },
    {
      slug: "u09-contar-lineas",
      title: "Contar líneas escritas",
      description: "Escribe 4 líneas y luego cuenta cuántas hay en el archivo.",
      difficulty: "easy",
      xpReward: 18,
      prompt: `## Contar líneas

Crea \`registro.txt\` con estas 4 líneas:

\`\`\`
Aurora
Mario
Sofia
Andres
\`\`\`

Cierra. Reabre con \`ifstream\`, recorre con \`getline\` y cuenta cuántas
líneas hay. Imprime SOLO el conteo.

Salida esperada:

\`\`\`
4
\`\`\``,
      starterCode: `#include <stdio.h>
#include <fstream>
#include <string>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <fstream>
#include <string>
using namespace std;

int main() {
  ofstream salida("registro.txt");
  salida << "Aurora" << endl;
  salida << "Mario" << endl;
  salida << "Sofia" << endl;
  salida << "Andres" << endl;
  salida.close();

  ifstream entrada("registro.txt");
  string linea;
  int cuenta = 0;
  while (getline(entrada, linea)) {
    cuenta++;
  }
  entrada.close();
  printf("%i\\n", cuenta);
  return 0;
}`,
      hints: [
        "Acumulador `int cuenta = 0;` fuera del while.",
        "Dentro: `cuenta++;`. Al final, `printf` con `%i`.",
      ],
      testCases: [
        {
          expectedStdout: "4\n",
          visible: true,
          description: "Cuatro líneas",
        },
      ],
    },

    // -----------------------------------------------------------------
    // MEDIUM × 3
    // -----------------------------------------------------------------
    {
      slug: "u09-suma-tres-enteros",
      title: "Sumar 3 enteros vía archivo",
      description: "Escribe 3 enteros separados por espacios y suma desde el archivo.",
      difficulty: "medium",
      xpReward: 22,
      prompt: `## Sumar tres vía archivo

1. Crea \`trio.txt\` con los enteros \`10 20 30\` (en una línea, separados
   por espacios).
2. Cierra el archivo.
3. Reábrelo con \`ifstream\`, lee los 3 enteros con \`>>\` encadenado.
4. Imprime la suma con \`printf\` y \`%i\`.

Salida esperada:

\`\`\`
60
\`\`\``,
      starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  ofstream salida("trio.txt");
  salida << 10 << " " << 20 << " " << 30 << endl;
  salida.close();

  ifstream entrada("trio.txt");
  int a, b, c;
  entrada >> a >> b >> c;
  entrada.close();

  printf("%i\\n", a + b + c);
  return 0;
}`,
      hints: [
        "Al escribir, separa los valores con un espacio entre `<<`.",
        "Al leer, `entrada >> a >> b >> c;` encadenado.",
      ],
      testCases: [
        {
          expectedStdout: "60\n",
          visible: true,
          description: "10+20+30 = 60",
        },
      ],
    },
    {
      slug: "u09-append-bitacora",
      title: "Append: bitácora",
      description: "Tres aperturas: una normal y dos en modo append.",
      difficulty: "medium",
      xpReward: 24,
      prompt: `## Bitácora con append

Construye \`bitacora.txt\` así (3 aperturas):

1. Primera (modo normal): escribe \`Encendido\`.
2. Segunda (modo \`ios::app\`): agrega \`Operacion\`.
3. Tercera (modo \`ios::app\`): agrega \`Apagado\`.

Después abre con \`ifstream\`, lee línea por línea con \`getline\` y muestra
cada una con \`printf\`.

Salida esperada:

\`\`\`
Encendido
Operacion
Apagado
\`\`\``,
      starterCode: `#include <stdio.h>
#include <fstream>
#include <string>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <fstream>
#include <string>
using namespace std;

int main() {
  ofstream a("bitacora.txt");
  a << "Encendido" << endl;
  a.close();

  ofstream b("bitacora.txt", ios::app);
  b << "Operacion" << endl;
  b.close();

  ofstream c("bitacora.txt", ios::app);
  c << "Apagado" << endl;
  c.close();

  ifstream lector("bitacora.txt");
  string linea;
  while (getline(lector, linea)) {
    printf("%s\\n", linea.c_str());
  }
  lector.close();
  return 0;
}`,
      hints: [
        "Sólo la PRIMERA apertura va sin `ios::app`.",
        "Las otras dos llevan `ios::app` como segundo argumento.",
        "Al imprimir un `string` con printf, usa `linea.c_str()` y `%s`.",
      ],
      testCases: [
        {
          expectedStdout: "Encendido\nOperacion\nApagado\n",
          visible: true,
          description: "Tres líneas, sin pérdida",
        },
      ],
    },
    {
      slug: "u09-filtrar-pares",
      title: "Filtrar pares del archivo",
      description: "Escribe 5 enteros y filtra solo los pares al leer.",
      difficulty: "medium",
      xpReward: 26,
      prompt: `## Filtrar pares

1. Crea \`numeros.txt\` con los enteros \`1 2 3 4 5 6 7 8 9 10\` separados
   por espacios.
2. Cierra el archivo.
3. Reábrelo con \`ifstream\` y, usando \`while (entrada >> valor)\`, imprime
   **solo los pares**, uno por línea.

Salida esperada:

\`\`\`
2
4
6
8
10
\`\`\``,
      starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {

  return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  ofstream salida("numeros.txt");
  for (int i = 1; i <= 10; i++) {
    salida << i << " ";
  }
  salida << endl;
  salida.close();

  ifstream entrada("numeros.txt");
  int valor;
  while (entrada >> valor) {
    if (valor % 2 == 0) {
      printf("%i\\n", valor);
    }
  }
  entrada.close();
  return 0;
}`,
      hints: [
        "Para escribir 1..10, un `for` de 1 a 10 con `salida << i << \" \";` funciona.",
        "Para leer todos, `while (entrada >> valor) { ... }`.",
        "Dentro del while: `if (valor % 2 == 0) printf(\"%i\\n\", valor);`.",
      ],
      testCases: [
        {
          expectedStdout: "2\n4\n6\n8\n10\n",
          visible: true,
          description: "Solo pares",
        },
      ],
    },

    // -----------------------------------------------------------------
    // HARD × 2
    // -----------------------------------------------------------------
    {
      slug: "u09-estadisticas-archivo",
      title: "Estadísticas de archivo",
      description: "Escribe 5 enteros y calcula suma + máximo + promedio en una pasada.",
      difficulty: "hard",
      xpReward: 30,
      prompt: `## Estadísticas vía archivo

1. Lee con \`scanf\` **5 enteros** del usuario.
2. Escríbelos en \`reporte.txt\`, uno por línea.
3. Cierra el archivo.
4. Reábrelo. En una sola pasada con \`while (entrada >> valor)\`, calcula:
   - suma
   - máximo (arranca con el primer valor leído)
   - cuántos hay (cuenta)
5. Imprime **3 líneas**:

\`\`\`
Suma: <s>
Mayor: <m>
Promedio: <s / cuenta con 2 decimales>
\`\`\`

Para el test, el sistema enviará: \`8 5 10 7 4\`.

- Suma = 34, mayor = 10, promedio = 6.80.

Salida esperada:

\`\`\`
Suma: 34
Mayor: 10
Promedio: 6.80
\`\`\``,
      starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;
`,
      solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  ofstream salida("reporte.txt");
  for (int i = 0; i < 5; i++) {
    int n;
    scanf("%i", &n);
    salida << n << endl;
  }
  salida.close();

  ifstream entrada("reporte.txt");
  int valor;
  int suma = 0;
  int mayor = 0;
  int cuenta = 0;
  bool primero = true;
  while (entrada >> valor) {
    suma += valor;
    cuenta++;
    if (primero) {
      mayor = valor;
      primero = false;
    } else if (valor > mayor) {
      mayor = valor;
    }
  }
  entrada.close();

  printf("Suma: %i\\n", suma);
  printf("Mayor: %i\\n", mayor);
  printf("Promedio: %.2f\\n", suma / (double) cuenta);
  return 0;
}`,
      hints: [
        "Para el máximo dentro del while, usa una bandera `bool primero = true;` que inicialice `mayor` en la primera lectura.",
        "Cast a `double` para que la división no se trunque: `suma / (double) cuenta`.",
      ],
      testCases: [
        {
          stdin: "8 5 10 7 4\n",
          expectedStdout: "Suma: 34\nMayor: 10\nPromedio: 6.80\n",
          visible: true,
          description: "Caso ejemplo",
        },
        {
          stdin: "10 10 10 10 10\n",
          expectedStdout: "Suma: 50\nMayor: 10\nPromedio: 10.00\n",
          visible: false,
          description: "Todos iguales",
        },
        {
          stdin: "1 2 3 4 5\n",
          expectedStdout: "Suma: 15\nMayor: 5\nPromedio: 3.00\n",
          visible: false,
          description: "1..5",
        },
      ],
    },
    {
      slug: "u09-copia-filtrada",
      title: "Copiar archivo filtrado",
      description: "Lee un archivo y copia solo las líneas que empiezan con 'A'.",
      difficulty: "hard",
      xpReward: 32,
      prompt: `## Copia filtrada

1. Crea \`origen.txt\` con estas 5 líneas:

\`\`\`
Aurora
Mario
Andres
Sofia
Adriana
\`\`\`

2. Abre \`origen.txt\` con \`ifstream\`. Por cada línea, si empieza con
   \`'A'\`, escríbela en otro archivo \`filtrado.txt\` (modo normal la
   primera vez, append las demás).
3. Después, abre \`filtrado.txt\` y muestra todo su contenido con \`printf\`.

Salida esperada:

\`\`\`
Aurora
Andres
Adriana
\`\`\``,
      starterCode: `#include <stdio.h>
#include <fstream>
#include <string>
using namespace std;
`,
      solutionCode: `#include <stdio.h>
#include <fstream>
#include <string>
using namespace std;

int main() {
  // 1) Crear origen.txt con las 5 líneas
  ofstream o("origen.txt");
  o << "Aurora" << endl;
  o << "Mario" << endl;
  o << "Andres" << endl;
  o << "Sofia" << endl;
  o << "Adriana" << endl;
  o.close();

  // 2) Limpia el archivo filtrado y agrega las líneas con 'A'
  ofstream limpio("filtrado.txt");
  limpio.close();

  ifstream entrada("origen.txt");
  string linea;
  while (getline(entrada, linea)) {
    if (linea[0] == 'A') {
      ofstream f("filtrado.txt", ios::app);
      f << linea << endl;
      f.close();
    }
  }
  entrada.close();

  // 3) Lee filtrado.txt y muestra todo
  ifstream lector("filtrado.txt");
  string s;
  while (getline(lector, s)) {
    printf("%s\\n", s.c_str());
  }
  lector.close();
  return 0;
}`,
      hints: [
        "Para comparar el primer caracter: `linea[0] == 'A'` (comillas simples para char).",
        "Limpia el archivo filtrado antes (abrir y cerrar `ofstream` lo trunca a 0).",
        "Cada escritura al filtrado abre en modo `ios::app` y se cierra al instante.",
      ],
      testCases: [
        {
          expectedStdout: "Aurora\nAndres\nAdriana\n",
          visible: true,
          description: "Solo las que empiezan con A",
        },
      ],
    },
  ],
};
