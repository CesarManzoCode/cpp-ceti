import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "persistencia-xml",
  title: "Persistencia: memoria, archivo y ciclo de vida",
  description:
    "Entiende qué significa persistir y separa la transformación XML del lugar físico donde se guarda.",
  estimatedMinutes: 18,
  xpReward: 60,
  steps: [
    {
      type: "theory",
      markdown: `# Persistir significa sobrevivir al proceso

Una lista y un \`XmlDocument\` en memoria desaparecen cuando termina el programa. **Persistencia** significa guardar información fuera del ciclo de vida del proceso para recuperarla después.

La misma representación XML puede viajar o guardarse en varios medios:

- archivo local;
- base de datos;
- mensaje de red;
- almacenamiento remoto.

Conviene separar dos responsabilidades:

1. **serializar/deserializar**: objeto ↔ XML;
2. **persistir/recuperar**: XML ↔ medio externo.

En cpp-ceti podemos probar completamente la primera parte en el navegador. El ejemplo de archivo real se marca como laboratorio local porque el filesystem del runner es temporal y no representa persistencia entre sesiones.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Xml;
class Program
{
    static void Main()
    {
        XmlDocument doc = new XmlDocument();
        doc.LoadXml("<inventario><producto codigo=\\"P1\\" /></inventario>");
        doc.Save("inventario.xml");

        XmlDocument recuperado = new XmlDocument();
        recuperado.Load("inventario.xml");
        Console.WriteLine(recuperado.DocumentElement.Name);
    }
}`,
      explanation:
        "`Save` y `Load` muestran persistencia física mediante archivo. El concepto es válido, pero en el juez remoto el archivo sólo vive dentro de esa ejecución.",
      runnable: false,
      localOnlyNote:
        "Ejecuta este laboratorio localmente con Mono/Visual Studio. El runner web no ofrece almacenamiento persistente entre ejecuciones.",
    },
    {
      type: "matching",
      pairs: [
        { left: "Objeto → XML", right: "Serialización." },
        { left: "XML → objeto", right: "Deserialización/parsing." },
        { left: "XML → archivo", right: "Persistencia física." },
        { left: "Archivo → XML", right: "Recuperación." },
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Demuestra un **round-trip en memoria**. Lee `codigo` y `stock`, crea un XML con `XmlDocument`, conviértelo a `OuterXml`, carga ese string en un segundo `XmlDocument` y finalmente imprime `CODIGO STOCK` desde el segundo documento.\n\nNo uses archivos en este reto.",
        starterCode: `using System;
using System.Xml;
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Xml;
class Program
{
    static void Main()
    {
        string codigo=Console.ReadLine();
        int stock=int.Parse(Console.ReadLine());

        XmlDocument salida=new XmlDocument();
        XmlElement p=salida.CreateElement("producto");
        p.SetAttribute("codigo",codigo);
        XmlElement s=salida.CreateElement("stock");
        s.InnerText=stock.ToString();
        p.AppendChild(s); salida.AppendChild(p);

        string xml=salida.OuterXml;
        XmlDocument entrada=new XmlDocument();
        entrada.LoadXml(xml);

        Console.WriteLine(entrada.DocumentElement.GetAttribute("codigo")+" "+entrada.DocumentElement["stock"].InnerText);
    }
}`,
        hints: [
          "Crea dos instancias de `XmlDocument`.",
          "El puente entre ellas es un string XML.",
          "Lee el resultado desde el segundo árbol.",
        ],
        difficulty: "medium",
        xpReward: 34,
        testCases: [
          {
            visible: true,
            stdin: "P1\n8\n",
            expectedStdout: "P1 8\n",
          },
          {
            visible: false,
            stdin: "X\n0\n",
            expectedStdout: "X 0\n",
          },
          {
            visible: false,
            stdin: "A&B\n17\n",
            expectedStdout: "A&B 17\n",
          },
        ],
      },
    },
  ],
});
