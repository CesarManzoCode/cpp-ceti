import type { UnitDefinition } from "../types";

// =====================================================================
// De problemas a objetos
// Abstrae objetos cotidianos y conviértelos en clases, instancias, estado y comportamiento en C#.
// =====================================================================

export const unidad01: UnitDefinition = {
  slug: "csharp-poo-01-modelar",
  title: "De problemas a objetos",
  description: "Abstrae objetos cotidianos y conviértelos en clases, instancias, estado y comportamiento en C#.",
  icon: "🧱",
  published: true,
  lessons: [
    /**
     * Objetivo: Identify relevant objects, state, and behavior in a concrete problem.
     * Requisitos previos: Variables and functions.
     */
    {
      slug: "pensar-en-objetos",
      title: "Pensar en objetos, no en una lista de instrucciones",
      description: "Separa qué sabe cada objeto de lo que puede hacer.",
      estimatedMinutes: 9,
      xpReward: 30,
      steps: [
        {
          type: "theory",
          markdown: `# De instrucciones a colaboradores

En programación estructurada sueles preguntar: **¿qué pasos debe ejecutar el programa?** En POO agregas otra pregunta: **¿quién debería conocer cada dato y realizar cada acción?**

Para un préstamo de herramientas del taller podrías identificar:

- \`Herramienta\`: conoce nombre y existencias; puede prestar y devolver.
- \`Alumno\`: conoce nombre y registro; puede solicitar una herramienta.
- \`Prestamo\`: conoce quién recibió qué y si ya devolvió.

Una **clase** es el modelo. Un **objeto** es una instancia concreta creada desde ese modelo. Sus datos forman el **estado** y sus acciones son **métodos**.

Abstraer no es anotar todo lo que existe. Es conservar sólo lo necesario para resolver el problema. El color favorito del alumno no ayuda a controlar préstamos; su registro sí.`,
        },
        {
          type: "matching",
          prompt: "Empareja cada elemento con su papel en un sistema de préstamo.",
          pairs: [
            { left: "Herramienta", right: "Clase posible: representa un tipo de objeto" },
            { left: "taladroBosch", right: "Objeto concreto o instancia" },
            { left: "Existencias", right: "Estado que el objeto debe recordar" },
            { left: "Prestar()", right: "Comportamiento que puede cambiar el estado" },
          ],
          explanation: "La clase define; la instancia existe durante la ejecución; los atributos describen; los métodos actúan.",
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
          explanation: "Herramienta es el modelo; taladro es el objeto. Los campos son públicos sólo para ver primero la mecánica. En la unidad siguiente protegeremos el estado.",
          runnable: true,
          expectedOutput: "Taladro: 3",
        },
        {
          type: "quiz",
          question: "En el código anterior, ¿cuál elemento es una instancia?",
          options: [
            "class Herramienta",
            "public int Existencias",
            "taladro",
            "Mostrar()",
          ],
          feedbackPerOption: [
            "Eso es la clase: el modelo compartido por posibles objetos.",
            "Eso es parte del estado definido por la clase.",
            "Correcto: la variable referencia al objeto creado con new.",
            "Eso es un método de la clase.",
          ],
          correctIndex: 2,
          explanation: "new Herramienta() crea el objeto; taladro guarda la referencia a esa instancia.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Ficha de herramienta

Define una clase \`FichaHerramienta\` con campos públicos \`Nombre\` (\`string\`) y \`Cantidad\` (\`int\`), y un método \`Mostrar()\` que escriba exactamente \`Nombre: Cantidad pieza(s)\`. Lee nombre y cantidad, crea un objeto y llama al método. No imprimas prompts.`,
            starterCode: `using System;

// Define la clase aquí

class Program
{
    static void Main()
    {
        string nombre = Console.ReadLine();
        int cantidad = int.Parse(Console.ReadLine());
        // Crea, asigna y muestra el objeto
    }
}`,
            solutionCode: `using System;

class FichaHerramienta
{
    public string Nombre;
    public int Cantidad;

    public void Mostrar()
    {
        Console.WriteLine($"{Nombre}: {Cantidad} pieza(s)");
    }
}

class Program
{
    static void Main()
    {
        string nombre = Console.ReadLine();
        int cantidad = int.Parse(Console.ReadLine());
        FichaHerramienta ficha = new FichaHerramienta();
        ficha.Nombre = nombre;
        ficha.Cantidad = cantidad;
        ficha.Mostrar();
    }
}`,
            hints: [
              "La clase va fuera de Program y contiene dos campos más un método.",
              "Crea con FichaHerramienta ficha = new FichaHerramienta();.",
              "Mostrar usa interpolación: $\"{Nombre}: {Cantidad} pieza(s)\".",
            ],
            difficulty: "easy",
            xpReward: 20,
            testCases: [
              {
                stdin: "Martillo\n8\n",
                expectedStdout: "Martillo: 8 pieza(s)\n",
                visible: true,
                description: "Caso visible",
              },
              {
                stdin: "Broca 1/4\n27\n",
                expectedStdout: "Broca 1/4: 27 pieza(s)\n",
                visible: false,
                description: "Nombre con espacio",
              },
              {
                stdin: "Nivel\n0\n",
                expectedStdout: "Nivel: 0 pieza(s)\n",
                visible: false,
                description: "Cantidad cero",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Explain and demonstrate independent object state.
     * Requisitos previos: pensar-en-objetos
     */
    {
      slug: "clase-objeto-instancia",
      title: "Una clase, muchos objetos",
      description: "Crea instancias independientes a partir del mismo modelo.",
      estimatedMinutes: 10,
      xpReward: 35,
      steps: [
        {
          type: "theory",
          markdown: `# El molde no guarda los datos de cada objeto

\`class Locker\` describe qué tendrá cualquier locker. Cada \`new Locker()\` crea una instancia separada. Cambiar \`lockerA.Numero\` no cambia \`lockerB.Numero\`.

Una variable de clase (\`Locker lockerA\`) guarda una **referencia** al objeto. Si dos variables apuntaran al mismo objeto, verían el mismo estado; hoy crearemos dos objetos distintos.`,
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

        a.Mostrar();
        b.Mostrar();
    }
}`,
          explanation: "a y b nacen de la misma clase, pero cada new crea estado independiente.",
          runnable: true,
          expectedOutput: `Locker 12: Ana
Locker 13: Luis`,
        },
        {
          type: "fill_blank",
          prompt: "Completa el tipo y la construcción de dos objetos diferentes.",
          template: `{{0}} primero = {{1}} Libro();
{{2}} segundo = {{3}} Libro();`,
          blanks: [
            { answer: "Libro", hint: "El tipo de la variable es la clase." },
            { answer: "new", hint: "La palabra que crea una instancia." },
            { answer: "Libro", hint: "El segundo objeto usa el mismo tipo." },
            { answer: "new", hint: "También necesita su propia construcción." },
          ],
          explanation: "Hay dos expresiones new, por lo tanto hay dos objetos.",
        },
        {
          type: "quiz",
          question: "Si ejecutas b = a; y luego cambias b.Numero, ¿qué ocurre?",
          options: [
            "Sólo cambia b porque las variables siempre copian objetos completos.",
            "a y b observan el cambio porque apuntan al mismo objeto.",
            "Se crea automáticamente un tercer objeto.",
            "No compila porque no se pueden asignar objetos.",
          ],
          correctIndex: 1,
          explanation: "Las clases son tipos por referencia. b = a copia la referencia, no clona el objeto.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Define Libro con campos Titulo y Paginas y método Resumen(). Lee datos para dos libros, crea dos instancias y muestra cada una como Titulo (N paginas).",
            starterCode: `using System;

class Libro
{
    // Campos y método
}

class Program
{
    static void Main()
    {
        string titulo1 = Console.ReadLine();
        int paginas1 = int.Parse(Console.ReadLine());
        string titulo2 = Console.ReadLine();
        int paginas2 = int.Parse(Console.ReadLine());
        // Dos objetos distintos
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
              "Cada objeto necesita su propio new.",
              "Asigna los datos al objeto correspondiente.",
              "Llama Resumen una vez por objeto.",
            ],
            difficulty: "easy",
            xpReward: 22,
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
     * Objetivo: Place state-changing behavior in the class that owns the state.
     * Requisitos previos: clase-objeto-instancia
     */
    {
      slug: "estado-y-comportamiento",
      title: "Los métodos cambian el estado",
      description: "Haz que el objeto realice la operación en lugar de modificar sus datos desde fuera.",
      estimatedMinutes: 11,
      xpReward: 35,
      steps: [
        {
          type: "code_example",
          code: `using System;

class TarjetaComedor
{
    public int Saldo;

    public void Recargar(int cantidad)
    {
        Saldo = Saldo + cantidad;
    }

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
        tarjeta.Recargar(40);
        tarjeta.Consumir(25);
        Console.WriteLine(tarjeta.Saldo);
    }
}`,
          explanation: "Recargar y Consumir viven junto al saldo porque esa clase es responsable de cambiarlo. La validación llegará con encapsulamiento.",
          runnable: true,
          expectedOutput: "115",
        },
        {
          type: "quiz",
          question: "¿Cuál diseño expresa mejor la responsabilidad del objeto?",
          options: [
            "Desde Program: tarjeta.Saldo = tarjeta.Saldo - costo;",
            "Dentro de TarjetaComedor: tarjeta.Consumir(costo);",
            "Una variable global saldo para todas las tarjetas.",
            "Imprimir el saldo sin almacenarlo.",
          ],
          correctIndex: 1,
          explanation: "El método representa la operación del dominio y centraliza la regla que después podremos validar.",
        },
        {
          type: "code_completion",
          prompt: "Ordena el cuerpo de un método que incrementa el contador y luego muestra el nuevo valor.",
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
            prompt: "Crea Marcador con campo público Puntos, método Sumar(int) y método Restar(int). Lee saldo inicial, puntos a sumar y puntos a restar; ejecuta ambos métodos e imprime Puntos: N.",
            starterCode: `using System;

class Marcador
{
    public int Puntos;
    // Métodos
}

class Program
{
    static void Main()
    {
        int inicial = int.Parse(Console.ReadLine());
        int suma = int.Parse(Console.ReadLine());
        int resta = int.Parse(Console.ReadLine());
        // Usa un Marcador
    }
}`,
            solutionCode: `using System;

class Marcador
{
    public int Puntos;
    public void Sumar(int cantidad) { Puntos = Puntos + cantidad; }
    public void Restar(int cantidad) { Puntos = Puntos - cantidad; }
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
              "Los métodos reciben cantidad.",
              "Ambos modifican Puntos.",
              "La salida ocurre después de las dos llamadas.",
            ],
            difficulty: "easy",
            xpReward: 22,
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
     * Objetivo: Select relevant attributes and methods from requirements.
     * Requisitos previos: estado-y-comportamiento
     */
    {
      slug: "abstraccion-con-criterio",
      title: "Abstraer es decidir qué importa",
      description: "Evita clases infladas y modela sólo lo que exige el problema.",
      estimatedMinutes: 10,
      xpReward: 40,
      steps: [
        {
          type: "theory",
          markdown: `# Un modelo tiene propósito

Para asignar equipos de laboratorio, de una laptop importan \`NumeroInventario\`, \`RamGb\` y \`Disponible\`. Su fondo de pantalla no afecta la operación. Otro sistema, como soporte técnico, quizá sí necesite número de serie y fecha de mantenimiento.

La pregunta correcta no es “¿qué datos podría tener una laptop?”, sino “¿qué datos y acciones necesita **este sistema**?”. Una clase con veinte campos irrelevantes no es más completa: es más difícil de entender y mantener.`,
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
          question: "El requerimiento dice: “registrar préstamos y evitar prestar un equipo ocupado”. ¿Qué miembro sobra en Equipo?",
          options: [
            "Disponible",
            "Prestar()",
            "NumeroInventario",
            "MarcaDeLaMochilaDelAlumno",
          ],
          correctIndex: 3,
          explanation: "Ese dato no ayuda a identificar, prestar ni validar disponibilidad del equipo.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Modela SensorAula con Nombre y Lectura, más Actualizar(double) y Mostrar(). Lee dos sensores; actualiza sólo el primero con una tercera lectura; imprime ambos como Nombre = lectura con un decimal. Deben seguir siendo objetos independientes.",
            starterCode: `using System;

class SensorAula
{
    // Estado y comportamiento relevante
}

class Program
{
    static void Main()
    {
        string n1 = Console.ReadLine();
        double l1 = double.Parse(Console.ReadLine());
        string n2 = Console.ReadLine();
        double l2 = double.Parse(Console.ReadLine());
        double nueva = double.Parse(Console.ReadLine());
        // Dos sensores; actualiza sólo el primero
    }
}`,
            solutionCode: `using System;

class SensorAula
{
    public string Nombre;
    public double Lectura;
    public void Actualizar(double nueva) { Lectura = nueva; }
    public void Mostrar() { Console.WriteLine($"{Nombre} = {Lectura:F1}"); }
}

class Program
{
    static void Main()
    {
        string n1 = Console.ReadLine();
        double l1 = double.Parse(Console.ReadLine());
        string n2 = Console.ReadLine();
        double l2 = double.Parse(Console.ReadLine());
        double nueva = double.Parse(Console.ReadLine());
        SensorAula primero = new SensorAula();
        primero.Nombre = n1;
        primero.Lectura = l1;
        SensorAula segundo = new SensorAula();
        segundo.Nombre = n2;
        segundo.Lectura = l2;
        primero.Actualizar(nueva);
        primero.Mostrar();
        segundo.Mostrar();
    }
}`,
            hints: [
              "No necesitas más de dos campos.",
              "Actualizar sólo asigna Lectura.",
              "F1 imprime un decimal.",
            ],
            difficulty: "medium",
            xpReward: 28,
            testCases: [
              {
                stdin: "Temperatura\n22.0\nHumedad\n48.5\n23.2\n",
                expectedStdout: "Temperatura = 23.2\nHumedad = 48.5\n",
                visible: true,
                description: "Independencia",
              },
              {
                stdin: "A\n0\nB\n-2.5\n10\n",
                expectedStdout: "A = 10.0\nB = -2.5\n",
                visible: false,
                description: "Decimales y negativos",
              },
            ],
          },
        },
      ],
    },
  ],
};
