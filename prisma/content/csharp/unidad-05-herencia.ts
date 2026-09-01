import type { UnitDefinition } from "../types";

// =====================================================================
// Herencia y polimorfismo
// Modela generalizaciones válidas, reutiliza comportamiento y usa despacho dinámico sin confundir herencia con composición.
// =====================================================================

export const unidad05: UnitDefinition = {
  slug: "csharp-poo-05-herencia",
  title: "Herencia y polimorfismo",
  description: "Modela generalizaciones válidas, reutiliza comportamiento y usa despacho dinámico sin confundir herencia con composición.",
  icon: "🌳",
  published: true,
  lessons: [
    /**
     * Objetivo: Implement a valid is-a relationship with C# inheritance.
     * Requisitos previos: elegir-relacion
     */
    {
      slug: "generalizacion-herencia",
      title: "Generalización: una relación es-un",
      description: "Decide cuándo una subclase realmente puede sustituir a su base.",
      estimatedMinutes: 14,
      xpReward: 45,
      steps: [
        {
          type: "theory",
          markdown: `# Heredar exige una promesa

\`class Becario : Empleado\` significa que **todo Becario es un Empleado**. La subclase recibe los miembros accesibles de la base y puede añadir especialización. No uses herencia sólo para ahorrar líneas: \`Motor : Automovil\` es falso; un automóvil *tiene un* motor.

Prueba de sustitución: si una operación espera \`Empleado\`, ¿aceptar un \`Becario\` conserva el sentido? Si sí, la generalización puede ser adecuada.`,
        },
        {
          // Constructores vacíos a propósito: la relación es-un y "qué se
          // hereda" es lo que se evalúa aquí. Encadenar constructores con
          // base(...) llega en la lección siguiente, por su cuenta.
          type: "code_example",
          code: `using System;

class Empleado
{
    public string Nombre;
    public void Identificarse() { Console.WriteLine("Empleado: " + Nombre); }
}

class Becario : Empleado
{
    public string Escuela;
}

class Program
{
    static void Main()
    {
        Becario b = new Becario();
        b.Nombre = "Ana";
        b.Escuela = "CETI";

        b.Identificarse();
        Console.WriteLine(b.Escuela);
    }
}`,
          explanation: "Becario no declara Nombre ni Identificarse: los hereda de Empleado. Escuela es su especialización, lo que lo hace un Becario y no cualquier Empleado.",
          runnable: true,
          expectedOutput: `Empleado: Ana
CETI`,
        },
        {
          type: "matching",
          pairs: [
            { left: "Becario / Empleado", right: "Herencia: es-un" },
            { left: "Automóvil / Motor", right: "Composición: tiene-un inseparable" },
            { left: "Curso / Docente", right: "Asociación: conoce-a" },
          ],
          explanation: "El vocabulario del dominio decide la relación; la reutilización es una consecuencia, no el criterio.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Crea Persona con campo público Nombre y método Presentar() que imprima \"Persona: N\". Crea Alumno : Persona con campo público Registro (sin constructores todavía). En Main lee nombre y registro, crea UN Alumno, asígnale ambos campos, llama Presentar() (heredado) e imprime \"Registro: R\".",
            starterCode: `using System;
class Persona { /* completa */ }
class Alumno : Persona { /* completa */ }
class Program { static void Main() { /* lee, crea y muestra */ } }`,
            solutionCode: `using System;
class Persona
{
    public string Nombre;
    public void Presentar() { Console.WriteLine("Persona: " + Nombre); }
}
class Alumno : Persona
{
    public string Registro;
}
class Program
{
    static void Main()
    {
        Alumno a = new Alumno();
        a.Nombre = Console.ReadLine();
        a.Registro = Console.ReadLine();

        a.Presentar();
        Console.WriteLine("Registro: " + a.Registro);
    }
}`,
            hints: [
              "Usa : Persona.",
              "Alumno no declara Nombre ni Presentar: los hereda.",
              "Todavía sin constructores: asigna los campos después de new.",
            ],
            difficulty: "medium",
            xpReward: 28,
            structure: {
              classes: [
                {
                  name: "Persona",
                  fields: [{ name: "Nombre", visibility: "public", type: "string" }],
                  methods: [{ name: "Presentar", visibility: "public" }],
                },
                {
                  name: "Alumno",
                  extends: "Persona",
                  fields: [{ name: "Registro", visibility: "public", type: "string" }],
                },
              ],
            },
            testCases: [
              {
                stdin: "Luz\n22101\n",
                expectedStdout: "Persona: Luz\nRegistro: 22101\n",
                visible: true,
                description: "Herencia básica",
              },
              {
                stdin: "José Luis\nA-7\n",
                expectedStdout: "Persona: José Luis\nRegistro: A-7\n",
                visible: false,
                description: "Texto variable",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Chain constructors with base and explain protected access.
     * Requisitos previos: generalizacion-herencia
     */
    {
      slug: "base-protected",
      title: "Construcción de la base y acceso protegido",
      description: "Inicializa primero la parte heredada y limita protected a extensiones justificadas.",
      estimatedMinutes: 14,
      xpReward: 45,
      steps: [
        {
          type: "theory",
          markdown: `# Primero existe la base

El constructor derivado delega con \`: base(...)\`. Así la base protege sus invariantes. \`protected\` permite acceso en la propia clase y sus derivadas, pero no desde \`Program\`. Prefiere \`private\` y propiedades cuando una subclase no necesita manipular el dato directamente.`,
        },
        {
          type: "code_example",
          code: `using System;
class Cuenta
{
    protected decimal saldo;
    public Cuenta(decimal saldoInicial) { saldo = saldoInicial; }
    public decimal ConsultarSaldo() { return saldo; }
}
class CuentaAhorro : Cuenta
{
    public CuentaAhorro(decimal saldoInicial) : base(saldoInicial) { }
    public void AbonarInteres(decimal tasa) { saldo += saldo * tasa; }
}
class Program
{
    static void Main()
    {
        CuentaAhorro c = new CuentaAhorro(100m);
        c.AbonarInteres(0.10m);
        Console.WriteLine(c.ConsultarSaldo().ToString("0.00"));
    }
}`,
          explanation: "La base inicializa saldo; la derivada puede usar el miembro protected, pero el consumidor sólo ve operaciones públicas.",
          runnable: true,
          expectedOutput: "110.00",
        },
        {
          type: "fill_blank",
          prompt: "Completa la llamada al constructor base y el miembro protegido.",
          template: `class Vehiculo
{
    protected string serie;
    public Vehiculo(string serie) { this.serie = serie; }
}
class Camion : Vehiculo
{
    public Camion(string serie) : {{0}}(serie) { }
    public string VerSerie() { return {{1}}; }
}`,
          blanks: [
            { answer: "base", hint: "Delega al constructor padre." },
            { answer: "serie", hint: "Es accesible por ser protected." },
          ],
          explanation: "base construye la parte Vehiculo antes de completar Camion.",
        },
        {
          type: "quiz",
          question: "¿Qué afirmación es correcta?",
          options: [
            "protected equivale a public.",
            "Program puede escribir cualquier miembro protected.",
            "Una clase derivada puede acceder a un miembro protected heredado.",
            "base crea un objeto separado.",
          ],
          correctIndex: 2,
          explanation: "protected abre el miembro a la jerarquía, no a cualquier consumidor.",
        },
        {
          // `CS-03`: la lección terminaba en fill + quiz, sin escribir una
          // sola línea de `base(...)` ni de acceso protegido — y la
          // siguiente sube a polimorfismo. El reto es corto y deliberado:
          // sólo constructor base y uso del miembro protegido.
          type: "code_challenge",
          exercise: {
            prompt: `## Construye la base y usa lo protegido

\`Vehiculo\` ya está escrita: guarda \`kilometros\` como \`protected\` y lo inicializa en su constructor.

Escribe \`Camion : Vehiculo\` con:

- un constructor que reciba los kilómetros iniciales y **delegue en la base** con \`: base(...)\`;
- un método \`Recorrer(int tramo)\` que le sume el tramo a \`kilometros\` — el miembro protegido, directamente, porque una derivada sí puede.

No agregues otro campo de kilómetros: la base ya lo tiene.`,
            starterCode: `using System;

class Vehiculo
{
    protected int kilometros;
    public Vehiculo(int kilometrosIniciales) { kilometros = kilometrosIniciales; }
    public int Odometro() { return kilometros; }
}

// Escribe aqui Camion : Vehiculo

class Program
{
    static void Main()
    {
        int iniciales = int.Parse(Console.ReadLine());
        int tramo = int.Parse(Console.ReadLine());

        Camion camion = new Camion(iniciales);
        camion.Recorrer(tramo);
        Console.WriteLine(camion.Odometro());
    }
}`,
            solutionCode: `using System;

class Vehiculo
{
    protected int kilometros;
    public Vehiculo(int kilometrosIniciales) { kilometros = kilometrosIniciales; }
    public int Odometro() { return kilometros; }
}

class Camion : Vehiculo
{
    public Camion(int kilometrosIniciales) : base(kilometrosIniciales) { }

    public void Recorrer(int tramo)
    {
        kilometros = kilometros + tramo;
    }
}

class Program
{
    static void Main()
    {
        int iniciales = int.Parse(Console.ReadLine());
        int tramo = int.Parse(Console.ReadLine());

        Camion camion = new Camion(iniciales);
        camion.Recorrer(tramo);
        Console.WriteLine(camion.Odometro());
    }
}`,
            hints: [
              "La firma empieza así: class Camion : Vehiculo",
              "El constructor delega: public Camion(int km) : base(km) { }",
              "Recorrer usa kilometros directamente; es protected, no private.",
            ],
            difficulty: "easy",
            xpReward: 25,
            structure: {
              classes: [
                {
                  name: "Camion",
                  extends: "Vehiculo",
                  constructors: [{ paramCount: 1, callsBase: true }],
                  methods: [{ name: "Recorrer", visibility: "public", paramCount: 1 }],
                },
              ],
            },
            testCases: [
              {
                stdin: "1200\n300\n",
                expectedStdout: "1500\n",
                visible: true,
                description: "Suma el tramo a lo que traia",
              },
              {
                stdin: "0\n45\n",
                expectedStdout: "45\n",
                visible: false,
                description: "Camion nuevo",
              },
              {
                stdin: "980\n0\n",
                expectedStdout: "980\n",
                visible: false,
                description: "Sin recorrido",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Use virtual/override and base references for runtime polymorphism.
     * Requisitos previos: base-protected
     */
    {
      slug: "virtual-override-polimorfismo",
      title: "Polimorfismo con virtual y override",
      description: "Invoca la implementación correcta a través de una referencia base.",
      estimatedMinutes: 17,
      xpReward: 60,
      steps: [
        {
          type: "theory",
          markdown: `# Un mensaje, ¿varias respuestas?

Piensa en este caso antes de ver ninguna palabra nueva:

\`\`\`csharp
class Empleado
{
    public decimal Pago() { return 1000m; }
}
class Vendedor : Empleado
{
    public decimal Pago() { return 1300m; }
}
...
Empleado e = new Vendedor();
Console.WriteLine(e.Pago());
\`\`\`

\`e\` está **declarada** como \`Empleado\`, pero el objeto que guarda es, en realidad, un \`Vendedor\`. ¿Qué \`Pago()\` corre: el de \`Empleado\` o el de \`Vendedor\`?`,
        },
        {
          type: "quiz",
          question: "Con el código de arriba (sin ninguna palabra clave nueva todavía), ¿qué imprime `e.Pago()`?",
          options: [
            "1300.00, porque el objeto real es un Vendedor",
            "1000.00, porque C# usa el tipo con el que se declaró e, no el tipo del objeto",
            "Un error de compilación",
            "1000.00 y 1300.00, una por línea",
          ],
          feedbackPerOption: [
            "Es la respuesta intuitiva, pero no es lo que hace C# sin más: sigue leyendo.",
            "",
            "El código compila: Vendedor sí es un Empleado.",
            "Sólo hay una llamada a Pago(); sólo puede imprimir un valor.",
          ],
          correctIndex: 1,
          explanation: "Sin marcar nada especial, C# resuelve Pago() por el TIPO DECLARADO de la variable (Empleado), no por el objeto real. Para que corra la versión de Vendedor hace falta decírselo explícitamente: eso es lo que sigue.",
        },
        {
          type: "theory",
          markdown: `# virtual + override: el contrato explícito

Para que \`e.Pago()\` corra la versión de \`Vendedor\` —lo que probablemente esperabas— hay que decirle a C# dos cosas:

- en la base, que el método **puede redefinirse**: \`public virtual decimal Pago()\`
- en la derivada, que **lo redefine**: \`public override decimal Pago()\`

Con las dos palabras presentes, C# elige la implementación según el **objeto real**, sin importar el tipo con el que declaraste la variable. Eso es polimorfismo.`,
        },
        {
          type: "code_example",
          code: `using System;
class Empleado
{
    public virtual decimal Pago() { return 1000m; }
}
class Vendedor : Empleado
{
    public override decimal Pago() { return 1300m; }
}
class Program
{
    static void Main()
    {
        Empleado e = new Vendedor();
        Console.WriteLine(e.Pago().ToString("0.00"));
    }
}`,
          explanation: "Misma variable declarada Empleado, mismo objeto Vendedor que antes — pero ahora Pago es virtual/override y sí corre la versión redefinida: 1300.00.",
          runnable: true,
          expectedOutput: "1300.00",
        },
        {
          type: "quiz",
          question: "¿Qué habilita el despacho polimórfico del ejemplo?",
          options: [
            "Que Pago sea static.",
            "La combinación virtual en la base y override en la derivada.",
            "Que la variable se llame e.",
            "El método Main.",
          ],
          correctIndex: 1,
          explanation: "virtual/override forman el contrato de redefinición.",
        },
        {
          // Segunda dimensión, por separado: ahora un ARREGLO de la base
          // con varios objetos reales. Todavía un solo par virtual/override.
          type: "code_completion",
          prompt: "Ordena el ciclo que recorre un arreglo de Empleado (con un Empleado y un Vendedor adentro) e imprime el Pago de cada uno con el método ya definido arriba.",
          lines: [
            "Empleado[] equipo = new Empleado[2];",
            "equipo[0] = new Empleado();",
            "equipo[1] = new Vendedor();",
            "for (int i = 0; i < equipo.Length; i++)",
            "    Console.WriteLine(equipo[i].Pago().ToString(\"0.00\"));",
          ],
          explanation: "El arreglo se declara del tipo base; cada posición puede guardar cualquier subtipo, y el ciclo no necesita saber cuál es cuál: cada Pago() se resuelve solo.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Define Notificacion con virtual Enviar(), y Correo y Sms que hagan override. Lee destinatarios, guarda ambos objetos en Notificacion[2] e imprime \"Correo a X\" y \"SMS a Y\" mediante un ciclo.",
            starterCode: `using System;
class Notificacion { public virtual void Enviar() { } }
class Correo : Notificacion { /* completa */ }
class Sms : Notificacion { /* completa */ }
class Program { static void Main() { /* arreglo y ciclo */ } }`,
            solutionCode: `using System;
class Notificacion { public virtual void Enviar() { } }
class Correo : Notificacion
{
    private string destino;
    public Correo(string destino) { this.destino = destino; }
    public override void Enviar() { Console.WriteLine("Correo a " + destino); }
}
class Sms : Notificacion
{
    private string destino;
    public Sms(string destino) { this.destino = destino; }
    public override void Enviar() { Console.WriteLine("SMS a " + destino); }
}
class Program
{
    static void Main()
    {
        Notificacion[] avisos = new Notificacion[2];
        avisos[0] = new Correo(Console.ReadLine());
        avisos[1] = new Sms(Console.ReadLine());
        for (int i = 0; i < avisos.Length; i++) avisos[i].Enviar();
    }
}`,
            hints: [
              "Cada derivada conserva su destino.",
              "Usa override.",
              "El arreglo debe declararse con el tipo base.",
            ],
            difficulty: "medium",
            xpReward: 35,
            structure: {
              classes: [
                {
                  name: "Notificacion",
                  methods: [{ name: "Enviar", visibility: "public", virtual: true }],
                },
                {
                  name: "Correo",
                  extends: "Notificacion",
                  methods: [{ name: "Enviar", visibility: "public", override: true }],
                },
                {
                  name: "Sms",
                  extends: "Notificacion",
                  methods: [{ name: "Enviar", visibility: "public", override: true }],
                },
              ],
            },
            testCases: [
              {
                stdin: "ana@ceti.mx\n3312345678\n",
                expectedStdout: "Correo a ana@ceti.mx\nSMS a 3312345678\n",
                visible: true,
                description: "Dos subtipos",
              },
              {
                stdin: "x@y.test\n000\n",
                expectedStdout: "Correo a x@y.test\nSMS a 000\n",
                visible: false,
                description: "Despacho y datos variables",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Declare and implement an abstract base class and abstract member.
     * Requisitos previos: virtual-override-polimorfismo
     */
    {
      slug: "clases-abstractas",
      title: "Contratos con clases abstractas",
      description: "Representa conceptos incompletos que sólo tienen sentido mediante subtipos.",
      estimatedMinutes: 17,
      xpReward: 50,
      steps: [
        {
          type: "theory",
          markdown: `# Una base que no debe instanciarse

Una clase \`abstract\` puede compartir estado y comportamiento, pero no se crea con \`new\`. Un miembro abstracto no tiene implementación y obliga a cada clase concreta a completarlo. Úsala cuando el dominio reconoce una familia y un contrato común; si sólo quieres que un objeto colabore con otro, composición suele ser más clara.`,
        },
        {
          type: "code_example",
          code: `using System;
abstract class Figura
{
    public abstract double Area();
    public void Mostrar() { Console.WriteLine(Area().ToString("0.00")); }
}
class Rectangulo : Figura
{
    private double ancho, alto;
    public Rectangulo(double ancho, double alto) { this.ancho = ancho; this.alto = alto; }
    public override double Area() { return ancho * alto; }
}
class Program
{
    static void Main() { new Rectangulo(3, 2).Mostrar(); }
}`,
          explanation: "Figura fija el contrato y comparte Mostrar; Rectangulo aporta el cálculo concreto.",
          runnable: true,
          expectedOutput: "6.00",
        },
        {
          type: "fill_blank",
          prompt: "Completa las palabras que convierten la base y su operación en un contrato abstracto implementado por Autobus.",
          template: `{{0}} class Transporte
{
    public {{1}} int Capacidad();
}
class Autobus : Transporte
{
    public {{2}} int Capacidad() { return 40; }
}`,
          blanks: [
            { answer: "abstract", hint: "Impide crear directamente la clase base." },
            { answer: "abstract", hint: "Declara una operación sin cuerpo." },
            { answer: "override", hint: "Implementa el contrato heredado." },
          ],
          explanation: "Una implementación concreta debe hacer override del miembro abstracto.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Crea abstract Producto con Nombre y abstract decimal PrecioFinal(). Crea ProductoNacional que devuelve el precio base y ProductoImportado que agrega 16%. Lee nombre y precio de ambos; imprime cada precio con dos decimales mediante Producto[2].",
            starterCode: `using System;
abstract class Producto { /* completa */ }
class ProductoNacional : Producto { /* completa */ }
class ProductoImportado : Producto { /* completa */ }
class Program { static void Main() { /* lee y recorre */ } }`,
            solutionCode: `using System;
abstract class Producto
{
    protected decimal precio;
    public string Nombre { get; private set; }
    public Producto(string nombre, decimal precio) { Nombre = nombre; this.precio = precio; }
    public abstract decimal PrecioFinal();
}
class ProductoNacional : Producto
{
    public ProductoNacional(string n, decimal p) : base(n, p) { }
    public override decimal PrecioFinal() { return precio; }
}
class ProductoImportado : Producto
{
    public ProductoImportado(string n, decimal p) : base(n, p) { }
    public override decimal PrecioFinal() { return precio * 1.16m; }
}
class Program
{
    static void Main()
    {
        Producto[] productos = new Producto[2];
        productos[0] = new ProductoNacional(Console.ReadLine(), decimal.Parse(Console.ReadLine()));
        productos[1] = new ProductoImportado(Console.ReadLine(), decimal.Parse(Console.ReadLine()));
        for (int i = 0; i < productos.Length; i++)
            Console.WriteLine(productos[i].Nombre + ": " + productos[i].PrecioFinal().ToString("0.00"));
    }
}`,
            hints: [
              "Producto no se instancia.",
              "Ambas derivadas implementan PrecioFinal.",
              "Usa 1.16m para decimal.",
            ],
            difficulty: "hard",
            xpReward: 40,
            structure: {
              classes: [
                {
                  name: "Producto",
                  abstract: true,
                  properties: [{ name: "Nombre", visibility: "public", type: "string" }],
                  methods: [
                    { name: "PrecioFinal", visibility: "public", abstract: true, returnType: "decimal" },
                  ],
                },
                {
                  name: "ProductoNacional",
                  extends: "Producto",
                  methods: [{ name: "PrecioFinal", visibility: "public", override: true }],
                },
                {
                  name: "ProductoImportado",
                  extends: "Producto",
                  methods: [{ name: "PrecioFinal", visibility: "public", override: true }],
                },
              ],
            },
            testCases: [
              {
                stdin: "Mesa\n100\nSensor\n250\n",
                expectedStdout: "Mesa: 100.00\nSensor: 290.00\n",
                visible: true,
                description: "Dos estrategias",
              },
              {
                stdin: "A\n1.5\nB\n10.25\n",
                expectedStdout: "A: 1.50\nB: 11.89\n",
                visible: false,
                description: "Decimales",
              },
            ],
          },
        },
      ],
    },
  ],
};
