import type { UnitDefinition } from "./types";

/**
 * Unidad 08 — Archivos (fstream)
 *
 * Cierre del recorrido básico. Aquí la curva de autonomía está al máximo:
 * 2-3 code_challenges por lección, starter mínimo (sólo includes), el
 * alumno escribe TODO. Los retos siempre siguen el patrón
 * "escribir al archivo → leer del mismo archivo → cout lo leído" para
 * que las pruebas puedan validarse desde stdout.
 */
export const unidad08: UnitDefinition = {
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

Las dos viven en \`#include <fstream>\`.`,
        },
        {
          type: "code_example",
          code: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
  ofstream archivo("notas.txt");   // abre (o crea) notas.txt
  archivo << "Aurora 9" << endl;
  archivo << "Mario 7"  << endl;
  archivo.close();                 // siempre cerrar al terminar

  cout << "Listo" << endl;
  return 0;
}`,
          explanation:
            "`ofstream archivo(\"notas.txt\");` crea el archivo (o lo abre si ya existe — borrando lo anterior). Después usas `archivo <<` igualito que `cout`. `close()` confirma que todo se guardó.",
          runnable: true,
          expectedOutput: "Listo",
        },
        {
          type: "quiz",
          question:
            "¿Qué `#include` necesitas para usar `ofstream`?",
          options: [
            "`<iostream>` (ya lo tengo).",
            "`<fstream>`.",
            "`<file>`.",
            "`<filesystem>`.",
          ],
          correctIndex: 1,
          explanation:
            "`<fstream>` (file stream) trae `ofstream` (para escribir) y `ifstream` (para leer). `<iostream>` solo es para consola.",
        },
        {
          type: "fill_blank",
          template: `#include <iostream>
#include {{0}}
using namespace std;

int main() {
  {{1}} salida("hola.txt");
  salida << "Hola disco" << endl;
  salida.close();
  return 0;
}`,
          blanks: [
            { answer: "<fstream>", hint: "El header de archivos." },
            { answer: "ofstream", hint: "Tipo para escribir (output)." },
          ],
          explanation:
            "Para escribir un archivo: `#include <fstream>` + `ofstream nombre(\"archivo.txt\");`",
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
3. Imprima en consola: \`Archivo creado\`.

Salida esperada en consola:

\`\`\`
Archivo creado
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <iostream>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
  ofstream archivo("saludo.txt");
  archivo << "Hola CETI" << endl;
  archivo.close();

  cout << "Archivo creado" << endl;
  return 0;
}`,
            hints: [
              "Falta todo el `int main()`.",
              "`ofstream archivo(\"saludo.txt\");` + `archivo << \"Hola CETI\" << endl;` + `archivo.close();`.",
              "Por último `cout << \"Archivo creado\" << endl;`.",
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
**línea por línea** con \`getline\`, imprimiendo cada línea en consola.

Salida esperada:

\`\`\`
Programacion
Calculo
Fisica
\`\`\``,
            difficulty: "medium",
            xpReward: 40,
            starterCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;
`,
            solutionCode: `#include <iostream>
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
    cout << linea << endl;
  }
  entrada.close();
  return 0;
}`,
            hints: [
              "Primero el bloque de escritura: 3 `salida << \"...\" << endl;`.",
              "Después, abrir con `ifstream`, leer con `while (getline(...))` e imprimir.",
              "Recuerda `#include <string>` (ya viene en el starter).",
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
        // Reto 3 (difícil): cin → archivo → archivo → cout
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Eco vía disco

Lee desde \`cin\` el **número de control** del alumno (una palabra, sin
espacios). Guárdalo en \`control.txt\` (una sola línea). Cierra el archivo.
Vuelve a abrirlo con \`ifstream\`, léelo, y respóndele:

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
            starterCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;
`,
            solutionCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
  string control;
  cin >> control;

  ofstream salida("control.txt");
  salida << control << endl;
  salida.close();

  ifstream entrada("control.txt");
  string leido;
  entrada >> leido;
  entrada.close();

  cout << "Guardado: " << leido << endl;
  return 0;
}`,
            hints: [
              "Tres pasos claros: cin → ofstream → ifstream → cout.",
              "Para leer una palabra del archivo, `entrada >> leido;` basta.",
              "El cout va con el prefijo `Guardado: ` (incluye el espacio).",
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
          code: `#include <iostream>
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

  cout << "Lei: " << n << endl;
  return 0;
}`,
          explanation:
            "`ifstream` funciona igual que `cin`: usa `entrada >> variable` para sacar valores del archivo. En este ejemplo el mismo programa escribe primero y lee después — útil para practicar y para que los tests funcionen.",
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
            "Mismo truco que `cout`/`cin`: la `o` es output (salida → escribir), la `i` es input (entrada → leer). Los operadores también: `<<` para meter, `>>` para sacar.",
        },
        {
          type: "fill_blank",
          template: `{{0}} entrada("datos.txt");
