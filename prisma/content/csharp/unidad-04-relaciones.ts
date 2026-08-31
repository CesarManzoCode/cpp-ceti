import type { UnitDefinition } from "../types";

// =====================================================================
// Relaciones entre clases
// Distingue dependencia, asociación, agregación, composición y generalización con evidencia de vida y propiedad.
// =====================================================================

export const unidad04: UnitDefinition = {
  slug: "csharp-poo-04-relaciones",
  title: "Relaciones entre clases",
  description: "Distingue dependencia, asociación, agregación, composición y generalización con evidencia de vida y propiedad.",
  icon: "🔗",
  published: true,
  lessons: [
    /**
     * Objetivo: Distinguish temporary use from persistent knowledge.
     * Requisitos previos: Unit 3
     */
    {
      slug: "dependencia-vs-asociacion",
      title: "Dependencia o asociación: ¿guarda la referencia?",
      description: "Usa la duración de la relación para decidir.",
      estimatedMinutes: 13,
      xpReward: 50,
      steps: [
        {
          type: "theory",
          markdown: `# La prueba de la referencia

**Dependencia:** una clase usa otra temporalmente, normalmente como parámetro o variable local. No necesita recordarla después de la operación. UML: flecha discontinua de quien usa hacia lo usado.

**Asociación:** un objeto conoce a otro durante parte relevante de su vida; guarda una referencia en un campo/propiedad. UML: línea continua.

\`Impresora.Imprimir(Documento d)\` puede ser dependencia si sólo usa \`d\` durante la llamada. \`Alumno\` asociado a \`Grupo\` guarda el grupo porque debe consultarlo después.`,
        },
        {
          type: "code_example",
          code: `using System;

class Documento
{
    public string Texto { get; private set; }
    public Documento(string texto) { Texto = texto; }
}

class Impresora
{
    public void Imprimir(Documento documento)
    {
        Console.WriteLine(documento.Texto);
    }
}

class Program
{
    static void Main()
    {
        Documento d = new Documento("Reporte");
        Impresora i = new Impresora();
        i.Imprimir(d);
    }
}`,
          explanation: "Impresora recibe Documento sólo durante Imprimir y no lo guarda: dependencia.",
          runnable: true,
          expectedOutput: "Reporte",
        },
        {
          type: "matching",
          pairs: [
            { left: "Método recibe Servicio y lo usa una vez", right: "Dependencia" },
            { left: "Alumno guarda Grupo como campo", right: "Asociación" },
            { left: "Flecha discontinua", right: "Notación común de dependencia" },
            { left: "Línea continua", right: "Notación común de asociación" },
          ],
          explanation: "No decidas por los nombres; decide por cómo vive la referencia.",
        },
        {
          type: "quiz",
          question: "Auto recibe Mecanico sólo en Revisar(Mecanico m) y no lo guarda. ¿Qué relación es?",
          options: [
            "Composición",
            "Dependencia",
            "Herencia",
            "Agregación",
          ],
          correctIndex: 1,
          explanation: "El uso es temporal y ocurre dentro de una operación.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Modela Notificador con Enviar(Mensaje mensaje), sin guardar el mensaje. Mensaje conserva Texto. Lee dos textos, crea un solo Notificador y dos Mensajes, y envíalos como Enviado: texto. La relación debe ser dependencia.",
            starterCode: `using System;

class Mensaje { /* ... */ }
class Notificador { /* ... */ }

class Program
{
    static void Main()
    {
        string a = Console.ReadLine();
        string b = Console.ReadLine();
        // Usa la dependencia
    }
}`,
            solutionCode: `using System;

class Mensaje
{
    public string Texto { get; private set; }
    public Mensaje(string texto) { Texto = texto; }
}

class Notificador
{
    public void Enviar(Mensaje mensaje)
    {
        Console.WriteLine($"Enviado: {mensaje.Texto}");
    }
}

class Program
{
    static void Main()
    {
        string a = Console.ReadLine();
        string b = Console.ReadLine();
        Notificador n = new Notificador();
        n.Enviar(new Mensaje(a));
        n.Enviar(new Mensaje(b));
    }
}`,
            hints: [
              "Notificador no necesita un campo Mensaje.",
              "Mensaje llega como parámetro.",
              "Usa dos objetos Mensaje.",
            ],
            difficulty: "easy",
            xpReward: 25,
            structure: {
              classes: [
                {
                  name: "Mensaje",
                  properties: [{ name: "Texto", visibility: "public", type: "string" }],
                  constructors: [{ paramCount: 1 }],
                },
                {
                  name: "Notificador",
                  methods: [{ name: "Enviar", visibility: "public", paramCount: 1 }],
                  // Dependencia: lo recibe, lo usa y NO lo conserva.
                  notStores: [{ type: "Mensaje" }],
                },
              ],
            },
            testCases: [
              {
                stdin: "Clase inicia\nClase termina\n",
                expectedStdout: "Enviado: Clase inicia\nEnviado: Clase termina\n",
                visible: true,
                description: "Dos dependencias temporales",
              },
              {
                stdin: "A\nB con espacio\n",
                expectedStdout: "Enviado: A\nEnviado: B con espacio\n",
                visible: false,
                description: "Texto variable",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Implement a persistent reference between independent objects.
     * Requisitos previos: dependencia-vs-asociacion
     */
    {
      slug: "asociacion",
      title: "Asociación: objetos que se conocen",
      description: "Guarda una referencia y navega la relación.",
      estimatedMinutes: 12,
      xpReward: 50,
      steps: [
        {
          type: "theory",
          markdown: `# Conocer no significa poseer

Un \`Alumno\` puede guardar una referencia a \`Grupo\`. Ambos pueden existir independientemente: el grupo no fue creado dentro del alumno y cambiar de grupo no destruye ninguno. Esa es una asociación.

La dirección importa. Si sólo \`Alumno\` guarda \`Grupo\`, puede navegar \`alumno.Grupo.Clave\`; el grupo no conoce automáticamente a todos sus alumnos.`,
        },
        {
          type: "code_example",
          code: `using System;

class Grupo
{
    public string Clave { get; private set; }
    public Grupo(string clave) { Clave = clave; }
}

class Alumno
{
    public string Nombre { get; private set; }
    private Grupo grupo;
    public Alumno(string nombre, Grupo grupo)
    {
        Nombre = nombre;
        this.grupo = grupo;
    }
    public void Mostrar() { Console.WriteLine($"{Nombre} - {grupo.Clave}"); }
}

class Program
{
    static void Main()
    {
        Grupo grupo = new Grupo("3P");
        Alumno alumno = new Alumno("Ana", grupo);
        alumno.Mostrar();
    }
}`,
          explanation: "Grupo nace fuera y se inyecta al Alumno, que conserva la referencia.",
          runnable: true,
          expectedOutput: "Ana - 3P",
        },
        {
          type: "quiz",
          question: "¿Qué línea convierte el uso de Grupo en una asociación persistente?",
          options: [
            "new Grupo(\"3P\")",
            "private Grupo grupo;",
            "Console.WriteLine",
            "class Program",
          ],
          correctIndex: 1,
          explanation: "El campo hace que Alumno recuerde al Grupo después del constructor.",
        },
        {
          type: "fill_blank",
          prompt: "Completa el campo y la asignación de una asociación.",
          template: `private {{0}} responsable;
public Equipo(Persona responsable) { {{1}}.responsable = responsable; }`,
          blanks: [
            { answer: "Persona", hint: "Tipo del objeto asociado." },
            { answer: "this", hint: "El objeto actual." },
          ],
          explanation: "El campo conserva la referencia recibida.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Crea Responsable con Nombre y Equipo con Codigo y una asociación private a Responsable recibida por constructor. Mostrar imprime Codigo -> Nombre. Lee un responsable y dos códigos; ambos equipos deben asociarse al mismo objeto Responsable.",
            starterCode: `using System;

class Responsable { /* ... */ }
class Equipo { /* ... */ }

class Program
{
    static void Main()
    {
        string nombre = Console.ReadLine();
        string c1 = Console.ReadLine();
        string c2 = Console.ReadLine();
        // Un responsable, dos equipos
    }
}`,
            solutionCode: `using System;

class Responsable
{
    public string Nombre { get; private set; }
    public Responsable(string nombre) { Nombre = nombre; }
}

class Equipo
{
    public string Codigo { get; private set; }
    private Responsable responsable;
    public Equipo(string codigo, Responsable responsable)
    {
        Codigo = codigo;
        this.responsable = responsable;
    }
    public void Mostrar() { Console.WriteLine($"{Codigo} -> {responsable.Nombre}"); }
}

class Program
{
    static void Main()
    {
        string nombre = Console.ReadLine();
        string c1 = Console.ReadLine();
        string c2 = Console.ReadLine();
        Responsable r = new Responsable(nombre);
        Equipo a = new Equipo(c1, r);
        Equipo b = new Equipo(c2, r);
        a.Mostrar();
        b.Mostrar();
    }
}`,
            hints: [
              "Responsable se crea una sola vez.",
              "Equipo guarda la referencia.",
              "Pasa r a ambos constructores.",
            ],
            difficulty: "medium",
            xpReward: 30,
            structure: {
              classes: [
                {
                  name: "Responsable",
                  properties: [{ name: "Nombre", visibility: "public", type: "string" }],
                  constructors: [{ paramCount: 1 }],
                },
                {
                  name: "Equipo",
                  properties: [{ name: "Codigo", visibility: "public", type: "string" }],
                  constructors: [{ paramCount: 2 }],
                  methods: [{ name: "Mostrar", visibility: "public" }],
                  // Asociación: el equipo GUARDA a su responsable.
                  stores: [{ type: "Responsable" }],
                },
              ],
            },
            testCases: [
              {
                stdin: "Franco\nPC-01\nPC-02\n",
                expectedStdout: "PC-01 -> Franco\nPC-02 -> Franco\n",
                visible: true,
                description: "Referencia compartida",
              },
              {
                stdin: "Ana Maria\nA\nB\n",
                expectedStdout: "A -> Ana Maria\nB -> Ana Maria\n",
                visible: false,
                description: "Nombre con espacio",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Differentiate whole-part relationships without false memory-management claims.
     * Requisitos previos: asociacion
     */
    {
      slug: "agregacion-composicion",
      title: "Agregación y composición: la vida de las partes",
      description: "Usa propiedad y ciclo de vida, no sólo el dibujo del rombo.",
      estimatedMinutes: 15,
      xpReward: 55,
      steps: [
        {
          type: "theory",
          markdown: `# El rombo habla del modelo, no del recolector de basura

**Agregación** (rombo blanco): relación todo-parte débil. La parte puede existir y ser compartida fuera del todo. Ejemplo: un \`EquipoProyecto\` recibe integrantes que ya existían.

**Composición** (rombo negro): el todo es responsable de crear/poseer conceptualmente la parte y la parte no tiene sentido independiente en ese modelo. Ejemplo: un \`Pedido\` crea sus \`DatosEnvio\` internos.

C# usa recolección de basura. Un rombo negro **no garantiza** que la memoria se destruya en un instante ni prohíbe físicamente otra referencia. Expresa una decisión de diseño y ciclo de vida conceptual.`,
        },
        {
          type: "code_example",
          code: `using System;

class Motor
{
    public string Serie { get; private set; }
    public Motor(string serie) { Serie = serie; }
}

class Auto
{
    private Motor motor;
    public Auto(string serieMotor)
    {
        motor = new Motor(serieMotor); // composición en este modelo
    }
    public void Mostrar() { Console.WriteLine(motor.Serie); }
}

class Program
{
    static void Main()
    {
        Auto auto = new Auto("M-9");
        auto.Mostrar();
    }
}`,
          explanation: "Auto crea su Motor internamente y no acepta uno compartido. Eso materializa la composición conceptual del ejemplo.",
          runnable: true,
          expectedOutput: "M-9",
        },
        {
          type: "matching",
          pairs: [
            { left: "El todo recibe una parte ya creada y compartible", right: "Agregación" },
            { left: "El todo crea la parte y controla su ciclo conceptual", right: "Composición" },
            { left: "Rombo blanco", right: "Agregación" },
            { left: "Rombo negro", right: "Composición" },
          ],
          explanation: "Primero justifica la vida de la parte; después elige el símbolo.",
        },
        {
          type: "quiz",
          question: "Curso recibe un Profesor creado por otro módulo; el Profesor puede impartir otros cursos. ¿Qué relación describe mejor el caso?",
          options: [
            "Composición",
            "Agregación",
            "Herencia",
            "Dependencia únicamente",
          ],
          correctIndex: 1,
          explanation: "Profesor existe independientemente y puede compartirse; Curso lo agrega a su contexto.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Implementa composición: Credencial crea internamente un CodigoQr a partir de un texto. CodigoQr tiene Valor; Credencial tiene Titular y un CodigoQr private. Mostrar imprime Titular:Valor. Program sólo puede crear Credencial, no debe pasar un CodigoQr.",
            starterCode: `using System;

class CodigoQr { /* ... */ }
class Credencial { /* ... */ }

class Program
{
    static void Main()
    {
        string titular = Console.ReadLine();
        string valor = Console.ReadLine();
        Credencial c = new Credencial(titular, valor);
        c.Mostrar();
    }
}`,
            solutionCode: `using System;

class CodigoQr
{
    public string Valor { get; private set; }
    public CodigoQr(string valor) { Valor = valor; }
}

class Credencial
{
    public string Titular { get; private set; }
    private CodigoQr codigo;
    public Credencial(string titular, string valorQr)
    {
        Titular = titular;
        codigo = new CodigoQr(valorQr);
    }
    public void Mostrar() { Console.WriteLine($"{Titular}:{codigo.Valor}"); }
}

class Program
{
    static void Main()
    {
        string titular = Console.ReadLine();
        string valor = Console.ReadLine();
        Credencial c = new Credencial(titular, valor);
        c.Mostrar();
    }
}`,
            hints: [
              "Credencial guarda un CodigoQr private.",
              "El new CodigoQr ocurre dentro del constructor de Credencial.",
              "Program pasa datos, no una parte ya creada.",
            ],
            difficulty: "medium",
            xpReward: 32,
            structure: {
              classes: [
                {
                  name: "CodigoQr",
                  properties: [{ name: "Valor", visibility: "public", type: "string" }],
                  constructors: [{ paramCount: 1 }],
                },
                {
                  name: "Credencial",
                  properties: [{ name: "Titular", visibility: "public", type: "string" }],
                  constructors: [{ paramCount: 2 }],
                  methods: [{ name: "Mostrar", visibility: "public" }],
                  // Composición: la credencial es dueña de su código.
                  stores: [{ type: "CodigoQr" }],
                },
              ],
            },
            testCases: [
              {
                stdin: "Cesar\nQR-123\n",
                expectedStdout: "Cesar:QR-123\n",
                visible: true,
                description: "Composición",
              },
              {
                stdin: "Ana Lopez\nX Y\n",
                expectedStdout: "Ana Lopez:X Y\n",
                visible: false,
                description: "Datos variables",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Select and justify a relation from requirements and implementation evidence.
     * Requisitos previos: All prior Unit 4 lessons
     */
    {
      slug: "elegir-relacion",
      title: "Elegir la relación y defenderla",
      description: "Combina UML y código sin escoger por intuición superficial.",
      estimatedMinutes: 16,
      xpReward: 60,
      steps: [
        {
          type: "theory",
          markdown: `# Cuatro preguntas de diagnóstico

1. ¿A es realmente un tipo de B? Si sí, candidata a generalización/herencia.
2. ¿A sólo usa B durante una llamada? Dependencia.
3. ¿A necesita recordar B? Asociación.
4. Si es todo-parte, ¿B existe/puede compartirse fuera de A? Sí: agregación. No, A crea y gobierna la parte: composición.

Las relaciones no son etiquetas decorativas. Deben coincidir con campos, parámetros, constructores y reglas de ciclo de vida del código.`,
        },
        {
          type: "matching",
          prompt: "Clasifica por evidencia, no por sustantivos.",
          pairs: [
            { left: "Reporte usa Formateador sólo en Generar(Formateador f)", right: "Dependencia" },
            { left: "Alumno guarda Grupo", right: "Asociación" },
            { left: "EquipoProyecto recibe Persona ya creada", right: "Agregación" },
            { left: "Pedido crea LineaDireccion interna no compartible", right: "Composición" },
          ],
          explanation: "La implementación propuesta aporta la evidencia decisiva.",
        },
        {
          type: "quiz",
          question: "¿Cuál afirmación es incorrecta?",
          options: [
            "Una dependencia suele aparecer como parámetro.",
            "Una asociación suele almacenarse como referencia.",
            "Toda clase con un campo de otro tipo es automáticamente composición.",
            "La composición expresa ciclo de vida conceptual fuerte.",
          ],
          correctIndex: 2,
          explanation: "Un campo sólo demuestra que se recuerda la referencia; la propiedad/ciclo de vida decide asociación, agregación o composición.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Modela una OrdenServicio que se asocia con un Cliente existente y compone un Diagnostico creado internamente desde texto. Cliente tiene Nombre; Diagnostico tiene Detalle; OrdenServicio recibe folio, Cliente y detalle. Mostrar imprime Folio | Cliente | Detalle. Lee un cliente y dos órdenes; ambas comparten el mismo Cliente, cada orden crea su Diagnostico.",
            starterCode: `using System;

class Cliente { /* ... */ }
class Diagnostico { /* ... */ }
class OrdenServicio { /* ... */ }

class Program
{
    static void Main()
    {
        string cliente = Console.ReadLine();
        string f1 = Console.ReadLine();
        string d1 = Console.ReadLine();
        string f2 = Console.ReadLine();
        string d2 = Console.ReadLine();
        // Un Cliente, dos OrdenServicio
    }
}`,
            solutionCode: `using System;

class Cliente
{
    public string Nombre { get; private set; }
    public Cliente(string nombre) { Nombre = nombre; }
}

class Diagnostico
{
    public string Detalle { get; private set; }
    public Diagnostico(string detalle) { Detalle = detalle; }
}

class OrdenServicio
{
    public string Folio { get; private set; }
    private Cliente cliente;
    private Diagnostico diagnostico;
    public OrdenServicio(string folio, Cliente cliente, string detalle)
    {
        Folio = folio;
        this.cliente = cliente;
        diagnostico = new Diagnostico(detalle);
    }
    public void Mostrar()
    {
        Console.WriteLine($"{Folio} | {cliente.Nombre} | {diagnostico.Detalle}");
    }
}

class Program
{
    static void Main()
    {
        string cliente = Console.ReadLine();
        string f1 = Console.ReadLine();
        string d1 = Console.ReadLine();
        string f2 = Console.ReadLine();
        string d2 = Console.ReadLine();
        Cliente c = new Cliente(cliente);
        OrdenServicio a = new OrdenServicio(f1, c, d1);
        OrdenServicio b = new OrdenServicio(f2, c, d2);
        a.Mostrar();
        b.Mostrar();
    }
}`,
            hints: [
              "Cliente se crea fuera y se comparte.",
              "Diagnostico se crea dentro de cada orden.",
              "Los campos revelan ambas relaciones.",
            ],
            difficulty: "hard",
            xpReward: 40,
            structure: {
              classes: [
                {
                  name: "Cliente",
                  properties: [{ name: "Nombre", visibility: "public", type: "string" }],
                  constructors: [{ paramCount: 1 }],
                },
                {
                  name: "Diagnostico",
                  properties: [{ name: "Detalle", visibility: "public", type: "string" }],
                  constructors: [{ paramCount: 1 }],
                },
                {
                  name: "OrdenServicio",
                  properties: [{ name: "Folio", visibility: "public", type: "string" }],
                  constructors: [{ paramCount: 3 }],
                  methods: [{ name: "Mostrar", visibility: "public" }],
                  // Asociación con el cliente y composición del diagnóstico.
                  stores: [{ type: "Cliente" }, { type: "Diagnostico" }],
                },
              ],
            },
            testCases: [
              {
                stdin: "Ferrol\nOS-1\nMotor detenido\nOS-2\nCable suelto\n",
                expectedStdout: "OS-1 | Ferrol | Motor detenido\nOS-2 | Ferrol | Cable suelto\n",
                visible: true,
                description: "Asociación + composición",
              },
              {
                stdin: "Cliente X\nA\nUno\nB\nDos\n",
                expectedStdout: "A | Cliente X | Uno\nB | Cliente X | Dos\n",
                visible: false,
                description: "Datos variables",
              },
            ],
          },
        },
      ],
    },
  ],
};
