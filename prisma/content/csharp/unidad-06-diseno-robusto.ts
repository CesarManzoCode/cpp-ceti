import type { UnitDefinition } from "../types";

// =====================================================================
// Responsabilidades y diseño robusto
// Distingue miembros de instancia y clase, protege invariantes y coordina varias clases.
// =====================================================================

export const unidad06: UnitDefinition = {
  slug: "csharp-poo-06-diseno-robusto",
  title: "Responsabilidades y diseño robusto",
  description: "Distingue miembros de instancia y clase, protege invariantes y coordina varias clases.",
  icon: "🛡️",
  published: true,
  lessons: [
    /**
     * Objetivo: Choose instance or static members according to ownership.
     * Requisitos previos: clases-abstractas
     */
    {
      slug: "instancia-y-static",
      title: "Responsabilidades de instancia y de clase",
      description: "Evita convertir static en almacenamiento global accidental.",
      estimatedMinutes: 14,
      xpReward: 45,
      steps: [
        {
          type: "theory",
          markdown: `# ¿De quién es el dato?

Cada objeto posee sus miembros de instancia. Un miembro \`static\` pertenece a la clase y se comparte. Una constante o una función pura de utilidad puede ser estática; el nombre o saldo de una entidad no. Estado global compartido introduce dependencias ocultas y hace las pruebas frágiles.`,
        },
        {
          type: "code_example",
          code: `using System;
class Alumno
{
    public static int Creados { get; private set; }
    public string Nombre { get; private set; }
    public Alumno(string nombre) { Nombre = nombre; Creados++; }
}
class Program
{
    static void Main()
    {
        new Alumno("A"); new Alumno("B");
        Console.WriteLine(Alumno.Creados);
    }
}`,
          explanation: "Nombre pertenece a cada objeto; Creados describe a la clase completa.",
          runnable: true,
          expectedOutput: "2",
        },
        {
          type: "matching",
          pairs: [
            { left: "Saldo de una cuenta", right: "Instancia" },
            { left: "Número de objetos creados", right: "static" },
            { left: "Convertir Celsius a Fahrenheit sin estado", right: "static" },
            { left: "Nombre de un alumno", right: "Instancia" },
          ],
          explanation: "La propiedad semántica del dato, no la comodidad de acceso, decide.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Crea Entrada con Folio de instancia y static Total. Cada construcción incrementa Total. Lee dos folios e imprime ambos y luego \"Total: 2\".",
            starterCode: `using System;
class Entrada { /* completa */ }
class Program { static void Main() { /* completa */ } }`,
            solutionCode: `using System;
class Entrada
{
    public static int Total { get; private set; }
    public string Folio { get; private set; }
    public Entrada(string folio) { Folio = folio; Total++; }
}
class Program
{
    static void Main()
    {
        Entrada a = new Entrada(Console.ReadLine());
        Entrada b = new Entrada(Console.ReadLine());
        Console.WriteLine(a.Folio);
        Console.WriteLine(b.Folio);
        Console.WriteLine("Total: " + Entrada.Total);
    }
}`,
            hints: [
              "Total se declara static.",
              "Incrementa una vez en el constructor.",
              "Accede como Entrada.Total.",
            ],
            difficulty: "easy",
            xpReward: 24,
            structure: {
              classes: [
                {
                  name: "Entrada",
                  properties: [
                    { name: "Total", visibility: "public", type: "int", static: true },
                    { name: "Folio", visibility: "public", type: "string" },
                  ],
                  constructors: [{ paramCount: 1 }],
                },
              ],
            },
            testCases: [
              {
                stdin: "A1\nA2\n",
                expectedStdout: "A1\nA2\nTotal: 2\n",
                visible: true,
                description: "Contador compartido",
              },
              {
                stdin: "X-99\nY 10\n",
                expectedStdout: "X-99\nY 10\nTotal: 2\n",
                visible: false,
                description: "Folios variables",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Guard invariants with ArgumentException and handle expected input failures.
     * Requisitos previos: instancia-y-static
     */
    {
      slug: "validacion-excepciones",
      title: "Validación y excepciones",
      description: "Impide estados inválidos y comunica fallos sin ocultarlos.",
      estimatedMinutes: 17,
      xpReward: 60,
      steps: [
        {
          type: "theory",
          markdown: `# Un objeto válido desde su nacimiento

Valida en el constructor y en los métodos que cambian estado. Lanza \`ArgumentException\` cuando un argumento viola el contrato. Captura sólo donde puedas dar una respuesta útil; no uses \`catch\` vacío. La interfaz traduce la excepción a un mensaje, mientras la clase de dominio conserva la regla.`,
        },
        {
          type: "code_example",
          code: `using System;
class Producto
{
    public decimal Precio { get; private set; }
    public Producto(decimal precio)
    {
        if (precio < 0) throw new ArgumentException("El precio no puede ser negativo");
        Precio = precio;
    }
}
class Program
{
    static void Main()
    {
        try { Console.WriteLine(new Producto(decimal.Parse(Console.ReadLine())).Precio); }
        catch (ArgumentException ex) { Console.WriteLine("Error: " + ex.Message); }
    }
}`,
          explanation: "La regla vive en Producto; Program decide cómo comunicar el error. Con stdin 25, la salida es la mostrada; con -1, imprime Error: El precio no puede ser negativo.",
          runnable: true,
          expectedOutput: "25",
        },
        {
          type: "quiz",
          question: "¿Dónde debe vivir la regla “el saldo no puede quedar negativo”?",
          options: [
            "Sólo en el botón de la GUI.",
            "En el método de dominio que retira saldo.",
            "En un comentario.",
            "En el método Main de cada programa.",
          ],
          correctIndex: 1,
          explanation: "Toda interfaz que use el objeto queda protegida por la misma invariante.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Implementa Termometro con constructor que acepte sólo valores >= -273.15. Lee un valor; imprime \"Temperatura: N.NN\" o \"Error: Valor menor al cero absoluto\".",
            starterCode: `using System;
class Termometro { /* regla y propiedad */ }
class Program { static void Main() { /* try/catch */ } }`,
            solutionCode: `using System;
class Termometro
{
    public double Celsius { get; private set; }
    public Termometro(double celsius)
    {
        if (celsius < -273.15) throw new ArgumentException("Valor menor al cero absoluto");
        Celsius = celsius;
    }
}
class Program
{
    static void Main()
    {
        try
        {
            Termometro t = new Termometro(double.Parse(Console.ReadLine()));
            Console.WriteLine("Temperatura: " + t.Celsius.ToString("0.00"));
        }
        catch (ArgumentException ex) { Console.WriteLine("Error: " + ex.Message); }
    }
}`,
            hints: [
              "Compara antes de asignar.",
              "Lanza ArgumentException con el texto exacto.",
              "Captura ArgumentException en Main.",
            ],
            difficulty: "medium",
            xpReward: 32,
            structure: {
              classes: [
                {
                  name: "Termometro",
                  properties: [{ name: "Celsius", visibility: "public", type: "double" }],
                  constructors: [{ paramCount: 1 }],
                },
              ],
            },
            testCases: [
              {
                stdin: "20\n",
                expectedStdout: "Temperatura: 20.00\n",
                visible: true,
                description: "Valor válido",
              },
              {
                stdin: "-273.15\n",
                expectedStdout: "Temperatura: -273.15\n",
                visible: false,
                description: "Límite incluido",
              },
              {
                stdin: "-300\n",
                expectedStdout: "Error: Valor menor al cero absoluto\n",
                visible: false,
                description: "Invariante",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Build a small multi-class domain model and trace its collaborations.
     * Requisitos previos: validacion-excepciones
     */
    {
      slug: "miniproyecto-dominio",
      title: "Miniproyecto: reservas de laboratorio",
      description: "Coordina entidades, asociación, validación y presentación sin mezclar responsabilidades.",
      estimatedMinutes: 18,
      xpReward: 65,
      steps: [
        {
          type: "theory",
          markdown: `# Del requisito a las responsabilidades

Requisito: “Un alumno reserva un laboratorio por cierto número de horas; el costo debe ser positivo”. \`Alumno\` conserva identidad, \`Laboratorio\` tarifa y \`Reserva\` coordina fecha lógica/costo. \`Program\` sólo recibe y muestra. Antes de codificar, dibuja las tres clases y marca asociaciones.

Fíjate en cómo llega cada colaborador a \`Reserva\`: el \`Alumno\` y el \`Laboratorio\` ya existen antes de la reserva y se le pasan hechos. Eso es **asociación** (como en U4), no composición — \`Reserva\` no los crea ni los posee, sólo los referencia mientras dura.`,
        },
        {
          type: "code_example",
          code: `using System;
class Alumno { public string Nombre { get; private set; } public Alumno(string n) { Nombre = n; } }
class Laboratorio { public string Nombre { get; private set; } public decimal Tarifa { get; private set; } public Laboratorio(string n, decimal t) { Nombre=n; Tarifa=t; } }
class Reserva
{
    private Alumno alumno; private Laboratorio laboratorio; private int horas;
    public Reserva(Alumno a, Laboratorio l, int h) { if (h <= 0) throw new ArgumentException("Horas inválidas"); alumno=a; laboratorio=l; horas=h; }
    public string Resumen() { return alumno.Nombre + " | " + laboratorio.Nombre + " | " + (laboratorio.Tarifa * horas).ToString("0.00"); }
}
class Program { static void Main() { Console.WriteLine(new Reserva(new Alumno("Eva"), new Laboratorio("L1", 50m), 2).Resumen()); } }`,
          explanation: "Reserva conoce los colaboradores y aplica la regla; ninguno imprime por obligación.",
          runnable: true,
          expectedOutput: "Eva | L1 | 100.00",
        },
        {
          type: "matching",
          pairs: [
            { left: "Capturar texto", right: "Program / interfaz" },
            { left: "Conservar tarifa", right: "Laboratorio" },
            { left: "Validar horas y calcular total", right: "Reserva" },
            { left: "Conservar nombre de alumno", right: "Alumno" },
          ],
          explanation: "Cada cambio futuro debe tener un hogar natural.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Completa el modelo anterior. Lee alumno, laboratorio, tarifa y horas. Imprime el resumen o \"Error: Horas invalidas\". Usa exactamente Alumno, Laboratorio y Reserva.",
            starterCode: `using System;
class Alumno { /* completa */ }
class Laboratorio { /* completa */ }
class Reserva { /* completa */ }
class Program { static void Main() { /* completa */ } }`,
            solutionCode: `using System;
class Alumno { public string Nombre { get; private set; } public Alumno(string n) { Nombre = n; } }
class Laboratorio { public string Nombre { get; private set; } public decimal Tarifa { get; private set; } public Laboratorio(string n, decimal t) { Nombre=n; Tarifa=t; } }
class Reserva
{
    private Alumno alumno; private Laboratorio laboratorio; private int horas;
    public Reserva(Alumno a, Laboratorio l, int h)
    {
        if (h <= 0) throw new ArgumentException("Horas invalidas");
        alumno=a; laboratorio=l; horas=h;
    }
    public string Resumen() { return alumno.Nombre + " | " + laboratorio.Nombre + " | " + (laboratorio.Tarifa * horas).ToString("0.00"); }
}
class Program
{
    static void Main()
    {
        string a=Console.ReadLine(), l=Console.ReadLine();
        decimal tarifa=decimal.Parse(Console.ReadLine()); int horas=int.Parse(Console.ReadLine());
        try { Console.WriteLine(new Reserva(new Alumno(a), new Laboratorio(l, tarifa), horas).Resumen()); }
        catch (ArgumentException ex) { Console.WriteLine("Error: " + ex.Message); }
    }
}`,
            hints: [
              "Reserva recibe los dos objetos.",
              "Valida horas antes de guardar.",
              "El total es tarifa por horas.",
            ],
            difficulty: "hard",
            xpReward: 42,
            structure: {
              classes: [
                {
                  name: "Alumno",
                  properties: [{ name: "Nombre", visibility: "public", type: "string" }],
                  constructors: [{ paramCount: 1 }],
                },
                {
                  name: "Laboratorio",
                  properties: [
                    { name: "Nombre", visibility: "public", type: "string" },
                    { name: "Tarifa", visibility: "public", type: "decimal" },
                  ],
                  constructors: [{ paramCount: 2 }],
                },
                {
                  name: "Reserva",
                  constructors: [{ paramCount: 3 }],
                  methods: [{ name: "Resumen", visibility: "public", returnType: "string" }],
                  stores: [{ type: "Alumno" }, { type: "Laboratorio" }],
                },
              ],
            },
            testCases: [
              {
                stdin: "Mia\nL2\n75\n3\n",
                expectedStdout: "Mia | L2 | 225.00\n",
                visible: true,
                description: "Colaboración válida",
              },
              {
                stdin: "Noe\nRedes\n10.5\n1\n",
                expectedStdout: "Noe | Redes | 10.50\n",
                visible: false,
                description: "Decimal",
              },
              {
                stdin: "Leo\nL1\n20\n0\n",
                expectedStdout: "Error: Horas invalidas\n",
                visible: false,
                description: "Regla",
              },
            ],
          },
        },
      ],
    },
  ],
};