int x;
entrada {{1}} x;
entrada.close();
cout << x << endl;`,
          blanks: [
            { answer: "ifstream", hint: "El tipo para leer." },
            { answer: ">>", hint: "El operador que SACA datos del stream." },
          ],
          explanation:
            "Patrón clásico de lectura: `ifstream` + `>>` para cada valor + `close()`.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Round-trip
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Ciclo escribir → leer

Crea el archivo \`numero.txt\` con el entero **77** dentro, ciérralo, vuelve a
abrirlo con \`ifstream\` y léelo. Imprime SOLO el número leído.

Salida esperada:

\`\`\`
77
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <iostream>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <iostream>
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

  cout << n << endl;
  return 0;
}`,
            hints: [
              "Bloque 1: `ofstream` + `<<` para escribir 77.",
              "Bloque 2: `ifstream` + `>>` para leer en `int n;`.",
              "Imprime solo `n`, sin texto.",
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
dos \`>>\` y muestra la **suma** en una sola línea (sin texto).

\`15 + 27 = 42\`.

Salida esperada:

\`\`\`
42
\`\`\``,
            difficulty: "medium",
            xpReward: 40,
            starterCode: `#include <iostream>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <iostream>
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

  cout << a + b << endl;
  return 0;
}`,
            hints: [
              "Al escribir, separa los dos valores con un espacio o un endl.",
              "Al leer, `entrada >> a >> b;` toma los dos en una línea.",
              "Imprime `a + b` directo.",
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
        // Reto 3 (difícil): cin → archivo → producto
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Tres enteros vía archivo

Lee con \`cin\` **3 enteros** del usuario. Guárdalos en \`numeros.txt\`
(separados por espacio o salto de línea). Cierra el archivo. Reabre, lee los
3 enteros y muestra su **producto** (multiplicación de los tres) en una sola
línea.

Para el test, el sistema enviará: \`2 3 4\` (producto = 24).

Salida esperada:

\`\`\`
24
\`\`\``,
            difficulty: "hard",
            xpReward: 50,
            starterCode: `#include <iostream>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
  int a, b, c;
  cin >> a >> b >> c;

  ofstream salida("numeros.txt");
  salida << a << " " << b << " " << c << endl;
  salida.close();

  ifstream entrada("numeros.txt");
  int x, y, z;
  entrada >> x >> y >> z;
  entrada.close();

  cout << x * y * z << endl;
  return 0;
}`,
            hints: [
              "Cuatro pasos: cin → ofstream → ifstream → cout.",
              "Al escribir, separa los 3 con espacios.",
              "Producto = `x * y * z`.",
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
          code: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
  ifstream archivo("noexiste.txt");

  if (!archivo) {
    cout << "No se pudo abrir" << endl;
    return 1;                 // sale con código de error
  }

  // si llegamos aquí, el archivo abrió bien
  int n;
  archivo >> n;
  cout << "Lei: " << n << endl;
  archivo.close();
  return 0;
}`,
          explanation:
            "`if (!archivo)` lee como “si el archivo NO abrió correctamente”. Es el chequeo más importante: si no lo haces y el archivo no existe, tu programa lee basura sin que te enteres.",
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
          template: `ifstream archivo("notas.txt");
if ({{0}}archivo) {
  cout << "Error al abrir" << endl;
  return {{1}};
}`,
          blanks: [
            { answer: "!", hint: "Operador de negación." },
            { answer: "1", hint: "Código de salida de error (distinto de 0)." },
          ],
          explanation:
            "Convención: `return 0;` = todo bien, `return 1;` (o cualquier no-cero) = hubo error.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (fácil): Reporte simple
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Intento fallido

Intenta abrir el archivo \`fantasma.txt\` con \`ifstream\`. Como no existe,
imprime en consola:

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
            starterCode: `#include <iostream>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
  ifstream archivo("fantasma.txt");
  if (!archivo) {
    cout << "No existe" << endl;
    return 1;
  }
  return 0;
}`,
            hints: [
              "Sólo intenta abrir con `ifstream`.",
              "`if (!archivo)` detecta que falló.",
              "Dentro: cout + `return 1;`.",
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
2. Si NO abre: imprimir \`Creando default\`, **crearlo** escribiendo el número
   **42**, y cerrarlo.
3. Volver a abrirlo con \`ifstream\` (ahora SÍ existe), leer el número y
   imprimirlo.

Como el archivo no existe la primera vez:

\`\`\`
Creando default
42
\`\`\``,
            difficulty: "medium",
            xpReward: 40,
            starterCode: `#include <iostream>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
  ifstream primer("config.txt");
  if (!primer) {
    cout << "Creando default" << endl;
    ofstream nuevo("config.txt");
    nuevo << 42 << endl;
    nuevo.close();
  }
  primer.close();

  ifstream segundo("config.txt");
  int n;
  segundo >> n;
  segundo.close();
  cout << n << endl;
  return 0;
}`,
            hints: [
              "Dentro del `if (!primer)` ve TODO el bloque de creación.",
              "Después del if, ABRE otra vez con un nuevo `ifstream` (no reuses el primero).",
              "Lee con `>>` a un `int n;` y `cout << n << endl;`.",
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
3. Si NO se pudo abrir, imprimir \`Fallo lectura\` y \`return 1;\`.
4. Si sí se abrió, escribir esa línea en otro archivo \`copia.txt\` y cerrarlo.
5. Abrir \`copia.txt\` y leer su única línea con \`getline\`. Si falla,
   imprimir \`Fallo copia\` y \`return 1;\`.
6. Si todo salió bien, imprimir la línea leída de \`copia.txt\`.

En condiciones normales el archivo SÍ se va a crear, así que la salida es:

\`\`\`
Hola CETI
\`\`\``,
            difficulty: "hard",
            xpReward: 55,
            starterCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;
`,
            solutionCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
  ofstream o1("origen.txt");
  o1 << "Hola CETI" << endl;
  o1.close();

  ifstream i1("origen.txt");
  if (!i1) {
    cout << "Fallo lectura" << endl;
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
    cout << "Fallo copia" << endl;
    return 1;
  }
  string final;
  getline(i2, final);
  i2.close();

  cout << final << endl;
  return 0;
}`,
            hints: [
              "Bloque 1: ofstream para crear origen.txt.",
              "Bloque 2: ifstream + validación + getline + close.",
              "Bloque 3: ofstream para copia.txt + ifstream + validación + getline + close + cout.",
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
          code: `#include <iostream>
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
    cout << linea << endl;
  }
  entrada.close();
  return 0;
}`,
          explanation:
            "`getline(entrada, linea)` lee una línea completa (incluyendo espacios) y devuelve `true` si lo logró. Dentro de un `while`, repite hasta llegar al final del archivo. Es **el patrón** para leer archivos de texto.",
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
          template: `ifstream f("datos.txt");
string s;
while ({{0}}(f, {{1}})) {
  cout << s << endl;
}
f.close();`,
          blanks: [
            { answer: "getline", hint: "Función que lee una línea completa." },
            { answer: "s", hint: "La variable string donde se guarda." },
          ],
          explanation:
            "Sintaxis fija: `while (getline(stream, variable_string)) { ... }`.",
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
imprimiendo cada línea en consola.

Salida esperada:

\`\`\`
Programacion
Calculo
Electronica
\`\`\``,
            difficulty: "easy",
            xpReward: 35,
            starterCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;
`,
            solutionCode: `#include <iostream>
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
    cout << linea << endl;
  }
  entrada.close();
  return 0;
}`,
            hints: [
              "Bloque de escritura: 3 `salida << \"...\" << endl;`.",
              "Bloque de lectura: `while (getline(entrada, linea)) cout << linea << endl;`.",
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
Imprime SOLO el conteo (sin texto).

Salida esperada:

\`\`\`
4
\`\`\``,
            difficulty: "medium",
            xpReward: 40,
            starterCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;
`,
            solutionCode: `#include <iostream>
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

  cout << cuenta << endl;
  return 0;
}`,
            hints: [
              "Después de escribir las 4 líneas, abre con `ifstream`.",
              "Acumulador `int cuenta = 0;` FUERA del while.",
              "Dentro del while solo `cuenta++;` (no imprimas en cada vuelta).",
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
compáralo con \`'A'\`.

Salida esperada:

\`\`\`
Aurora
Andres
Adriana
\`\`\``,
            difficulty: "hard",
            xpReward: 55,
            starterCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;
