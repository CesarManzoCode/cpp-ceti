import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "csharp-poo2-leer-productos-xml",
    title: "Lee un producto XML",
    description: "Extrae atributos y nodos desde un documento recibido como texto.",
    prompt:
      'lee una línea `<producto codigo="..."><nombre>...</nombre><precio>...</precio></producto>` e imprime `codigo|nombre|precio`.',
    starterCode: `using System;
using System.Xml;
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Xml;
class Program{static void Main(){XmlDocument d=new XmlDocument();d.LoadXml(Console.ReadLine());XmlElement p=d.DocumentElement;Console.WriteLine(p.GetAttribute("codigo")+"|"+p["nombre"].InnerText+"|"+p["precio"].InnerText);}}`,
    difficulty: "easy",
    xpReward: 26,
    testCases: [
      {
        stdin: '<producto codigo="P1"><nombre>Mouse</nombre><precio>250</precio></producto>\n',
        expectedStdout: "P1|Mouse|250\n",
        visible: true,
      },
      {
        stdin: '<producto codigo="X"><nombre>Cable HDMI</nombre><precio>0</precio></producto>\n',
        expectedStdout: "X|Cable HDMI|0\n",
        visible: false,
      },
      {
        stdin: '<producto codigo="Z"><nombre>A &amp; B</nombre><precio>7</precio></producto>\n',
        expectedStdout: "Z|A & B|7\n",
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-crear-xml-producto",
    title: "Genera XML de una orden",
    description: "Construye nodos y atributos con la API XML en lugar de concatenar el documento.",
    prompt:
      'lee `folio`, `cliente`, `total` entero y produce exactamente `<orden folio="F"><cliente>N</cliente><total>T</total></orden>` mediante `XmlDocument`.',
    starterCode: `using System;
using System.Xml;
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Xml;
class Program{static void Main(){string f=Console.ReadLine(),c=Console.ReadLine();int t=int.Parse(Console.ReadLine());XmlDocument d=new XmlDocument();XmlElement o=d.CreateElement("orden");o.SetAttribute("folio",f);XmlElement n=d.CreateElement("cliente");n.InnerText=c;o.AppendChild(n);XmlElement x=d.CreateElement("total");x.InnerText=t.ToString();o.AppendChild(x);d.AppendChild(o);Console.WriteLine(d.OuterXml);}}`,
    difficulty: "medium",
    xpReward: 32,
    testCases: [
      {
        stdin: "F1\nAna\n300\n",
        expectedStdout: '<orden folio="F1"><cliente>Ana</cliente><total>300</total></orden>\n',
        visible: true,
      },
      {
        stdin: "X\nA & B\n0\n",
        expectedStdout: '<orden folio="X"><cliente>A &amp; B</cliente><total>0</total></orden>\n',
        visible: false,
      },
      {
        stdin: "Z9\nLuis\n12\n",
        expectedStdout: '<orden folio="Z9"><cliente>Luis</cliente><total>12</total></orden>\n',
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-parsear-datos-xml",
    title: "Parsing validado",
    description: "Rechaza datos tipados incorrectamente antes de crear el objeto de dominio.",
    prompt:
      'lee `<alumno registro="..."><promedio>...</promedio></alumno>`. Si `promedio` no es entero de 0 a 100 imprime `INVALIDO`; si lo es, imprime `registro promedio`.',
    starterCode: `using System;
using System.Xml;
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Xml;
class Program{static void Main(){XmlDocument d=new XmlDocument();d.LoadXml(Console.ReadLine());XmlElement a=d.DocumentElement;int p;XmlNode n=a["promedio"];if(n==null||!int.TryParse(n.InnerText,out p)||p<0||p>100){Console.WriteLine("INVALIDO");return;}Console.WriteLine(a.GetAttribute("registro")+" "+p);}}`,
    difficulty: "medium",
    xpReward: 32,
    testCases: [
      {
        stdin: '<alumno registro="A1"><promedio>90</promedio></alumno>\n',
        expectedStdout: "A1 90\n",
        visible: true,
      },
      {
        stdin: '<alumno registro="X"><promedio>abc</promedio></alumno>\n',
        expectedStdout: "INVALIDO\n",
        visible: false,
      },
      {
        stdin: '<alumno registro="Y"><promedio>101</promedio></alumno>\n',
        expectedStdout: "INVALIDO\n",
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-inventario-xml",
    title: "Inventario serializable",
    description: "Transforma una lista de productos en un documento XML completo y determinista.",
    prompt:
      'lee `n` productos (`codigo`,`stock`) y genera con `XmlDocument` `<inventario>` con hijos `<producto codigo="..."><stock>...</stock></producto>` en el mismo orden de entrada. Imprime `OuterXml`.',
    starterCode: `using System;
using System.Xml;
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Xml;
class Program{static void Main(){int n=int.Parse(Console.ReadLine());XmlDocument d=new XmlDocument();XmlElement inv=d.CreateElement("inventario");d.AppendChild(inv);for(int i=0;i<n;i++){string c=Console.ReadLine();int s=int.Parse(Console.ReadLine());XmlElement p=d.CreateElement("producto");p.SetAttribute("codigo",c);XmlElement x=d.CreateElement("stock");x.InnerText=s.ToString();p.AppendChild(x);inv.AppendChild(p);}Console.WriteLine(d.OuterXml);}}`,
    difficulty: "hard",
    xpReward: 40,
    testCases: [
      {
        stdin: "2\nA\n1\nB\n2\n",
        expectedStdout:
          '<inventario><producto codigo="A"><stock>1</stock></producto><producto codigo="B"><stock>2</stock></producto></inventario>\n',
        visible: true,
      },
      {
        stdin: "1\nX\n0\n",
        expectedStdout: '<inventario><producto codigo="X"><stock>0</stock></producto></inventario>\n',
        visible: false,
      },
      {
        stdin: "3\nA\n5\nB\n0\nC\n9\n",
        expectedStdout:
          '<inventario><producto codigo="A"><stock>5</stock></producto><producto codigo="B"><stock>0</stock></producto><producto codigo="C"><stock>9</stock></producto></inventario>\n',
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
