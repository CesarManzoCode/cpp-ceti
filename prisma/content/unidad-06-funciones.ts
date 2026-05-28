import type { UnitDefinition } from "./types";

/**
 * Unidad 06 — Funciones
 *
 * El alumno aprende a empaquetar código reutilizable. Patrón estable:
 *   code_example → fill_blank → (quiz) → code_challenge.
 * Ejemplos del CETI: saludar, calcular promedio, verificar aprobado,
 * convertir calificación a letra.
 */
export const unidad06: UnitDefinition = {
  slug: "funciones",
  title: "Funciones: empaquetar tu código",
  description:
    "Define tus propias funciones para no repetir código. Parámetros, return y prototipos.",
  icon: "🧩",
  published: true,
  lessons: [
    // =====================================================================
    // Lección 1: Tu primera función (void, sin parámetros)
    // =====================================================================
    {
      slug: "funcion-void",
      title: "Tu primera función (void)",
      description:
        "Una función que no recibe nada y no devuelve nada — solo hace algo.",
      xpReward: 30,
      estimatedMinutes: 6,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

void saludar() {
  cout << "Hola alumno CETI" << endl;
}

int main() {
  saludar();
  saludar();
  return 0;
}`,
          explanation:
            "`void` significa que la función NO devuelve nada. Definirla NO la ejecuta — solo la registra. Para correrla, la **llamas** desde `main` con `saludar();`.",
          runnable: true,
          expectedOutput: `Hola alumno CETI
Hola alumno CETI`,
        },
        {
          type: "quiz",
          question:
            "¿Qué hace el `void` en `void saludar()`?",
          options: [
            "Indica que la función no recibe parámetros.",
            "Indica que la función no devuelve ningún valor.",
            "Hace que la función sea privada.",
            "Es un comentario, no afecta nada.",
          ],
          correctIndex: 1,
          explanation:
            "`void` es el tipo de retorno: ‘nada’. Si la función no necesita devolver un valor (solo imprime, modifica algo, etc.) usas `void`.",
        },
        {
          type: "fill_blank",
          template: `{{0}} despedir() {
  cout << "Hasta luego" << endl;
}

int main() {
  {{1}};
  return 0;
}`,
          blanks: [
            { answer: "void", hint: "Tipo de retorno cuando la función no devuelve nada." },
            { answer: "despedir()", hint: "Cómo se llama a la función — recuerda los paréntesis." },
          ],
          explanation:
            "Para definir: `void nombre() { ... }`. Para llamar: `nombre();`. Sin los `()` no se ejecuta.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Encabezado del programa

Define una función \`void\` llamada \`encabezado\` que imprima exactamente:

\`\`\`
=== CETI Colomos ===
\`\`\`

Y desde \`main\`, llámala **dos veces**. Salida esperada:

\`\`\`
=== CETI Colomos ===
=== CETI Colomos ===
\`\`\``,
            difficulty: "easy",
            xpReward: 25,
            starterCode: `#include <iostream>
using namespace std;

// Define encabezado aquí

int main() {
  // Llámala dos veces

  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

void encabezado() {
  cout << "=== CETI Colomos ===" << endl;
}

int main() {
  encabezado();
  encabezado();
  return 0;
}`,
            hints: [
              "Define la función ANTES de main: `void encabezado() { ... }`.",
              "Dentro: un solo `cout` con el texto exacto.",
              "En main: `encabezado();` dos veces (con el `;` cada vez).",
            ],
            testCases: [
              {
                expectedStdout: "=== CETI Colomos ===\n=== CETI Colomos ===\n",
                visible: true,
                description: "Imprime el encabezado dos veces",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 2: Parámetros
    // =====================================================================
    {
      slug: "parametros",
      title: "Funciones con parámetros",
      description:
        "Pasa datos a la función para que actúe sobre ellos.",
      xpReward: 35,
      estimatedMinutes: 7,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
#include <string>
using namespace std;

void saludar(string nombre) {
  cout << "Hola " << nombre << endl;
}

int main() {
  saludar("Aurora");
  saludar("Diego");
  return 0;
}`,
          explanation:
            "El parámetro `string nombre` recibe el valor que pongas entre los paréntesis al llamarla. Cada llamada puede pasar algo distinto.",
          runnable: true,
          expectedOutput: `Hola Aurora
Hola Diego`,
        },
        {
          type: "fill_blank",
          template: `void imprimir_edad({{0}} edad) {
  cout << "Tienes " << edad << " anios" << endl;
}

int main() {
  imprimir_edad({{1}});
  return 0;
}`,
          blanks: [
            { answer: "int", hint: "Tipo del parámetro: un número entero." },
            { answer: "19", hint: "Cualquier número entero como ejemplo." },
          ],
          explanation:
            "Al declarar la función indicas TIPO y NOMBRE del parámetro. Al llamarla pasas un valor de ese tipo.",
        },
        {
          type: "quiz",
          question:
            "Si llamas `saludar(\"Aurora\")`, ¿qué pasa dentro de la función?",
          options: [
            "`nombre` queda vacío.",
            "`nombre` toma el valor `\"Aurora\"` solo durante esa llamada.",
            "La función crea una variable global `nombre`.",
            "Da error porque no puedes pasar strings.",
          ],
          correctIndex: 1,
          explanation:
            "El parámetro es como una variable local que se inicializa con el argumento que pasas. Vive solo durante esa llamada.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Imprimir materia

Define una función \`void imprimir_materia(string nombre)\` que imprima:

\`\`\`
Materia: <nombre>
\`\`\`

(donde \`<nombre>\` es el parámetro recibido)

Desde \`main\`, llámala con \`"Calculo"\` y luego con \`"Programacion"\`. Salida esperada:

\`\`\`
Materia: Calculo
Materia: Programacion
\`\`\``,
            difficulty: "easy",
            xpReward: 30,
            starterCode: `#include <iostream>
#include <string>
using namespace std;

// Define imprimir_materia aquí

int main() {
  // Dos llamadas con strings distintos

  return 0;
}`,
            solutionCode: `#include <iostream>
#include <string>
using namespace std;

void imprimir_materia(string nombre) {
  cout << "Materia: " << nombre << endl;
}

int main() {
  imprimir_materia("Calculo");
  imprimir_materia("Programacion");
  return 0;
}`,
            hints: [
              "El parámetro va como `string nombre` dentro de los paréntesis.",
              "Dentro: `cout << \"Materia: \" << nombre << endl;`.",
              "En main: pasa el string entre comillas dobles en cada llamada.",
            ],
            testCases: [
              {
                expectedStdout: "Materia: Calculo\nMateria: Programacion\n",
                visible: true,
                description: "Dos llamadas con strings distintos",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 3: return — devolver un valor
    // =====================================================================
    {
      slug: "return-value",
      title: "Funciones que devuelven un valor",
      description:
        "En lugar de imprimir, la función calcula algo y lo regresa.",
      xpReward: 40,
      estimatedMinutes: 8,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

int doblar(int n) {
  return n * 2;
}

int main() {
  int x = doblar(5);
  cout << x << endl;       // 10
  cout << doblar(7) << endl; // 14
  return 0;
}`,
          explanation:
            "El tipo ANTES del nombre (`int doblar`) indica QUÉ devuelve. `return` entrega el valor y termina la función. Puedes capturarlo en una variable o usarlo directo en un `cout`.",
          runnable: true,
          expectedOutput: `10
14`,
        },
        {
          type: "quiz",
          question:
            "¿Qué pasa con el código que esté DESPUÉS de un `return` dentro de la misma función?",
          options: [
            "Se ejecuta normalmente.",
            "Se ejecuta solo si la condición es verdadera.",
            "No se ejecuta — `return` termina la función.",
            "Da error de compilación.",
          ],
          correctIndex: 2,
          explanation:
            "`return` sale de la función de inmediato. Cualquier código posterior dentro de la misma función queda muerto (de hecho el compilador suele avisar).",
        },
        {
          type: "fill_blank",
          template: `{{0}} sumar(int a, int b) {
  {{1}} a + b;
}

int main() {
  cout << sumar(3, 4) << endl;
  return 0;
}`,
          blanks: [
            { answer: "int", hint: "Tipo del valor que devuelve (entero)." },
            { answer: "return", hint: "Palabra clave para devolver el resultado." },
          ],
          explanation:
            "Si la función devuelve un entero, el tipo es `int`. Y `return expr;` entrega el valor calculado.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Función promedio de dos calificaciones

Define una función \`double promedio(int a, int b)\` que devuelva el promedio (suma / 2.0) de los dos enteros.

Desde \`main\`, calcula \`promedio(8, 10)\` e imprime el resultado.

Salida esperada:

\`\`\`
9
\`\`\``,
            difficulty: "medium",
            xpReward: 35,
            starterCode: `#include <iostream>
using namespace std;

// Define promedio aquí

int main() {
  cout << promedio(8, 10) << endl;
  return 0;
}`,
            solutionCode: `#include <iostream>
using namespace std;

double promedio(int a, int b) {
  return (a + b) / 2.0;
}

int main() {
  cout << promedio(8, 10) << endl;
  return 0;
}`,
            hints: [
              "Tipo de retorno: `double` porque el promedio puede tener decimales.",
              "Dentro: `return (a + b) / 2.0;` con `2.0` (no `2`) para no truncar.",
              "Los paréntesis aseguran que primero se suma y luego se divide.",
            ],
            testCases: [
              {
                expectedStdout: "9\n",
                visible: true,
                description: "Promedio de 8 y 10 es 9",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 4: Prototipos (forward declaration)
    // =====================================================================
    {
      slug: "prototipos",
      title: "Prototipos: declarar antes de definir",
      description:
        "Cómo usar una función ANTES de escribir su cuerpo.",
      xpReward: 30,
      estimatedMinutes: 6,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
using namespace std;

// Prototipo: solo la firma, terminada con ;
int cuadrado(int n);

int main() {
  cout << cuadrado(4) << endl;  // 16
  return 0;
}

// Definición completa (puede ir después)
int cuadrado(int n) {
  return n * n;
}`,
          explanation:
            "El **prototipo** (también llamado declaración) le dice al compilador ‘existe esta función’. Así puedes ponerla DESPUÉS de `main`. Sin prototipo, debes definirla antes de usarla.",
          runnable: true,
          expectedOutput: "16",
        },
        {
          type: "quiz",
          question:
            "¿Cuál es la diferencia entre un prototipo y la definición?",
          options: [
            "Son lo mismo, solo nombres distintos.",
            "El prototipo no tiene cuerpo (`{ ... }`) y termina en `;`.",
            "El prototipo va al final del archivo.",
            "La definición es opcional si hay prototipo.",
          ],
          correctIndex: 1,
          explanation:
            "El prototipo es solo la firma (tipo, nombre, parámetros) con `;` al final. La definición incluye el cuerpo `{ ... }`. Sin la definición no compila — el prototipo no la reemplaza.",
        },
        {
          type: "fill_blank",
          template: `#include <iostream>
using namespace std;

void presentar(string nombre){{0}}

int main() {
  presentar("Aurora");
  return 0;
}

void presentar(string nombre) {
  cout << "Hola " << nombre << endl;
}`,
          blanks: [
            { answer: ";", hint: "El prototipo termina con este caracter." },
          ],
          explanation:
            "Un prototipo NO lleva llaves, solo `;`. El cuerpo va en la definición de abajo.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Prototipo + definición

Escribe un programa con:

1. Un **prototipo** de \`int triple(int n);\` ANTES de \`main\`.
2. En \`main\`, imprime \`triple(5)\`.
3. La **definición** de \`triple\` DESPUÉS de \`main\`, que devuelva \`n * 3\`.

Salida esperada:

\`\`\`
15
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
using namespace std;

// Prototipo aquí

int main() {
  // Imprime triple(5)
  return 0;
}

// Definición aquí`,
            solutionCode: `#include <iostream>
using namespace std;

int triple(int n);

int main() {
  cout << triple(5) << endl;
  return 0;
}

int triple(int n) {
  return n * 3;
}`,
            hints: [
              "El prototipo es `int triple(int n);` (con `;` al final, sin llaves).",
              "En main: `cout << triple(5) << endl;`.",
              "La definición debajo es `int triple(int n) { return n * 3; }`.",
            ],
            testCases: [
              {
                expectedStdout: "15\n",
                visible: true,
                description: "triple(5) = 15",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 5: Parámetros con valor por defecto
    // =====================================================================
    {
      slug: "parametros-default",
      title: "Parámetros con valor por defecto",
      description:
        "Argumentos opcionales: si no los pasas, usan un valor predefinido.",
      xpReward: 30,
      estimatedMinutes: 6,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
#include <string>
using namespace std;

void saludar(string nombre = "alumno") {
  cout << "Hola " << nombre << endl;
}

int main() {
  saludar();         // usa "alumno" por defecto
  saludar("Aurora"); // usa "Aurora"
  return 0;
}`,
          explanation:
            "Si pones `= valor` al definir el parámetro, ese parámetro se vuelve opcional. Si no lo pasas, usa el default. Cuando hay varios defaults, deben estar SIEMPRE al final de la lista.",
          runnable: true,
          expectedOutput: `Hola alumno
Hola Aurora`,
        },
        {
          type: "fill_blank",
          template: `void repetir(string texto, int veces {{0}} 1) {
  for (int i = 0; i < veces; i++) {
    cout << texto << endl;
  }
}

int main() {
  repetir("CETI");      // 1 vez (default)
  repetir("Hola", 3);   // 3 veces
  return 0;
}`,
          blanks: [
            { answer: "=", hint: "Operador para asignar el valor por defecto." },
          ],
          explanation:
            "`int veces = 1` significa: si no me mandas `veces`, asume 1. La sintaxis es el operador `=` después del tipo y nombre.",
        },
        {
          type: "quiz",
          question:
            "¿Cuál de estas firmas es VÁLIDA en C++?",
          options: [
            "`void f(int a = 1, int b);`",
            "`void f(int a, int b = 2);`",
            "`void f(int a = 1, int b)` sin `;`",
            "Las dos primeras son válidas.",
          ],
          correctIndex: 1,
          explanation:
            "Los parámetros con default deben estar AL FINAL. No puedes tener `int a = 1, int b` porque dejas un default antes de un no-default.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Función con default

Define una función \`void imprimir_nota(string materia, int nota = 10)\`. Si no se pasa la nota, asume 10.

Imprime cada llamada con el formato:

\`\`\`
<materia>: <nota>
\`\`\`

Desde \`main\`, llama:
1. \`imprimir_nota("Calculo");\` (usa el default)
2. \`imprimir_nota("Fisica", 8);\`

Salida esperada:

\`\`\`
Calculo: 10
Fisica: 8
\`\`\``,
            difficulty: "medium",
            xpReward: 30,
            starterCode: `#include <iostream>
#include <string>
using namespace std;

// Define imprimir_nota con default aquí

int main() {
  // Dos llamadas: una sin nota, otra con nota

  return 0;
}`,
            solutionCode: `#include <iostream>
#include <string>
using namespace std;

void imprimir_nota(string materia, int nota = 10) {
  cout << materia << ": " << nota << endl;
}

int main() {
  imprimir_nota("Calculo");
  imprimir_nota("Fisica", 8);
  return 0;
}`,
            hints: [
              "Firma: `void imprimir_nota(string materia, int nota = 10)`.",
              "Dentro: `cout << materia << \": \" << nota << endl;`.",
              "En main: una llamada con un solo argumento, otra con dos.",
            ],
            testCases: [
              {
                expectedStdout: "Calculo: 10\nFisica: 8\n",
                visible: true,
                description: "Default y override",
              },
            ],
          },
        },
      ],
    },

    // =====================================================================
    // Lección 6: Ejercicio integrador
    // =====================================================================
    {
      slug: "funciones-integrador",
      title: "Integrador: aprobar o reprobar",
      description:
        "Junta funciones con parámetros, return y control de flujo en un programa real.",
      xpReward: 50,
      estimatedMinutes: 10,
      steps: [
        {
          type: "code_example",
          code: `#include <iostream>
#include <string>
using namespace std;

string estado(int calificacion) {
  if (calificacion >= 7) {
    return "Aprobado";
  } else {
    return "Reprobado";
  }
}

int main() {
  cout << estado(8) << endl;
  cout << estado(5) << endl;
  return 0;
}`,
          explanation:
            "Una función con `return` puede devolver desde un `if`. El primer `return` que se cumple termina la función — no hace falta `else` en realidad, pero ayuda a leer.",
          runnable: true,
          expectedOutput: `Aprobado
Reprobado`,
        },
        {
          type: "fill_blank",
          template: `bool aprobado(int calificacion) {
  {{0}} calificacion >= 7;
}

int main() {
  cout << aprobado(8) << endl;
  cout << aprobado(6) << endl;
  return 0;
}`,
          blanks: [
            { answer: "return", hint: "Devuelve directamente el resultado de la comparación." },
          ],
          explanation:
            "Como `calificacion >= 7` ya es un `bool`, puedes devolverlo directo sin un `if`. Es la versión más limpia.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Calificación → letra

Define una función \`string letra(int calificacion)\` que devuelva:

- \`"A"\` si \`calificacion >= 9\`
- \`"B"\` si \`calificacion >= 8\`
- \`"C"\` si \`calificacion >= 7\`
- \`"R"\` en cualquier otro caso

Desde \`main\`, imprime el resultado de \`letra(10)\`, \`letra(8)\` y \`letra(5)\`, cada uno en una línea.

Salida esperada:

\`\`\`
A
B
R
\`\`\``,
            difficulty: "hard",
            xpReward: 40,
            starterCode: `#include <iostream>
#include <string>
using namespace std;

// Define letra aquí

int main() {
  cout << letra(10) << endl;
  cout << letra(8) << endl;
  cout << letra(5) << endl;
  return 0;
}`,
            solutionCode: `#include <iostream>
#include <string>
using namespace std;

string letra(int calificacion) {
  if (calificacion >= 9) {
    return "A";
  } else if (calificacion >= 8) {
    return "B";
  } else if (calificacion >= 7) {
    return "C";
  } else {
    return "R";
  }
}

int main() {
  cout << letra(10) << endl;
  cout << letra(8) << endl;
  cout << letra(5) << endl;
  return 0;
}`,
            hints: [
              "Tipo de retorno: `string` (no `int`).",
              "Empieza por la condición MÁS estricta: `>= 9` para A.",
              "Cada rama del if tiene su `return \"...\";`.",
            ],
            testCases: [
              {
                expectedStdout: "A\nB\nR\n",
                visible: true,
                description: "10→A, 8→B, 5→R",
              },
            ],
          },
        },
      ],
    },
  ],
};