`,
            solutionCode: `#include <iostream>
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
      cout << linea << endl;
    }
  }
  entrada.close();
  return 0;
}`,
            hints: [
              "Las comillas simples `'A'` se usan para un solo caracter.",
              "`if (linea[0] == 'A') { cout << linea << endl; }` dentro del while.",
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
          code: `#include <iostream>
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
    cout << linea << endl;
  }
  c.close();
  return 0;
}`,
          explanation:
            "Sin el segundo argumento `ios::app`, al reabrir un `ofstream` se BORRA todo lo anterior. Con `ios::app` (append = añadir) las nuevas líneas se pegan al final del archivo.",
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
          template: `ofstream archivo("registro.txt", ios::{{0}});
archivo << "nueva linea" << endl;
archivo.close();`,
          blanks: [
            { answer: "app", hint: "Modo APPEND, del inglés *append*." },
          ],
          explanation:
            "El segundo argumento `ios::app` activa el modo append.",
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
3. Reabrir con \`ifstream\` y leer todo con \`getline\` para verificar.

Salida esperada:

\`\`\`
Inicio
Fin
\`\`\``,
            difficulty: "easy",
            xpReward: 35,
            starterCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;
`,
            solutionCode: `#include <iostream>
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
    cout << linea << endl;
  }
  c.close();
  return 0;
}`,
            hints: [
              "Primera apertura: SIN segundo argumento (trunca o crea).",
              "Segunda apertura: CON `ios::app`.",
              "Tercera apertura: `ifstream` + `while (getline(...))`.",
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

Después abre con \`ifstream\` y leerlo con \`getline\`, imprimiendo cada línea.

Salida esperada:

\`\`\`
Encendido
Inicio sesion
Operacion
Apagado
\`\`\``,
            difficulty: "medium",
            xpReward: 45,
            starterCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;
