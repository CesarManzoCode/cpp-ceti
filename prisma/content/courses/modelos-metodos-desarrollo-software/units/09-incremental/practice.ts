import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "mm-inc-disponibilidad",
    title: "Feature por versión",
    description: "Modela capacidades por incremento.",
    prompt: "v1 REGISTRAR; v2 además CONSULTAR; v3 además CERRAR. Lee versión y función.",
    starterCode: `using System; class Program{static void Main(){/* completa */}}`,
    solutionCode: `using System; class Program{static void Main(){int v=int.Parse(Console.ReadLine());string f=Console.ReadLine();bool ok=(v>=1&&f=="REGISTRAR")||(v>=2&&f=="CONSULTAR")||(v>=3&&f=="CERRAR");Console.WriteLine(ok?"SI":"NO");}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "1\nREGISTRAR\n", expectedStdout: "SI\n", visible: true, description: "v1" },
      { stdin: "1\nCERRAR\n", expectedStdout: "NO\n", visible: false, description: "No" },
      { stdin: "3\nCERRAR\n", expectedStdout: "SI\n", visible: false, description: "v3" },
    ],
  },
  {
    slug: "mm-inc-validacion",
    title: "Itera una regla",
    description: "Cambia criterio entre versiones.",
    prompt: "v1 longitud>=3; v2>=5; v3>=8.",
    starterCode: `using System; class Program{static void Main(){/* completa */}}`,
    solutionCode: `using System; class Program{static void Main(){int v=int.Parse(Console.ReadLine());string t=Console.ReadLine();int min=v>=3?8:(v>=2?5:3);Console.WriteLine(t.Length>=min?"VALIDA":"INVALIDA");}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "1\nabc\n", expectedStdout: "VALIDA\n", visible: true, description: "v1" },
      { stdin: "2\nabc\n", expectedStdout: "INVALIDA\n", visible: false, description: "v2" },
      { stdin: "3\nabcdefgh\n", expectedStdout: "VALIDA\n", visible: false, description: "v3" },
    ],
  },
  {
    slug: "mm-inc-prioridad",
    title: "Prioriza por valor/riesgo/esfuerzo",
    description: "Calcula score explícito.",
    prompt: "score=valor*2+riesgo-esfuerzo.",
    starterCode: `using System; class Program{static void Main(){/* completa */}}`,
    solutionCode: `using System; class Program{static void Main(){int v=int.Parse(Console.ReadLine());int r=int.Parse(Console.ReadLine());int e=int.Parse(Console.ReadLine());Console.WriteLine(v*2+r-e);}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "4\n3\n2\n", expectedStdout: "9\n", visible: true, description: "Score" },
      { stdin: "1\n0\n2\n", expectedStdout: "0\n", visible: false, description: "Bajo" },
    ],
  },
  {
    slug: "mm-inc-fechas",
    title: "Entregas acumuladas",
    description: "Calcula hitos.",
    prompt: "Lee inicio y 4 duraciones; imprime fin de cada incremento.",
    starterCode: `using System; class Program{static void Main(){/* completa */}}`,
    solutionCode: `using System; class Program{static void Main(){int d=int.Parse(Console.ReadLine());for(int i=0;i<4;i++){d+=int.Parse(Console.ReadLine());Console.WriteLine(d);}}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "1\n1\n2\n3\n4\n", expectedStdout: "2\n4\n7\n11\n", visible: true, description: "Acumulado" },
      { stdin: "10\n1\n1\n1\n1\n", expectedStdout: "11\n12\n13\n14\n", visible: false, description: "Uniforme" },
    ],
  },
] satisfies PracticeExerciseDefinition[];
