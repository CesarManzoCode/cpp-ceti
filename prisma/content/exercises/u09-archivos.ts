import type { PracticeUnitSetDefinition } from "./types";

/**
 * Ejercicios de práctica — Unidad 09: Archivos
 *
 * Mix CETI-style: file I/O con ofstream/ifstream + terminal con printf/scanf.
 *
 * ANTI-HARDCODE: todos los retos LEEN datos desde stdin (scanf) y tienen
 * varios test cases ocultos con inputs distintos. Así el alumno no puede
 * adivinar la salida y copiarla con un printf — debe procesar el input.
 * (Las pruebas validan stdout; el uso real del archivo no se puede forzar
 * desde stdout, pero al menos el ALGORITMO queda verificado y la salida
 * deja de ser fija.)
 *
 * Para imprimir un std::string con printf: `s.c_str()` y `%s`.
 *
 * Calibración:
 *   easy   — starter con includes + main + comentario
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
      title: "Guardar un número y recuperarlo",
      description: "Lee un entero, escríbelo al archivo, vuelve a leerlo y muéstralo.",
      difficulty: "easy",
      xpReward: 18,
      prompt: `## Round-trip de un número

1. Lee un entero \`n\` del usuario con \`scanf\`.
2. Escríbelo en \`dato.txt\` con \`ofstream\` y cierra.
3. Vuelve a abrir el archivo con \`ifstream\`, lee el entero y muéstralo con
   \`printf\`.

Para el test, el sistema enviará: \`99\`.

Salida esperada:

\`\`\`
99
\`\`\``,
      starterCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  int n;
  // 1) scanf  2) ofstream escribe n  3) ifstream lee  4) printf

  return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <fstream>
using namespace std;

int main() {
  int n;
  scanf("%i", &n);

  ofstream salida("dato.txt");
  salida << n << endl;
  salida.close();

  ifstream entrada("dato.txt");
  int leido;
  entrada >> leido;
  entrada.close();

  printf("%i\\n", leido);
  return 0;
}`,
      hints: [
        "Lee primero con `scanf(\"%i\", &n);`.",
        "Escribe al archivo con `<<` y lee de regreso con `>>`.",
        "Imprime el valor leído con `printf(\"%i\\n\", ...)`.",
      ],
      testCases: [
        {
          stdin: "99\n",
          expectedStdout: "99\n",
          visible: true,
          description: "Round-trip de 99",
        },
        {
          stdin: "7\n",
          expectedStdout: "7\n",
          visible: false,
          description: "Otro valor",
        },
        {
          stdin: "1000\n",
          expectedStdout: "1000\n",
          visible: false,
          description: "Valor grande",
        },
      ],
    },
    {
      slug: "u09-tres-lineas-archivo",
      title: "Tres palabras al archivo",
      description: "Lee 3 palabras, escríbelas como líneas y reimprímelas con getline.",
      difficulty: "easy",
      xpReward: 18,
      prompt: `## Tres palabras

1. Lee **3 palabras** del usuario con \`scanf\` (separadas por espacio).
2. Escríbelas en \`palabras.txt\`, **una por línea**, con \`ofstream\`.
3. Reabre con \`ifstream\` y léelas con \`getline\`, imprimiendo cada una con
   \`printf("%s\\n", linea.c_str())\`.

Para el test, el sistema enviará: \`Calculo Fisica Quimica\`.

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
  char a[100], b[100], c[100];
  // 1) scanf de 3 palabras  2) escribir cada una como línea
  // 3) getline + printf

  return 0;
}`,
      solutionCode: `#include <stdio.h>
#include <fstream>
#include <string>
using namespace std;

int main() {
  char a[100], b[100], c[100];
  scanf("%99s %99s %99s", a, b, c);

  ofstream salida("palabras.txt");
  salida << a << endl;
  salida << b << endl;
  salida << c << endl;
  salida.close();

  ifstream entrada("palabras.txt");
  string linea;
  while (getline(entrada, linea)) {
    printf("%s\\n", linea.c_str());
  }
  entrada.close();
  return 0;
}`,
      hints: [
        "Para leer 3 palabras: `scanf(\"%99s %99s %99s\", a, b, c);` (los char[] NO llevan `&`).",
        "Escribe cada palabra con `salida << a << endl;` etc.",
        "Para imprimir un string con printf: `printf(\"%s\\n\", linea.c_str());`.",
      ],
      testCases: [
        {
          stdin: "Calculo Fisica Quimica\n",
          expectedStdout: "Calculo\nFisica\nQuimica\n",
          visible: true,
          description: "Caso ejemplo",
        },
        {
          stdin: "uno dos tres\n",
          expectedStdout: "uno\ndos\ntres\n",
          visible: false,
          description: "Otras palabras",
        },
        {
          stdin: "Lunes Martes Miercoles\n",
          expectedStdout: "Lunes\nMartes\nMiercoles\n",
          visible: false,
          description: "Días",
        },
      ],
    },
    {
      slug: "u09-contar-lineas",
      title: "Contar palabras escritas",
      description: "Lee palabras hasta el final, escríbelas y cuenta las líneas.",
      difficulty: "easy",
      xpReward: 20,
      prompt: `## Contar líneas

Lee palabras del usuario **hasta que se acaben** (usa
\`while (scanf("%99s", buf) == 1)\`). Escribe cada palabra como una línea en
\`registro.txt\`. Después abre el archivo, recórrelo con \`getline\` y cuenta
cuántas líneas tiene. Imprime SOLO el conteo.

Para el test, el sistema enviará: \`Aurora Mario Sofia Andres\` (4 palabras).

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
  char buf[100];
  while (scanf("%99s", buf) == 1) {
    salida << buf << endl;
  }
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
        "`while (scanf(\"%99s\", buf) == 1)` lee palabras hasta que ya no haya (devuelve 1 mientras lea con éxito).",
        "Dentro del while, escribe `buf` como línea en el archivo.",
        "Después cuenta con otro `while (getline(...))` y un contador.",
      ],
      testCases: [
        {
          stdin: "Aurora Mario Sofia Andres\n",
          expectedStdout: "4\n",
          visible: true,
          description: "4 palabras",
        },
        {
          stdin: "uno dos\n",
          expectedStdout: "2\n",
          visible: false,
          description: "2 palabras",
        },
        {
          stdin: "a b c d e f\n",
          expectedStdout: "6\n",
          visible: false,
          description: "6 palabras",
        },
      ],
    },

    // -----------------------------------------------------------------
    // MEDIUM × 3
    // -----------------------------------------------------------------
    {
      slug: "u09-suma-tres-enteros",
      title: "Sumar 3 enteros vía archivo",
      description: "Lee 3 enteros, guárdalos en archivo y suma desde el archivo.",
      difficulty: "medium",
      xpReward: 24,
      prompt: `## Sumar tres vía archivo

1. Lee **3 enteros** del usuario con \`scanf\`.
2. Escríbelos en \`trio.txt\` (separados por espacios).
3. Reábrelo con \`ifstream\`, lee los 3 enteros con \`>>\` y muestra la suma.

Para el test, el sistema enviará: \`10 20 30\`.

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
  int a, b, c;
  scanf("%i %i %i", &a, &b, &c);

  ofstream salida("trio.txt");
  salida << a << " " << b << " " << c << endl;
  salida.close();

  ifstream entrada("trio.txt");
  int x, y, z;
  entrada >> x >> y >> z;
  entrada.close();

  printf("%i\\n", x + y + z);
  return 0;
}`,
      hints: [
        "Lee del usuario con `scanf(\"%i %i %i\", &a, &b, &c);`.",
        "Al escribir al archivo, separa con espacios entre `<<`.",
        "Al releer, `entrada >> x >> y >> z;` y suma.",
      ],
      testCases: [
        {
          stdin: "10 20 30\n",
          expectedStdout: "60\n",
          visible: true,
          description: "10+20+30",
        },
        {
          stdin: "1 2 3\n",
          expectedStdout: "6\n",
          visible: false,
          description: "1+2+3",
        },
        {
          stdin: "100 200 300\n",
          expectedStdout: "600\n",
          visible: false,
          description: "Valores grandes",
        },
      ],
    },
    {
      slug: "u09-append-bitacora",
      title: "Bitácora con append (no pierdas datos)",
      description: "Lee 3 palabras, escríbelas con append y verifica que ninguna se pierda.",
      difficulty: "medium",
      xpReward: 26,
      prompt: `## Bitácora con append

Lee **3 palabras** del usuario. Escribe la PRIMERA en \`bitacora.txt\` en modo
normal, y las otras dos en modo **\`ios::app\`** (para no borrar lo anterior).
Después abre el archivo, léelo con \`getline\` y muestra todas las líneas.

> Ojo: si usas modo normal en las 3, solo sobrevive la última — el test lo
> detecta porque faltarían líneas.

Para el test, el sistema enviará: \`Encendido Operacion Apagado\`.

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
  char a[100], b[100], c[100];
  scanf("%99s %99s %99s", a, b, c);

  ofstream s1("bitacora.txt");
  s1 << a << endl;
  s1.close();

  ofstream s2("bitacora.txt", ios::app);
  s2 << b << endl;
  s2.close();

  ofstream s3("bitacora.txt", ios::app);
  s3 << c << endl;
  s3.close();

  ifstream lector("bitacora.txt");
  string linea;
  while (getline(lector, linea)) {
    printf("%s\\n", linea.c_str());
  }
  lector.close();
  return 0;
}`,
      hints: [
        "Lee 3 palabras con `scanf(\"%99s %99s %99s\", a, b, c);`.",
        "Primera apertura SIN segundo argumento; las otras dos con `ios::app`.",
        "Si truncas en cada apertura, pierdes datos y el test falla — por eso el append importa.",
      ],
      testCases: [
        {
          stdin: "Encendido Operacion Apagado\n",
          expectedStdout: "Encendido\nOperacion\nApagado\n",
          visible: true,
          description: "Tres entradas en orden",
        },
        {
          stdin: "Inicio Avance Fin\n",
          expectedStdout: "Inicio\nAvance\nFin\n",
          visible: false,
          description: "Otras palabras",
        },
        {
          stdin: "uno dos tres\n",
          expectedStdout: "uno\ndos\ntres\n",
          visible: false,
          description: "Genéricas",
        },
      ],
    },
    {
      slug: "u09-filtrar-pares",
      title: "Filtrar pares del archivo",
      description: "Lee 6 enteros, guárdalos y muestra solo los pares al releer.",
      difficulty: "medium",
      xpReward: 26,
      prompt: `## Filtrar pares

1. Lee **6 enteros** del usuario con \`scanf\`.
2. Escríbelos en \`numeros.txt\` (uno por línea o separados por espacios).
3. Reábrelo con \`ifstream\` y, usando \`while (entrada >> valor)\`, imprime
   SOLO los pares, uno por línea.

Para el test, el sistema enviará: \`1 2 3 4 5 6\`.

Salida esperada:

\`\`\`
2
4
6
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
  for (int i = 0; i < 6; i++) {
    int n;
    scanf("%i", &n);
    salida << n << endl;
  }
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
        "Un for de 6 vueltas que lee con scanf y escribe al archivo.",
        "Al releer: `while (entrada >> valor)` y dentro `if (valor % 2 == 0) printf(...)`.",
      ],
      testCases: [
        {
          stdin: "1 2 3 4 5 6\n",
          expectedStdout: "2\n4\n6\n",
          visible: true,
          description: "Pares de 1..6",
        },
        {
          stdin: "10 15 20 25 30 35\n",
          expectedStdout: "10\n20\n30\n",
          visible: false,
          description: "Otros valores",
        },
        {
          stdin: "1 3 5 7 9 11\n",
          expectedStdout: "",
          visible: false,
          description: "Ningún par",
        },
      ],
    },

    // -----------------------------------------------------------------
    // HARD × 2
    // -----------------------------------------------------------------
    {
      slug: "u09-estadisticas-archivo",
      title: "Estadísticas de archivo",
      description: "Lee 5 enteros, guárdalos y calcula suma + máximo + promedio.",
      difficulty: "hard",
      xpReward: 32,
      prompt: `## Estadísticas vía archivo

1. Lee con \`scanf\` **5 enteros** del usuario.
2. Escríbelos en \`reporte.txt\`, uno por línea.
3. Reábrelo. En una sola pasada con \`while (entrada >> valor)\`, calcula:
   suma, máximo (arranca con el primer valor leído) y cuántos hay (cuenta).
4. Imprime **3 líneas**:

\`\`\`
Suma: <s>
Mayor: <m>
Promedio: <s / cuenta con 2 decimales>
\`\`\`

Para el test, el sistema enviará: \`8 5 10 7 4\`.

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
        "Usa una bandera `bool primero = true;` para inicializar `mayor` con la primera lectura.",
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
      description: "Lee 5 nombres, escríbelos, y copia solo los que empiezan con 'A'.",
      difficulty: "hard",
      xpReward: 34,
      prompt: `## Copia filtrada

1. Lee **5 nombres** del usuario con \`scanf\` (una palabra cada uno).
2. Escríbelos en \`origen.txt\`, uno por línea.
3. Abre \`origen.txt\` con \`ifstream\`. Por cada línea, si empieza con
   \`'A'\`, escríbela en \`filtrado.txt\` (modo normal la primera vez, append
   las demás).
4. Abre \`filtrado.txt\` y muestra todo su contenido con \`printf\`.

Para el test, el sistema enviará: \`Aurora Mario Andres Sofia Adriana\`.

- Empiezan con A: Aurora, Andres, Adriana.

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
  // 1) Leer 5 nombres y escribirlos en origen.txt
  ofstream o("origen.txt");
  for (int i = 0; i < 5; i++) {
    char nombre[100];
    scanf("%99s", nombre);
    o << nombre << endl;
  }
  o.close();

  // 2) Limpiar filtrado.txt
  ofstream limpio("filtrado.txt");
  limpio.close();

  // 3) Filtrar los que empiezan con 'A'
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

  // 4) Mostrar filtrado.txt
  ifstream lector("filtrado.txt");
  string s;
  while (getline(lector, s)) {
    printf("%s\\n", s.c_str());
  }
  lector.close();
  return 0;
}`,
      hints: [
        "Lee los 5 nombres con un for: `char nombre[100]; scanf(\"%99s\", nombre);` y escribe cada uno.",
        "Para el filtro, compara el primer caracter: `if (linea[0] == 'A')`.",
        "Escribe los filtrados en modo append para no perder los anteriores.",
      ],
      testCases: [
        {
          stdin: "Aurora Mario Andres Sofia Adriana\n",
          expectedStdout: "Aurora\nAndres\nAdriana\n",
          visible: true,
          description: "3 nombres con A",
        },
        {
          stdin: "Ana Beto Carlos Alberto Diego\n",
          expectedStdout: "Ana\nAlberto\n",
          visible: false,
          description: "Distinto set: solo Ana y Alberto",
        },
        {
          stdin: "Beto Carlos Diego Erik Fer\n",
          expectedStdout: "",
          visible: false,
          description: "Ninguno empieza con A",
        },
        {
          stdin: "Aldo Ariel Aaron Abel Ana\n",
          expectedStdout: "Aldo\nAriel\nAaron\nAbel\nAna\n",
          visible: false,
          description: "Todos empiezan con A",
        },
      ],
    },
  ],
};