`,
            solutionCode: `#include <iostream>
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
    cout << linea << endl;
  }
  lector.close();
  return 0;
}`,
            hints: [
              "Sólo la PRIMERA apertura va sin `ios::app`.",
              "Las otras 3 SÍ llevan `ios::app`.",
              "Al final, un solo bloque `ifstream` + `while (getline(...))`.",
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
        // Reto 3 (difícil): Append desde cin en for
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 3 — Append en bucle

Lee con \`cin\` **3 palabras** del usuario (separadas por espacio o línea).
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
            starterCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;
`,
            solutionCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
  // archivo vacío
  ofstream limpio("palabras.txt");
  limpio.close();

  for (int i = 0; i < 3; i++) {
    string palabra;
    cin >> palabra;
    ofstream app("palabras.txt", ios::app);
    app << palabra << endl;
    app.close();
  }

  ifstream lector("palabras.txt");
  string linea;
  while (getline(lector, linea)) {
    cout << linea << endl;
  }
  lector.close();
  return 0;
}`,
            hints: [
              "Primera apertura SIN segundo argumento, solo para limpiar/crear.",
              "Dentro del for: lee con `cin >> palabra;`, abre con `ios::app`, escribe, cierra.",
              "Al final, lectura completa con `while (getline(...))`.",
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
          code: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
  // 1) Pide y guarda
  ofstream salida("boletin.txt");
  for (int i = 0; i < 3; i++) {
    int n;
    cin >> n;
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

  cout << "Promedio: " << suma / (double)total << endl;
  return 0;
}`,
          explanation:
            "Patrón completo: `cin` arma el archivo, `ifstream` lo relee, y un acumulador con `while (entrada >> valor)` saca todo lo guardado. El cast `(double)total` fuerza división con decimales.",
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
          template: `int valor, suma = 0, cuenta = 0;
ifstream f("datos.txt");
while (f {{0}} valor) {
  suma += valor;
  cuenta{{1}};
}
f.close();`,
          blanks: [
            { answer: ">>", hint: "Mismo operador que con `cin`." },
            { answer: "++", hint: "Sube el contador 1 cada vuelta." },
          ],
          explanation:
            "Patrón: `while (stream >> variable)` para leer todos los valores que haya, sin saber cuántos son.",
        },
        // -----------------------------------------------------------------
        // Reto 1 (medio): Promedio en disco
        // -----------------------------------------------------------------
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Reto 1 — Promedio en disco

