import type { UnitDefinition } from "../types";

// =====================================================================
// Encapsulamiento y constructores
// Protege el estado y garantiza que cada objeto nazca y permanezca válido.
// =====================================================================

export const unidad02: UnitDefinition = {
  slug: "csharp-poo-02-encapsular",
  title: "Encapsulamiento y constructores",
  description: "Protege el estado y garantiza que cada objeto nazca y permanezca válido.",
  icon: "🔒",
  published: true,
  lessons: [
    /**
     * Objetivo: Apply visibility according to responsibility, not convenience.
     * Requisitos previos: Unit 1
     */
    {
      slug: "visibilidad",
      title: "public, private y protected",
      description: "Decide quién puede ver o modificar cada miembro.",
      estimatedMinutes: 11,
      xpReward: 40,
      steps: [
        {
          type: "theory",
          markdown: `# Encapsular es controlar el acceso

- \`public\`: cualquier código con acceso al objeto puede usar el miembro. En UML: \`+\`.
- \`private\`: sólo la propia clase puede usarlo. En UML: \`-\`.
- \`protected\`: la clase y sus clases derivadas pueden usarlo. En UML: \`#\`.

El estado que sostiene una regla debe ser \`private\`. Si \`saldo\` es público, cualquier línea puede volverlo negativo sin pasar por \`Retirar\`. Haz públicas las operaciones que el resto del programa necesita, no todos los datos.

\`protected\` se reconoce ahora, pero se usará con sentido al estudiar herencia. No lo elijas como un \`private\` “menos estricto”.`,
        },
        {
          type: "code_example",
          code: `using System;

class CuentaCopias
{
    private int saldo;

    public void Recargar(int hojas)
    {
        if (hojas > 0) saldo = saldo + hojas;
    }

    public bool Imprimir()
    {
        if (saldo == 0) return false;
        saldo = saldo - 1;
        return true;
    }

    public int ConsultarSaldo()
    {
        return saldo;
    }
}

class Program
{
    static void Main()
    {
        CuentaCopias cuenta = new CuentaCopias();
        cuenta.Recargar(2);
        cuenta.Imprimir();
        Console.WriteLine(cuenta.ConsultarSaldo());
    }
}`,
          explanation: "Program no puede escribir saldo directamente. Sólo las operaciones de CuentaCopias pueden preservar la regla.",
          runnable: true,
          expectedOutput: "1",
        },
        {
          type: "quiz",
          question: "¿Qué miembro debería ser private en una clase Inventario?",
          options: [
            "RegistrarEntrada(int)",
            "ConsultarExistencias()",
            "existencias",
            "MostrarResumen()",
          ],
          correctIndex: 2,
          explanation: "El dato interno sostiene reglas; el exterior interactúa mediante operaciones públicas.",
        },
        {
          type: "fill_blank",
          prompt: "Haz privado el dato y pública la operación que lo consulta.",
          template: `{{0}} int existencias;
{{1}} int Consultar() { return existencias; }`,
          blanks: [
            { answer: "private", hint: "Sólo la clase debe modificar el campo." },
            { answer: "public", hint: "El resto del programa sí necesita consultar." },
          ],
          explanation: "El campo queda oculto; el método es el contrato público.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Implementa Inventario con existencias private, Agregar(int), Retirar(int) que devuelva bool y Consultar(). Agregar ignora cantidades <= 0. Retirar sólo tiene éxito si cantidad > 0 y hay suficientes piezas. Lee inicial, retiro y entrada; inicializa agregando, intenta retirar, agrega la entrada e imprime OK/NO y Final: N.",
            starterCode: `using System;

class Inventario
{
    private int existencias;
    // Métodos públicos
}

class Program
{
    static void Main()
    {
        int inicial = int.Parse(Console.ReadLine());
        int retiro = int.Parse(Console.ReadLine());
        int entrada = int.Parse(Console.ReadLine());
        // Ejecuta el caso
    }
}`,
            solutionCode: `using System;

class Inventario
{
    private int existencias;
    public void Agregar(int cantidad) { if (cantidad > 0) existencias += cantidad; }
    public bool Retirar(int cantidad)
    {
        if (cantidad <= 0 || cantidad > existencias) return false;
        existencias -= cantidad;
        return true;
    }
    public int Consultar() { return existencias; }
}

class Program
{
    static void Main()
    {
        int inicial = int.Parse(Console.ReadLine());
        int retiro = int.Parse(Console.ReadLine());
        int entrada = int.Parse(Console.ReadLine());
        Inventario inventario = new Inventario();
        inventario.Agregar(inicial);
        bool ok = inventario.Retirar(retiro);
        inventario.Agregar(entrada);
        Console.WriteLine(ok ? "OK" : "NO");
        Console.WriteLine($"Final: {inventario.Consultar()}");
    }
}`,
            hints: [
              "No expongas existencias.",
              "Retirar valida antes de restar.",
              "El operador condicional puede imprimir OK o NO.",
            ],
            difficulty: "medium",
            xpReward: 30,
            structure: {
              classes: [
                {
                  name: "Inventario",
                  fields: [{ name: "existencias", visibility: "private", type: "int" }],
                  methods: [
                    { name: "Agregar", visibility: "public", paramCount: 1 },
                    { name: "Retirar", visibility: "public", paramCount: 1, returnType: "bool" },
                    { name: "Consultar", visibility: "public", returnType: "int" },
                  ],
                },
              ],
            },
            testCases: [
              {
                stdin: "10\n4\n3\n",
                expectedStdout: "OK\nFinal: 9\n",
                visible: true,
                description: "Retiro válido",
              },
              {
                stdin: "5\n8\n2\n",
                expectedStdout: "NO\nFinal: 7\n",
                visible: false,
                description: "No permite negativo",
              },
              {
                stdin: "4\n0\n-3\n",
                expectedStdout: "NO\nFinal: 4\n",
                visible: false,
                description: "Cantidades inválidas",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Implement controlled read/write access and explain C# properties.
     * Requisitos previos: visibilidad
     */
    {
      slug: "getters-setters-propiedades",
      title: "Getters, setters y propiedades de C#",
      description: "Conecta el estilo visto en clase con la forma idiomática de C#.",
      estimatedMinutes: 12,
      xpReward: 45,
      steps: [
        {
          type: "theory",
          markdown: `# Dos escrituras, una misma intención

Un getter explícito devuelve un campo privado y un setter recibe el valor nuevo:

\`\`\`csharp
public string GetNombre() { return nombre; }
public void SetNombre(string nuevo) { nombre = nuevo; }
\`\`\`

C# ofrece **propiedades**, que conservan ese control con una sintaxis de uso parecida a un campo:

\`\`\`csharp
public string Nombre
{
    get { return nombre; }
    set { if (value != "") nombre = value; }
}
\`\`\`

\`value\` es el dato que intentan asignar. Desde fuera se escribe \`alumno.Nombre = "Ana"\`, pero se ejecuta el bloque \`set\`. Una auto-propiedad (\`public string Nombre { get; set; }\`) es útil cuando no hay regla; no protege por arte de magia una validación que nunca escribiste.`,
        },
        {
          type: "code_example",
          code: `using System;

class Alumno
{
    private double promedio;

    public double Promedio
    {
        get { return promedio; }
        set
        {
            if (value >= 0 && value <= 10) promedio = value;
        }
    }
}

class Program
{
    static void Main()
    {
        Alumno alumno = new Alumno();
        alumno.Promedio = 8.7;
        alumno.Promedio = 15;
        Console.WriteLine(alumno.Promedio.ToString("F1"));
    }
}`,
          explanation: "La segunda asignación pasa por set, no cumple la regla y no reemplaza 8.7.",
          runnable: true,
          expectedOutput: "8.7",
        },
        {
          type: "matching",
          prompt: "Empareja sintaxis y efecto.",
          pairs: [
            { left: "get", right: "Se ejecuta al leer la propiedad" },
            { left: "set", right: "Se ejecuta al asignar la propiedad" },
            { left: "value", right: "Valor nuevo recibido por el setter" },
            { left: "{ get; private set; }", right: "Se lee desde fuera; sólo la clase asigna" },
          ],
          explanation: "Una propiedad es una interfaz controlada sobre el estado.",
        },
        {
          type: "fill_blank",
          prompt: "Completa una propiedad que permite leer Stock desde fuera pero sólo modificarlo dentro de la clase.",
          template: "public int Stock { {{0}}; {{1}} set; }",
          blanks: [
            { answer: "get", hint: "Accessor de lectura." },
            { answer: "private", hint: "Restringe la escritura." },
          ],
          explanation: "Program puede consultar Stock, pero no asignarlo directamente.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Crea Calificacion con campo private valor y propiedad Valor. El setter acepta sólo 0..10; si el dato es inválido conserva el anterior. Lee dos intentos de asignación e imprime el valor final con un decimal.",
            starterCode: `using System;

class Calificacion
{
    private double valor;
    // Propiedad Valor
}

class Program
{
    static void Main()
    {
        double a = double.Parse(Console.ReadLine());
        double b = double.Parse(Console.ReadLine());
        Calificacion c = new Calificacion();
        c.Valor = a;
        c.Valor = b;
        Console.WriteLine(c.Valor.ToString("F1"));
    }
}`,
            solutionCode: `using System;

class Calificacion
{
    private double valor;
    public double Valor
    {
        get { return valor; }
        set { if (value >= 0 && value <= 10) valor = value; }
    }
}

class Program
{
    static void Main()
    {
        double a = double.Parse(Console.ReadLine());
        double b = double.Parse(Console.ReadLine());
        Calificacion c = new Calificacion();
        c.Valor = a;
        c.Valor = b;
        Console.WriteLine(c.Valor.ToString("F1"));
    }
}`,
            hints: [
              "La propiedad y el campo no deben llamarse igual.",
              "value debe estar entre 0 y 10.",
              "Una entrada inválida no asigna nada.",
            ],
            difficulty: "medium",
            xpReward: 30,
            structure: {
              classes: [
                {
                  name: "Calificacion",
                  fields: [{ name: "valor", visibility: "private", type: "double" }],
                  properties: [{ name: "Valor", visibility: "public", type: "double" }],
                },
              ],
            },
            testCases: [
              {
                stdin: "8.5\n12\n",
                expectedStdout: "8.5\n",
                visible: true,
                description: "Conserva válido",
              },
              {
                stdin: "-1\n9\n",
                expectedStdout: "9.0\n",
                visible: false,
                description: "Segundo válido",
              },
              {
                stdin: "10\n0\n",
                expectedStdout: "0.0\n",
                visible: false,
                description: "Límites inclusivos",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Use constructors and this to establish valid initial state.
     * Requisitos previos: getters-setters-propiedades
     */
    {
      slug: "constructores",
      title: "Constructores: objetos válidos desde el inicio",
      description: "Inicializa el estado obligatorio al crear la instancia.",
      estimatedMinutes: 12,
      xpReward: 45,
      steps: [
        {
          type: "theory",
          markdown: `# El constructor no es un método cualquiera

Tiene el mismo nombre que la clase, no declara tipo de retorno y se ejecuta con \`new\`. Si un producto no tiene sentido sin código y precio, esos datos pertenecen al constructor.

\`this.codigo\` señala el campo del objeto actual; \`codigo\` señala el parámetro. La distinción evita nombres artificiales.

Si declaras cualquier constructor con parámetros, C# ya no crea automáticamente el constructor vacío. \`new Producto()\` sólo compilará si también defines \`public Producto() { ... }\`.`,
        },
        {
          type: "code_example",
          code: `using System;

class Producto
{
    public string Codigo { get; private set; }
    public double Precio { get; private set; }

    public Producto(string codigo, double precio)
    {
        Codigo = codigo;
        if (precio >= 0) Precio = precio;
    }
}

class Program
{
    static void Main()
    {
        Producto p = new Producto("T-15", 39.5);
        Console.WriteLine($"{p.Codigo}: \${p.Precio:F2}");
    }
}`,
          explanation: "El objeto recibe sus datos obligatorios en la misma expresión que lo crea.",
          runnable: true,
          expectedOutput: "T-15: $39.50",
        },
        {
          type: "quiz",
          question: "¿Cuál firma es un constructor válido de la clase Pedido?",
          options: [
            "public void Pedido()",
            "public Pedido(int folio)",
            "private int Pedido",
            "public int Pedido()",
          ],
          correctIndex: 1,
          explanation: "No tiene tipo de retorno y su nombre coincide exactamente con la clase.",
        },
        {
          type: "code_completion",
          prompt: "Ordena el constructor que asigna ambos parámetros al objeto actual.",
          lines: [
            "public Equipo(string serie, int ram)",
            "{",
            "    this.serie = serie;",
            "    this.ram = ram;",
            "}",
          ],
          explanation: "this distingue los campos de los parámetros homónimos.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Implementa Pedido con propiedades Folio y Total de escritura privada. El constructor recibe ambos; Total negativo se convierte en 0. Lee datos, crea el objeto e imprime Pedido F: $T con dos decimales.",
            starterCode: `using System;

class Pedido
{
    // Propiedades y constructor
}

class Program
{
    static void Main()
    {
        int folio = int.Parse(Console.ReadLine());
        double total = double.Parse(Console.ReadLine());
        Pedido pedido = new Pedido(folio, total);
        Console.WriteLine($"Pedido {pedido.Folio}: \${pedido.Total:F2}");
    }
}`,
            solutionCode: `using System;

class Pedido
{
    public int Folio { get; private set; }
    public double Total { get; private set; }
    public Pedido(int folio, double total)
    {
        Folio = folio;
        Total = total >= 0 ? total : 0;
    }
}

class Program
{
    static void Main()
    {
        int folio = int.Parse(Console.ReadLine());
        double total = double.Parse(Console.ReadLine());
        Pedido pedido = new Pedido(folio, total);
        Console.WriteLine($"Pedido {pedido.Folio}: \${pedido.Total:F2}");
    }
}`,
            hints: [
              "Las propiedades llevan private set.",
              "El constructor tiene el nombre Pedido.",
              "Usa total >= 0 ? total : 0.",
            ],
            difficulty: "medium",
            xpReward: 30,
            structure: {
              classes: [
                {
                  name: "Pedido",
                  properties: [
                    { name: "Folio", visibility: "public", type: "int" },
                    { name: "Total", visibility: "public", type: "double" },
                  ],
                  constructors: [{ paramCount: 2 }],
                },
              ],
            },
            testCases: [
              {
                stdin: "104\n250.5\n",
                expectedStdout: "Pedido 104: $250.50\n",
                visible: true,
                description: "Total válido",
              },
              {
                stdin: "7\n-10\n",
                expectedStdout: "Pedido 7: $0.00\n",
                visible: false,
                description: "Corrige negativo",
              },
              {
                stdin: "0\n0\n",
                expectedStdout: "Pedido 0: $0.00\n",
                visible: false,
                description: "Ceros",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Implement method and constructor overloads with distinct signatures.
     * Requisitos previos: constructores
     */
    {
      slug: "sobrecarga",
      title: "Sobrecarga: mismo nombre, distintas entradas",
      description: "Distingue sobrecarga de duplicación y de override.",
      estimatedMinutes: 10,
      xpReward: 45,
      steps: [
        {
          type: "theory",
          markdown: `# La firma decide qué versión se llama

Hay **sobrecarga** cuando una clase contiene métodos con el mismo nombre pero diferente cantidad o tipo de parámetros. El tipo de retorno por sí solo no distingue una firma.

\`\`\`csharp
public double Calcular(double subtotal) { ... }
public double Calcular(double subtotal, double descuento) { ... }
\`\`\`

Esto no es \`override\`. Sobrecarga se resuelve por los argumentos de la llamada y puede ocurrir sin herencia. \`override\` reemplaza comportamiento heredado y llegará después.`,
        },
        {
          type: "code_example",
          code: `using System;

class Etiqueta
{
    public void Imprimir(string texto)
    {
        Console.WriteLine(texto);
    }

    public void Imprimir(string texto, int copias)
    {
        for (int i = 0; i < copias; i++) Console.WriteLine(texto);
    }
}

class Program
{
    static void Main()
    {
        Etiqueta e = new Etiqueta();
        e.Imprimir("A");
        e.Imprimir("B", 2);
    }
}`,
          explanation: "El compilador elige por la lista de argumentos: una cadena o una cadena más un entero.",
          runnable: true,
          expectedOutput: `A
B
B`,
        },
        {
          type: "quiz",
          question: "¿Cuál par NO es una sobrecarga válida?",
          options: [
            "Calcular(int) y Calcular(double)",
            "Calcular(int) y Calcular(int, int)",
            "int Calcular(int) y double Calcular(int)",
            "Pedido() y Pedido(int)",
          ],
          correctIndex: 2,
          explanation: "Sólo cambia el retorno; los parámetros son idénticos, así que las firmas colisionan.",
        },
        {
          type: "matching",
          pairs: [
            { left: "Mismo nombre, parámetros distintos", right: "Sobrecarga" },
            { left: "Misma firma heredada, nueva implementación", right: "Override (se verá con herencia)" },
            { left: "Pedido()` y `Pedido(int folio)", right: "Constructores sobrecargados" },
            { left: "Cambiar sólo el tipo de retorno", right: "Error: firma duplicada" },
          ],
          explanation: "La sobrecarga ofrece variantes legítimas de una misma operación.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Crea CalculadoraEnvio con Calcular(double peso), que cobra peso*12, y la sobrecarga Calcular(double peso, bool express), que cobra peso*12 más 50 sólo si express es true. Lee peso y 0/1; imprime Normal y Elegido con dos decimales.",
            starterCode: `using System;

class CalculadoraEnvio
{
    // Dos métodos Calcular
}

class Program
{
    static void Main()
    {
        double peso = double.Parse(Console.ReadLine());
        bool express = Console.ReadLine() == "1";
        CalculadoraEnvio c = new CalculadoraEnvio();
        Console.WriteLine($"Normal: {c.Calcular(peso):F2}");
        Console.WriteLine($"Elegido: {c.Calcular(peso, express):F2}");
    }
}`,
            solutionCode: `using System;

class CalculadoraEnvio
{
    public double Calcular(double peso) { return peso * 12; }
    public double Calcular(double peso, bool express)
    {
        return Calcular(peso) + (express ? 50 : 0);
    }
}

class Program
{
    static void Main()
    {
        double peso = double.Parse(Console.ReadLine());
        bool express = Console.ReadLine() == "1";
        CalculadoraEnvio c = new CalculadoraEnvio();
        Console.WriteLine($"Normal: {c.Calcular(peso):F2}");
        Console.WriteLine($"Elegido: {c.Calcular(peso, express):F2}");
    }
}`,
            hints: [
              "Las dos firmas difieren por el segundo parámetro.",
              "La segunda versión puede reutilizar Calcular(peso).",
              "Express suma 50.",
            ],
            difficulty: "medium",
            xpReward: 32,
            structure: {
              classes: [
                {
                  name: "CalculadoraEnvio",
                  methods: [
                    { name: "Calcular", visibility: "public", paramCount: 1, returnType: "double" },
                    { name: "Calcular", visibility: "public", paramCount: 2, returnType: "double" },
                  ],
                },
              ],
            },
            testCases: [
              {
                stdin: "2.5\n1\n",
                expectedStdout: "Normal: 30.00\nElegido: 80.00\n",
                visible: true,
                description: "Express",
              },
              {
                stdin: "10\n0\n",
                expectedStdout: "Normal: 120.00\nElegido: 120.00\n",
                visible: false,
                description: "Normal",
              },
              {
                stdin: "0\n1\n",
                expectedStdout: "Normal: 0.00\nElegido: 50.00\n",
                visible: false,
                description: "Peso cero",
              },
            ],
          },
        },
      ],
    },
    /**
     * Referencias e identidad. Vive AQUÍ y no en U1 a propósito (ver
     * `CS-01`): `b = a` sólo se entiende cuando el alumno ya distingue
     * identidad, estado e independencia entre instancias, y ya construye
     * objetos con constructor. Antes de eso, aliasing es ruido.
     *
     * El orden interno también importa: primero se VE el caso (dos
     * variables, un objeto), luego se PREDICE, y sólo al final se escribe
     * código.
     */
    {
      slug: "referencias-identidad",
      title: "Referencias: dos variables, un objeto",
      description: "Distingue copiar una referencia de crear otro objeto.",
      estimatedMinutes: 9,
      xpReward: 40,
      steps: [
        {
          type: "theory",
          markdown: `# La variable no es el objeto

Cuando escribes \`Locker a = new Locker();\` pasan dos cosas distintas:

1. \`new Locker()\` crea **el objeto** en algún lugar de la memoria.
2. \`a\` guarda **una referencia** a ese objeto: una flecha que apunta hacia él.

La variable no *contiene* el objeto: lo *señala*.

Eso explica un caso que hasta ahora no habíamos tocado:

\`\`\`csharp
Locker a = new Locker();   //  a ──▶ [objeto 1]
Locker b = a;              //  b ──▶ [objeto 1]   (la MISMA flecha)
\`\`\`

Contra este otro:

\`\`\`csharp
Locker a = new Locker();   //  a ──▶ [objeto 1]
Locker b = new Locker();   //  b ──▶ [objeto 2]   (dos objetos)
\`\`\`

**Cuenta los \`new\`: hay tantos objetos como \`new\`.** En el primer caso hay uno solo, con dos nombres.`,
        },
        {
          type: "code_example",
          code: `using System;

class Locker
{
    public int Numero;
}

class Program
{
    static void Main()
    {
        Locker a = new Locker();
        a.Numero = 12;

        Locker b = a;          // copia la REFERENCIA, no el objeto
        b.Numero = 99;

        Locker c = new Locker();  // este si es otro objeto
        c.Numero = 7;

        Console.WriteLine(a.Numero);
        Console.WriteLine(b.Numero);
        Console.WriteLine(c.Numero);
    }
}`,
          explanation: "Hay dos `new`, así que hay dos objetos. `a` y `b` apuntan al mismo: cambiar `b.Numero` cambia lo que ve `a`. `c` es independiente. Cambia `Locker b = a;` por `Locker b = new Locker();` y observa cómo las dos primeras líneas dejan de moverse juntas.",
          runnable: true,
          expectedOutput: `99
99
7`,
        },
        {
          type: "quiz",
          question: "Después de `Cuenta x = new Cuenta(); Cuenta y = x; y.Saldo = 500;`, ¿cuánto vale `x.Saldo`?",
          options: [
            "500: x e y son dos nombres del mismo objeto.",
            "0: y trabaja sobre una copia del objeto.",
            "Depende de cuál se lea primero.",
            "No compila: no se pueden asignar objetos entre variables.",
          ],
          feedbackPerOption: [
            "",
            "Asignar una variable de clase copia la flecha, no el objeto al que apunta.",
            "El orden de lectura no cambia el estado: hay un solo objeto.",
            "Sí compila: es una asignación de referencia, algo perfectamente normal.",
          ],
          correctIndex: 0,
          explanation: "Hubo un solo `new`, así que hay un solo objeto. `y = x` copió la referencia y las dos variables lo señalan.",
        },
        {
          type: "fill_blank",
          prompt: "Completa el código para que `original` y `copia` terminen siendo DOS objetos independientes.",
          template: `Cuenta original = new Cuenta("Ana");
Cuenta copia = {{0}} Cuenta({{1}}.Titular);`,
          blanks: [
            { answer: "new", hint: "Para que sea otro objeto tiene que haber otro..." },
            { answer: "original", hint: "El titular se toma de la cuenta que ya existe." },
          ],
          explanation: "Sin un segundo `new` habría un solo objeto con dos nombres. Con él hay dos objetos que sólo comparten el dato copiado.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: `## Uno o dos objetos

\`Ficha\` ya está escrita, con constructor y propiedad. En \`Main\`:

1. crea una ficha con el nombre leído;
2. crea un **alias** de esa misma ficha (sin \`new\`) y cámbiale el nombre al leído en segundo lugar;
3. crea una ficha **independiente** con el tercer nombre;
4. imprime, en este orden, el nombre de la ficha original, el del alias y el de la independiente.

Si el alias está bien hecho, las dos primeras líneas salen iguales.`,
            starterCode: `using System;

class Ficha
{
    public string Nombre { get; set; }
    public Ficha(string nombre) { Nombre = nombre; }
}

class Program
{
    static void Main()
    {
        string primero = Console.ReadLine();
        string cambio = Console.ReadLine();
        string tercero = Console.ReadLine();

        // 1) ficha original   2) alias (sin new) + cambio   3) ficha aparte
    }
}`,
            solutionCode: `using System;

class Ficha
{
    public string Nombre { get; set; }
    public Ficha(string nombre) { Nombre = nombre; }
}

class Program
{
    static void Main()
    {
        string primero = Console.ReadLine();
        string cambio = Console.ReadLine();
        string tercero = Console.ReadLine();

        Ficha original = new Ficha(primero);
        Ficha alias = original;
        alias.Nombre = cambio;

        Ficha aparte = new Ficha(tercero);

        Console.WriteLine(original.Nombre);
        Console.WriteLine(alias.Nombre);
        Console.WriteLine(aparte.Nombre);
    }
}`,
            hints: [
              "El alias se crea SIN new: Ficha alias = original;",
              "Cambiarle el nombre al alias cambia el del original: es el mismo objeto.",
              "La ficha independiente sí lleva su propio new.",
            ],
            difficulty: "easy",
            xpReward: 25,
            structure: {
              classes: [
                {
                  name: "Ficha",
                  properties: [{ name: "Nombre", visibility: "public", type: "string" }],
                  constructors: [{ paramCount: 1 }],
                },
              ],
            },
            testCases: [
              {
                stdin: "Ana\nSofia\nLuis\n",
                expectedStdout: "Sofia\nSofia\nLuis\n",
                visible: true,
                description: "El alias arrastra al original",
              },
              {
                stdin: "A\nB\nC\n",
                expectedStdout: "B\nB\nC\n",
                visible: false,
                description: "Nombres cortos",
              },
              {
                stdin: "Equipo 1\nEquipo 2\nEquipo 3\n",
                expectedStdout: "Equipo 2\nEquipo 2\nEquipo 3\n",
                visible: false,
                description: "Nombres con espacio",
              },
            ],
          },
        },
      ],
    },
  ],
};
