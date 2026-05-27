import type { UnitDefinition } from "./types";

/**
 * Unidad 08 — Archivos (fstream)
 *
 * Cierre del recorrido básico de C++: ahora los datos sobreviven más allá
 * de que se cierre el programa. ofstream para escribir, ifstream para leer,
 * getline para línea por línea, validación con if (!archivo) y un
 * integrador que guarda y recupera un boletín.
 *
 * Patrón estable: code_example → quiz/fill_blank → code_challenge.
 * Como los tests verifican por stdout, los retos siempre siguen el patrón
 * "escribir al archivo → leer del mismo archivo → cout lo leído".
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
      description:
        "Tu primer programa que deja huella en el disco.",
      xpReward: 30,
      estimatedMinutes: 7,
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
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Crear un archivo y confirmarlo

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

int main() {
  // 1) abre saludo.txt con ofstream
  // 2) escríbele "Hola CETI" con endl
  // 3) ciérralo
  // 4) imprime "Archivo creado"

  return 0;
}`,
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
              "Declara `ofstream archivo(\"saludo.txt\");`.",
              "Para escribir usas el mismo `<<` que con cout.",
              "Después `archivo.close();` y por último el `cout << \"Archivo creado\"`.",
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
      ],
    },

    // =====================================================================
    // Lección 2: Leer un archivo con ifstream
    // =====================================================================
    {
      slug: "leer-archivo",
      title: "Leer un archivo con ifstream",
      description:
        "Abre un archivo que ya existe y trae los datos a una variable.",
      xpReward: 35,
      estimatedMinutes: 8,
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
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Ciclo escribir → leer

Tu programa debe:

1. Crear el archivo \`numero.txt\` con el entero **77** dentro.
2. Cerrar el archivo.
3. Volver a abrirlo con \`ifstream\` y leer ese entero.
4. Imprimir el número leído (sin texto, solo el número).

Salida esperada:

\`\`\`
77
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
  // 1) escribe 77 en numero.txt
  // 2) ábrelo con ifstream y léelo a una variable
  // 3) imprime esa variable

  return 0;
}`,
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
              "Primero `ofstream salida(...)` + `<<` para escribir.",
              "Después `ifstream entrada(...)` + `>>` para leer en una variable.",
              "Imprime con `cout << n << endl;` (sin texto extra).",
            ],
            testCases: [
              {
                expectedStdout: "77\n",
                visible: true,
                description: "Lee y reimprime 77",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 3: Validar que el archivo abrió
    // =====================================================================
    {
      slug: "validar-archivo",
      title: "Verificar que el archivo se abrió",
      description:
        "Si el archivo no existe `ifstream` no truena, solo falla en silencio. Hay que checarlo.",
      xpReward: 35,
      estimatedMinutes: 8,
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
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Doble intento

Tu programa debe:

1. Intentar abrir \`fantasma.txt\` (que no existe) con \`ifstream\`.
2. Si NO abre, imprimir \`Archivo no encontrado\` y crear ese archivo escribiéndole el número **123**.
3. Volver a leerlo y, si ahora SÍ abre, imprimir el número.

Como el archivo NO existe la primera vez, salida esperada:

\`\`\`
Archivo no encontrado
123
\`\`\``,
            difficulty: "medium",
            xpReward: 40,
            starterCode: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
  ifstream primer("fantasma.txt");
  if (!primer) {
    // imprime el aviso, crea el archivo con 123, ciérralo
  }
  primer.close();

  // ahora vuelve a abrirlo con ifstream y lee el número

  return 0;
}`,
            solutionCode: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
  ifstream primer("fantasma.txt");
  if (!primer) {
    cout << "Archivo no encontrado" << endl;
    ofstream nuevo("fantasma.txt");
    nuevo << 123 << endl;
    nuevo.close();
  }
  primer.close();

  ifstream segundo("fantasma.txt");
  int n;
  segundo >> n;
  segundo.close();
  cout << n << endl;
  return 0;
}`,
            hints: [
              "Dentro del `if (!primer)`: cout del aviso + abrir con `ofstream` para crearlo + escribir 123 + cerrar.",
              "Después del if, abre un segundo `ifstream` (puedes reusar el nombre o crear `segundo`).",
              "Lee a `int n;` y `cout << n << endl;`.",
            ],
            testCases: [
              {
                expectedStdout: "Archivo no encontrado\n123\n",
                visible: true,
                description: "Primer intento falla, segundo lee 123",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 4: Leer línea por línea con getline
    // =====================================================================
    {
      slug: "leer-linea",
      title: "Leer línea por línea con getline",
      description:
        "Cuando cada línea del archivo es un dato completo (un nombre, una dirección, una frase).",
      xpReward: 40,
      estimatedMinutes: 9,
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
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Eco de líneas

Tu programa debe:

1. Crear \`materias.txt\` con estas 3 líneas (en este orden):
   - \`Programacion\`
   - \`Calculo\`
   - \`Electronica\`
2. Cerrar el archivo.
3. Abrirlo con \`ifstream\` y leerlo línea por línea con \`getline\`.
4. Imprimir cada línea (en el MISMO orden).

Salida esperada:

\`\`\`
Programacion
Calculo
Electronica
\`\`\``,
            difficulty: "medium",
            xpReward: 40,
            starterCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
  // 1) escribe las 3 materias en materias.txt
  // 2) léelas con getline en un while
  // 3) imprime cada una

  return 0;
}`,
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
              "Tres `salida << \"...\" << endl;` para escribir las materias.",
              "El patrón de lectura es `while (getline(entrada, linea)) { cout << linea << endl; }`.",
              "No olvides `#include <string>`.",
            ],
            testCases: [
              {
                expectedStdout: "Programacion\nCalculo\nElectronica\n",
                visible: true,
                description: "Lee las 3 materias en orden",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 5: Modo append (no borrar lo anterior)
    // =====================================================================
    {
      slug: "modo-append",
      title: "Agregar al final sin borrar (modo append)",
      description:
        "Por defecto, abrir un archivo para escritura BORRA su contenido. Para agregar al final usas `ios::app`.",
      xpReward: 40,
      estimatedMinutes: 9,
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
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Bitácora de 3 entradas

Tu programa debe construir el archivo \`bitacora.txt\` con TRES líneas
agregadas en orden, **cada una con una apertura distinta** del archivo:

1. Primera apertura (modo normal): escribe \`Inicio\`.
2. Segunda apertura (modo append): agrega \`Avance\`.
3. Tercera apertura (modo append): agrega \`Fin\`.

Después, abre el archivo con \`ifstream\` y lo lees con \`getline\`, imprimiendo
cada línea.

Salida esperada:

\`\`\`
Inicio
Avance
Fin
\`\`\``,
            difficulty: "hard",
            xpReward: 45,
            starterCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
  // 1) escribe Inicio (modo normal)
  // 2) abre en modo append y escribe Avance
  // 3) abre en modo append y escribe Fin
  // 4) lee con getline e imprime

  return 0;
}`,
            solutionCode: `#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
  ofstream a("bitacora.txt");
  a << "Inicio" << endl;
  a.close();

  ofstream b("bitacora.txt", ios::app);
  b << "Avance" << endl;
  b.close();

  ofstream c("bitacora.txt", ios::app);
  c << "Fin" << endl;
  c.close();

  ifstream lector("bitacora.txt");
  string linea;
  while (getline(lector, linea)) {
    cout << linea << endl;
  }
  lector.close();
  return 0;
}`,
            hints: [
              "Primera apertura SIN segundo argumento (borra si existía).",
              "Segunda y tercera CON `ios::app`.",
              "Al final, el bloque de lectura `while (getline(...))`.",
            ],
            testCases: [
              {
                expectedStdout: "Inicio\nAvance\nFin\n",
                visible: true,
                description: "Tres líneas en orden, sin pérdida",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 6: Integrador (boletín en archivo)
    // =====================================================================
    {
      slug: "integrador-archivos",
      title: "Integrador: boletín guardado en archivo",
      description:
        "Pide N calificaciones, guárdalas en un archivo y léelas para calcular el promedio.",
      xpReward: 60,
      estimatedMinutes: 12,
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
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Boletín en disco

Tu programa debe:

1. Leer con \`cin\` **5 calificaciones enteras** del usuario.
2. Guardarlas en \`boletin.txt\`, una por línea, en el orden recibido.
3. Cerrar el archivo.
4. Reabrirlo con \`ifstream\`, recorrerlo con \`while (entrada >> valor)\` y
   calcular la suma.
5. Imprimir UNA sola línea: \`Promedio: <p>\` con \`<p>\` = suma / 5.0.

Para el test, el sistema enviará: \`8 9 7 10 6\` (suma = 40 → promedio = 8).

Salida esperada:

\`\`\`
Promedio: 8
\`\`\``,
            difficulty: "hard",
            xpReward: 50,
            starterCode: `#include <iostream>
#include <fstream>
using namespace std;

int main() {
  // 1) cin de 5 enteros → ofstream a boletin.txt
  // 2) ifstream + while(entrada >> valor) → suma
  // 3) cout << "Promedio: " << suma / 5.0 << endl;

  return 0;
}`,
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
              "Primero un for que lee con `cin` y escribe con `salida <<` (5 veces).",
              "Después un `while (entrada >> valor) suma += valor;`.",
              "Divide entre `5.0` (con punto) para obtener decimales.",
            ],
            testCases: [
              {
                stdin: "8 9 7 10 6\n",
                expectedStdout: "Promedio: 8\n",
                visible: true,
                description: "Caso 8,9,7,10,6 → promedio 8",
              },
              {
                stdin: "10 10 10 10 10\n",
                expectedStdout: "Promedio: 10\n",
                visible: true,
                description: "Todos 10 → promedio 10",
              },
            ],
          },
        },
      ],
    },
  ],
};
