import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "mm-solid-srp",
    title: "SRP práctico",
    description: "Separa cálculo y formato.",
    prompt: "Calculador multiplica cantidad*precio; Formato devuelve IMPORTE:N.",
    starterCode: `using System; // crea dos clases`,
    solutionCode: `using System; class Calculador{public int Total(int c,int p){return c*p;}}class Formato{public string Texto(int n){return "IMPORTE:"+n;}}class Program{static void Main(){int c=int.Parse(Console.ReadLine());int p=int.Parse(Console.ReadLine());Calculador x=new Calculador();Formato f=new Formato();Console.WriteLine(f.Texto(x.Total(c,p)));}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "2\n50\n", expectedStdout: "IMPORTE:100\n", visible: true, description: "Normal" },
      { stdin: "0\n50\n", expectedStdout: "IMPORTE:0\n", visible: false, description: "Cero" },
    ],
  },
  {
    slug: "mm-solid-ocp",
    title: "OCP práctico",
    description: "Extiende comportamiento por polimorfismo.",
    prompt: "Base `Recargo` abstracta; Normal suma 0, Urgente suma 100.",
    starterCode: `using System; // completa`,
    solutionCode: `using System; abstract class Recargo{public abstract int Aplicar(int total);}class Normal:Recargo{public override int Aplicar(int total){return total;}}class Urgente:Recargo{public override int Aplicar(int total){return total+100;}}class Program{static void Main(){string t=Console.ReadLine();int n=int.Parse(Console.ReadLine());Recargo r=t=="URGENTE"?(Recargo)new Urgente():new Normal();Console.WriteLine(r.Aplicar(n));}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "NORMAL\n500\n", expectedStdout: "500\n", visible: true, description: "Normal" },
      { stdin: "URGENTE\n500\n", expectedStdout: "600\n", visible: false, description: "Extensión" },
    ],
  },
  {
    slug: "mm-solid-isp",
    title: "ISP práctico",
    description: "Segrega lectura y escritura.",
    prompt: "Define ILector/IEscritor; Buffer implementa ambos.",
    starterCode: `using System; // completa`,
    solutionCode: `using System; interface ILector{string Leer();}interface IEscritor{void Escribir(string t);}class Buffer:ILector,IEscritor{private string v="";public string Leer(){return v;}public void Escribir(string t){v=t;}}class Program{static void Main(){Buffer b=new Buffer();b.Escribir(Console.ReadLine());Console.WriteLine(b.Leer());}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "x\n", expectedStdout: "x\n", visible: true, description: "Normal" },
      { stdin: "texto largo\n", expectedStdout: "texto largo\n", visible: false, description: "Variable" },
    ],
  },
  {
    slug: "mm-solid-dip",
    title: "DIP práctico",
    description: "Inyecta una abstracción.",
    prompt:
      "ILogger tiene Escribir; LoggerMemoria guarda último texto; Servicio recibe ILogger y registra `OK:<dato>`, luego Program imprime lo guardado.",
    starterCode: `using System; // completa`,
    solutionCode: `using System; interface ILogger{void Escribir(string t);}class LoggerMemoria:ILogger{public string Ultimo{get;private set;}public void Escribir(string t){Ultimo=t;}}class Servicio{private ILogger log;public Servicio(ILogger l){log=l;}public void Procesar(string d){log.Escribir("OK:"+d);}}class Program{static void Main(){LoggerMemoria l=new LoggerMemoria();new Servicio(l).Procesar(Console.ReadLine());Console.WriteLine(l.Ultimo);}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "T1\n", expectedStdout: "OK:T1\n", visible: true, description: "Inyección" },
      { stdin: "abc\n", expectedStdout: "OK:abc\n", visible: false, description: "Variable" },
    ],
  },
] satisfies PracticeExerciseDefinition[];
