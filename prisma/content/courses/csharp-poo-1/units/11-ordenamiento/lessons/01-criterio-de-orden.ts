import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "criterio-de-orden",
  title: "¿Qué significa ordenar objetos?",
  description:
    "Convierte una regla del dominio en una comparación consistente entre dos objetos.",
  estimatedMinutes: 13,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `# Los objetos no vienen con un orden universal

Los enteros tienen una comparación obvia. Un \`Producto\` no: ¿debe ir antes el de menor precio, el de nombre alfabéticamente menor o el de mayor stock?

Antes del algoritmo debes fijar el **criterio**. Un comparador responde, para dos objetos \`a\` y \`b\`:

- valor negativo: \`a\` va antes;
- cero: son equivalentes para ese criterio;
- valor positivo: \`a\` va después.

El criterio debe ser coherente. Si A va antes que B y B antes que C, el comparador no debería afirmar que C va antes que A.

Ordenar es una decisión del problema, no una propiedad mágica de cada clase.`,
    },
    {
      type: "code_example",
      code: `using System;

class Producto
{
    public string Nombre { get; private set; }
    public int Precio { get; private set; }
    public Producto(string nombre, int precio) { Nombre = nombre; Precio = precio; }
}

class Program
{
    static int CompararPorPrecio(Producto a, Producto b)
    {
        if (a.Precio < b.Precio) return -1;
        if (a.Precio > b.Precio) return 1;
        return 0;
    }

    static void Main()
    {
        Producto a = new Producto("Mouse", 250);
        Producto b = new Producto("Teclado", 400);
        Console.WriteLine(CompararPorPrecio(a, b));
    }
}`,
      explanation:
        "el método no ordena nada todavía; define la regla que un algoritmo puede usar después.",
      runnable: true,
      expectedOutput: "-1",
    },
    {
      type: "matching",
      pairs: [
        {
          left: "Ordenar catálogo por precio ascendente",
          right: "Comparar Precio menor primero",
        },
        {
          left: "Ranking por puntuación",
          right: "Comparar Puntos mayor primero",
        },
        {
          left: "Directorio alfabético",
          right: "Comparar Nombre",
        },
        {
          left: "Misma regla, dos objetos equivalentes",
          right: "Comparador devuelve 0",
        },
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Crea `Producto` con `Nombre` y `Precio`. Implementa `CompararPorPrecio(Producto a, Producto b)` que devuelva `-1`, `0` o `1`. Lee dos productos (nombre y precio de cada uno) e imprime el nombre del que debe aparecer primero; si tienen el mismo precio imprime `EMPATE`.",
        starterCode: `using System;
class Producto { }
class Program
{
    static int CompararPorPrecio(Producto a, Producto b) { return 0; }
    static void Main() { }
}`,
        solutionCode: `using System;
class Producto
{
    public string Nombre { get; private set; }
    public int Precio { get; private set; }
    public Producto(string nombre, int precio) { Nombre=nombre; Precio=precio; }
}
class Program
{
    static int CompararPorPrecio(Producto a, Producto b)
    {
        if(a.Precio<b.Precio)return -1;
        if(a.Precio>b.Precio)return 1;
        return 0;
    }
    static void Main()
    {
        Producto a=new Producto(Console.ReadLine(),int.Parse(Console.ReadLine()));
        Producto b=new Producto(Console.ReadLine(),int.Parse(Console.ReadLine()));
        int c=CompararPorPrecio(a,b);
        if(c<0)Console.WriteLine(a.Nombre);
        else if(c>0)Console.WriteLine(b.Nombre);
        else Console.WriteLine("EMPATE");
    }
}`,
        hints: [
          "compara precios, no nombres",
          "devuelve cero si son iguales",
          "el signo decide quién va primero",
        ],
        difficulty: "easy",
        xpReward: 24,
        testCases: [
          {
            stdin: "Mouse\n250\nTeclado\n400\n",
            expectedStdout: "Mouse\n",
            visible: true,
          },
          {
            stdin: "A\n9\nB\n2\n",
            expectedStdout: "B\n",
            visible: false,
          },
          {
            stdin: "A\n5\nB\n5\n",
            expectedStdout: "EMPATE\n",
            visible: false,
          },
        ],
      },
    },
  ],
});
