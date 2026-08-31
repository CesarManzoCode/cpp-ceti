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
          type: "code_example",
          code: `using System;

class Empleado
{
    public string Nombre { get; private set; }
    public Empleado(string nombre) { Nombre = nombre; }
    public void Identificarse() { Console.WriteLine("Empleado: " + Nombre); }
}

class Becario : Empleado
{
    public string Escuela { get; private set; }
    public Becario(string nombre, string escuela) : base(nombre) { Escuela = escuela; }
}

class Program
{
    static void Main()
    {
        Becario b = new Becario("Ana", "CETI");
        b.Identificarse();
        Console.WriteLine(b.Escuela);
    }
}`,
          explanation: "Becario hereda Identificarse y satisface el contrato de Empleado; Escuela es su especialización.",
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
            prompt: "Crea Persona con Nombre y método Presentar(). Crea Alumno : Persona con Registro. Lee nombre y registro; imprime \"Persona: N\" y \"Registro: R\".",
            starterCode: `using System;
class Persona { /* completa */ }
class Alumno : Persona { /* completa */ }
class Program { static void Main() { /* lee, crea y muestra */ } }`,
            solutionCode: `using System;
class Persona
{
    public string Nombre { get; private set; }
    public Persona(string nombre) { Nombre = nombre; }
    public void Presentar() { Console.WriteLine("Persona: " + Nombre); }
}
class Alumno : Persona
{
    public string Registro { get; private set; }
    public Alumno(string nombre, string registro) : base(nombre) { Registro = registro; }
}
class Program
{
    static void Main()
    {
        Alumno a = new Alumno(Console.ReadLine(), Console.ReadLine());
        a.Presentar();
        Console.WriteLine("Registro: " + a.Registro);
    }
}`,
            hints: [
              "Usa : Persona.",
              "Invoca base(nombre) en el constructor.",
              "El método heredado se llama sobre Alumno.",
            ],
            difficulty: "medium",
            xpReward: 28,
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
          markdown: `# Un mensaje, varias respuestas

La base declara un punto de extensión \`virtual\`; la subclase lo redefine con \`override\`. Una variable de tipo base puede referirse a cualquier subtipo y C# elige la implementación según el objeto real. En POO I se practica con un arreglo de tamaño fijo; las colecciones genéricas corresponden a POO II.`,
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
        Empleado[] equipo = new Empleado[2];
        equipo[0] = new Empleado();
        equipo[1] = new Vendedor();
        for (int i = 0; i < equipo.Length; i++)
            Console.WriteLine(equipo[i].Pago().ToString("0.00"));
    }
}`,
          explanation: "La segunda referencia tiene tipo declarado Empleado, pero el objeto Vendedor decide la respuesta.",
          runnable: true,
          expectedOutput: `1000.00
1300.00`,
        },
        {
          type: "quiz",
          question: "¿Qué habilita el despacho polimórfico del ejemplo?",
          options: [
            "Que Pago sea static.",
            "La combinación virtual en la base y override en la derivada.",
            "Que el arreglo tenga dos posiciones.",
            "El método Main.",
          ],
          correctIndex: 1,
          explanation: "virtual/override forman el contrato de redefinición.",
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
