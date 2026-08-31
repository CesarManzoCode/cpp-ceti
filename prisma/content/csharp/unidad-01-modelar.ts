import type { UnitDefinition } from "../types";

// =====================================================================
// De problemas a objetos
//
// La unidad va de lo concreto a lo formal, en este orden y sin saltos:
//   1. un objeto concreto del problema (qué recuerda / qué hace)
//   2. del ejemplar al modelo: clase, objeto, instancia, `new`
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
     * Etapas 1 y 2: un objeto concreto y, sólo después, los nombres
     * formales (clase, objeto, instancia, `new`).
     */
    {
      slug: "pensar-en-objetos",
      title: "Pensar en objetos, no en una lista de instrucciones",
      description: "Un objeto concreto: qué necesita recordar y qué necesita hacer.",
      estimatedMinutes: 9,
      xpReward: 30,
      steps: [
        {
          type: "theory",
          markdown: `# Un taladro del taller

En el taller del CETI hay un taladro. Para controlar los préstamos, del taladro sólo importan dos cosas:

- **cómo se llama**: \`Taladro\`
- **cuántas piezas quedan**: \`3\`

Y una sola acción: **mostrar su ficha**, algo como \`Taladro: 3\`.

Eso es todo por ahora. Nada de herencia, nada de diagramas.

Fíjate en cómo se parte en dos: hay cosas que el taladro **recuerda** (nombre, existencias) y cosas que **hace** (mostrar su ficha). Esa separación es la idea central de la unidad; los nombres formales vienen en la pantalla siguiente, cuando ya la hayas visto funcionando.`,
        },
        {
          type: "code_example",
          code: `using System;

class Herramienta
{
    public string Nombre;
    public int Existencias;

    public void Mostrar()
    {
        Console.WriteLine($"{Nombre}: {Existencias}");
    }
}

class Program
{
    static void Main()
    {
        Herramienta taladro = new Herramienta();
        taladro.Nombre = "Taladro";
        taladro.Existencias = 3;
        taladro.Mostrar();
    }
}`,
          explanation: "Arriba está el taladro del que hablamos. `Nombre` y `Existencias` son lo que recuerda; `Mostrar()` es lo que hace. Córrelo y cambia el 3 por otro número: verás que la ficha cambia con él. Los campos son públicos sólo para ver la mecánica primero; en la unidad siguiente protegeremos el estado.",
          runnable: true,
          expectedOutput: "Taladro: 3",
        },
        {
          type: "theory",
          markdown: `# Ahora sí, los nombres

Ya viste el código funcionando. Ponle nombre a cada pieza:

- \`class Herramienta\` es la **clase**: el molde. Describe qué recordará y qué hará *cualquier* herramienta.
- \`taladro\` es un **objeto** (también se le dice **instancia**): una herramienta concreta, con sus propios datos.
- \`new Herramienta()\` es lo que **crea** el objeto. Sin \`new\` sólo tienes el molde, no la pieza.

Dicho corto: **la clase describe, el objeto existe.**

La clase no guarda "Taladro" ni el 3. Esos datos viven en el objeto.`,
        },
        {
          type: "fill_blank",
          prompt: "Completa la creación de un objeto a partir de la clase `Herramienta` y la asignación de su nombre.",
          template: `{{0}} llave = {{1}} Herramienta();
llave.{{2}} = "Llave";`,
          blanks: [
            { answer: "Herramienta", hint: "El tipo de la variable es la clase, igual que en el ejemplo." },
            { answer: "new", hint: "La palabra que crea la instancia." },
            { answer: "Nombre", hint: "El campo que guarda cómo se llama. Respeta la mayúscula." },
          ],
          explanation: "Mismo patrón del ejemplo: tipo, `new`, y luego se llenan los datos del objeto.",
        },
        {
          type: "quiz",
          question: "En el código de la lección, ¿cuál de estos es un objeto (una instancia)?",
          options: [
            "class Herramienta",
            "public int Existencias",
            "taladro",
            "Mostrar()",
          ],
          feedbackPerOption: [
            "Eso describe; todavía no existe ninguna herramienta concreta.",
            "Eso es uno de los datos que la clase dice que habrá.",
            "",
            "Eso es una de las acciones que la clase describe.",
          ],
          correctIndex: 2,
          explanation: "`new Herramienta()` crea el objeto y `taladro` es la variable que lo referencia: la clase describe, el objeto existe.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Tu turno: la clase

\`Main\` ya está escrito: lee el nombre, crea el objeto, le asigna el nombre y llama a \`Presentar()\`. **Falta la clase.**

Escribe \`FichaHerramienta\` con:

- un campo público \`Nombre\` de tipo \`string\`
- un método \`Presentar()\` que escriba exactamente \`Herramienta: Nombre\`

Es el mismo patrón del ejemplo, con un solo dato en vez de dos.`,
            starterCode: `using System;

// Escribe aquí la clase FichaHerramienta

class Program
{
    static void Main()
    {
        string nombre = Console.ReadLine();
        FichaHerramienta ficha = new FichaHerramienta();
        ficha.Nombre = nombre;
        ficha.Presentar();
    }
}`,
            solutionCode: `using System;

class FichaHerramienta
{
    public string Nombre;

    public void Presentar()
    {
        Console.WriteLine($"Herramienta: {Nombre}");
    }
}

class Program
{
    static void Main()
    {
        string nombre = Console.ReadLine();
        FichaHerramienta ficha = new FichaHerramienta();
        ficha.Nombre = nombre;
        ficha.Presentar();
    }
}`,
            hints: [
              "La clase va FUERA de Program, igual que Herramienta en el ejemplo.",
              "Adentro: un campo `public string Nombre;` y un método `public void Presentar()`.",
              "Presentar imprime con interpolación: $\"Herramienta: {Nombre}\".",
            ],
            difficulty: "easy",
            xpReward: 20,
            structure: {
              classes: [
                {
                  name: "FichaHerramienta",
                  fields: [{ name: "Nombre", visibility: "public", type: "string" }],
                  methods: [{ name: "Presentar", visibility: "public" }],
                },
              ],
            },
            testCases: [
              {
                stdin: "Martillo\n",
                expectedStdout: "Herramienta: Martillo\n",
                visible: true,
                description: "Caso visible",
              },
              {
                stdin: "Broca 1/4\n",
                expectedStdout: "Herramienta: Broca 1/4\n",
                visible: false,
                description: "Nombre con espacio",
              },
              {
                stdin: "Nivel\n",
                expectedStdout: "Herramienta: Nivel\n",
                visible: false,
                description: "Otro nombre",
              },
            ],
          },
        },
      ],
    },
    /**
     * Etapa 3: una clase, dos objetos independientes. Se manipula UNO y se
     * comparan las dos salidas. Nada de `b = a`: eso llega al final de U2.
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

    public void Mostrar()
    {
        Console.WriteLine($"Locker {Numero}: {Responsable}");
    }
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

        a.Mostrar();
        b.Mostrar();
    }
}`,
          explanation: "Dos `new`, dos objetos. Le cambiamos el responsable a `a` y `b` sigue con Luis: cada objeto tiene sus propios datos. Cambia la línea de Sofia por una que toque a `b` y verás moverse la otra línea, nunca las dos.",
          runnable: true,
          expectedOutput: `Locker 12: Sofia
Locker 13: Luis`,
        },
        {
          type: "quiz",
          question: "Con dos objetos creados por separado (`Locker a = new Locker();` y `Locker b = new Locker();`), ¿qué imprime `b.Mostrar()` después de ejecutar `a.Numero = 99;`?",
          options: [
            "El número que se le dio a b: el cambio en a no lo toca.",
            "99, porque comparten la clase Locker.",
            "0, porque asignar a un objeto borra el otro.",
            "Nada: sólo se puede mostrar un objeto por programa.",
          ],
          feedbackPerOption: [
            "",
            "La clase es el molde compartido, pero los datos no: viven en cada objeto.",
            "Asignar a un objeto no toca a los demás; nada se borra.",
            "Puedes crear y mostrar tantos objetos como quieras.",
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

\`Main\` ya lee los datos y ya está escrito hasta la lectura. Te toca:

1. escribir la clase \`Libro\` con campos públicos \`Titulo\` (\`string\`) y \`Paginas\` (\`int\`) y un método \`Resumen()\` que escriba \`Titulo (N paginas)\`;
2. crear **dos** objetos distintos en \`Main\`, darle sus datos a cada uno y mostrar ambos.

La dimensión nueva frente al reto anterior es una sola: ahora son dos objetos.`,
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

    public void Resumen()
    {
        Console.WriteLine($"{Titulo} ({Paginas} paginas)");
    }
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

        primero.Resumen();
        segundo.Resumen();
    }
}`,
            hints: [
              "La clase es como la del reto anterior, pero con dos campos.",
              "Cada objeto necesita su propio new: dos libros, dos new.",
              "Asigna los datos al objeto correspondiente y llama Resumen una vez por objeto.",
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
                  methods: [{ name: "Resumen", visibility: "public" }],
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
     * Etapas 4 y 5: estado y comportamiento con traza antes → después, y
     * luego responsabilidad (quién debe hacer la operación).
     */
    {
      slug: "estado-y-comportamiento",
      title: "Los métodos cambian el estado",
      description: "Predice el valor antes y después de la llamada, y decide quién debe hacer la operación.",
      estimatedMinutes: 11,
      xpReward: 35,
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

El dato que el objeto **recuerda** se llama **estado**. La acción que lo **cambia** se llama **comportamiento** (un método).

Un método no es una función suelta: vive junto al dato que modifica.`,
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
          explanation: "El programa imprime el estado antes y después de la llamada: 100 y 75. `Consumir` vive dentro de `TarjetaComedor` porque es esa clase la que sabe qué es el saldo. La validación (no dejar el saldo en negativo) llegará con encapsulamiento.",
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
          type: "theory",
          markdown: `# ¿Quién debe hacer la operación?

Hay dos formas de descontar 25 pesos:

\`\`\`csharp
// A: lo hace Program, por fuera
tarjeta.Saldo = tarjeta.Saldo - 25;

// B: lo hace la tarjeta
tarjeta.Consumir(25);
\`\`\`

Las dos dan 75 hoy. No son lo mismo mañana.

Cuando la escuela decida que el saldo no puede quedar negativo, en **A** hay que buscar y corregir cada línea del programa que resta saldo. En **B** se corrige en un solo lugar: dentro de \`Consumir\`.

A eso se le llama **responsabilidad**: la operación pertenece a la clase que es dueña del dato.`,
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
