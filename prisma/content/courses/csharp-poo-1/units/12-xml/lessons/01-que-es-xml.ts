import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "que-es-xml",
  title: "XML como representación estructurada",
  description:
    "Lee elementos, atributos y jerarquía como una representación explícita de información del dominio.",
  estimatedMinutes: 14,
  xpReward: 50,
  steps: [
    {
      type: "theory",
      markdown: `# XML describe estructura, no sólo texto

XML usa **elementos** y **atributos** para representar información con jerarquía.

\`\`\`xml
<producto codigo="P1">
  <nombre>Mouse</nombre>
  <stock>4</stock>
</producto>
\`\`\`

Aquí:

- \`producto\` es el elemento raíz;
- \`codigo\` es un atributo del producto;
- \`nombre\` y \`stock\` son elementos hijos;
- el valor \`4\` sigue siendo texto en el documento y tendrá que convertirse a \`int\` al entrar al modelo C#.

XML no sabe qué es un \`Producto\` de C#. El programa debe definir cómo traducir entre el documento y sus objetos.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Xml;

class Program
{
    static void Main()
    {
        string xml = "<producto codigo=\\"P1\\"><nombre>Mouse</nombre><stock>4</stock></producto>";
        XmlDocument doc = new XmlDocument();
        doc.LoadXml(xml);

        XmlElement raiz = doc.DocumentElement;
        Console.WriteLine(raiz.GetAttribute("codigo"));
        Console.WriteLine(raiz["nombre"].InnerText);
        Console.WriteLine(raiz["stock"].InnerText);
    }
}`,
      explanation:
        "`XmlDocument` construye un árbol en memoria. `DocumentElement` es la raíz y los hijos se consultan por etiqueta.",
      runnable: true,
      expectedOutput: `P1
Mouse
4`,
    },
    {
      type: "matching",
      pairs: [
        { left: "<producto>", right: "Elemento raíz." },
        { left: 'codigo="P1"', right: "Atributo." },
        { left: "<stock>4</stock>", right: "Elemento hijo con contenido textual." },
        { left: "XmlDocument", right: "Árbol XML cargado en memoria." },
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          'Lee una sola línea que contiene XML con esta forma:\n\n```xml\n<producto codigo="P1"><nombre>Mouse</nombre><stock>4</stock></producto>\n```\n\nCarga la línea con `XmlDocument` e imprime exactamente:\n\n```text\nCodigo: P1\nNombre: Mouse\nStock: 4\n```',
        starterCode: `using System;
using System.Xml;
class Program
{
    static void Main()
    {
        string xml = Console.ReadLine();
        // carga y lee
    }
}`,
        solutionCode: `using System;
using System.Xml;
class Program
{
    static void Main()
    {
        string xml = Console.ReadLine();
        XmlDocument doc = new XmlDocument();
        doc.LoadXml(xml);
        XmlElement p = doc.DocumentElement;
        Console.WriteLine("Codigo: " + p.GetAttribute("codigo"));
        Console.WriteLine("Nombre: " + p["nombre"].InnerText);
        Console.WriteLine("Stock: " + p["stock"].InnerText);
    }
}`,
        hints: [
          "`LoadXml` recibe el texto.",
          "`DocumentElement` es el producto.",
          "`GetAttribute` y `InnerText` recuperan valores.",
        ],
        difficulty: "easy",
        xpReward: 26,
        testCases: [
          {
            visible: true,
            stdin: '<producto codigo="P1"><nombre>Mouse</nombre><stock>4</stock></producto>\n',
            expectedStdout: "Codigo: P1\nNombre: Mouse\nStock: 4\n",
          },
          {
            visible: false,
            stdin: '<producto codigo="X"><nombre>Cable HDMI</nombre><stock>0</stock></producto>\n',
            expectedStdout: "Codigo: X\nNombre: Cable HDMI\nStock: 0\n",
          },
          {
            visible: false,
            stdin: '<producto codigo="Z9"><nombre>Monitor</nombre><stock>17</stock></producto>\n',
            expectedStdout: "Codigo: Z9\nNombre: Monitor\nStock: 17\n",
          },
        ],
      },
    },
  ],
});
