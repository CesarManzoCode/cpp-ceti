import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "por-que-genericos",
  title: "Por qué existen los genéricos",
  description:
    "Detecta duplicación causada únicamente por el tipo y la reemplaza por una abstracción paramétrica.",
  estimatedMinutes: 14,
  xpReward: 50,
  steps: [
    {
      type: "theory",
      markdown: `# Reutilizar sin borrar los tipos

Imagina dos clases casi idénticas:

- \`CajaProducto\` guarda un \`Producto\`;
- \`CajaCliente\` guarda un \`Cliente\`.

La única diferencia real es el tipo. Podrías guardar \`object\`, pero entonces cualquier valor entra y el consumidor tiene que hacer casts, perdiendo seguridad de tipos.

Un **genérico** conserva la forma de la clase y deja el tipo como parámetro:

\`\`\`csharp
class Caja<T>
{
    private T valor;
}
\`\`\`

Cuando escribes \`Caja<Producto>\`, \`T\` significa \`Producto\`; en \`Caja<Cliente>\`, significa \`Cliente\`.

La reutilización ocurre en compilación: el código sigue sabiendo qué tipo entra y sale.`,
    },
    {
      type: "code_example",
      code: `using System;

class Caja<T>
{
    private T valor;
    public Caja(T valor) { this.valor = valor; }
    public T Obtener() { return valor; }
}

class Program
{
    static void Main()
    {
        Caja<int> numero = new Caja<int>(7);
        Caja<string> texto = new Caja<string>("CETI");

        Console.WriteLine(numero.Obtener());
        Console.WriteLine(texto.Obtener());
    }
}`,
      explanation:
        "la misma implementación trabaja con dos tipos y devuelve exactamente el tipo configurado en cada instancia.",
      runnable: true,
      expectedOutput: `7
CETI`,
    },
    {
      type: "quiz",
      question:
        "¿qué ventaja tiene `Caja<Producto>` frente a una caja que guarda `object`?",
      options: [
        "Puede guardar absolutamente cualquier valor sin reglas.",
        "El compilador conserva que entra y sale un `Producto`, evitando casts accidentales.",
        "Convierte automáticamente Producto en string.",
        "Crea una base de datos.",
      ],
      correctIndex: 1,
      explanation:
        "El compilador conserva que entra y sale un `Producto`, evitando casts accidentales.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Implementa `Caja<T>` con constructor y método `Obtener()`. Lee una línea de texto y un entero, crea `Caja<string>` y `Caja<int>`, e imprime ambos valores en ese orden.",
        starterCode: `using System;
class Caja<T>
{
    // completa
}
class Program { static void Main() { } }`,
        solutionCode: `using System;
class Caja<T>
{
    private T valor;
    public Caja(T valor) { this.valor = valor; }
    public T Obtener() { return valor; }
}
class Program
{
    static void Main()
    {
        Caja<string> texto = new Caja<string>(Console.ReadLine());
        Caja<int> numero = new Caja<int>(int.Parse(Console.ReadLine()));
        Console.WriteLine(texto.Obtener());
        Console.WriteLine(numero.Obtener());
    }
}`,
        hints: [
          "`T` puede usarse como tipo de campo, parámetro y retorno.",
          "no uses `object`.",
          "instancia indicando el tipo entre `< >`.",
        ],
        difficulty: "easy",
        xpReward: 26,
        testCases: [
          {
            visible: true,
            stdin: "Hola\n7\n",
            expectedStdout: "Hola\n7\n",
          },
          {
            visible: false,
            stdin: "Cable HDMI\n0\n",
            expectedStdout: "Cable HDMI\n0\n",
          },
          {
            visible: false,
            stdin: "X\n-5\n",
            expectedStdout: "X\n-5\n",
          },
        ],
      },
    },
  ],
});
