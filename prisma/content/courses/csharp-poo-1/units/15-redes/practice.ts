import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "csharp-poo2-crear-mensaje-protocolo",
    title: "Construye mensajes del protocolo",
    description: "Codifica una operación del dominio en un formato textual determinista.",
    prompt: "lee `comando`, `codigo`, `cantidad`; imprime `COMANDO|CODIGO|CANTIDAD`.",
    starterCode: `using System; class Program { static void Main() { } }`,
    solutionCode: `using System; class Program{static void Main(){string c=Console.ReadLine(),id=Console.ReadLine();int n=int.Parse(Console.ReadLine());Console.WriteLine(c+"|"+id+"|"+n);}}`,
    difficulty: "easy",
    xpReward: 24,
    testCases: [
      { stdin: "ALTA\nP1\n5\n", expectedStdout: "ALTA|P1|5\n", visible: true },
      { stdin: "AJUSTE\nX\n-2\n", expectedStdout: "AJUSTE|X|-2\n", visible: false },
      { stdin: "STOCK\nA&B\n0\n", expectedStdout: "STOCK|A&B|0\n", visible: false },
    ],
  },
  {
    slug: "csharp-poo2-parsear-mensaje",
    title: "Parsea una respuesta",
    description: "Valida forma mínima y traduce campos de un mensaje recibido.",
    prompt:
      "lee una línea. Acepta `OK|CODIGO|STOCK` con stock entero; imprime `CODIGO STOCK`. Cualquier otra forma imprime `ERROR`.",
    starterCode: `using System; class Program { static void Main() { } }`,
    solutionCode: `using System;
class Program{static void Main(){string[] p=Console.ReadLine().Split('|');int s;if(p.Length==3&&p[0]=="OK"&&p[1].Length>0&&int.TryParse(p[2],out s))Console.WriteLine(p[1]+" "+s);else Console.WriteLine("ERROR");}}`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      { stdin: "OK|P1|7\n", expectedStdout: "P1 7\n", visible: true },
      { stdin: "OK|P1|x\n", expectedStdout: "ERROR\n", visible: false },
      { stdin: "ERROR|NO\n", expectedStdout: "ERROR\n", visible: false },
    ],
  },
  {
    slug: "csharp-poo2-validar-endpoint",
    title: "Valida endpoint",
    description: "Rechaza configuración IP/puerto inválida antes de abrir red.",
    prompt: "lee `ip` y `puerto`; imprime `ip:puerto` si ambos son válidos, o `INVALIDO`.",
    starterCode: `using System;
using System.Net;
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Net;
class Program{static void Main(){string t=Console.ReadLine();int p=int.Parse(Console.ReadLine());IPAddress ip;if(IPAddress.TryParse(t,out ip)&&p>=1&&p<=65535)Console.WriteLine(t+":"+p);else Console.WriteLine("INVALIDO");}}`,
    difficulty: "easy",
    xpReward: 26,
    testCases: [
      { stdin: "10.0.0.1\n80\n", expectedStdout: "10.0.0.1:80\n", visible: true },
      { stdin: "bad\n80\n", expectedStdout: "INVALIDO\n", visible: false },
      { stdin: "127.0.0.1\n0\n", expectedStdout: "INVALIDO\n", visible: false },
    ],
  },
  {
    slug: "csharp-poo2-procesar-comando-remoto",
    title: "Procesa un comando remoto sin red",
    description: "Mantiene la lógica del servicio independiente del transporte de sockets.",
    prompt:
      "empieza con diccionario vacío y procesa `n` mensajes: `ALTA|codigo|stock`, `BUSCAR|codigo`, `ELIMINAR|codigo`. Respuestas: alta nueva `OK`, duplicada `DUP`; buscar imprime stock o `NO`; eliminar no imprime. Rechaza cualquier mensaje mal formado con `ERROR`.",
    starterCode: `using System;
using System.Collections.Generic;
class Procesador { }
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Collections.Generic;
class Procesador
{
    private Dictionary<string,int>d=new Dictionary<string,int>();
    public string Procesar(string m)
    {
        string[] p=m.Split('|');
        if(p.Length==3&&p[0]=="ALTA")
        {
            int s;if(p[1].Length==0||!int.TryParse(p[2],out s)||s<0)return "ERROR";
            if(d.ContainsKey(p[1]))return "DUP";d.Add(p[1],s);return "OK";
        }
        if(p.Length==2&&p[0]=="BUSCAR"){int s;return d.TryGetValue(p[1],out s)?s.ToString():"NO";}
        if(p.Length==2&&p[0]=="ELIMINAR"){d.Remove(p[1]);return null;}
        return "ERROR";
    }
}
class Program{static void Main(){int n=int.Parse(Console.ReadLine());Procesador p=new Procesador();for(int i=0;i<n;i++){string r=p.Procesar(Console.ReadLine());if(r!=null)Console.WriteLine(r);}}}`,
    difficulty: "hard",
    xpReward: 40,
    testCases: [
      {
        stdin: "5\nALTA|P1|5\nBUSCAR|P1\nALTA|P1|9\nELIMINAR|P1\nBUSCAR|P1\n",
        expectedStdout: "OK\n5\nDUP\nNO\n",
        visible: true,
      },
      {
        stdin: "4\nBUSCAR|X\nALTA|X|0\nBUSCAR|X\nMAL\n",
        expectedStdout: "NO\nOK\n0\nERROR\n",
        visible: false,
      },
      {
        stdin: "3\nALTA||2\nALTA|A|-1\nALTA|A|x\n",
        expectedStdout: "ERROR\nERROR\nERROR\n",
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
