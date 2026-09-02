import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "cliente-servidor-tcp",
  title: "Arquitectura cliente-servidor TCP",
  description:
    "Sigue el ciclo de escuchar, aceptar, conectar, enviar y responder, y separa ese transporte del servicio de dominio.",
  estimatedMinutes: 18,
  xpReward: 65,
  steps: [
    {
      type: "theory",
      markdown: `# Un servidor ofrece un servicio en un endpoint

En un modelo cliente-servidor TCP básico:

**Servidor**
1. crea un listener en IP/puerto;
2. comienza a escuchar;
3. acepta una conexión;
4. lee una solicitud;
5. ejecuta una operación de aplicación;
6. escribe una respuesta;
7. cierra recursos cuando corresponde.

**Cliente**
1. conoce el endpoint del servidor;
2. conecta;
3. envía una solicitud del protocolo;
4. lee la respuesta.

El socket no debe contener reglas de inventario. Idealmente entrega el mensaje a una clase como \`ProcesadorComandos\`, que puede probarse sin red.`,
    },
    {
      type: "code_example",
      code: `// Servidor.cs
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
class Servidor
{
    static void Main()
    {
        TcpListener listener=new TcpListener(IPAddress.Loopback,5050);
        listener.Start();
        using(TcpClient cliente=listener.AcceptTcpClient())
        using(NetworkStream red=cliente.GetStream())
        using(StreamReader entrada=new StreamReader(red))
        using(StreamWriter salida=new StreamWriter(red){AutoFlush=true})
        {
            string mensaje=entrada.ReadLine();
            salida.WriteLine("RECIBIDO|"+mensaje);
        }
        listener.Stop();
    }
}

// Cliente.cs (ejecutar en otro proceso)
// TcpClient cliente=new TcpClient("127.0.0.1",5050);
// escribir una línea y leer la respuesta usando su NetworkStream.`,
      explanation:
        "el ejemplo usa una línea como framing mínimo. Sólo demuestra el ciclo TCP local; no es arquitectura de producción.",
      runnable: false,
      localOnlyNote:
        "Requiere dos procesos locales y apertura de un puerto TCP. Ejecuta Servidor.cs y Cliente.cs en localhost fuera del runner web.",
    },
    {
      type: "code_completion",
      lines: [
        "listener.Start();",
        "TcpClient cliente = listener.AcceptTcpClient();",
        "NetworkStream red = cliente.GetStream();",
        "leer solicitud;",
        "producir respuesta;",
        "cerrar/Dispose y listener.Stop().",
      ],
      prompt: "Orden del servidor:",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Implementa sólo la **lógica del protocolo**, no la red. Lee `n` solicitudes con formato `PING` o `ECO|texto`. Para cada una imprime la respuesta:\n\n- `PING` → `PONG`\n- `ECO|texto` → `OK|texto`\n- cualquier otra → `ERROR|COMANDO`",
        starterCode: `using System;
class Procesador
{
    public string Responder(string solicitud) { return ""; }
}
class Program { static void Main() { } }`,
        solutionCode: `using System;
class Procesador
{
    public string Responder(string solicitud)
    {
        string[] p=solicitud.Split('|');
        if(p[0]=="PING" && p.Length==1)return "PONG";
        if(p[0]=="ECO" && p.Length==2)return "OK|"+p[1];
        return "ERROR|COMANDO";
    }
}
class Program
{
    static void Main()
    {
        int n=int.Parse(Console.ReadLine()); Procesador p=new Procesador();
        for(int i=0;i<n;i++)Console.WriteLine(p.Responder(Console.ReadLine()));
    }
}`,
        hints: [
          "separa protocolo de socket",
          "valida también cantidad de campos",
          "produce una respuesta por solicitud.",
        ],
        difficulty: "medium",
        xpReward: 34,
        testCases: [
          {
            visible: true,
            stdin: "3\nPING\nECO|hola\nOTRO\n",
            expectedStdout: "PONG\nOK|hola\nERROR|COMANDO\n",
          },
          {
            visible: false,
            stdin: "2\nECO|A B\nPING\n",
            expectedStdout: "OK|A B\nPONG\n",
          },
          {
            visible: false,
            stdin: "2\nPING|extra\nECO\n",
            expectedStdout: "ERROR|COMANDO\nERROR|COMANDO\n",
          },
        ],
      },
    },
  ],
});
