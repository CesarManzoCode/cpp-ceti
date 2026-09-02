import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "xml-a-objetos",
  title: "De XML a objetos: parsing y casting",
  description:
    "Convierte texto XML a tipos del dominio y valida la frontera antes de construir objetos.",
  estimatedMinutes: 17,
  xpReward: 60,
  steps: [
    {
      type: "theory",
      markdown: `# La frontera entra como texto

Aunque XML contenga \`<stock>8</stock>\`, \`InnerText\` devuelve un \`string\`. El programa tiene que convertirlo a \`int\` y decidir qué hacer si no puede.

Ese proceso tiene dos partes:

- **parsing:** interpretar una representación textual (\`"8"\`) como un valor;
- **casting/conversión:** obtener el tipo que el modelo necesita.

Evita construir un objeto inválido y "arreglarlo después". Primero valida la entrada; después llama al constructor con datos tipados.

Una frontera robusta puede usar \`int.TryParse\`, comprobar nodos obligatorios y entonces crear \`Producto\`.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Xml;
class Producto
{
    public string Codigo{get;private set;} public int Stock{get;private set;}
    public Producto(string codigo,int stock){Codigo=codigo;Stock=stock;}
}
class Program
{
    static void Main()
    {
        XmlDocument doc=new XmlDocument();
        doc.LoadXml("<producto codigo=\\"P1\\"><stock>8</stock></producto>");
        XmlElement raiz=doc.DocumentElement;
        int stock;
        if(!int.TryParse(raiz["stock"].InnerText,out stock))
        {
            Console.WriteLine("Stock invalido"); return;
        }
        Producto p=new Producto(raiz.GetAttribute("codigo"),stock);
        Console.WriteLine(p.Codigo+": "+p.Stock);
    }
}`,
      explanation:
        "el objeto sólo nace después de que el texto se convirtió correctamente a `int`.",
      runnable: true,
      expectedOutput: "P1: 8",
    },
    {
      type: "quiz",
      question:
        "¿por qué no basta con leer `InnerText` y asignarlo directamente a una propiedad `int`?",
      options: [
        "Porque XML siempre cifra los números.",
        "Porque `InnerText` es texto y el modelo exige una conversión validada.",
        "Porque C# no admite enteros en objetos.",
        "Porque un atributo no puede contener números.",
      ],
      correctIndex: 1,
      explanation:
        "Porque `InnerText` es texto y el modelo exige una conversión validada.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          'Lee una línea `<producto codigo="..."><stock>...</stock></producto>`. Si el nodo `stock` falta o no contiene un entero, imprime `STOCK INVALIDO`. Si es entero, crea un `Producto` y muestra `CODIGO STOCK`.',
        starterCode: `using System;
using System.Xml;
class Producto { }
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Xml;
class Producto
{
    public string Codigo{get;private set;} public int Stock{get;private set;}
    public Producto(string codigo,int stock){Codigo=codigo;Stock=stock;}
}
class Program
{
    static void Main()
    {
        XmlDocument doc=new XmlDocument();
        doc.LoadXml(Console.ReadLine());
        XmlElement raiz=doc.DocumentElement;
        XmlNode nodo=raiz["stock"];
        int stock;
        if(nodo==null || !int.TryParse(nodo.InnerText,out stock))
        {
            Console.WriteLine("STOCK INVALIDO"); return;
        }
        Producto p=new Producto(raiz.GetAttribute("codigo"),stock);
        Console.WriteLine(p.Codigo+" "+p.Stock);
    }
}`,
        hints: [
          "Comprueba `nodo == null` antes de leer `InnerText`.",
          "Usa `TryParse`.",
          "Construye después de validar.",
        ],
        difficulty: "medium",
        xpReward: 34,
        testCases: [
          {
            visible: true,
            stdin: '<producto codigo="P1"><stock>8</stock></producto>\n',
            expectedStdout: "P1 8\n",
          },
          {
            visible: false,
            stdin: '<producto codigo="X"><stock>abc</stock></producto>\n',
            expectedStdout: "STOCK INVALIDO\n",
          },
          {
            visible: false,
            stdin: '<producto codigo="Z"><nombre>Sin stock</nombre></producto>\n',
            expectedStdout: "STOCK INVALIDO\n",
          },
        ],
      },
    },
  ],
});
