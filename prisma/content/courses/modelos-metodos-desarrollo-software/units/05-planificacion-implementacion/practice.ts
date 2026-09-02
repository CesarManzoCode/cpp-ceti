import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "mm-plan-ruta",
    title: "Ruta crítica simple",
    description: "Calcula duración con ramas paralelas.",
    prompt: "A seguido por B y C paralelos; imprime A+max(B,C).",
    starterCode: `using System;
class Program
{
    static void Main()
    {
        int a = int.Parse(Console.ReadLine());
        int b = int.Parse(Console.ReadLine());
        int c = int.Parse(Console.ReadLine());
        /* completa */
    }
}`,
    solutionCode: `using System;
class Program
{
    static void Main()
    {
        int a = int.Parse(Console.ReadLine());
        int b = int.Parse(Console.ReadLine());
        int c = int.Parse(Console.ReadLine());
        Console.WriteLine(a + (b > c ? b : c));
    }
}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "2\n4\n7\n", expectedStdout: "9\n", visible: true, description: "C" },
      { stdin: "5\n8\n1\n", expectedStdout: "13\n", visible: false, description: "B" },
    ],
  },
  {
    slug: "mm-plan-porcentaje",
    title: "Avance medible",
    description: "Calcula avance sin dividir por cero.",
    prompt: "total/completadas → porcentaje entero.",
    starterCode: `using System;
class Program
{
    static void Main()
    {
        int t = int.Parse(Console.ReadLine());
        int c = int.Parse(Console.ReadLine());
        /* completa */
    }
}`,
    solutionCode: `using System;
class Program
{
    static void Main()
    {
        int t = int.Parse(Console.ReadLine());
        int c = int.Parse(Console.ReadLine());
        Console.WriteLine(t == 0 ? 0 : c * 100 / t);
    }
}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "8\n6\n", expectedStdout: "75\n", visible: true, description: "Normal" },
      { stdin: "0\n0\n", expectedStdout: "0\n", visible: false, description: "Cero" },
      { stdin: "6\n1\n", expectedStdout: "16\n", visible: false, description: "Truncado" },
    ],
  },
  {
    slug: "mm-plan-ticket",
    title: "Cambio trazable",
    description: "Implementa dos transiciones permitidas de Ticket.",
    prompt:
      "Ticket inicia ABIERTO; lee un nuevo estado, aplica si es EN_PROCESO; luego lee otro, aplica si CERRADO. Imprime estado final.",
    starterCode: `using System;
class Ticket
{
    /* completa */
}
class Program
{
    /* completa */
}`,
    solutionCode: `using System;
class Ticket
{
    public string Estado { get; private set; }
    public Ticket() { Estado = "ABIERTO"; }
    public bool Cambiar(string n)
    {
        if (Estado == "ABIERTO" && n == "EN_PROCESO") { Estado = n; return true; }
        if (Estado == "EN_PROCESO" && n == "CERRADO") { Estado = n; return true; }
        return false;
    }
}
class Program
{
    static void Main()
    {
        Ticket t = new Ticket();
        t.Cambiar(Console.ReadLine());
        t.Cambiar(Console.ReadLine());
        Console.WriteLine(t.Estado);
    }
}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "EN_PROCESO\nCERRADO\n", expectedStdout: "CERRADO\n", visible: true, description: "Completo" },
      { stdin: "CERRADO\nEN_PROCESO\n", expectedStdout: "EN_PROCESO\n", visible: false, description: "Primero inválido" },
    ],
  },
  {
    slug: "mm-plan-costo-cambio",
    title: "Costo de una desviación",
    description: "Calcula impacto presupuestal.",
    prompt: "Lee costoActual, horasExtra y tarifaHora; imprime nuevo costo.",
    starterCode: `using System;
class Program
{
    static void Main()
    {
        /* completa */
    }
}`,
    solutionCode: `using System;
class Program
{
    static void Main()
    {
        int c = int.Parse(Console.ReadLine());
        int h = int.Parse(Console.ReadLine());
        int t = int.Parse(Console.ReadLine());
        Console.WriteLine(c + h * t);
    }
}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "1000\n3\n100\n", expectedStdout: "1300\n", visible: true, description: "Normal" },
      { stdin: "500\n0\n90\n", expectedStdout: "500\n", visible: false, description: "Sin extra" },
    ],
  },
] satisfies PracticeExerciseDefinition[];
