import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "csharp-poo2-hilo-calculo",
    title: "Cálculo en worker",
    description:
      "Delega un cálculo a un hilo y consume el resultado después de Join.",
    prompt:
      "Lee n; un hilo calcula n*n en una variable compartida; Main hace Join e imprime el valor.",
    starterCode: `using System;
using System.Threading;
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Threading;
class Program{static int n;static long r;static void W(){r=(long)n*n;}static void Main(){n=int.Parse(Console.ReadLine());Thread t=new Thread(W);t.Start();t.Join();Console.WriteLine(r);}}`,
    difficulty: "easy",
    xpReward: 26,
    testCases: [
      { stdin: "5\n", expectedStdout: "25\n", visible: true },
      { stdin: "0\n", expectedStdout: "0\n", visible: false },
      { stdin: "-12\n", expectedStdout: "144\n", visible: false },
    ],
  },
  {
    slug: "csharp-poo2-dos-trabajadores",
    title: "Dos trabajadores independientes",
    description:
      "Ejecuta dos cálculos concurrentes sin compartir la misma variable de salida.",
    prompt:
      "Lee a y b. Un hilo calcula a*a; otro b*b. Espera ambos e imprime cada resultado y su suma.",
    starterCode: `using System;
using System.Threading;
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Threading;
class Program{static int a,b;static long ra,rb;static void A(){ra=(long)a*a;}static void B(){rb=(long)b*b;}static void Main(){a=int.Parse(Console.ReadLine());b=int.Parse(Console.ReadLine());Thread x=new Thread(A),y=new Thread(B);x.Start();y.Start();x.Join();y.Join();Console.WriteLine(ra);Console.WriteLine(rb);Console.WriteLine(ra+rb);}}`,
    difficulty: "medium",
    xpReward: 32,
    testCases: [
      { stdin: "3\n4\n", expectedStdout: "9\n16\n25\n", visible: true },
      { stdin: "0\n5\n", expectedStdout: "0\n25\n25\n", visible: false },
      { stdin: "-2\n-3\n", expectedStdout: "4\n9\n13\n", visible: false },
    ],
  },
  {
    slug: "csharp-poo2-contador-protegido",
    title: "Contador protegido",
    description:
      "Usa exclusión mutua para preservar todos los incrementos de varios hilos.",
    prompt:
      "Lee n. Crea tres hilos; cada uno incrementa el mismo contador n veces bajo lock. Tras los tres Join, imprime 3*n.",
    starterCode: `using System;
using System.Threading;
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Threading;
class Program{static int n,c;static readonly object g=new object();static void W(){for(int i=0;i<n;i++)lock(g){c++;}}static void Main(){n=int.Parse(Console.ReadLine());Thread a=new Thread(W),b=new Thread(W),d=new Thread(W);a.Start();b.Start();d.Start();a.Join();b.Join();d.Join();Console.WriteLine(c);}}`,
    difficulty: "medium",
    xpReward: 34,
    testCases: [
      { stdin: "100\n", expectedStdout: "300\n", visible: true },
      { stdin: "1\n", expectedStdout: "3\n", visible: false },
      { stdin: "2000\n", expectedStdout: "6000\n", visible: false },
    ],
  },
  {
    slug: "csharp-poo2-error-en-worker",
    title: "Error controlado en worker",
    description:
      "Convierte una excepción del hilo en un resultado explícito para el coordinador.",
    prompt:
      "Lee una línea. Un hilo intenta int.Parse. Si funciona guarda DOBLE X; si falla guarda INVALIDO. Main espera e imprime la salida.",
    starterCode: `using System;
using System.Threading;
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Threading;
class Program{static string entrada,salida;static void W(){try{int x=int.Parse(entrada);salida="DOBLE "+(x*2);}catch(FormatException){salida="INVALIDO";}}static void Main(){entrada=Console.ReadLine();Thread t=new Thread(W);t.Start();t.Join();Console.WriteLine(salida);}}`,
    difficulty: "medium",
    xpReward: 32,
    testCases: [
      { stdin: "7\n", expectedStdout: "DOBLE 14\n", visible: true },
      { stdin: "abc\n", expectedStdout: "INVALIDO\n", visible: false },
      { stdin: "-3\n", expectedStdout: "DOBLE -6\n", visible: false },
    ],
  },
] satisfies PracticeExerciseDefinition[];
