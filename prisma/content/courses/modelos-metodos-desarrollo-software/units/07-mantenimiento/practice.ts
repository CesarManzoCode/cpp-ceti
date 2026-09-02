import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "mm-mant-clasificar",
    title: "Clasifica mantenimiento",
    description: "Identifica intención del cambio.",
    prompt: "Lee C/A/P/R y devuelve nombre completo; otro INVALIDO.",
    starterCode: `using System; class Program{static void Main(){/* completa */}}`,
    solutionCode: `using System; class Program{static void Main(){string x=Console.ReadLine();if(x=="C")Console.WriteLine("CORRECTIVO");else if(x=="A")Console.WriteLine("ADAPTATIVO");else if(x=="P")Console.WriteLine("PERFECTIVO");else if(x=="R")Console.WriteLine("PREVENTIVO");else Console.WriteLine("INVALIDO");}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "A\n", expectedStdout: "ADAPTATIVO\n", visible: true, description: "Adaptativo" },
      { stdin: "P\n", expectedStdout: "PERFECTIVO\n", visible: false, description: "Perfectivo" },
      { stdin: "Z\n", expectedStdout: "INVALIDO\n", visible: false, description: "Inválido" },
    ],
  },
  {
    slug: "mm-mant-cero",
    title: "Corrige división",
    description: "Reproduce y corrige borde.",
    prompt: "Promedio devuelve 0 con cantidad<=0.",
    starterCode: `using System; class Program{static int P(int t,int c){return t/c;}static void Main(){Console.WriteLine(P(int.Parse(Console.ReadLine()),int.Parse(Console.ReadLine())));}}`,
    solutionCode: `using System; class Program{static int P(int t,int c){return c<=0?0:t/c;}static void Main(){Console.WriteLine(P(int.Parse(Console.ReadLine()),int.Parse(Console.ReadLine())));}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "8\n2\n", expectedStdout: "4\n", visible: true, description: "Normal" },
      { stdin: "8\n0\n", expectedStdout: "0\n", visible: false, description: "Bug" },
    ],
  },
  {
    slug: "mm-mant-regresion",
    title: "Cambio sin romper anterior",
    description: "Aplica nueva regla y conserva antigua.",
    prompt: "Base 200; URGENTE suma 100; convenio descuenta 10%.",
    starterCode: `using System; class Program{static void Main(){/* completa */}}`,
    solutionCode: `using System; class Program{static void Main(){string p=Console.ReadLine();bool c=Console.ReadLine()=="SI";int t=200;if(p=="URGENTE")t+=100;if(c)t=t*90/100;Console.WriteLine(t);}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "NORMAL\nNO\n", expectedStdout: "200\n", visible: true, description: "Anterior" },
      { stdin: "URGENTE\nNO\n", expectedStdout: "300\n", visible: false, description: "Anterior urgente" },
      { stdin: "URGENTE\nSI\n", expectedStdout: "270\n", visible: false, description: "Cambio" },
    ],
  },
  {
    slug: "mm-mant-prioridad",
    title: "Prioriza mejoras",
    description: "Calcula puntaje explícito.",
    prompt: "impacto*3+riesgo*2-esfuerzo.",
    starterCode: `using System; class Program{static void Main(){/* completa */}}`,
    solutionCode: `using System; class Program{static void Main(){int i=int.Parse(Console.ReadLine());int r=int.Parse(Console.ReadLine());int e=int.Parse(Console.ReadLine());Console.WriteLine(i*3+r*2-e);}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "4\n5\n2\n", expectedStdout: "20\n", visible: true, description: "Alto" },
      { stdin: "1\n1\n1\n", expectedStdout: "4\n", visible: false, description: "Bajo" },
    ],
  },
] satisfies PracticeExerciseDefinition[];