Tu programa debe:

1. Leer con \`cin\` **5 calificaciones** enteras.
2. Guardarlas en \`boletin.txt\`, una por línea, en el orden recibido.
3. Cerrar el archivo.
4. Reabrirlo con \`ifstream\`, recorrerlo con \`while (entrada >> valor)\` y
   sumar.
5. Imprimir UNA sola línea: \`Promedio: <p>\` con \`<p>\` = suma / 5.0.

Para el test, el sistema enviará: \`8 9 7 10 6\` (promedio = 8).

Salida esperada:

\`\`\`
Promedio: 8
\`\`\``,
            difficulty: "medium",
            xpReward: 50,
            starterCode: `#include <iostream>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
  ofstream salida("boletin.txt");
  for (int i = 0; i < 5; i++) {
    int n;
    cin >> n;
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

  cout << "Promedio: " << suma / 5.0 << endl;
  return 0;
}`,
            hints: [
              "Bloque 1: for de 5 vueltas, `cin >> n; salida << n << endl;`.",
              "Bloque 2: `while (entrada >> valor) suma += valor;`.",
              "Divide entre `5.0` para decimales.",
            ],
            testCases: [
              {
                stdin: "8 9 7 10 6\n",
                expectedStdout: "Promedio: 8\n",
                visible: true,
                description: "Promedio entero",
              },
              {
                stdin: "10 10 10 10 10\n",
                expectedStdout: "Promedio: 10\n",
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

1. Lee con \`cin\` **5 calificaciones** enteras.
2. Escríbelas en \`reporte.txt\`, una por línea.
3. Cierra el archivo.
4. Reábrelo y, en una sola pasada con \`while (entrada >> valor)\`, calcula:
   - **suma**
   - **máximo** (arranca con el primer valor leído)
   - **cuántas son** \`>= 7\` (aprobados)
5. Imprime **TRES** líneas exactamente:

\`\`\`
Promedio: <suma/5.0>
Mayor: <máximo>
Aprobados: <conteo>
\`\`\`

Para el test, el sistema enviará: \`8 5 10 7 4\`.

- Suma = 34, promedio = 6.8.
- Mayor = 10.
- Aprobados (≥7) = 3 (8, 10, 7).

Salida esperada:

\`\`\`
Promedio: 6.8
Mayor: 10
Aprobados: 3
\`\`\``,
            difficulty: "hard",
            xpReward: 70,
            starterCode: `#include <iostream>
#include <fstream>
using namespace std;
`,
            solutionCode: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
  // Bloque 1: cin + escribir archivo
  ofstream salida("reporte.txt");
  for (int i = 0; i < 5; i++) {
    int n;
    cin >> n;
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

  cout << "Promedio: " << suma / 5.0 << endl;
  cout << "Mayor: " << mayor << endl;
  cout << "Aprobados: " << aprobados << endl;
  return 0;
}`,
            hints: [
              "Para el máximo dentro del while, usa una bandera `bool primero = true;` que inicialice `mayor` con la PRIMERA lectura. Después del primer valor, sigues comparando normal.",
              "Suma y aprobados son acumuladores normales que arrancan en 0.",
              "Tres `cout` distintos al final, en el orden EXACTO Promedio → Mayor → Aprobados.",
            ],
            testCases: [
              {
                stdin: "8 5 10 7 4\n",
                expectedStdout: "Promedio: 6.8\nMayor: 10\nAprobados: 3\n",
                visible: true,
                description: "Caso ejemplo",
              },
              {
                stdin: "10 10 10 10 10\n",
                expectedStdout: "Promedio: 10\nMayor: 10\nAprobados: 5\n",
                visible: false,
                description: "Todos perfectos",
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
      ],
    },
  ],
};
