import { defineLesson } from "../../../../../authoring";

export const leccion06 = defineLesson({
  slug: "seguridad-del-mensaje",
  title: "No confíes en el mensaje remoto",
  description:
    "Valida tamaño, estructura, comandos y tipos antes de permitir que una entrada remota alcance el dominio.",
  estimatedMinutes: 18,
  xpReward: 65,
  steps: [
    {
      type: "theory",
      markdown: `# La red es una frontera no confiable

Un mensaje remoto puede llegar mal formado, incompleto, duplicado o deliberadamente malicioso. Aunque estés en una LAN escolar, el código debe validar antes de actuar.

Para este protocolo pequeño aplica controles concretos:

- limita longitud máxima;
- acepta sólo comandos conocidos;
- valida cantidad de campos;
- convierte números con \`TryParse\`;
- valida rangos;
- nunca uses texto remoto para construir rutas/comandos del sistema sin reglas estrictas.

Esto no convierte el protocolo en “seguro” criptográficamente. Autenticación, cifrado y TLS son temas adicionales. Aquí el objetivo oficial de seguridad en transmisión se traduce a no confiar ciegamente en el contenido y diseñar mensajes que puedan rechazarse con claridad.`,
    },
    {
      type: "code_example",
      code: `using System;
class Validador
{
    public static bool AltaValida(string mensaje)
    {
        if(mensaje==null || mensaje.Length>100)return false;
        string[] p=mensaje.Split('|');
        if(p.Length!=3 || p[0]!="ALTA" || p[1].Length==0)return false;
        int stock;
        return int.TryParse(p[2],out stock) && stock>=0;
    }
}
class Program
{
    static void Main()
    {
        Console.WriteLine(Validador.AltaValida("ALTA|P1|5"));
        Console.WriteLine(Validador.AltaValida("ALTA|P1|-2"));
    }
}`,
      explanation:
        "la aplicación sólo entrega al dominio datos cuya forma y tipos cumplen el contrato mínimo.",
      runnable: true,
      expectedOutput: `True
False`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Mensaje > límite", right: "Rechazar antes de parsear más." },
        { left: "Comando desconocido", right: "Respuesta de protocolo `ERROR`." },
        { left: "Stock no entero", right: "Error de validación de campo." },
        {
          left: "`ALTA|P1|-3`",
          right: "Estructura correcta, dato de dominio inválido.",
        },
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee `n` mensajes. Considera válido sólo `ALTA|CODIGO|STOCK` donde:\n\n- longitud total <= 50;\n- exactamente 3 campos;\n- código no vacío;\n- stock es entero entre 0 y 100000.\n\nPor cada línea imprime `VALIDO` o `INVALIDO`.",
        starterCode: `using System;
class Program
{
    static bool EsValido(string mensaje) { return false; }
    static void Main() { }
}`,
        solutionCode: `using System;
class Program
{
    static bool EsValido(string mensaje)
    {
        if(mensaje==null || mensaje.Length>50)return false;
        string[] p=mensaje.Split('|');
        if(p.Length!=3 || p[0]!="ALTA" || p[1].Length==0)return false;
        int stock;
        return int.TryParse(p[2],out stock) && stock>=0 && stock<=100000;
    }
    static void Main()
    {
        int n=int.Parse(Console.ReadLine());
        for(int i=0;i<n;i++)Console.WriteLine(EsValido(Console.ReadLine())?"VALIDO":"INVALIDO");
    }
}`,
        hints: [
          "valida longitud antes de usar campos",
          "Split debe dar exactamente 3",
          "usa TryParse y rango.",
        ],
        difficulty: "medium",
        xpReward: 34,
        testCases: [
          {
            visible: true,
            stdin: "4\nALTA|P1|5\nALTA||5\nALTA|P2|-1\nBUSCAR|P1\n",
            expectedStdout: "VALIDO\nINVALIDO\nINVALIDO\nINVALIDO\n",
          },
          {
            visible: false,
            stdin: "3\nALTA|X|0\nALTA|X|100000\nALTA|X|100001\n",
            expectedStdout: "VALIDO\nVALIDO\nINVALIDO\n",
          },
          {
            visible: false,
            stdin: "2\nALTA|P|abc\nALTA|P|1|EXTRA\n",
            expectedStdout: "INVALIDO\nINVALIDO\n",
          },
        ],
      },
    },
  ],
});
