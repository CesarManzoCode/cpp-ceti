import type { UnitDefinition } from "../types";

// =====================================================================
// De problemas a objetos
//
// La unidad va de lo concreto a lo formal, en SEIS pasos pequeños y sin
// saltos — cada uno agrega UNA idea nueva:
//   1. datos repetidos → class, tipo propio, campos (sin new, sin objeto)
//   2. new, objeto, instancia, acceso con `.`
//   3. una clase, dos objetos independientes
//   4. estado y comportamiento, con traza antes → llamada → después
//   5. responsabilidad: quién debe hacer la operación
//   6. abstracción con propósito: qué miembros exige ESTE sistema
//
// Referencias y aliasing (`b = a`) NO viven aquí: llegan al final de U2,
// cuando el alumno ya distingue identidad, estado e independencia. Meterlos
// antes obliga a hablar de dos variables y un objeto justo cuando apenas se
// está asentando que cada `new` crea estado separado.
//
// Cada reto autónomo agrega UNA dimensión sobre la práctica guiada anterior.
// La lectura y conversión de datos viene escrita en el starter: leer no es
// lo que se está evaluando aquí, modelar sí.
// =====================================================================

export const unidad01: UnitDefinition = {
  slug: "csharp-poo-01-modelar",
  title: "De problemas a objetos",
  description: "Abstrae objetos cotidianos y conviértelos en clases, instancias, estado y comportamiento en C#.",
  icon: "🧱",
  published: true,
  lessons: [
    /**
     * Etapa 1: SÓLO class / tipo propio / campos. Nada de new, objeto,
     * instancia, métodos, responsabilidad, referencias ni encapsulación
     * — eso viene en las lecciones siguientes, una idea a la vez.
     */
    {
      slug: "pensar-en-objetos",
      title: "De variables sueltas a una clase",
      description: "Agrupa datos que se repiten en un molde propio: la clase.",
      estimatedMinutes: 8,
      xpReward: 25,
      steps: [
        {
          type: "theory",
          markdown: `# Los mismos dos datos, otra vez

En la tienda del taller cada producto tiene un nombre y unas existencias:

\`\`\`csharp
string nombre = "Taladro";
int existencias = 3;
\`\`\`

Pero la tienda no tiene un solo producto. Tiene muchos:

\`\`\`csharp
string nombre1 = "Taladro";
int existencias1 = 3;

string nombre2 = "Sierra";
int existencias2 = 8;
\`\`\`

Es el mismo par de datos, copiado, con un número al final del nombre para no chocar. Con diez productos serían veinte variables sueltas, sin nada que diga que \`nombre1\` y \`existencias1\` van juntos.

Falta un molde que diga: **todo Producto tiene un nombre y unas existencias.**`,
        },
        {
          type: "theory",
          markdown: `# \`class\`: un tipo que tú defines

C# ya trae tipos como \`string\` e \`int\`. Con \`class\` defines uno **tuyo**:

\`\`\`csharp
class Producto
{
    public string Nombre;
    public int Existencias;
}
\`\`\`

- \`class Producto\` declara el tipo nuevo.
- \`Nombre\` y \`Existencias\` son sus **campos**: los datos que va a tener todo Producto.
- \`public\` va antes de cada campo por ahora de forma mecánica — cópialo tal cual. En U2 verás qué significa exactamente y cuándo conviene cambiarlo.

Esto todavía **no crea ningún producto**. Es sólo el molde: dice qué tendrá un Producto, no cuál. Eso viene en la siguiente lección.`,
        },
        {
          type: "code_example",
          code: `class Producto
{
    public string Nombre;
    public int Existencias;
}`,
          explanation: "Dos campos, un molde. No hay Main aquí a propósito: una clase por sí sola no es un programa completo, y todavía no estamos creando ningún producto — sólo describiendo la forma que tendrán todos.",
          runnable: false,
          localOnlyNote: "Es sólo la declaración del molde: no se ejecuta todavía, se lee.",
        },
        {
          type: "quiz",
          question: "Dentro de `class Producto { public string Nombre; public int Existencias; }`, ¿qué es `Existencias`?",
          options: [
            "Un campo: un dato que cada Producto va a tener",
            "Una variable local dentro de Main",
            "El nombre de la clase",
            "Un valor concreto, como 3",
          ],
          feedbackPerOption: [
            "",
            "No está dentro de ningún método; está dentro de la clase.",
            "El nombre de la clase es Producto.",
            "Todavía no hay ningún valor: la clase sólo describe qué campo va a existir.",
          ],
          correctIndex: 0,
          explanation: "Los campos describen los datos que tendrá cada objeto de esa clase. Por ahora es sólo descripción: ningún Producto existe todavía.",
        },
        {
          type: "fill_blank",
          prompt: "Completa la declaración de una clase Herramienta con dos campos.",
          template: `{{0}} Herramienta
{
    public string {{1}};
    public int {{2}};
}`,
          blanks: [
            { answer: "class", hint: "La palabra que declara un tipo propio." },
            { answer: "Nombre", hint: "Un campo de texto, con mayúscula inicial." },
            { answer: "Existencias", hint: "Un campo numérico, con mayúscula inicial." },
          ],
          explanation: "class declara el molde; dentro van los campos con su tipo y su nombre, cada uno con `public` por ahora.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Tu turno: sólo el molde

El taller de robótica quiere modelar un \`Curso\`: cada curso tiene un **nombre** y un **cupo disponible**.

Declara la clase \`Curso\` con:

- un campo público \`Nombre\` de tipo \`string\`
- un campo público \`CupoDisponible\` de tipo \`int\`

Todavía no vas a crear ningún objeto — sólo el molde. \`Main\` se queda vacío.`,
            starterCode: `using System;

// Declara aquí la clase Curso

class Program
{
    static void Main()
    {
    }
}`,
            solutionCode: `using System;

class Curso
{
    public string Nombre;
    public int CupoDisponible;
}

class Program
{
    static void Main()
    {
    }
}`,
            hints: [
              "Empieza con class Curso, fuera de Program.",
              "Dos campos públicos: uno string, uno int.",
              "No necesitas new ni Main con contenido: sólo el molde.",
            ],
            difficulty: "easy",
            xpReward: 20,
            structure: {
              classes: [
                {
                  name: "Curso",
                  fields: [
                    { name: "Nombre", visibility: "public", type: "string" },
                    { name: "CupoDisponible", visibility: "public", type: "int" },
                  ],
                },
              ],
            },
            testCases: [
              {
                stdin: "",
                expectedStdout: "",
                visible: true,
                description: "Sólo se evalúa la estructura de la clase",
              },
            ],
          },
        },
      ],
    },
    /**
     * Etapa 2 (NUEVA): new, objeto, instancia, acceso con `.`. Reutiliza
     * la clase Producto de la lección anterior. Nada de "referencia" ni
     * de métodos: sólo crear y usar.
     */
    {
      slug: "crear-un-objeto",
      title: "Crear y usar un objeto",
      description: "El molde no basta: hay que construir uno con new.",
      estimatedMinutes: 9,
      xpReward: 28,
      steps: [
        {
          type: "theory",
          markdown: `# La clase describe, el objeto existe

Con la clase \`Producto\` de la lección anterior todavía no tienes ningún producto: sólo el molde. Para tener uno de verdad:

\`\`\`csharp
Producto taladro = new Producto();
taladro.Nombre = "Taladro";
taladro.Existencias = 3;
\`\`\`

- \`new Producto()\` **construye** un producto concreto siguiendo el molde de la clase.
- \`taladro\` es la variable que guarda ese producto. También se le llama **objeto** o **instancia**.
- Con el punto \`.\` accedes a sus campos: \`taladro.Nombre\`, \`taladro.Existencias\`.

Dicho corto: **la clase describe, el objeto existe.** Sin \`new\` sólo tienes el molde, no la pieza.`,
        },
        {
          type: "code_example",
          code: `using System;

class Producto
{
    public string Nombre;
    public int Existencias;
}

class Program
{
    static void Main()
    {
        Producto taladro = new Producto();
        taladro.Nombre = "Taladro";
        taladro.Existencias = 3;

        Console.WriteLine(taladro.Nombre);
        Console.WriteLine(taladro.Existencias);
    }
}`,
          explanation: "new Producto() crea el objeto; las dos líneas siguientes llenan sus campos con el punto. Cambia el 3 por otro número y verás que la segunda línea impresa cambia con él.",
          runnable: true,
          expectedOutput: `Taladro
3`,
        },
        {
          type: "quiz",
          question: "¿Cuál de estas líneas CREA el objeto (no sólo lo usa)?",
          options: [
            "taladro.Nombre = \"Taladro\";",
            "Producto taladro = new Producto();",
            "Console.WriteLine(taladro.Nombre);",
            "class Producto { public string Nombre; public int Existencias; }",
          ],
          feedbackPerOption: [
            "Eso asigna un campo de un objeto que ya existe.",
            "",
            "Eso sólo lee y muestra un campo.",
            "Eso es el molde; no crea ningún objeto por sí solo.",
          ],
          correctIndex: 1,
          explanation: "`new Producto()` es lo que construye el objeto. Todo lo demás asume que ya existe.",
        },
        {
          type: "fill_blank",
          prompt: "Completa la creación de un objeto Producto y la asignación de sus dos campos.",
          template: `{{0}} llave = {{1}} Producto();
llave.{{2}} = "Llave";
llave.{{3}} = 12;`,
          blanks: [
            { answer: "Producto", hint: "El tipo de la variable es la clase." },
            { answer: "new", hint: "La palabra que crea la instancia." },
            { answer: "Nombre", hint: "El campo de texto. Respeta la mayúscula." },
            { answer: "Existencias", hint: "El campo numérico. Respeta la mayúscula." },
          ],
          explanation: "Mismo patrón del ejemplo: tipo, new, y luego se llenan los dos campos del objeto con el punto.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Sólo crear y usar

La clase \`Alumno\` ya está escrita, con dos campos: \`Nombre\` y \`Grupo\`. \`Main\` ya lee ambos datos.

Te toca: crea el objeto, asígnale los datos leídos y muestra cada campo con \`Console.WriteLine\`, uno por línea. La clase no cambia — sólo la usas.`,
            starterCode: `using System;

class Alumno
{
    public string Nombre;
    public string Grupo;
}

class Program
{
    static void Main()
    {
        string nombre = Console.ReadLine();
        string grupo = Console.ReadLine();

        // Crea el objeto, asígnale los datos y muestra Nombre y Grupo
    }
}`,
            solutionCode: `using System;

class Alumno
{
    public string Nombre;
    public string Grupo;
}

class Program
{
    static void Main()
    {
        string nombre = Console.ReadLine();
        string grupo = Console.ReadLine();

        Alumno alumno = new Alumno();
        alumno.Nombre = nombre;
        alumno.Grupo = grupo;

        Console.WriteLine(alumno.Nombre);
        Console.WriteLine(alumno.Grupo);
    }
}`,
            hints: [
              "Usa new Alumno() para crear el objeto.",
              "Asigna cada campo con el punto: alumno.Nombre = nombre;",
              "Imprime cada campo con su propio Console.WriteLine.",
            ],
            difficulty: "easy",
            xpReward: 22,
            structure: {
              classes: [
                {
                  name: "Alumno",
                  fields: [
                    { name: "Nombre", visibility: "public", type: "string" },
                    { name: "Grupo", visibility: "public", type: "string" },
                  ],
                },
              ],
            },
            testCases: [
              {
                stdin: "Luna\n3A\n",
                expectedStdout: "Luna\n3A\n",
                visible: true,
                description: "Caso visible",
              },
              {
                stdin: "Iris Nava\n2B\n",
                expectedStdout: "Iris Nava\n2B\n",
                visible: false,
                description: "Nombre con espacio",
              },
            ],
          },
        },
      ],
    },
    /**
     * Etapa 3: una clase, dos objetos independientes. Se manipula UNO y se
     * comparan las dos salidas, con campos + Console.WriteLine directo
     * (sin métodos: `Mostrar()` llega hasta la etapa 4). Nada de `b = a`:
     * eso llega al final de U2.
     */
    {
      slug: "clase-objeto-instancia",
      title: "Una clase, muchos objetos",
      description: "Cada new crea un estado separado: cambia uno y el otro no se entera.",
      estimatedMinutes: 10,
      xpReward: 35,
      steps: [
        {
          type: "theory",
          markdown: `# Un molde, muchas piezas

Los lockers del taller son todos iguales de fábrica: cada uno tiene un número y un responsable. Un solo \`class Locker\` los describe a todos.

Pero el locker 12 es de Ana y el 13 es de Luis. **Cada \`new\` crea un estado separado.**

Eso es lo que vas a comprobar aquí: cambiarle el responsable a uno no le cambia nada al otro.`,
        },
        {
          type: "code_example",
          code: `using System;

class Locker
{
    public int Numero;
    public string Responsable;
}

class Program
{
    static void Main()
    {
        Locker a = new Locker();
        a.Numero = 12;
        a.Responsable = "Ana";

        Locker b = new Locker();
        b.Numero = 13;
        b.Responsable = "Luis";

        // Le cambiamos el responsable SÓLO al primero.
        a.Responsable = "Sofia";

        Console.WriteLine($"Locker {a.Numero}: {a.Responsable}");
        Console.WriteLine($"Locker {b.Numero}: {b.Responsable}");
    }
}`,
          explanation: "Dos `new`, dos objetos. Le cambiamos el responsable a `a` y `b` sigue con Luis: cada objeto tiene sus propios campos. Cambia la línea de Sofia por una que toque a `b` y verás moverse la otra línea, nunca las dos.",
          runnable: true,
          expectedOutput: `Locker 12: Sofia
Locker 13: Luis`,
        },
        {
          type: "quiz",
          question: "Con dos objetos creados por separado (`Locker a = new Locker();` y `Locker b = new Locker();`), ¿qué imprime `Console.WriteLine(b.Numero);` después de ejecutar `a.Numero = 99;`?",
          options: [
            "El número que se le dio a b: el cambio en a no lo toca.",
            "99, porque comparten la clase Locker.",
            "0, porque asignar a un objeto borra el otro.",
            "Nada: un campo sólo se puede leer una vez.",
          ],
          feedbackPerOption: [
            "",
            "La clase es el molde compartido, pero los datos no: viven en cada objeto.",
            "Asignar a un objeto no toca a los demás; nada se borra.",
            "Un campo se puede leer tantas veces como quieras.",
          ],
          correctIndex: 0,
          explanation: "Cada `new` reserva su propio estado. `a` y `b` comparten la clase, no los datos.",
        },
        {
          type: "fill_blank",
          prompt: "Completa la creación de DOS libros distintos a partir de la misma clase.",
          template: `{{0}} primero = {{1}} Libro();
{{2}} segundo = {{3}} Libro();`,
          blanks: [
            { answer: "Libro", hint: "El tipo de la variable es la clase." },
            { answer: "new", hint: "La palabra que crea una instancia." },
            { answer: "Libro", hint: "El segundo objeto usa el mismo tipo." },
            { answer: "new", hint: "También necesita su propia construcción: dos objetos, dos new." },
          ],
          explanation: "Hay dos expresiones `new`, por lo tanto hay dos objetos con estado independiente.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Dos libros, un molde

\`Main\` ya lee los datos. Te toca:

1. escribir la clase \`Libro\` con campos públicos \`Titulo\` (\`string\`) y \`Paginas\` (\`int\`);
2. crear **dos** objetos distintos en \`Main\`, darle sus datos a cada uno y mostrar ambos con \`Console.WriteLine\`, formato \`Titulo (N paginas)\`.

La dimensión nueva frente al reto anterior es una sola: ahora son dos objetos. Todavía sin métodos: imprime los campos directamente.`,
            starterCode: `using System;

// Escribe aquí la clase Libro

class Program
{
    static void Main()
    {
        string titulo1 = Console.ReadLine();
        int paginas1 = int.Parse(Console.ReadLine());
        string titulo2 = Console.ReadLine();
        int paginas2 = int.Parse(Console.ReadLine());

        // Crea DOS libros, dales sus datos y muestra cada uno.
    }
}`,
            solutionCode: `using System;

class Libro
{
    public string Titulo;
    public int Paginas;
}

class Program
{
    static void Main()
    {
        string titulo1 = Console.ReadLine();
        int paginas1 = int.Parse(Console.ReadLine());
        string titulo2 = Console.ReadLine();
        int paginas2 = int.Parse(Console.ReadLine());

        Libro primero = new Libro();
        primero.Titulo = titulo1;
        primero.Paginas = paginas1;

        Libro segundo = new Libro();
        segundo.Titulo = titulo2;
        segundo.Paginas = paginas2;

        Console.WriteLine($"{primero.Titulo} ({primero.Paginas} paginas)");
        Console.WriteLine($"{segundo.Titulo} ({segundo.Paginas} paginas)");
    }
}`,
            hints: [
              "La clase es como la del reto anterior, pero con dos campos.",
              "Cada objeto necesita su propio new: dos libros, dos new.",
              "Imprime cada libro con su propia línea, usando sus campos directamente.",
            ],
            difficulty: "easy",
            xpReward: 22,
            structure: {
              classes: [
                {
                  name: "Libro",
                  fields: [
                    { name: "Titulo", visibility: "public", type: "string" },
                    { name: "Paginas", visibility: "public", type: "int" },
                  ],
                },
              ],
            },
            testCases: [
              {
                stdin: "POO\n120\nUML\n80\n",
                expectedStdout: "POO (120 paginas)\nUML (80 paginas)\n",
                visible: true,
                description: "Dos libros",
              },
              {
                stdin: "Manual CETI\n1\nC Sharp\n450\n",
                expectedStdout: "Manual CETI (1 paginas)\nC Sharp (450 paginas)\n",
                visible: false,
                description: "Títulos con espacios",
              },
            ],
          },
        },
      ],
    },
    /**
     * Etapa 4: estado y comportamiento con traza antes → después. La
     * responsabilidad (quién debe hacer la operación) se movió a su
     * propia lección para no mezclar dos ideas nuevas en una sola.
     */
    {
      slug: "estado-y-comportamiento",
      title: "Los métodos cambian el estado",
      description: "Predice el valor antes y después de la llamada a un método.",
      estimatedMinutes: 9,
      xpReward: 32,
      steps: [
        {
          type: "theory",
          markdown: `# Antes, la llamada, después

La tarjeta del comedor guarda **un** dato: el saldo. Y tiene **una** acción: consumir.

Sigue la traza con los ojos antes de correr nada:

| Momento | \`Saldo\` |
|---|---|
| recién creada, con 100 | \`100\` |
| se ejecuta \`tarjeta.Consumir(25)\` | — |
| después de la llamada | \`75\` |

El dato que el objeto **recuerda** se llama **estado**. La acción que lo **cambia** se llama **comportamiento** (un método).`,
        },
        {
          type: "code_example",
          code: `using System;

class TarjetaComedor
{
    public int Saldo;

    public void Consumir(int cantidad)
    {
        Saldo = Saldo - cantidad;
    }
}

class Program
{
    static void Main()
    {
        TarjetaComedor tarjeta = new TarjetaComedor();
        tarjeta.Saldo = 100;

        Console.WriteLine(tarjeta.Saldo);   // antes
        tarjeta.Consumir(25);
        Console.WriteLine(tarjeta.Saldo);   // despues
    }
}`,
          explanation: "El programa imprime el estado antes y después de la llamada: 100 y 75. Consumir recibe un parámetro y usa ese valor para cambiar Saldo.",
          runnable: true,
          expectedOutput: `100
75`,
        },
        {
          type: "quiz",
          question: "El saldo es 40 y se ejecuta `tarjeta.Consumir(15)`. ¿Qué imprime la siguiente línea, `Console.WriteLine(tarjeta.Saldo);`?",
          options: ["40", "15", "25", "Nada, Consumir no imprime"],
          feedbackPerOption: [
            "Ése es el valor de antes; la llamada ya cambió el estado.",
            "Ése es el argumento que se consumió, no lo que queda.",
            "",
            "Consumir no imprime, pero la línea siguiente sí imprime el saldo.",
          ],
          correctIndex: 2,
          explanation: "El método cambió el estado: 40 − 15 = 25. Después de la llamada, el objeto recuerda el nuevo valor.",
        },
        {
          type: "code_completion",
          prompt: "Ordena el cuerpo de un método que registra una entrada: primero cambia el estado, luego muestra el valor ya actualizado.",
          lines: [
            "public void RegistrarEntrada()",
            "{",
            "    Entradas = Entradas + 1;",
            "    Console.WriteLine(Entradas);",
            "}",
          ],
          explanation: "Primero cambia el estado; después muestra el estado ya actualizado.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Un marcador que se mueve solo

\`Main\` ya lee los tres números y ya crea el marcador con su valor inicial. Te toca la clase y las dos llamadas.

Escribe \`Marcador\` con:

- un campo público \`Puntos\` de tipo \`int\`
- un método \`Sumar(int cantidad)\` que le sume al estado
- un método \`Restar(int cantidad)\` que le reste al estado

Y en \`Main\`, pídele al objeto que sume y que reste — **no cambies \`Puntos\` desde fuera**. La dimensión nueva es una: métodos que reciben un dato y modifican el estado.`,
            starterCode: `using System;

// Escribe aquí la clase Marcador

class Program
{
    static void Main()
    {
        int inicial = int.Parse(Console.ReadLine());
        int suma = int.Parse(Console.ReadLine());
        int resta = int.Parse(Console.ReadLine());

        Marcador marcador = new Marcador();
        marcador.Puntos = inicial;

        // Pídele al marcador que sume y que reste, y muestra el resultado
        // con el formato:  Puntos: N
    }
}`,
            solutionCode: `using System;

class Marcador
{
    public int Puntos;

    public void Sumar(int cantidad)
    {
        Puntos = Puntos + cantidad;
    }

    public void Restar(int cantidad)
    {
        Puntos = Puntos - cantidad;
    }
}

class Program
{
    static void Main()
    {
        int inicial = int.Parse(Console.ReadLine());
        int suma = int.Parse(Console.ReadLine());
        int resta = int.Parse(Console.ReadLine());

        Marcador marcador = new Marcador();
        marcador.Puntos = inicial;

        marcador.Sumar(suma);
        marcador.Restar(resta);

        Console.WriteLine($"Puntos: {marcador.Puntos}");
    }
}`,
            hints: [
              "Cada método recibe un `int cantidad` y modifica `Puntos`.",
              "Sumar: Puntos = Puntos + cantidad;  Restar: Puntos = Puntos - cantidad;",
              "La salida ocurre al final, después de las dos llamadas.",
            ],
            difficulty: "easy",
            xpReward: 22,
            structure: {
              classes: [
                {
                  name: "Marcador",
                  fields: [{ name: "Puntos", visibility: "public", type: "int" }],
                  methods: [
                    { name: "Sumar", visibility: "public", paramCount: 1 },
                    { name: "Restar", visibility: "public", paramCount: 1 },
                  ],
                },
              ],
            },
            testCases: [
              {
                stdin: "10\n7\n3\n",
                expectedStdout: "Puntos: 14\n",
                visible: true,
                description: "Cambio doble",
              },
              {
                stdin: "0\n100\n40\n",
                expectedStdout: "Puntos: 60\n",
                visible: false,
                description: "Parte de cero",
              },
              {
                stdin: "50\n0\n50\n",
                expectedStdout: "Puntos: 0\n",
                visible: false,
                description: "Llega a cero",
              },
            ],
          },
        },
      ],
    },
    /**
     * Etapa 5 (NUEVA): responsabilidad. Contrasta cambiar el campo desde
     * fuera contra pedírselo al objeto. Puede usar `if` (conocimiento
     * estructurado previo); todavía sin `private`.
     */
    {
      slug: "responsabilidad-del-objeto",
      title: "La operación pertenece al objeto",
      description: "Decide quién debe hacer el cambio: el objeto, no quien lo usa.",
      estimatedMinutes: 9,
      xpReward: 34,
      steps: [
        {
          type: "theory",
          markdown: `# ¿Quién debe hacer la operación?

Hay dos formas de descontar 25 pesos de una tarjeta:

\`\`\`csharp
// A: lo hace Program, por fuera
tarjeta.Saldo = tarjeta.Saldo - 25;

// B: lo hace la tarjeta
tarjeta.Consumir(25);
\`\`\`

Las dos dan 75 hoy. No son lo mismo mañana.

Cuando la escuela decida que el saldo no puede quedar negativo, en **A** hay que buscar y corregir cada línea del programa que resta saldo. En **B** se corrige en un solo lugar: dentro de \`Consumir\`.

A eso se le llama **responsabilidad**: la operación pertenece a la clase que es dueña del dato. Todavía no vamos a *impedir* el acceso directo desde fuera — eso lo hace \`private\`, y lo verás en la unidad siguiente. Por ahora se trata de decidir bien dónde vive el código, aunque nada te obligue todavía.`,
        },
        {
          type: "quiz",
          question: "El sistema del comedor va a agregar la regla “el saldo nunca puede quedar negativo”. ¿Cuál diseño hace ese cambio más fácil de aplicar de forma consistente?",
          options: [
            "Que cada parte del programa que descuenta escriba tarjeta.Saldo = tarjeta.Saldo - monto directamente.",
            "Que sólo TarjetaComedor.Consumir cambie Saldo, y todo el programa llame a Consumir.",
            "Da igual: el resultado numérico es el mismo.",
            "Convertir Saldo en una constante.",
          ],
          feedbackPerOption: [
            "Cada lugar que resta tendría que recordar agregar la misma regla por su cuenta.",
            "",
            "El resultado de hoy es igual, pero mantener la regla en un solo lugar es más fácil y más seguro.",
            "Una constante no podría cambiar nunca, ni siquiera válidamente.",
          ],
          correctIndex: 1,
          explanation: "Cuando la operación vive en un solo método, agregar o corregir una regla se hace en un solo lugar — y todo el que llama a Consumir queda protegido automáticamente.",
        },
        {
          type: "code_completion",
          prompt: "Ordena el cuerpo de Agregar: primero decide con un if si hay espacio, y sólo entonces cambia el estado.",
          lines: [
            "public void Agregar(int cantidad)",
            "{",
            "    if (Ocupados + cantidad <= Capacidad)",
            "    {",
            "        Ocupados = Ocupados + cantidad;",
            "    }",
            "}",
          ],
          explanation: "La decisión (if) va antes del cambio de estado: el objeto sólo se actualiza cuando la regla lo permite.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## La alberca decide, no Main

La alberca del CETI tiene un cupo máximo. Modela \`Alberca\` con:

- campo público \`Personas\` (cuántas hay ahora)
- campo público \`Capacidad\` (el cupo)
- método \`Entrar()\` que aumente \`Personas\` en 1 **sólo si todavía hay lugar** (\`Personas < Capacidad\`) — la decisión la toma la alberca, no quien la usa.

\`Main\` ya lee la capacidad, las personas iniciales y cuántas veces alguien intenta entrar; llama \`Entrar()\` esa cantidad de veces y al final imprime \`Personas\`. Todavía sin \`private\`: el campo sigue siendo público, pero nadie fuera de \`Alberca\` decide si se puede entrar.`,
            starterCode: `using System;

// Escribe aquí la clase Alberca

class Program
{
    static void Main()
    {
        int capacidad = int.Parse(Console.ReadLine());
        int personas = int.Parse(Console.ReadLine());
        int intentos = int.Parse(Console.ReadLine());

        Alberca alberca = new Alberca();
        alberca.Capacidad = capacidad;
        alberca.Personas = personas;

        // Llama Entrar() "intentos" veces y muestra Personas al final.
    }
}`,
            solutionCode: `using System;

class Alberca
{
    public int Personas;
    public int Capacidad;

    public void Entrar()
    {
        if (Personas < Capacidad)
        {
            Personas = Personas + 1;
        }
    }
}

class Program
{
    static void Main()
    {
        int capacidad = int.Parse(Console.ReadLine());
        int personas = int.Parse(Console.ReadLine());
        int intentos = int.Parse(Console.ReadLine());

        Alberca alberca = new Alberca();
        alberca.Capacidad = capacidad;
        alberca.Personas = personas;

        for (int i = 0; i < intentos; i++)
        {
            alberca.Entrar();
        }

        Console.WriteLine(alberca.Personas);
    }
}`,
            hints: [
              "Entrar no recibe parámetros: siempre intenta sumar uno.",
              "El if va DENTRO de Entrar, no en Main.",
              "Main sólo llama Entrar() en un ciclo; no revisa el cupo por su cuenta.",
            ],
            difficulty: "medium",
            xpReward: 30,
            structure: {
              classes: [
                {
                  name: "Alberca",
                  fields: [
                    { name: "Personas", visibility: "public", type: "int" },
                    { name: "Capacidad", visibility: "public", type: "int" },
                  ],
                  methods: [{ name: "Entrar", visibility: "public", paramCount: 0 }],
                },
              ],
            },
            testCases: [
              {
                stdin: "5\n3\n4\n",
                expectedStdout: "5\n",
                visible: true,
                description: "Se llena y bloquea los intentos de más",
              },
              {
                stdin: "10\n0\n3\n",
                expectedStdout: "3\n",
                visible: false,
                description: "Con espacio de sobra",
              },
              {
                stdin: "2\n2\n1\n",
                expectedStdout: "2\n",
                visible: false,
                description: "Ya está llena",
              },
            ],
          },
        },
      ],
    },
    /**
     * Etapa 6: abstracción con propósito. El reto evalúa SELECCIÓN de
     * miembros y responsabilidad; nada de formato nuevo ni de conversiones
     * que no se hayan explicado.
     */
    {
      slug: "abstraccion-con-criterio",
      title: "Abstraer es decidir qué importa",
      description: "Elige los miembros que ESTE sistema necesita y deja fuera el resto.",
      estimatedMinutes: 10,
      xpReward: 40,
      steps: [
        {
          type: "theory",
          markdown: `# Un modelo tiene propósito

Para asignar equipos de laboratorio, de una laptop importan su \`NumeroInventario\` y si está \`Disponible\`; y la operación importante es \`Prestar()\`.

Su fondo de pantalla no. El color de la mochila del alumno, tampoco.

Otro sistema —soporte técnico— quizá sí necesite número de serie y fecha de mantenimiento. **No hay una lista universal de datos correctos: hay datos que este sistema necesita.**

La pregunta no es "¿qué podría tener una laptop?", sino "¿qué necesita recordar y hacer **para este problema**?". Una clase con veinte campos irrelevantes no es más completa: es más difícil de entender y de mantener.`,
        },
        {
          type: "matching",
          prompt: "Para un sistema que presta equipo, separa lo relevante de lo decorativo.",
          pairs: [
            { left: "NumeroInventario", right: "Identifica el equipo prestado" },
            { left: "Disponible", right: "Permite decidir si se puede prestar" },
            { left: "Prestar()", right: "Cambia el estado operativo" },
            { left: "ColorFavoritoDelAlumno", right: "No pertenece al modelo de Equipo" },
          ],
          explanation: "La abstracción depende del problema y de las operaciones requeridas.",
        },
        {
          type: "quiz",
          question: "El requerimiento dice: “registrar préstamos y evitar prestar un equipo ocupado”. ¿Qué miembro sobra en `Equipo`?",
          options: [
            "Disponible",
            "Prestar()",
            "NumeroInventario",
            "MarcaDeLaMochilaDelAlumno",
          ],
          feedbackPerOption: [
            "Sin ese dato no se puede saber si el equipo ya está ocupado.",
            "Ésa es justo la operación que el requerimiento pide registrar.",
            "Sin él no se sabría qué equipo se prestó.",
            "",
          ],
          correctIndex: 3,
          explanation: "Ese dato no ayuda a identificar, prestar ni validar la disponibilidad del equipo: no pertenece a este modelo.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Sólo lo que el sistema necesita

El laboratorio quiere saber, de cada equipo, **su código** y **si está disponible**, y poder **prestarlo**. Nada más: ni la marca, ni el color, ni quién lo usó el semestre pasado.

\`Main\` ya lee los datos. Escribe \`Equipo\` con exactamente:

- campo público \`Codigo\` (\`string\`)
- campo público \`Disponible\` (\`bool\`)
- método \`Prestar()\` que ponga \`Disponible\` en \`false\` — **la operación la hace el equipo, no \`Main\`**
- método \`Mostrar()\` que escriba \`Codigo: libre\` u \`Codigo: ocupado\` según el estado

Se prestan dos equipos de los tres que hay; el tercero queda libre. Son objetos independientes: prestar uno no ocupa a los demás.`,
            starterCode: `using System;

// Escribe aquí la clase Equipo

class Program
{
    static void Main()
    {
        string a = Console.ReadLine();
        string b = Console.ReadLine();
        string c = Console.ReadLine();

        // Crea tres equipos disponibles, presta el primero y el tercero
        // (pidiéndoselo a ellos, no cambiando Disponible desde aquí)
        // y muestra los tres en orden.
    }
}`,
            solutionCode: `using System;

class Equipo
{
    public string Codigo;
    public bool Disponible;

    public void Prestar()
    {
        Disponible = false;
    }

    public void Mostrar()
    {
        if (Disponible)
        {
            Console.WriteLine($"{Codigo}: libre");
        }
        else
        {
            Console.WriteLine($"{Codigo}: ocupado");
        }
    }
}

class Program
{
    static void Main()
    {
        string a = Console.ReadLine();
        string b = Console.ReadLine();
        string c = Console.ReadLine();

        Equipo primero = new Equipo();
        primero.Codigo = a;
        primero.Disponible = true;

        Equipo segundo = new Equipo();
        segundo.Codigo = b;
        segundo.Disponible = true;

        Equipo tercero = new Equipo();
        tercero.Codigo = c;
        tercero.Disponible = true;

        primero.Prestar();
        tercero.Prestar();

        primero.Mostrar();
        segundo.Mostrar();
        tercero.Mostrar();
    }
}`,
            hints: [
              "Dos campos y dos métodos: nada más entra al modelo.",
              "Prestar no recibe nada; sólo hace Disponible = false;.",
              "Mostrar decide con un if entre \"libre\" y \"ocupado\".",
            ],
            difficulty: "medium",
            xpReward: 28,
            structure: {
              classes: [
                {
                  name: "Equipo",
                  fields: [
                    { name: "Codigo", visibility: "public", type: "string" },
                    { name: "Disponible", visibility: "public", type: "bool" },
                  ],
                  methods: [
                    { name: "Prestar", visibility: "public", paramCount: 0 },
                    { name: "Mostrar", visibility: "public", paramCount: 0 },
                  ],
                },
              ],
            },
            testCases: [
              {
                stdin: "LAB-01\nLAB-02\nLAB-03\n",
                expectedStdout: "LAB-01: ocupado\nLAB-02: libre\nLAB-03: ocupado\n",
                visible: true,
                description: "Dos prestados, uno libre",
              },
              {
                stdin: "PC 1\nPC 2\nPC 3\n",
                expectedStdout: "PC 1: ocupado\nPC 2: libre\nPC 3: ocupado\n",
                visible: false,
                description: "Códigos con espacio",
              },
            ],
          },
        },
      ],
    },
  ],
};
