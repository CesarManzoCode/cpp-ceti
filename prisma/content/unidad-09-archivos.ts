import type { UnitDefinition } from "./types";

/**
 * Unidad 09 — Archivos (fstream)
 *
 * Cierre del recorrido básico. Curva de autonomía al máximo:
 * 2-3 code_challenges por lección, starter mínimo, alumno escribe TODO.
 *
 * MIX característico del CETI:
 * - Operaciones de archivo: `ofstream` / `ifstream` con `<<`, `>>`, `endl`.
 * - I/O de TERMINAL (lo que validan los tests): `printf` / `scanf`.
 *
 * Patrón fijo en retos: "escribir al archivo → leer del mismo archivo →
 * printf lo leído". Para imprimir un `std::string` con `printf` se usa
 * `printf("%s\\n", s.c_str());`. Para leer una palabra con `scanf`
 * usamos `char[]`.
 */
export const unidad09: UnitDefinition = {
  slug: "archivos",
  title: "Archivos: guardar y leer datos del disco",
  description:
    "Tus programas dejan de empezar de cero cada vez. ofstream, ifstream, getline y validación.",
  icon: "📂",
  published: true,
  lessons: [
    // =====================================================================
    // Lección 1: Escribir a un archivo con ofstream
    // =====================================================================
    {
      slug: "escribir-archivo",
      title: "Escribir a un archivo con ofstream",
      description: "Tu primer programa que deja huella en el disco.",
      xpReward: 35,
      estimatedMinutes: 10,
      steps: [
        {
          type: "theory",
          markdown: `## Por qué archivos

Hasta ahora todo lo que el programa guarda **desaparece** cuando termina:
variables, arreglos, todo. Si quieres que los datos sobrevivan (calificaciones
del semestre, lista de alumnos, configuración) necesitas escribirlos en un
**archivo de texto** del disco.

C++ trae dos herramientas:

- \`ofstream\` — **o**utput file stream — para **escribir** a un archivo.
- \`ifstream\` — **i**nput file stream — para **leer** de un archivo.

Las dos viven en \`#include <fstream>\`. Para escribir AL archivo usas
\`<<\` y \`endl\` (sí, como en el viejo cout — esto es la API de
streams, separada de la consola). Para imprimir EN la TERMINAL ya usas
\`printf\`.`,
        },
        {
          type: "code_example",
          code: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  ofstream archivo("notas.txt");   // abre (o crea) notas.txt
  archivo << "Aurora 9" << endl;
  archivo << "Mario 7"  << endl;
  archivo.close();                 // siempre cerrar al terminar

  printf("Listo\\n");
  return 0;
}`,
          explanation:
            "`ofstream archivo(\"notas.txt\");` crea el archivo (o lo abre si ya existe — borrando lo anterior). Después usas `archivo <<` con `endl`. `close()` confirma que todo se guardó. La salida a la TERMINAL (`Listo`) usa `printf`.",
          runnable: true,
          expectedOutput: "Listo",
        },
        {
          type: "quiz",
          question:
            "¿Qué `#include` necesitas para usar `ofstream`?",
          options: [
            "`<stdio.h>` (ya lo tengo).",
            "`<fstream>`.",
            "`<file>`.",
            "`<filesystem>`.",
          ],
          correctIndex: 1,
          explanation:
            "`<fstream>` (file stream) trae `ofstream` (para escribir) y `ifstream` (para leer). `<stdio.h>` es para `printf`/`scanf`, no para archivos.",
        },
        {
          type: "fill_blank",
          template: `#include <stdio.h>
#include {{0}}
using namespace std;

{{1}} main() {
  // Declara el stream de salida y abre el archivo
  {{2}} archivo("hola.txt");

  // Escribe 3 líneas usando el operador de file streams
  archivo {{3}} "Linea A" << endl;
  archivo << "Linea B" {{4}} endl;
  archivo << "Linea C" << endl;

  // Cierra el stream
  archivo.{{5}}();

  printf("Listo\\n");
  return {{6}};
}`,
          blanks: [
            { answer: "<fstream>", hint: "Header de archivos." },
            { answer: "int", hint: "Tipo de retorno de main." },
            { answer: "ofstream", hint: "Tipo para ESCRIBIR (output)." },
            { answer: "<<", hint: "Operador de salida (sale de aquí hacia el archivo)." },
            { answer: "<<", hint: "Mismo operador en cadena." },
            { answer: "close", hint: "Método para cerrar el stream." },
            { answer: "0", hint: "Código de salida correcto." },
          ],
          explanation:
            "Patrón fijo de escritura: `#include <fstream>` + `ofstream nombre(\"archivo\");` + escrituras con `<<` + `endl` + `nombre.close();`. La confirmación a la consola va con `printf`.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Crear y confirmar
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Crear un archivo y confirmar

Escribe un programa que:

1. Cree el archivo \`saludo.txt\` con la línea \`Hola CETI\` dentro.
2. Cierre el archivo.
3. Imprima en consola con \`printf\`: \`Archivo creado\`.

Salida esperada en consola:

\`\`\`
Archivo creado
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  ofstream archivo("saludo.txt");
  archivo << "Hola CETI" << endl;
  archivo.close();

  printf("Archivo creado\\n");
  return 0;
}`,
            hints: [
              "Falta todo el `int main()`.",
              "`ofstream archivo(\"saludo.txt\");` + `archivo << \"Hola CETI\" << endl;` + `archivo.close();`.",
              "Por último `printf(\"Archivo creado\\n\");`.",
            ],
            testCases: [
              {
                expectedStdout: "Archivo creado\n",
                visible: true,
                description: "Imprime la confirmación",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Tres líneas + verificación
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Tres líneas

Crea el archivo \`materias.txt\` con estas tres líneas en orden:

1. \`Programacion\`
2. \`Calculo\`
3. \`Fisica\`

Cierra el archivo. Después abre el mismo archivo con \`ifstream\` y léelo
**línea por línea** con \`getline\`, imprimiendo cada línea en consola con
\`printf("%s\\n", linea.c_str());\` (los strings de C++ se pasan a printf
con \`.c_str()\`).

Salida esperada:

\`\`\`
Programacion
Calculo
Fisica
\`\`\``,
            difficulty: "medium",
            xpReward: 40,
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
  ofstream salida("materias.txt");
  salida << "Programacion" << endl;
  salida << "Calculo"      << endl;
  salida << "Fisica"       << endl;
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
              "Primero el bloque de escritura: 3 `salida << \"...\" << endl;`.",
              "Después, abrir con `ifstream`, leer con `while (getline(...))` y `printf`.",
              "El string al printf va con `.c_str()`: `printf(\"%s\\n\", linea.c_str());`.",
            ],
            testCases: [
              {
                expectedStdout: "Programacion\nCalculo\nFisica\n",
                visible: true,
                description: "Tres materias en orden",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): scanf → archivo → ifstream → printf
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Eco vía disco

Lee desde \`scanf\` el **número de control** del alumno (una palabra, sin
espacios). Para leer la palabra usa \`char control[100];\` y
\`scanf("%99s", control);\`. Guárdalo en \`control.txt\` (una sola línea).
Cierra el archivo. Vuelve a abrirlo con \`ifstream\`, léelo a otra
\`char\` buffer, y respóndele con \`printf\`:

\`\`\`
Guardado: <numero>
\`\`\`

Para el test, el sistema enviará: \`23110567\`.

Salida esperada:

\`\`\`
Guardado: 23110567
\`\`\``,
            difficulty: "hard",
            xpReward: 50,
            starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  char control[100];
  scanf("%99s", control);

  ofstream salida("control.txt");
  salida << control << endl;
  salida.close();

  char leido[100];
  ifstream entrada("control.txt");
  entrada >> leido;
  entrada.close();

  printf("Guardado: %s\\n", leido);
  return 0;
}`,
            hints: [
              "Para una palabra con scanf usa `char control[100]; scanf(\"%99s\", control);`.",
              "Para leer del archivo a un char buffer: `entrada >> leido;` también funciona.",
              "`printf(\"Guardado: %s\\n\", leido);` usa `%s` para char arrays — sin `.c_str()`.",
            ],
            testCases: [
              {
                stdin: "23110567\n",
                expectedStdout: "Guardado: 23110567\n",
                visible: true,
                description: "Número de control",
              },
              {
                stdin: "ABCxyz999\n",
                expectedStdout: "Guardado: ABCxyz999\n",
                visible: false,
                description: "Cualquier palabra alfanumérica",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 2: Leer con ifstream
    // =====================================================================
    {
      slug: "leer-archivo",
      title: "Leer un archivo con ifstream",
      description:
        "Abre un archivo que ya existe y trae los datos a una variable.",
      xpReward: 40,
      estimatedMinutes: 11,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  // Primero lo creamos
  ofstream salida("dato.txt");
  salida << 42 << endl;
  salida.close();

  // Luego lo leemos
  ifstream entrada("dato.txt");
  int n;
  entrada >> n;
  entrada.close();

  printf("Lei: %i\\n", n);
  return 0;
}`,
          explanation:
            "`ifstream` funciona como un `cin` apuntando a un archivo: usa `entrada >> variable` para sacar valores. En este ejemplo el programa escribe primero y lee después. La salida a la TERMINAL va con `printf`.",
          runnable: true,
          expectedOutput: "Lei: 42",
        },
        {
          type: "quiz",
          question:
            "¿Cuál es la diferencia entre `ofstream` e `ifstream`?",
          options: [
            "Son lo mismo.",
            "`ofstream` escribe (usa `<<`); `ifstream` lee (usa `>>`).",
            "`ofstream` lee, `ifstream` escribe.",
            "Sirven para distintos tipos de archivos.",
          ],
          correctIndex: 1,
          explanation:
            "La `o` es output (salida → escribir), la `i` es input (entrada → leer). Los operadores: `<<` para meter al archivo, `>>` para sacar del archivo.",
        },
        {
          type: "fill_blank",
          template: `// Escribir 3 enteros, releer y mostrar el producto

{{0}} salida("trio.txt");
salida {{1}} 4 << " " << 5 << " " << 6 << endl;
salida.{{2}}();

{{3}} entrada("trio.txt");
int a, b, c;
entrada {{4}} a >> b >> c;
entrada.{{5}}();

printf("Producto: %i\\n", a {{6}} b {{7}} c);`,
          blanks: [
            { answer: "ofstream", hint: "Tipo para ESCRIBIR." },
            { answer: "<<", hint: "Operador de salida." },
            { answer: "close", hint: "Método de cierre del stream de salida." },
            { answer: "ifstream", hint: "Tipo para LEER." },
            { answer: ">>", hint: "Operador de entrada (encadenado con los otros >>)." },
            { answer: "close", hint: "Método de cierre del stream de entrada." },
            { answer: "*", hint: "Operador de multiplicación." },
            { answer: "*", hint: "Mismo operador (multiplicación)." },
          ],
          explanation:
            "El operador `>>` en archivos funciona como en `scanf`: extrae valores en orden. La impresión a CONSOLA va con `printf` y `%i`.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Round-trip
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Ciclo escribir → leer

Crea el archivo \`numero.txt\` con el entero **77** dentro, ciérralo, vuelve a
abrirlo con \`ifstream\` y léelo. Imprime SOLO el número leído con \`printf\`.

Salida esperada:

\`\`\`
77
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  ofstream salida("numero.txt");
  salida << 77 << endl;
  salida.close();

  ifstream entrada("numero.txt");
  int n;
  entrada >> n;
  entrada.close();

  printf("%i\\n", n);
  return 0;
}`,
            hints: [
              "Bloque 1: `ofstream` + `<<` para escribir 77.",
              "Bloque 2: `ifstream` + `>>` para leer en `int n;`.",
              "Imprime solo `n` con `printf(\"%i\\n\", n);`.",
            ],
            testCases: [
              {
                expectedStdout: "77\n",
                visible: true,
                description: "Reimprime 77 tras pasar por archivo",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Dos enteros, sumarlos
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Suma vía archivo

Crea el archivo \`pareja.txt\` con los enteros **15** y **27** (en el mismo
orden, separados por espacio o salto de línea — cualquiera de las dos).
Cierra el archivo. Vuelve a abrirlo con \`ifstream\`, lee los DOS enteros con
dos \`>>\` y muestra la **suma** con \`printf\` (sin texto, solo el número).

\`15 + 27 = 42\`.

Salida esperada:

\`\`\`
42
\`\`\``,
            difficulty: "medium",
            xpReward: 40,
            starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  ofstream salida("pareja.txt");
  salida << 15 << " " << 27 << endl;
  salida.close();

  ifstream entrada("pareja.txt");
  int a, b;
  entrada >> a >> b;
  entrada.close();

  printf("%i\\n", a + b);
  return 0;
}`,
            hints: [
              "Al escribir, separa los dos valores con un espacio o un endl.",
              "Al leer, `entrada >> a >> b;` toma los dos en una línea.",
              "Imprime `a + b` con `printf(\"%i\\n\", a + b);`.",
            ],
            testCases: [
              {
                expectedStdout: "42\n",
                visible: true,
                description: "15 + 27 = 42",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): scanf → archivo → producto
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Tres enteros vía archivo

Lee con \`scanf\` **3 enteros** del usuario. Guárdalos en \`numeros.txt\`
(separados por espacio o salto de línea). Cierra el archivo. Reabre, lee los
3 enteros y muestra su **producto** (multiplicación de los tres) en una sola
línea con \`printf\`.

Para el test, el sistema enviará: \`2 3 4\` (producto = 24).

Salida esperada:

\`\`\`
24
\`\`\``,
            difficulty: "hard",
            xpReward: 50,
            starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  int a, b, c;
  scanf("%i %i %i", &a, &b, &c);

  ofstream salida("numeros.txt");
  salida << a << " " << b << " " << c << endl;
  salida.close();

  ifstream entrada("numeros.txt");
  int x, y, z;
  entrada >> x >> y >> z;
  entrada.close();

  printf("%i\\n", x * y * z);
  return 0;
}`,
            hints: [
              "Cuatro pasos: scanf → ofstream → ifstream → printf.",
              "Al escribir, separa los 3 con espacios.",
              "Producto = `x * y * z`, imprime con `%i`.",
            ],
            testCases: [
              {
                stdin: "2 3 4\n",
                expectedStdout: "24\n",
                visible: true,
                description: "2 × 3 × 4 = 24",
              },
              {
                stdin: "5 5 5\n",
                expectedStdout: "125\n",
                visible: false,
                description: "5³ = 125",
              },
              {
                stdin: "0 100 200\n",
                expectedStdout: "0\n",
                visible: false,
                description: "Cualquier cero anula el producto",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 3: Validar apertura
    // =====================================================================
    {
      slug: "validar-archivo",
      title: "Verificar que el archivo se abrió",
      description:
        "Si el archivo no existe `ifstream` no truena, solo falla en silencio. Hay que checarlo.",
      xpReward: 40,
      estimatedMinutes: 10,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  ifstream archivo("noexiste.txt");

  if (!archivo) {
    printf("No se pudo abrir\\n");
    return 1;                 // sale con código de error
  }

  // si llegamos aquí, el archivo abrió bien
  int n;
  archivo >> n;
  printf("Lei: %i\\n", n);
  archivo.close();
  return 0;
}`,
          explanation:
            "`if (!archivo)` se lee como “si el archivo NO abrió correctamente”. Es el chequeo más importante: si no lo haces y el archivo no existe, tu programa lee basura sin que te enteres.",
          runnable: true,
          expectedOutput: "No se pudo abrir",
        },
        {
          type: "quiz",
          question:
            "¿Qué pasa si no validas y el archivo no existe?",
          options: [
            "El programa truena con error claro.",
            "Las variables quedan con basura o con su valor anterior y el programa sigue como si nada.",
            "C++ crea el archivo automáticamente.",
            "El programa se queda colgado para siempre.",
          ],
          correctIndex: 1,
          explanation:
            "Esa es la trampa: `ifstream` falla **en silencio**. El programa sigue, lee variables que nunca recibieron datos, y obtienes resultados absurdos sin explicación. Por eso siempre se valida.",
        },
        {
          type: "fill_blank",
          template: `// Lee un entero del archivo SI existe; si no, reporta y sale.
{{0}} archivo("config.txt");

{{1}} ({{2}}archivo) {
  printf("Error al abrir\\n");
  return {{3}};
}

// si llegamos aqui, el archivo SI abrio
int valor;
archivo {{4}} valor;
archivo.{{5}}();

printf("Lei: %i\\n", {{6}});
return {{7}};`,
          blanks: [
            { answer: "ifstream", hint: "Tipo de stream para LEER." },
            { answer: "if", hint: "Condicional para validar." },
            { answer: "!", hint: "Operador de negación lógica." },
            { answer: "1", hint: "Código de salida con error (no cero)." },
            { answer: ">>", hint: "Operador de lectura (del archivo)." },
            { answer: "close", hint: "Método para cerrar el stream." },
            { answer: "valor", hint: "La variable que recibió el dato." },
            { answer: "0", hint: "Código de salida exitoso." },
          ],
          explanation:
            "Patrón fijo: abrir → `if (!stream)` para detectar falla → si abrió, leer normal. `return 0` confirma éxito; `return 1` (o cualquier no-cero) indica error.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Reporte simple
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Intento fallido

Intenta abrir el archivo \`fantasma.txt\` con \`ifstream\`. Como no existe,
imprime en consola con \`printf\`:

\`\`\`
No existe
\`\`\`

Y termina con \`return 1;\`.

(El archivo NO debe ser creado: solo intentas leer y reportar la falla.)

Salida esperada:

\`\`\`
No existe
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  ifstream archivo("fantasma.txt");
  if (!archivo) {
    printf("No existe\\n");
    return 1;
  }
  return 0;
}`,
            hints: [
              "Sólo intenta abrir con `ifstream`.",
              "`if (!archivo)` detecta que falló.",
              "Dentro: `printf(\"No existe\\n\");` + `return 1;`.",
            ],
            testCases: [
              {
                expectedStdout: "No existe\n",
                visible: true,
                description: "Reporta el archivo faltante",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Doble intento
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Auto-reparación

Tu programa debe:

1. Intentar abrir \`config.txt\` con \`ifstream\`.
2. Si NO abre: imprimir \`Creando default\` con \`printf\`, **crearlo**
   escribiendo el número **42**, y cerrarlo.
3. Volver a abrirlo con \`ifstream\` (ahora SÍ existe), leer el número y
   imprimirlo con \`printf\`.

Como el archivo no existe la primera vez:

\`\`\`
Creando default
42
\`\`\``,
            difficulty: "medium",
            xpReward: 40,
            starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  ifstream primer("config.txt");
  if (!primer) {
    printf("Creando default\\n");
    ofstream nuevo("config.txt");
    nuevo << 42 << endl;
    nuevo.close();
  }
  primer.close();

  ifstream segundo("config.txt");
  int n;
  segundo >> n;
  segundo.close();
  printf("%i\\n", n);
  return 0;
}`,
            hints: [
              "Dentro del `if (!primer)` ve TODO el bloque de creación.",
              "Después del if, ABRE otra vez con un nuevo `ifstream` (no reuses el primero).",
              "Lee con `>>` a un `int n;` y `printf(\"%i\\n\", n);`.",
            ],
            testCases: [
              {
                expectedStdout: "Creando default\n42\n",
                visible: true,
                description: "Caída + creación + lectura exitosa",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Validación en dos archivos
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Dos archivos en cadena

Tu programa debe:

1. Crear \`origen.txt\` con la línea \`Hola CETI\` y cerrarlo.
2. Abrir \`origen.txt\` con \`ifstream\` y leer su línea con \`getline\`.
3. Si NO se pudo abrir, imprimir \`Fallo lectura\` con \`printf\` y \`return 1;\`.
4. Si sí se abrió, escribir esa línea en otro archivo \`copia.txt\` y cerrarlo.
5. Abrir \`copia.txt\` y leer su única línea con \`getline\`. Si falla,
   imprimir \`Fallo copia\` con \`printf\` y \`return 1;\`.
6. Si todo salió bien, imprimir la línea leída con
   \`printf("%s\\n", linea.c_str());\`.

En condiciones normales el archivo SÍ se va a crear, así que la salida es:

\`\`\`
Hola CETI
\`\`\``,
            difficulty: "hard",
            xpReward: 55,
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
  ofstream o1("origen.txt");
  o1 << "Hola CETI" << endl;
  o1.close();

  ifstream i1("origen.txt");
  if (!i1) {
    printf("Fallo lectura\\n");
    return 1;
  }
  string linea;
  getline(i1, linea);
  i1.close();

  ofstream o2("copia.txt");
  o2 << linea << endl;
  o2.close();

  ifstream i2("copia.txt");
  if (!i2) {
    printf("Fallo copia\\n");
    return 1;
  }
  string final;
  getline(i2, final);
  i2.close();

  printf("%s\\n", final.c_str());
  return 0;
}`,
            hints: [
              "Bloque 1: ofstream para crear origen.txt.",
              "Bloque 2: ifstream + validación + getline + close.",
              "Bloque 3: ofstream para copia.txt + ifstream + validación + getline + close + printf con `.c_str()`.",
            ],
            testCases: [
              {
                expectedStdout: "Hola CETI\n",
                visible: true,
                description: "Camino feliz: copia la línea de un archivo a otro",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 4: Línea por línea con getline
    // =====================================================================
    {
      slug: "leer-linea",
      title: "Leer línea por línea con getline",
      description:
        "Cuando cada línea del archivo es un dato completo (un nombre, una dirección, una frase).",
      xpReward: 45,
      estimatedMinutes: 12,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>
#include <fstream>
#include <string>
using namespace std;

int main() {
  // Preparamos el archivo con 3 líneas
  ofstream salida("alumnos.txt");
  salida << "Aurora Garcia" << endl;
  salida << "Mario Lopez"   << endl;
  salida << "Sofia Perez"   << endl;
  salida.close();

  // Lo leemos línea por línea
  ifstream entrada("alumnos.txt");
  string linea;
  while (getline(entrada, linea)) {
    printf("%s\\n", linea.c_str());
  }
  entrada.close();
  return 0;
}`,
          explanation:
            "`getline(entrada, linea)` lee una línea completa (incluyendo espacios) y devuelve `true` si lo logró. Dentro de un `while`, repite hasta llegar al final. Para imprimir un `std::string` con `printf` se usa `.c_str()`: `printf(\"%s\\n\", linea.c_str());`.",
          runnable: true,
          expectedOutput: "Aurora Garcia\nMario Lopez\nSofia Perez",
        },
        {
          type: "quiz",
          question:
            "¿Por qué `getline` va dentro de un `while` y no de un `for`?",
          options: [
            "Porque getline siempre va en while.",
            "Porque no sabes de antemano cuántas líneas tiene el archivo. `while (getline(...))` corre hasta que ya no haya más.",
            "Porque `for` no compila con strings.",
            "Por estética nada más.",
          ],
          correctIndex: 1,
          explanation:
            "Un archivo puede tener 3 o 3000 líneas — no lo sabes hasta llegar al final. `while (getline(...))` aprovecha que la función devuelve `false` cuando se acaba.",
        },
        {
          type: "fill_blank",
          template: `// Construye un archivo de 3 líneas, después léelo y cuéntalas

ofstream salida("notas.txt");
salida << "Linea A" << endl;
salida << "Linea B" << endl;
salida << "Linea C" << endl;
salida.close();

{{0}} f("notas.txt");
{{1}} linea;
int cuenta = {{2}};

{{3}} ({{4}}(f, {{5}})) {
  printf("%s\\n", linea.c_str());
  cuenta{{6}};
}
f.{{7}}();

printf("Total: %i\\n", cuenta);`,
          blanks: [
            { answer: "ifstream", hint: "Stream para LEER." },
            { answer: "string", hint: "Tipo para guardar una línea de texto." },
            { answer: "0", hint: "El contador parte de cero." },
            { answer: "while", hint: "Ciclo que sigue mientras la lectura tenga éxito." },
            { answer: "getline", hint: "Función que lee una línea completa (con espacios)." },
            { answer: "linea", hint: "Variable string donde se guarda cada línea." },
            { answer: "++", hint: "Incrementa el contador en uno por vuelta." },
            { answer: "close", hint: "Método para cerrar el stream." },
          ],
          explanation:
            "Sintaxis fija: `while (getline(stream, variable_string)) { ... }`. Para imprimir el string con `printf` usa `linea.c_str()`. El contador (entero) va con `%i`.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Eco de líneas
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Eco de líneas

Crea \`materias.txt\` con estas 3 líneas en orden:

- \`Programacion\`
- \`Calculo\`
- \`Electronica\`

Reábrelo con \`ifstream\` y léelo línea por línea con \`getline\`,
imprimiendo cada línea con \`printf("%s\\n", linea.c_str());\`.

Salida esperada:

\`\`\`
Programacion
Calculo
Electronica
\`\`\``,
            difficulty: "easy",
            xpReward: 35,
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
  ofstream salida("materias.txt");
  salida << "Programacion" << endl;
  salida << "Calculo"      << endl;
  salida << "Electronica"  << endl;
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
              "Bloque de escritura: 3 `salida << \"...\" << endl;`.",
              "Bloque de lectura: `while (getline(entrada, linea)) printf(\"%s\\n\", linea.c_str());`.",
              "Acuérdate de cerrar ambos streams.",
            ],
            testCases: [
              {
                expectedStdout: "Programacion\nCalculo\nElectronica\n",
                visible: true,
                description: "Tres materias en orden",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Contar líneas
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Conteo de líneas

Crea \`registro.txt\` con estas 4 líneas:

\`\`\`
Alumno1
Alumno2
Alumno3
Alumno4
\`\`\`

Reábrelo, recorre todas las líneas con \`getline\` y CUENTA cuántas hay.
Imprime SOLO el conteo (sin texto) con \`printf\` y \`%i\`.

Salida esperada:

\`\`\`
4
\`\`\``,
            difficulty: "medium",
            xpReward: 40,
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
  ofstream salida("registro.txt");
  salida << "Alumno1" << endl;
  salida << "Alumno2" << endl;
  salida << "Alumno3" << endl;
  salida << "Alumno4" << endl;
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
              "Después de escribir las 4 líneas, abre con `ifstream`.",
              "Acumulador `int cuenta = 0;` FUERA del while.",
              "Dentro del while solo `cuenta++;`. Al final imprime con `printf(\"%i\\n\", cuenta);`.",
            ],
            testCases: [
              {
                expectedStdout: "4\n",
                visible: true,
                description: "Cuatro líneas",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Solo líneas con A inicial
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Filtrar por inicial

Crea \`lista.txt\` con estas 5 líneas:

\`\`\`
Aurora
Mario
Andres
Sofia
Adriana
\`\`\`

Reábrelo y recórrelo con \`getline\`. **Imprime SOLO las líneas que comienzan
con la letra \`A\`** (mayúscula).

Pista: para checar el primer caracter de un string \`s\`, usa \`s[0]\` y
compáralo con \`'A'\`. Para imprimir el string usa \`printf("%s\\n", s.c_str());\`.

Salida esperada:

\`\`\`
Aurora
Andres
Adriana
\`\`\``,
            difficulty: "hard",
            xpReward: 55,
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
  ofstream salida("lista.txt");
  salida << "Aurora"  << endl;
  salida << "Mario"   << endl;
  salida << "Andres"  << endl;
  salida << "Sofia"   << endl;
  salida << "Adriana" << endl;
  salida.close();

  ifstream entrada("lista.txt");
  string linea;
  while (getline(entrada, linea)) {
    if (linea[0] == 'A') {
      printf("%s\\n", linea.c_str());
    }
  }
  entrada.close();
  return 0;
}`,
            hints: [
              "Las comillas simples `'A'` se usan para un solo caracter.",
              "`if (linea[0] == 'A') { printf(\"%s\\n\", linea.c_str()); }` dentro del while.",
              "No imprimas las que no empiezan con A.",
            ],
            testCases: [
              {
                expectedStdout: "Aurora\nAndres\nAdriana\n",
                visible: true,
                description: "Tres nombres con A inicial",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 5: Modo append
    // =====================================================================
    {
      slug: "modo-append",
      title: "Agregar al final sin borrar (modo append)",
      description:
        "Por defecto, abrir un archivo para escritura BORRA su contenido. Para agregar al final usas `ios::app`.",
      xpReward: 45,
      estimatedMinutes: 12,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>
#include <fstream>
#include <string>
using namespace std;

int main() {
  // Crear con contenido inicial
  ofstream a("log.txt");
  a << "Linea 1" << endl;
  a.close();

  // Abrir EN MODO APPEND para no borrar
  ofstream b("log.txt", ios::app);
  b << "Linea 2" << endl;
  b.close();

  // Verifica leyendo todo
  ifstream c("log.txt");
  string linea;
  while (getline(c, linea)) {
    printf("%s\\n", linea.c_str());
  }
  c.close();
  return 0;
}`,
          explanation:
            "Sin el segundo argumento `ios::app`, al reabrir un `ofstream` se BORRA todo lo anterior. Con `ios::app` (append = añadir) las nuevas líneas se pegan al final.",
          runnable: true,
          expectedOutput: "Linea 1\nLinea 2",
        },
        {
          type: "quiz",
          question:
            "Si abres `ofstream f(\"x.txt\");` y x.txt ya existía con contenido, ¿qué pasa con ese contenido?",
          options: [
            "Se conserva, las escrituras nuevas se agregan al final.",
            "Se BORRA completo — modo por defecto es truncate.",
            "Genera un error de compilación.",
            "Pide confirmación al usuario.",
          ],
          correctIndex: 1,
          explanation:
            "Por defecto `ofstream` **trunca** (borra) el contenido anterior. Es la causa #1 de pérdida de datos al empezar con archivos. Para evitarlo, usa `ios::app`.",
        },
        {
          type: "fill_blank",
          template: `// Construye un log de 3 entradas SIN perder lo anterior

// 1) Primera apertura: modo normal (crea o trunca)
{{0}} a("log.txt");
a << "Inicio" << endl;
a.{{1}}();

// 2) Segunda apertura: APPEND
ofstream b("log.txt", ios::{{2}});
b << "Avance" << endl;
b.close();

// 3) Tercera apertura: APPEND otra vez
{{3}} c("log.txt", ios::{{4}});
c << "Fin" << endl;
c.close();

// 4) Verificación leyendo todo
ifstream lector("log.txt");
{{5}} s;
{{6}} (getline(lector, s)) {
  printf("%s\\n", s.c_str());
}
lector.{{7}}();`,
          blanks: [
            { answer: "ofstream", hint: "Tipo del primer stream (escribe)." },
            { answer: "close", hint: "Método para cerrar el primer stream." },
            { answer: "app", hint: "Modo APPEND (sigue al final)." },
            { answer: "ofstream", hint: "Tipo del tercer stream (también escribe)." },
            { answer: "app", hint: "Mismo modo append." },
            { answer: "string", hint: "Tipo para leer una línea." },
            { answer: "while", hint: "Ciclo de lectura línea por línea." },
            { answer: "close", hint: "Cierre del stream lector." },
          ],
          explanation:
            "Sin `ios::app` el archivo se TRUNCA en cada apertura — pierdes lo anterior. Con `ios::app` las escrituras nuevas se pegan al final. La primera apertura va sin `ios::app` para empezar limpio.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Una sola apendida
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Primera apendida

Tu programa debe:

1. Crear \`historial.txt\` (modo normal) con la línea \`Inicio\`.
2. Reabrir el archivo en modo \`ios::app\` y agregar \`Fin\`.
3. Reabrir con \`ifstream\` y leer todo con \`getline\` para verificar
   (imprime cada línea con \`printf("%s\\n", linea.c_str());\`).

Salida esperada:

\`\`\`
Inicio
Fin
\`\`\``,
            difficulty: "easy",
            xpReward: 35,
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
  ofstream a("historial.txt");
  a << "Inicio" << endl;
  a.close();

  ofstream b("historial.txt", ios::app);
  b << "Fin" << endl;
  b.close();

  ifstream c("historial.txt");
  string linea;
  while (getline(c, linea)) {
    printf("%s\\n", linea.c_str());
  }
  c.close();
  return 0;
}`,
            hints: [
              "Primera apertura: SIN segundo argumento (trunca o crea).",
              "Segunda apertura: CON `ios::app`.",
              "Tercera: `ifstream` + `while (getline(...))` + `printf` con `.c_str()`.",
            ],
            testCases: [
              {
                expectedStdout: "Inicio\nFin\n",
                visible: true,
                description: "Dos líneas en orden, sin pérdida",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (medio): Append múltiple
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Bitácora de 4 entradas

Construye \`bitacora.txt\` así, **abriendo el archivo 4 veces**:

1. Primera apertura (modo normal): escribe \`Encendido\`.
2. Segunda apertura (modo append): agrega \`Inicio sesion\`.
3. Tercera apertura (modo append): agrega \`Operacion\`.
4. Cuarta apertura (modo append): agrega \`Apagado\`.

Después abre con \`ifstream\` y leerlo con \`getline\`, imprimiendo cada
línea con \`printf("%s\\n", linea.c_str());\`.

Salida esperada:

\`\`\`
Encendido
Inicio sesion
Operacion
Apagado
\`\`\``,
            difficulty: "medium",
            xpReward: 45,
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
  ofstream a("bitacora.txt");
  a << "Encendido" << endl;
  a.close();

  ofstream b("bitacora.txt", ios::app);
  b << "Inicio sesion" << endl;
  b.close();

  ofstream c("bitacora.txt", ios::app);
  c << "Operacion" << endl;
  c.close();

  ofstream d("bitacora.txt", ios::app);
  d << "Apagado" << endl;
  d.close();

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
              "Las otras 3 SÍ llevan `ios::app`.",
              "Al final, un solo bloque `ifstream` + `while (getline(...))` + `printf`.",
            ],
            testCases: [
              {
                expectedStdout: "Encendido\nInicio sesion\nOperacion\nApagado\n",
                visible: true,
                description: "Cuatro líneas en orden",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 3 (difícil): Append desde scanf en for
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Append en bucle

Lee con \`scanf\` **3 palabras** del usuario (separadas por espacio o línea).
Usa un \`char palabra[100];\` y \`scanf("%99s", palabra);\` por iteración.
Crea \`palabras.txt\` vacío (modo normal). Después, en un \`for\`, abre el
archivo **3 veces** en modo \`ios::app\` y escribe una palabra por apertura.

Cuando hayas terminado, abre con \`ifstream\` y léelo línea por línea para
verificar.

Para el test, el sistema enviará: \`Hola Mundo CETI\`.

Salida esperada:

\`\`\`
Hola
Mundo
CETI
\`\`\``,
            difficulty: "hard",
            xpReward: 55,
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
  // archivo vacío
  ofstream limpio("palabras.txt");
  limpio.close();

  for (int i = 0; i < 3; i++) {
    char palabra[100];
    scanf("%99s", palabra);
    ofstream app("palabras.txt", ios::app);
    app << palabra << endl;
    app.close();
  }

  ifstream lector("palabras.txt");
  string linea;
  while (getline(lector, linea)) {
    printf("%s\\n", linea.c_str());
  }
  lector.close();
  return 0;
}`,
            hints: [
              "Primera apertura SIN segundo argumento, solo para limpiar/crear.",
              "Dentro del for: `char palabra[100]; scanf(\"%99s\", palabra);`, abre con `ios::app`, escribe, cierra.",
              "Al final, `while (getline(...))` + `printf(\"%s\\n\", linea.c_str());`.",
            ],
            testCases: [
              {
                stdin: "Hola Mundo CETI\n",
                expectedStdout: "Hola\nMundo\nCETI\n",
                visible: true,
                description: "Tres palabras leídas y agregadas",
              },
              {
                stdin: "uno dos tres\n",
                expectedStdout: "uno\ndos\ntres\n",
                visible: false,
                description: "Cualquier triada funciona",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 6: Integrador
    // =====================================================================
    {
      slug: "integrador-archivos",
      title: "Integrador: boletín guardado en archivo",
      description:
        "Pide N calificaciones, guárdalas en un archivo y léelas para calcular estadísticas.",
      xpReward: 80,
      estimatedMinutes: 18,
      steps: [
        {
          type: "code_example",
          code: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  // 1) Pide y guarda
  ofstream salida("boletin.txt");
  for (int i = 0; i < 3; i++) {
    int n;
    scanf("%i", &n);
    salida << n << endl;
  }
  salida.close();

  // 2) Lee del archivo y suma
  ifstream entrada("boletin.txt");
  int valor;
  int suma = 0;
  int total = 0;
  while (entrada >> valor) {
    suma += valor;
    total++;
  }
  entrada.close();

  printf("Promedio: %.2f\\n", suma / (double)total);
  return 0;
}`,
          explanation:
            "Patrón completo: `scanf` arma el archivo vía `ofstream`, `ifstream` lo relee, y `while (entrada >> valor)` saca todo. El cast `(double)total` fuerza división con decimales, y `%.2f` los imprime con 2 decimales.",
          runnable: true,
          expectedOutput: "",
        },
        {
          type: "quiz",
          question:
            "¿Qué hace exactamente `while (entrada >> valor)`?",
          options: [
            "Lee una sola vez.",
            "Lee mientras `entrada >> valor` siga teniendo éxito; cuando se acaba el archivo, devuelve falso y el while termina.",
            "Crea una variable nueva en cada vuelta.",
            "Lee solo strings, no enteros.",
          ],
          correctIndex: 1,
          explanation:
            "Es el equivalente a `while (getline(...))` pero para valores sueltos. Cuando el stream se queda sin datos, la expresión es falsa y sales del while.",
        },
        {
          type: "fill_blank",
          template: `// Pipeline completo: scanf → archivo → archivo → estadísticas

// 1) Pide N enteros y guárdalos en el archivo
ofstream salida("datos.txt");
for (int i = 0; i < 5; i++) {
  int n;
  scanf("%i", {{0}}n);
  salida << n {{1}} endl;
}
salida.{{2}}();

// 2) Releer y calcular suma + cuenta
ifstream entrada("datos.txt");
int valor;
int suma   = {{3}};
int cuenta = 0;

{{4}} (entrada {{5}} valor) {
  suma {{6}} valor;
  cuenta{{7}};
}
entrada.close();

// 3) Imprime el promedio con 2 decimales
printf("Promedio: %.2f\\n", suma / ({{8}})cuenta);`,
          blanks: [
            { answer: "&", hint: "& OBLIGATORIO antes de la variable en scanf." },
            { answer: "<<", hint: "Escribe al stream del archivo." },
            { answer: "close", hint: "Cierra el stream de escritura." },
            { answer: "0", hint: "Acumulador empieza en cero." },
            { answer: "while", hint: "Ciclo que se detiene cuando la lectura falla." },
            { answer: ">>", hint: "Lee siguiente valor del archivo." },
            { answer: "+=", hint: "Atajo de acumulación." },
            { answer: "++", hint: "Incrementa el contador en uno." },
            { answer: "double", hint: "Cast a tipo con decimales para forzar división no entera." },
          ],
          explanation:
            "Pipeline `scanf → ofstream → ifstream → printf`. El `while (entrada >> valor)` corre hasta que el stream se acaba. Promedio impreso con `%.2f`.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (medio): Promedio en disco
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Promedio en disco

Tu programa debe:

1. Leer con \`scanf\` **5 calificaciones** enteras.
2. Guardarlas en \`boletin.txt\`, una por línea, en el orden recibido.
3. Cerrar el archivo.
4. Reabrirlo con \`ifstream\`, recorrerlo con \`while (entrada >> valor)\` y
   sumar.
5. Imprimir UNA sola línea con \`printf\`: \`Promedio: <p>\` con \`<p>\` =
   suma / 5.0 y **2 decimales** (\`%.2f\`).

Para el test, el sistema enviará: \`8 9 7 10 6\` (promedio = 8.00).

Salida esperada:

\`\`\`
Promedio: 8.00
\`\`\``,
            difficulty: "medium",
            xpReward: 50,
            starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  ofstream salida("boletin.txt");
  for (int i = 0; i < 5; i++) {
    int n;
    scanf("%i", &n);
    salida << n << endl;
  }
  salida.close();

  ifstream entrada("boletin.txt");
  int valor;
  int suma = 0;
  while (entrada >> valor) {
    suma += valor;
  }
  entrada.close();

  printf("Promedio: %.2f\\n", suma / 5.0);
  return 0;
}`,
            hints: [
              "Bloque 1: for de 5 vueltas, `scanf(\"%i\", &n); salida << n << endl;`.",
              "Bloque 2: `while (entrada >> valor) suma += valor;`.",
              "Divide entre `5.0` e imprime con `printf(\"Promedio: %.2f\\n\", ...);`.",
            ],
            testCases: [
              {
                stdin: "8 9 7 10 6\n",
                expectedStdout: "Promedio: 8.00\n",
                visible: true,
                description: "Promedio exacto, 2 decimales",
              },
              {
                stdin: "10 10 10 10 10\n",
                expectedStdout: "Promedio: 10.00\n",
                visible: false,
                description: "Todos 10",
              },
            ],
          },
        },
        // -----------------------------------------------------------------
        // Reto 2 (difícil): Reporte completo
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 2 — Reporte completo en disco

Construye un mini sistema:

1. Lee con \`scanf\` **5 calificaciones** enteras.
2. Escríbelas en \`reporte.txt\`, una por línea.
3. Cierra el archivo.
4. Reábrelo y, en una sola pasada con \`while (entrada >> valor)\`, calcula:
   - **suma**
   - **máximo** (arranca con el primer valor leído)
   - **cuántas son** \`>= 7\` (aprobados)
5. Imprime **TRES** líneas con \`printf\`:

\`\`\`
Promedio: <suma/5.0 con 2 decimales>
Mayor: <máximo>
Aprobados: <conteo>
\`\`\`

Para el test, el sistema enviará: \`8 5 10 7 4\`.

- Suma = 34, promedio = 6.80.
- Mayor = 10.
- Aprobados (≥7) = 3 (8, 10, 7).

Salida esperada:

\`\`\`
Promedio: 6.80
Mayor: 10
Aprobados: 3
\`\`\``,
            difficulty: "hard",
            xpReward: 70,
            starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  // Bloque 1: scanf + escribir archivo
  ofstream salida("reporte.txt");
  for (int i = 0; i < 5; i++) {
    int n;
    scanf("%i", &n);
    salida << n << endl;
  }
  salida.close();

  // Bloque 2: releer y agregar estadísticas
  ifstream entrada("reporte.txt");
  int valor;
  int suma = 0;
  int mayor = 0;
  int aprobados = 0;
  bool primero = true;

  while (entrada >> valor) {
    suma += valor;
    if (primero) {
      mayor = valor;
      primero = false;
    } else if (valor > mayor) {
      mayor = valor;
    }
    if (valor >= 7) aprobados++;
  }
  entrada.close();

  printf("Promedio: %.2f\\n", suma / 5.0);
  printf("Mayor: %i\\n", mayor);
  printf("Aprobados: %i\\n", aprobados);
  return 0;
}`,
            hints: [
              "Para el máximo dentro del while, usa una bandera `bool primero = true;` que inicialice `mayor` con la PRIMERA lectura. Después del primer valor, sigues comparando normal.",
              "Suma y aprobados son acumuladores normales que arrancan en 0.",
              "Tres `printf` distintos al final: `%.2f` para promedio, `%i` para los enteros, en el orden EXACTO Promedio → Mayor → Aprobados.",
            ],
            testCases: [
              {
                stdin: "8 5 10 7 4\n",
                expectedStdout: "Promedio: 6.80\nMayor: 10\nAprobados: 3\n",
                visible: true,
                description: "Caso ejemplo",
              },
              {
                stdin: "10 10 10 10 10\n",
                expectedStdout: "Promedio: 10.00\nMayor: 10\nAprobados: 5\n",
                visible: false,
                description: "Todos perfectos",
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
      ],
    },
  ],
};
