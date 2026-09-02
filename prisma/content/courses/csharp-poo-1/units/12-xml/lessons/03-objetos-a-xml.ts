import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "objetos-a-xml",
  title: "De objetos a XML",
  description:
    "Construye un documento XML desde objetos sin mezclar el modelo de dominio con concatenaciones frágiles de texto.",
  estimatedMinutes: 17,
  xpReward: 60,
  steps: [
    {
      type: "theory",
      markdown: `# Serializar es traducir una representación a otra

Un objeto vive en memoria con tipos C#: \`int\`, \`string\`, referencias y métodos. XML es texto estructurado. **Serializar** significa traducir el estado que necesitas conservar o transferir a esa representación.

Podrías concatenar strings, pero aparecen problemas de escape y estructura. Una API XML crea nodos y se encarga de representar caracteres especiales correctamente.

Decide de forma deliberada qué va como atributo y qué como elemento. Una regla simple para este curso:

- identificadores pequeños y propios del elemento pueden ir como atributos;
- datos del contenido pueden ir como hijos.

No es una ley universal; es un contrato de representación que debe mantenerse estable entre productor y consumidor.`,
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
        XmlElement producto = doc.CreateElement("producto");
        producto.SetAttribute("codigo", "P1");

        XmlElement nombre = doc.CreateElement("nombre");
        nombre.InnerText = "Mouse & teclado";
        producto.AppendChild(nombre);

        doc.AppendChild(producto);
        Console.WriteLine(doc.OuterXml);
    }
}`,
      explanation:
        "`InnerText` escapa `&` como `&amp;`. La API mantiene el documento bien formado.",
      runnable: true,
      expectedOutput: '<producto codigo="P1"><nombre>Mouse &amp; teclado</nombre></producto>',
    },
    {
      type: "code_completion",
      lines: [
        'XmlElement producto = doc.CreateElement("producto");',
        'producto.SetAttribute("codigo", codigo);',
        'XmlElement nombre = doc.CreateElement("nombre");',
        "nombre.InnerText = texto;",
        "producto.AppendChild(nombre);",
        "doc.AppendChild(producto);",
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          'Lee `codigo`, `nombre` y `stock`. Construye con `XmlDocument` exactamente esta forma, sin concatenar el XML manualmente:\n\n```xml\n<producto codigo="P1"><nombre>Mouse</nombre><stock>4</stock></producto>\n```\n\nImprime `doc.OuterXml`.',
        starterCode: `using System;
using System.Xml;
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Xml;
class Program
{
    static void Main()
    {
        string codigo = Console.ReadLine();
        string textoNombre = Console.ReadLine();
        int stock = int.Parse(Console.ReadLine());

        XmlDocument doc = new XmlDocument();
        XmlElement producto = doc.CreateElement("producto");
        producto.SetAttribute("codigo", codigo);

        XmlElement nombre = doc.CreateElement("nombre");
        nombre.InnerText = textoNombre;
        producto.AppendChild(nombre);

        XmlElement nodoStock = doc.CreateElement("stock");
        nodoStock.InnerText = stock.ToString();
        producto.AppendChild(nodoStock);

        doc.AppendChild(producto);
        Console.WriteLine(doc.OuterXml);
    }
}`,
        hints: [
          "Crea el root primero.",
          "`SetAttribute` para código.",
          "Cada hijo se agrega con `AppendChild`.",
        ],
        difficulty: "medium",
        xpReward: 34,
        testCases: [
          {
            visible: true,
            stdin: "P1\nMouse\n4\n",
            expectedStdout: '<producto codigo="P1"><nombre>Mouse</nombre><stock>4</stock></producto>\n',
          },
          {
            visible: false,
            stdin: "X\nCable HDMI\n0\n",
            expectedStdout: '<producto codigo="X"><nombre>Cable HDMI</nombre><stock>0</stock></producto>\n',
          },
          {
            visible: false,
            stdin: "A&B\nUno & Dos\n9\n",
            expectedStdout: '<producto codigo="A&amp;B"><nombre>Uno &amp; Dos</nombre><stock>9</stock></producto>\n',
          },
        ],
      },
    },
  ],
});
