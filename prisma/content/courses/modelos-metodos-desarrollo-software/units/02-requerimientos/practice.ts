import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "mm-requisitos-prioridad",
    title: "Prioridad por impacto",
    description: "Convierte reglas de negocio en comportamiento verificable.",
    prompt:
      "Lee impacto (1..5) y urgencia (1..5). CRITICA si ambos >=4; ALTA si alguno >=4; MEDIA si alguno >=2; en otro caso BAJA.",
    starterCode: `using System;
class Program { static void Main() { int impacto=int.Parse(Console.ReadLine()); int urgencia=int.Parse(Console.ReadLine()); /* completa */ } }`,
    solutionCode: `using System;
class Program { static void Main() { int i=int.Parse(Console.ReadLine()); int u=int.Parse(Console.ReadLine()); if(i>=4&&u>=4)Console.WriteLine("CRITICA"); else if(i>=4||u>=4)Console.WriteLine("ALTA"); else if(i>=2||u>=2)Console.WriteLine("MEDIA"); else Console.WriteLine("BAJA"); } }`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "5\n5\n", expectedStdout: "CRITICA\n", visible: true, description: "Ambos altos" },
      { stdin: "5\n1\n", expectedStdout: "ALTA\n", visible: false, description: "Uno alto" },
      { stdin: "2\n1\n", expectedStdout: "MEDIA\n", visible: false, description: "Medio" },
      { stdin: "1\n1\n", expectedStdout: "BAJA\n", visible: false, description: "Bajo" },
    ],
  },
  {
    slug: "mm-requisitos-sla",
    title: "SLA verificable",
    description: "Aplica límites por prioridad.",
    prompt:
      "Límites en horas: CRITICA=2, ALTA=4, MEDIA=8, BAJA=24. Imprime EN_TIEMPO si horas <= límite; prioridad desconocida PRIORIDAD_INVALIDA; si excede FUERA_DE_TIEMPO.",
    starterCode: `using System; class Program { static void Main(){ string p=Console.ReadLine(); int h=int.Parse(Console.ReadLine()); /* completa */ } }`,
    solutionCode: `using System; class Program { static void Main(){ string p=Console.ReadLine(); int h=int.Parse(Console.ReadLine()); int l=-1; if(p=="CRITICA")l=2; else if(p=="ALTA")l=4; else if(p=="MEDIA")l=8; else if(p=="BAJA")l=24; if(l<0)Console.WriteLine("PRIORIDAD_INVALIDA"); else Console.WriteLine(h<=l?"EN_TIEMPO":"FUERA_DE_TIEMPO"); } }`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "CRITICA\n2\n", expectedStdout: "EN_TIEMPO\n", visible: true, description: "Frontera" },
      { stdin: "CRITICA\n3\n", expectedStdout: "FUERA_DE_TIEMPO\n", visible: false, description: "Excede" },
      { stdin: "BAJA\n24\n", expectedStdout: "EN_TIEMPO\n", visible: false, description: "Frontera baja" },
      { stdin: "X\n1\n", expectedStdout: "PRIORIDAD_INVALIDA\n", visible: false, description: "Valor inválido" },
    ],
  },
  {
    slug: "mm-requisitos-transicion",
    title: "Transición de estados",
    description: "Implementa una máquina de estados mínima.",
    prompt:
      "ABIERTO→EN_PROCESO, EN_PROCESO→CERRADO, EN_PROCESO→ABIERTO son válidas; cualquier otra NO.",
    starterCode: `using System; class Program { static void Main(){ string a=Console.ReadLine(); string b=Console.ReadLine(); /* completa */ } }`,
    solutionCode: `using System; class Program { static void Main(){ string a=Console.ReadLine(); string b=Console.ReadLine(); bool ok=(a=="ABIERTO"&&b=="EN_PROCESO")||(a=="EN_PROCESO"&&(b=="CERRADO"||b=="ABIERTO")); Console.WriteLine(ok?"SI":"NO"); } }`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "ABIERTO\nEN_PROCESO\n", expectedStdout: "SI\n", visible: true, description: "Avance" },
      { stdin: "EN_PROCESO\nCERRADO\n", expectedStdout: "SI\n", visible: false, description: "Cierre" },
      { stdin: "CERRADO\nABIERTO\n", expectedStdout: "NO\n", visible: false, description: "Reapertura no definida" },
      { stdin: "ABIERTO\nCERRADO\n", expectedStdout: "NO\n", visible: false, description: "Salto" },
    ],
  },
  {
    slug: "mm-requisitos-cambio",
    title: "Impacto de cambio",
    description: "Decide si un cambio cabe en presupuesto.",
    prompt:
      "Lee costoBase, porcentajeCambio y presupuestoMax. estimado=base+base*porcentaje/100. Imprime ACEPTAR si estimado<=presupuesto, en otro caso REPLANEAR.",
    starterCode: `using System; class Program { static void Main(){ int b=int.Parse(Console.ReadLine()); int p=int.Parse(Console.ReadLine()); int max=int.Parse(Console.ReadLine()); /* completa */ } }`,
    solutionCode: `using System; class Program { static void Main(){ int b=int.Parse(Console.ReadLine()); int p=int.Parse(Console.ReadLine()); int max=int.Parse(Console.ReadLine()); int e=b+b*p/100; Console.WriteLine(e<=max?"ACEPTAR":"REPLANEAR"); } }`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "1000\n20\n1200\n", expectedStdout: "ACEPTAR\n", visible: true, description: "Justo" },
      { stdin: "1000\n20\n1199\n", expectedStdout: "REPLANEAR\n", visible: false, description: "Excede" },
      { stdin: "500\n0\n500\n", expectedStdout: "ACEPTAR\n", visible: false, description: "Sin cambio" },
    ],
  },
] satisfies PracticeExerciseDefinition[];
