import type { UnitDefinition } from "../types";

// =====================================================================
// UML como contrato de código
// Lee y produce diagramas de clase que coincidan con una implementación real.
// =====================================================================

export const unidad03: UnitDefinition = {
  slug: "csharp-poo-03-uml",
  title: "UML como contrato de código",
  description: "Lee y produce diagramas de clase que coincidan con una implementación real.",
  icon: "📐",
  published: true,
  lessons: [
    /**
     * Objetivo: Read every part of a UML class box.
     * Requisitos previos: Units 1-2
     */
    {
      slug: "anatomia-diagrama-clase",
      title: "La anatomía de una clase en UML",
      description: "Interpreta nombre, atributos, operaciones, tipos y visibilidad.",
      estimatedMinutes: 11,
      xpReward: 40,
      steps: [
        {
          type: "theory",
          markdown: `# Tres compartimentos

\`\`\`text
Producto
-----------------------------
-codigo: string
-precio: double
-----------------------------
+Producto(codigo: string, precio: double)
+CambiarPrecio(nuevo: double): bool
+ObtenerPrecio(): double
\`\`\`

1. Arriba: nombre de clase.
2. Centro: atributos como \`visibilidad nombre: tipo\`.
3. Abajo: operaciones como \`visibilidad nombre(parámetros): retorno\`.

Símbolos: \`+ public\`, \`- private\`, \`# protected\`. \`void\` significa que la operación no devuelve un valor. Un constructor no necesita retorno en código; en el diagrama puede mostrarse con el nombre de la clase.`,
        },
        {
          type: "matching",
          pairs: [
            { left: "-saldo: int", right: "Campo private saldo de tipo int" },
            { left: "+Recargar(cantidad: int): void", right: "Método público con un parámetro" },
            { left: "#codigo: string", right: "Miembro protected" },
            { left: "+Consultar(): int", right: "Método público que devuelve int" },
          ],
          explanation: "Lee cada línea de izquierda a derecha: visibilidad, nombre, tipo o firma.",
        },
        {
          type: "quiz",
          question: "¿Qué representa +Retirar(cantidad: int): bool?",
          options: [
            "Un campo público bool llamado Retirar",
            "Un método privado sin parámetros",
            "Un método público que recibe int y devuelve bool",
            "Un constructor protected",
          ],
          correctIndex: 2,
          explanation: "Los paréntesis indican operación; + es public; el tipo después de : es el retorno.",
        },
        {
          type: "fill_blank",
          prompt: "Traduce el miembro UML -existencias: int a C#.",
          template: "{{0}} {{1}} existencias;",
          blanks: [
            { answer: "private", hint: "El símbolo -." },
            { answer: "int", hint: "El tipo aparece después de : en UML." },
          ],
          explanation: "UML coloca nombre antes del tipo; C# coloca tipo antes del nombre.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Implementa exactamente este contrato: Contador, -valor:int, +Contador(inicial:int), +Incrementar():void, +Obtener():int. Lee inicial y número de incrementos, crea el objeto, incrementa con un for e imprime Obtener().",
            starterCode: `using System;

// Implementa Contador según UML

class Program
{
    static void Main()
    {
        int inicial = int.Parse(Console.ReadLine());
        int veces = int.Parse(Console.ReadLine());
        // Usa Contador
    }
}`,
            solutionCode: `using System;

class Contador
{
    private int valor;
    public Contador(int inicial) { valor = inicial; }
    public void Incrementar() { valor++; }
    public int Obtener() { return valor; }
}

class Program
{
    static void Main()
    {
        int inicial = int.Parse(Console.ReadLine());
        int veces = int.Parse(Console.ReadLine());
        Contador contador = new Contador(inicial);
        for (int i = 0; i < veces; i++) contador.Incrementar();
        Console.WriteLine(contador.Obtener());
    }
}`,
            hints: [
              "Cada línea UML se convierte en un miembro.",
              "valor no se toca desde Program.",
              "El for llama Incrementar veces veces.",
            ],
            difficulty: "easy",
            xpReward: 25,
            testCases: [
              {
                stdin: "5\n3\n",
                expectedStdout: "8\n",
                visible: true,
                description: "Contrato básico",
              },
              {
                stdin: "-2\n2\n",
                expectedStdout: "0\n",
                visible: false,
                description: "Inicial negativo",
              },
              {
                stdin: "9\n0\n",
                expectedStdout: "9\n",
                visible: false,
                description: "Sin incrementos",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Translate a complete UML class into compiling C#.
     * Requisitos previos: anatomia-diagrama-clase
     */
    {
      slug: "uml-a-csharp",
      title: "Del diagrama al código",
      description: "Implementa sin perder visibilidad, tipos ni firmas.",
      estimatedMinutes: 13,
      xpReward: 50,
      steps: [
        {
          type: "theory",
          markdown: `# Traducción mecánica, decisiones explícitas

Recorre el diagrama en este orden:

1. Crea la clase.
2. Declara atributos con la visibilidad exacta.
3. Implementa constructor y establece invariantes.
4. Implementa cada operación con parámetros y retorno exactos.
5. Compila un caso mínimo y compara nuevamente diagrama contra código.

No “mejores” silenciosamente el contrato durante la traducción. Si el diagrama necesita cambiar, actualiza ambos artefactos y explica por qué.`,
        },
        {
          type: "code_example",
          code: `using System;

// UML:
// Bateria
// -nivel: int
// +Bateria(inicial: int)
// +Cargar(cantidad: int): void
// +Nivel(): int
class Bateria
{
    private int nivel;

    public Bateria(int inicial)
    {
        nivel = inicial >= 0 ? inicial : 0;
    }

    public void Cargar(int cantidad)
    {
        if (cantidad > 0) nivel += cantidad;
    }

    public int Nivel() { return nivel; }
}

class Program
{
    static void Main()
    {
        Bateria b = new Bateria(20);
        b.Cargar(15);
        Console.WriteLine(b.Nivel());
    }
}`,
          explanation: "El comentario permite revisar la correspondencia uno a uno. La validación concreta una regla del modelo sin cambiar la firma.",
          runnable: true,
          expectedOutput: "35",
        },
        {
          type: "quiz",
          question: "El UML exige -codigo:string y +Codigo():string. ¿Qué implementación rompe el contrato?",
          options: [
            "private string codigo;",
            "public string Codigo() { return codigo; }",
            "public string codigo;",
            "class Producto { ... }",
          ],
          correctIndex: 2,
          explanation: "El diagrama exige el atributo privado. Hacerlo público elimina el control de acceso.",
        },
        {
          type: "code_completion",
          prompt: "Ordena la implementación de un método UML +Cambiar(nuevo:int):bool.",
          lines: [
            "public bool Cambiar(int nuevo)",
            "{",
            "    if (nuevo < 0) return false;",
            "    valor = nuevo;",
            "    return true;",
            "}",
          ],
          explanation: "La firma, retorno y regla deben coincidir con el contrato.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Implementa UML: Tanque, -litros:double, -capacidad:double, +Tanque(capacidad:double), +Agregar(cantidad:double):bool, +Litros():double. Agregar sólo acepta cantidad > 0 y no rebasa capacidad. Lee capacidad y dos cargas; imprime OK/NO por cada una y Final: N.N.",
            starterCode: `using System;

class Tanque
{
    // Implementa el diagrama
}

class Program
{
    static void Main()
    {
        double capacidad = double.Parse(Console.ReadLine());
        double a = double.Parse(Console.ReadLine());
        double b = double.Parse(Console.ReadLine());
        Tanque tanque = new Tanque(capacidad);
        Console.WriteLine(tanque.Agregar(a) ? "OK" : "NO");
        Console.WriteLine(tanque.Agregar(b) ? "OK" : "NO");
        Console.WriteLine($"Final: {tanque.Litros():F1}");
    }
}`,
            solutionCode: `using System;

class Tanque
{
    private double litros;
    private double capacidad;
    public Tanque(double capacidad) { this.capacidad = capacidad > 0 ? capacidad : 0; }
    public bool Agregar(double cantidad)
    {
        if (cantidad <= 0 || litros + cantidad > capacidad) return false;
        litros += cantidad;
        return true;
    }
    public double Litros() { return litros; }
}

class Program
{
    static void Main()
    {
        double capacidad = double.Parse(Console.ReadLine());
        double a = double.Parse(Console.ReadLine());
        double b = double.Parse(Console.ReadLine());
        Tanque tanque = new Tanque(capacidad);
        Console.WriteLine(tanque.Agregar(a) ? "OK" : "NO");
        Console.WriteLine(tanque.Agregar(b) ? "OK" : "NO");
        Console.WriteLine($"Final: {tanque.Litros():F1}");
    }
}`,
            hints: [
              "Dos campos private.",
              "Valida litros + cantidad antes de asignar.",
              "Un intento fallido no cambia litros.",
            ],
            difficulty: "medium",
            xpReward: 32,
            testCases: [
              {
                stdin: "10\n4\n7\n",
                expectedStdout: "OK\nNO\nFinal: 4.0\n",
                visible: true,
                description: "Evita rebase",
              },
              {
                stdin: "5\n2.5\n2.5\n",
                expectedStdout: "OK\nOK\nFinal: 5.0\n",
                visible: false,
                description: "Llena exacto",
              },
              {
                stdin: "8\n-1\n3\n",
                expectedStdout: "NO\nOK\nFinal: 3.0\n",
                visible: false,
                description: "Rechaza negativo",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Derive a consistent textual UML representation from C#.
     * Requisitos previos: uml-a-csharp
     */
    {
      slug: "csharp-a-uml",
      title: "Del código al diagrama",
      description: "Reconstruye el contrato visible de una clase existente.",
      estimatedMinutes: 11,
      xpReward: 45,
      steps: [
        {
          type: "theory",
          markdown: `# El diagrama no copia el cuerpo de los métodos

Para pasar C# a UML registra estructura: clase, atributos relevantes, propiedades/operaciones, visibilidad, parámetros y retornos. No copies \`if\`, ciclos ni \`Console.WriteLine\`; pertenecen a la implementación.

Una propiedad puede representarse como atributo público con \`{get}\`/\`{get,set}\` o como operaciones getter/setter, pero elige una convención y úsala de forma consistente en todo el proyecto.`,
        },
        {
          type: "code_example",
          code: `class Puerta
{
    private bool abierta;
    public void Abrir() { abierta = true; }
    public void Cerrar() { abierta = false; }
    public bool EstaAbierta() { return abierta; }
}`,
          explanation: `UML resultante:

\`\`\`text
Puerta
-----------------
-abierta: bool
-----------------
+Abrir(): void
+Cerrar(): void
+EstaAbierta(): bool
\`\`\``,
          runnable: false,
        },
        {
          type: "matching",
          pairs: [
            { left: "private double total;", right: "-total: double" },
            { left: "public bool Pagar(double monto)", right: "+Pagar(monto: double): bool" },
            { left: "protected string codigo;", right: "#codigo: string" },
            { left: "public Pedido(int folio)", right: "+Pedido(folio: int)" },
          ],
          explanation: "C# y UML ordenan nombre/tipo de manera distinta, pero expresan el mismo contrato.",
        },
        {
          type: "quiz",
          question: "¿Qué detalle NO debe copiarse al diagrama de clase?",
          options: [
            "Tipo de retorno",
            "Visibilidad",
            "El ciclo for dentro del método",
            "Parámetros",
          ],
          correctIndex: 2,
          explanation: "El diagrama de clase muestra estructura, no el algoritmo interno completo.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "El programa contiene una clase Semaforo. Completa sólo Main para demostrar su contrato: lee color inicial, crea el objeto, llama Cambiar una vez con el segundo color e imprime ColorActual(). No modifiques la clase.",
            starterCode: `using System;

class Semaforo
{
    private string color;
    public Semaforo(string inicial) { color = inicial; }
    public void Cambiar(string nuevo) { color = nuevo; }
    public string ColorActual() { return color; }
}

class Program
{
    static void Main()
    {
        string inicial = Console.ReadLine();
        string nuevo = Console.ReadLine();
        // Usa únicamente el contrato público visible en UML
    }
}`,
            solutionCode: `using System;

class Semaforo
{
    private string color;
    public Semaforo(string inicial) { color = inicial; }
    public void Cambiar(string nuevo) { color = nuevo; }
    public string ColorActual() { return color; }
}

class Program
{
    static void Main()
    {
        string inicial = Console.ReadLine();
        string nuevo = Console.ReadLine();
        Semaforo semaforo = new Semaforo(inicial);
        semaforo.Cambiar(nuevo);
        Console.WriteLine(semaforo.ColorActual());
    }
}`,
            hints: [
              "El constructor recibe el color inicial.",
              "color es private: usa Cambiar y ColorActual.",
              "No agregues acceso directo al campo.",
            ],
            difficulty: "easy",
            xpReward: 24,
            testCases: [
              {
                stdin: "Rojo\nVerde\n",
                expectedStdout: "Verde\n",
                visible: true,
                description: "Usa contrato",
              },
              {
                stdin: "Amarillo\nRojo\n",
                expectedStdout: "Rojo\n",
                visible: false,
                description: "No hardcode",
              },
            ],
          },
        },
      ],
    },
    /**
     * Objetivo: Produce a minimal class contract from prose requirements.
     * Requisitos previos: csharp-a-uml
     */
    {
      slug: "modelar-requerimientos",
      title: "De requerimientos a un modelo verificable",
      description: "Extrae responsabilidades antes de dibujar o programar.",
      estimatedMinutes: 14,
      xpReward: 55,
      steps: [
        {
          type: "theory",
          markdown: `# Subraya verbos, datos y reglas

Requerimiento: “La papelería registra artículos. Cada artículo tiene clave, descripción, precio y existencias. No puede vender más piezas de las disponibles. Una venta exitosa reduce existencias y devuelve el importe”.

- Datos del objeto: clave, descripción, precio, existencias.
- Operación: \`Vender(cantidad)\`.
- Regla: cantidad positiva y no mayor a existencias.
- Resultado necesario: éxito e importe. Para POO I podemos separar \`PuedeVender\` y \`Vender\`, o devolver un número con convenio documentado. Aquí usaremos \`bool Vender(int)\` y \`double Importe(int)\` para mantener contratos simples.

No crees \`Papeleria\`, \`Sistema\`, \`Usuario\`, \`Pantalla\` y \`BaseDeDatos\` sólo porque aparecen o se imaginan. Empieza por las responsabilidades que el caso realmente exige.`,
        },
        {
          type: "matching",
          pairs: [
            { left: "“tiene clave y precio”", right: "Atributos" },
            { left: "“vende piezas”", right: "Método" },
            { left: "“no más de las disponibles”", right: "Invariante/validación" },
            { left: "“mostrar botón Vender”", right: "Responsabilidad de GUI, no de Articulo" },
          ],
          explanation: "Separar dominio de interfaz desde el modelo evita una clase que haga todo.",
        },
        {
          type: "quiz",
          question: "¿Qué decisión demuestra mejor abstracción para este requerimiento?",
          options: [
            "Agregar 20 datos “por si acaso”",
            "Modelar sólo datos y operaciones usados por venta",
            "Poner todo en Main",
            "Hacer públicos todos los campos",
          ],
          correctIndex: 1,
          explanation: "El modelo mínimo cubre las reglas observables sin inventar alcance.",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Implementa Articulo con Codigo de sólo lectura externa, Precio y Existencias privados, constructor, Vender(int):bool y ConsultarExistencias():int. El constructor convierte precio/existencias negativos a 0. Lee artículo y dos ventas; por cada venta imprime OK/NO; al final Stock: N.",
            starterCode: `using System;

class Articulo
{
    // Modelo derivado del requerimiento
}

class Program
{
    static void Main()
    {
        string codigo = Console.ReadLine();
        double precio = double.Parse(Console.ReadLine());
        int stock = int.Parse(Console.ReadLine());
        int v1 = int.Parse(Console.ReadLine());
        int v2 = int.Parse(Console.ReadLine());
        Articulo a = new Articulo(codigo, precio, stock);
        Console.WriteLine(a.Vender(v1) ? "OK" : "NO");
        Console.WriteLine(a.Vender(v2) ? "OK" : "NO");
        Console.WriteLine($"Stock: {a.ConsultarExistencias()}");
    }
}`,
            solutionCode: `using System;

class Articulo
{
    public string Codigo { get; private set; }
    private double precio;
    private int existencias;
    public Articulo(string codigo, double precio, int existencias)
    {
        Codigo = codigo;
        this.precio = precio >= 0 ? precio : 0;
        this.existencias = existencias >= 0 ? existencias : 0;
    }
    public bool Vender(int cantidad)
    {
        if (cantidad <= 0 || cantidad > existencias) return false;
        existencias -= cantidad;
        return true;
    }
    public int ConsultarExistencias() { return existencias; }
}

class Program
{
    static void Main()
    {
        string codigo = Console.ReadLine();
        double precio = double.Parse(Console.ReadLine());
        int stock = int.Parse(Console.ReadLine());
        int v1 = int.Parse(Console.ReadLine());
        int v2 = int.Parse(Console.ReadLine());
        Articulo a = new Articulo(codigo, precio, stock);
        Console.WriteLine(a.Vender(v1) ? "OK" : "NO");
        Console.WriteLine(a.Vender(v2) ? "OK" : "NO");
        Console.WriteLine($"Stock: {a.ConsultarExistencias()}");
    }
}`,
            hints: [
              "Convierte las reglas del texto en condiciones.",
              "Una venta fallida no cambia existencias.",
              "No necesitas clases inventadas para pasar los tests.",
            ],
            difficulty: "hard",
            xpReward: 38,
            testCases: [
              {
                stdin: "A1\n20\n10\n3\n8\n",
                expectedStdout: "OK\nNO\nStock: 7\n",
                visible: true,
                description: "Regla central",
              },
              {
                stdin: "X\n-5\n-2\n1\n0\n",
                expectedStdout: "NO\nNO\nStock: 0\n",
                visible: false,
                description: "Constructor y cantidades inválidas",
              },
              {
                stdin: "B\n1.5\n5\n2\n3\n",
                expectedStdout: "OK\nOK\nStock: 0\n",
                visible: false,
                description: "Agota exacto",
              },
            ],
          },
        },
      ],
    },
  ],
};
