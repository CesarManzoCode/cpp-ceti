import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "mm-final-ticket",
    title: "Núcleo del Ticket",
    description: "Construye el dominio mínimo.",
    prompt:
      "Ticket inicia ABIERTO; asigna técnico y permite cerrar sólo con técnico. Imprime estado.",
    starterCode: `using System; // completa Ticket y Program`,
    solutionCode: `using System; class Ticket{public string Estado{get;private set;}public string Tecnico{get;private set;}public Ticket(){Estado="ABIERTO";Tecnico="";}public void Asignar(string t){Tecnico=t;}public bool Cerrar(){if(Tecnico.Length==0)return false;Estado="CERRADO";return true;}}class Program{static void Main(){Ticket t=new Ticket();string x=Console.ReadLine();if(x.Length>0)t.Asignar(x);t.Cerrar();Console.WriteLine(t.Estado);}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "Ana\n", expectedStdout: "CERRADO\n", visible: true, description: "Con técnico" },
      { stdin: "\n", expectedStdout: "ABIERTO\n", visible: false, description: "Sin técnico" },
    ],
  },
  {
    slug: "mm-final-autorizacion",
    title: "Autorización del servicio",
    description: "Protege un criterio no funcional.",
    prompt:
      "TECNICO/ADMIN pueden cerrar; EMPLEADO no. Lee rol y técnico asignado SI/NO; imprime PUEDE/NO_PUEDE.",
    starterCode: `using System; class Program{static void Main(){/* completa */}}`,
    solutionCode: `using System; class Program{static void Main(){string r=Console.ReadLine();bool asignado=Console.ReadLine()=="SI";bool rol=r=="TECNICO"||r=="ADMIN";Console.WriteLine(rol&&asignado?"PUEDE":"NO_PUEDE");}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "TECNICO\nSI\n", expectedStdout: "PUEDE\n", visible: true, description: "Válido" },
      { stdin: "EMPLEADO\nSI\n", expectedStdout: "NO_PUEDE\n", visible: false, description: "Rol" },
      { stdin: "ADMIN\nNO\n", expectedStdout: "NO_PUEDE\n", visible: false, description: "Sin asignación" },
    ],
  },
  {
    slug: "mm-final-prioridad",
    title: "Prioridad con criterios",
    description: "Implementa regla del proyecto.",
    prompt: "Detenido→CRITICA; >=10 afectados→ALTA; 2..9→MEDIA; otro BAJA.",
    starterCode: `using System; class Program{static void Main(){/* completa */}}`,
    solutionCode: `using System;
class Program
{
    static string Prioridad(int afectados, bool detenido)
    {
        if (detenido) return "CRITICA";
        if (afectados >= 10) return "ALTA";
        if (afectados >= 2) return "MEDIA";
        return "BAJA";
    }
    static void Main()
    {
        int afectados = int.Parse(Console.ReadLine());
        bool detenido = Console.ReadLine() == "SI";
        Console.WriteLine(Prioridad(afectados, detenido));
    }
}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "20\nSI\n", expectedStdout: "CRITICA\n", visible: true, description: "Detenido" },
      { stdin: "20\nNO\n", expectedStdout: "ALTA\n", visible: false, description: "Alta" },
      { stdin: "3\nNO\n", expectedStdout: "MEDIA\n", visible: false, description: "Media" },
      { stdin: "0\nNO\n", expectedStdout: "BAJA\n", visible: false, description: "Baja" },
    ],
  },
  {
    slug: "mm-final-pausado",
    title: "Incremento PAUSADO",
    description: "Implementa la evolución final sin romper transiciones.",
    prompt: "ABIERTO→EN_PROCESO; EN_PROCESO→PAUSADO/CERRADO; PAUSADO→EN_PROCESO.",
    starterCode: `using System; class Program{static void Main(){/* completa */}}`,
    solutionCode: `using System; class Program{static void Main(){string a=Console.ReadLine();string b=Console.ReadLine();bool ok=(a=="ABIERTO"&&b=="EN_PROCESO")||(a=="EN_PROCESO"&&(b=="PAUSADO"||b=="CERRADO"))||(a=="PAUSADO"&&b=="EN_PROCESO");Console.WriteLine(ok?"SI":"NO");}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "ABIERTO\nEN_PROCESO\n", expectedStdout: "SI\n", visible: true, description: "Regresión" },
      { stdin: "EN_PROCESO\nPAUSADO\n", expectedStdout: "SI\n", visible: false, description: "Nuevo" },
      { stdin: "PAUSADO\nCERRADO\n", expectedStdout: "NO\n", visible: false, description: "No definido" },
    ],
  },
] satisfies PracticeExerciseDefinition[];
