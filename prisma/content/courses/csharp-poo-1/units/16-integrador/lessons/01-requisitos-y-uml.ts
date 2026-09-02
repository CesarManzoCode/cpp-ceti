import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "requisitos-y-uml",
  title: "Del problema al modelo y sus casos de uso",
  description:
    "Fija requisitos verificables y traduce sustantivos, operaciones y relaciones a un modelo orientado a objetos antes de integrar tecnología.",
  estimatedMinutes: 18,
  xpReward: 65,
  steps: [
    {
      type: "theory",
      markdown: `# El proyecto no empieza con un socket

El problema canónico será un inventario para una organización con áreas y bienes.

Requisitos mínimos:

- registrar áreas;
- registrar bienes con código, nombre y stock;
- consultar un bien por código;
- ajustar existencias;
- eliminar bienes;
- persistir/exportar información en XML;
- aceptar operaciones a través de un protocolo de mensajes;
- permitir que una tarea de procesamiento ocurra en un hilo sin corromper el inventario.

Antes de elegir clases separa **qué debe hacer el sistema** de **cómo lo implementará**.

Casos de uso mínimos: \`Registrar bien\`, \`Consultar bien\`, \`Ajustar stock\`, \`Eliminar bien\`, \`Guardar inventario\`, \`Atender solicitud remota\`.

Un modelo inicial razonable:

- \`Bien\`: entidad con identidad y estado;
- \`Area\`: agrupa bienes;
- \`Inventario\`: coordina operaciones;
- \`Repositorio<T>\`: mecánica reusable de almacenamiento;
- \`XmlInventario\`: transformación XML;
- \`ProcesadorComandos\`: protocolo de aplicación.

La red será un adaptador alrededor del procesador, no el lugar donde vive el negocio.`,
    },
    {
      type: "matching",
      pairs: [
        {
          left: "Bien",
          right: "Entidad del dominio con código, nombre y stock.",
        },
        {
          left: "Inventario",
          right: "Coordina reglas y operaciones sobre bienes.",
        },
        {
          left: "Repositorio<T>",
          right: "Almacenamiento reusable de entidades.",
        },
        {
          left: "XmlInventario",
          right: "Traducción entre objetos y XML.",
        },
        {
          left: "ProcesadorComandos",
          right: "Traduce mensajes del protocolo a operaciones del inventario.",
        },
        {
          left: "TcpClient/TcpListener",
          right: "Transporte local; no contiene reglas de stock.",
        },
      ],
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;

class Bien
{
    public string Codigo{get;private set;}
    public string Nombre{get;private set;}
    public int Stock{get;private set;}
    public Bien(string codigo,string nombre,int stock)
    {
        if(stock<0)throw new ArgumentException("Stock invalido");
        Codigo=codigo;Nombre=nombre;Stock=stock;
    }
    public void Ajustar(int cambio)
    {
        if(Stock+cambio<0)throw new ArgumentException("Stock insuficiente");
        Stock+=cambio;
    }
}

class Area
{
    public string Nombre{get;private set;}
    private List<Bien> bienes=new List<Bien>();
    public Area(string nombre){Nombre=nombre;}
    public void Agregar(Bien bien){bienes.Add(bien);}
}`,
      explanation:
        "el modelo expresa identidad, invariantes y relación de composición antes de introducir XML o sockets.",
      runnable: false,
      localOnlyNote:
        "Fragmento de modelo sin Main. Se usa para leer/dibujar UML y luego se integra en los retos ejecutables.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          'Implementa `Bien` con `Codigo`, `Nombre`, `Stock`, constructor que rechace stock negativo con `ArgumentException("Stock invalido")` y método `Ajustar(int cambio)` que rechace un resultado negativo con `ArgumentException("Stock insuficiente")`.\n\nLee código, nombre, stock inicial y cambio. Imprime `CODIGO NOMBRE STOCK` o `ERROR: mensaje`.',
        starterCode: `using System;
class Bien { }
class Program { static void Main() { } }`,
        solutionCode: `using System;
class Bien
{
    public string Codigo{get;private set;}
    public string Nombre{get;private set;}
    public int Stock{get;private set;}
    public Bien(string codigo,string nombre,int stock)
    {
        if(stock<0)throw new ArgumentException("Stock invalido");
        Codigo=codigo;Nombre=nombre;Stock=stock;
    }
    public void Ajustar(int cambio)
    {
        if(Stock+cambio<0)throw new ArgumentException("Stock insuficiente");
        Stock+=cambio;
    }
}
class Program
{
    static void Main()
    {
        try
        {
            Bien b=new Bien(Console.ReadLine(),Console.ReadLine(),int.Parse(Console.ReadLine()));
            b.Ajustar(int.Parse(Console.ReadLine()));
            Console.WriteLine(b.Codigo+" "+b.Nombre+" "+b.Stock);
        }
        catch(ArgumentException ex){Console.WriteLine("ERROR: "+ex.Message);}
    }
}`,
        hints: [
          "valida en el objeto",
          "no permitas que `Program` modifique Stock directamente",
          "el cambio puede ser negativo si el resultado sigue siendo válido",
        ],
        difficulty: "medium",
        xpReward: 34,
        structure: {
          classes: [
            {
              name: "Bien",
              properties: [
                { name: "Codigo", visibility: "public", type: "string" },
                { name: "Nombre", visibility: "public", type: "string" },
                { name: "Stock", visibility: "public", type: "int" },
              ],
              constructors: [{ paramCount: 3 }],
              methods: [
                { name: "Ajustar", visibility: "public", paramCount: 1 },
              ],
            },
          ],
        },
        testCases: [
          {
            visible: true,
            stdin: "P1\nMouse\n5\n3\n",
            expectedStdout: "P1 Mouse 8\n",
          },
          {
            visible: false,
            stdin: "X\nCable HDMI\n2\n-3\n",
            expectedStdout: "ERROR: Stock insuficiente\n",
          },
          {
            visible: false,
            stdin: "Z\nMonitor\n-1\n0\n",
            expectedStdout: "ERROR: Stock invalido\n",
          },
        ],
      },
    },
  ],
});
