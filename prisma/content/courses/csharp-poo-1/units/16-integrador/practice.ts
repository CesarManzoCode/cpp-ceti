import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "csharp-poo2-modelo-inventario",
    title: "Modelo estructural del inventario",
    description:
      "Implementa la entidad central con invariantes antes de agregar infraestructura.",
    prompt:
      "implementa `Bien(Codigo,Nombre,Stock)` con stock >= 0 y método `Ajustar` que no permita resultado negativo. Lee datos y cambio; imprime stock final o `ERROR`.",
    starterCode: `using System;
class Bien { }
class Program { static void Main() { } }`,
    solutionCode: `using System;
class Bien{public string Codigo{get;private set;}public string Nombre{get;private set;}public int Stock{get;private set;}public Bien(string c,string n,int s){if(s<0)throw new ArgumentException();Codigo=c;Nombre=n;Stock=s;}public void Ajustar(int x){if(Stock+x<0)throw new ArgumentException();Stock+=x;}}
class Program{static void Main(){try{Bien b=new Bien(Console.ReadLine(),Console.ReadLine(),int.Parse(Console.ReadLine()));b.Ajustar(int.Parse(Console.ReadLine()));Console.WriteLine(b.Stock);}catch(ArgumentException){Console.WriteLine("ERROR");}}}`,
    difficulty: "medium",
    xpReward: 34,
    testCases: [
      {
        visible: true,
        stdin: "P1\nMouse\n5\n-2\n",
        expectedStdout: "3\n",
      },
      {
        visible: false,
        stdin: "X\nCable\n0\n-1\n",
        expectedStdout: "ERROR\n",
      },
      {
        visible: false,
        stdin: "Z\nMonitor\n-1\n2\n",
        expectedStdout: "ERROR\n",
      },
    ],
  },
  {
    slug: "csharp-poo2-repositorio-dominio",
    title: "Repositorio de dominio",
    description:
      "Encapsula almacenamiento y búsqueda por identidad detrás de un repositorio genérico.",
    prompt:
      "crea `Entidad(Id)`, `Bien : Entidad`, `Repositorio<T> where T:Entidad` respaldado por `Dictionary<string,T>` con `Agregar`, `Buscar`, `Eliminar`. Procesa altas/búsquedas/bajas y devuelve `OK`, `DUP`, nombre, `NO`.",
    starterCode: `using System;
using System.Collections.Generic;
class Entidad { }
class Bien : Entidad { }
class Repositorio<T> where T : Entidad { }
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Collections.Generic;
class Entidad{public string Id{get;private set;}public Entidad(string id){Id=id;}}
class Bien:Entidad{public string Nombre{get;private set;}public Bien(string id,string n):base(id){Nombre=n;}}
class Repositorio<T> where T:Entidad{private Dictionary<string,T>d=new Dictionary<string,T>();public bool Agregar(T x){if(d.ContainsKey(x.Id))return false;d.Add(x.Id,x);return true;}public T Buscar(string id){T x;return d.TryGetValue(id,out x)?x:null;}public void Eliminar(string id){d.Remove(id);}}
class Program{static void Main(){int n=int.Parse(Console.ReadLine());Repositorio<Bien>r=new Repositorio<Bien>();for(int i=0;i<n;i++){string[]p=Console.ReadLine().Split('|');if(p[0]=="A")Console.WriteLine(r.Agregar(new Bien(p[1],p[2]))?"OK":"DUP");else if(p[0]=="B"){Bien b=r.Buscar(p[1]);Console.WriteLine(b==null?"NO":b.Nombre);}else if(p[0]=="E")r.Eliminar(p[1]);}}}`,
    difficulty: "hard",
    xpReward: 40,
    testCases: [
      {
        visible: true,
        stdin: "5\nA|P1|Mouse\nA|P2|Cable\nB|P2\nE|P2\nB|P2\n",
        expectedStdout: "OK\nOK\nCable\nNO\n",
      },
      {
        visible: false,
        stdin: "3\nA|X|Uno\nA|X|Dos\nB|X\n",
        expectedStdout: "OK\nDUP\nUno\n",
      },
      {
        visible: false,
        stdin: "2\nB|Z\nE|Z\n",
        expectedStdout: "NO\n",
      },
    ],
  },
  {
    slug: "csharp-poo2-import-export-xml",
    title: "Import/export XML en memoria",
    description:
      "Serializa un objeto y reconstruye sus datos desde XML sin depender del filesystem.",
    prompt:
      'lee `codigo`, `nombre`, `stock`; genera XML `<bien codigo="..."><nombre>...</nombre><stock>...</stock></bien>`, vuelve a cargarlo y muestra `codigo|nombre|stock`.',
    starterCode: `using System;
using System.Xml;
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Xml;
class Program{static void Main(){string c=Console.ReadLine(),n=Console.ReadLine();int s=int.Parse(Console.ReadLine());XmlDocument d=new XmlDocument();XmlElement b=d.CreateElement("bien");b.SetAttribute("codigo",c);XmlElement x=d.CreateElement("nombre");x.InnerText=n;b.AppendChild(x);XmlElement y=d.CreateElement("stock");y.InnerText=s.ToString();b.AppendChild(y);d.AppendChild(b);XmlDocument r=new XmlDocument();r.LoadXml(d.OuterXml);XmlElement z=r.DocumentElement;Console.WriteLine(z.GetAttribute("codigo")+"|"+z["nombre"].InnerText+"|"+z["stock"].InnerText);}}`,
    difficulty: "medium",
    xpReward: 34,
    testCases: [
      {
        visible: true,
        stdin: "P1\nMouse\n5\n",
        expectedStdout: "P1|Mouse|5\n",
      },
      {
        visible: false,
        stdin: "X\nA & B\n0\n",
        expectedStdout: "X|A & B|0\n",
      },
      {
        visible: false,
        stdin: "Z\nCable HDMI\n17\n",
        expectedStdout: "Z|Cable HDMI|17\n",
      },
    ],
  },
  {
    slug: "csharp-poo2-comandos-thread-safe",
    title: "Comandos thread-safe",
    description:
      "Aplica operaciones concurrentes a un servicio que protege internamente su estado.",
    prompt:
      "crea `Inventario` con stock privado, `Ajustar(int)` y `Consultar()`, ambos bajo el mismo lock. Lee `n`; crea dos hilos, uno suma `1` n veces y otro suma `2` n veces. Tras ambos `Join`, imprime `3*n`.",
    starterCode: `using System;
using System.Threading;
class Inventario { }
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Threading;
class Inventario{private int stock;private readonly object g=new object();public void Ajustar(int x){lock(g){stock+=x;}}public int Consultar(){lock(g){return stock;}}}
class Program{static int n;static Inventario inv=new Inventario();static void A(){for(int i=0;i<n;i++)inv.Ajustar(1);}static void B(){for(int i=0;i<n;i++)inv.Ajustar(2);}static void Main(){n=int.Parse(Console.ReadLine());Thread a=new Thread(A),b=new Thread(B);a.Start();b.Start();a.Join();b.Join();Console.WriteLine(inv.Consultar());}}`,
    difficulty: "hard",
    xpReward: 42,
    testCases: [
      {
        visible: true,
        stdin: "100\n",
        expectedStdout: "300\n",
      },
      {
        visible: false,
        stdin: "1\n",
        expectedStdout: "3\n",
      },
      {
        visible: false,
        stdin: "2000\n",
        expectedStdout: "6000\n",
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
