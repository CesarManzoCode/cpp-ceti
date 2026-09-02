import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "arquitectura-del-proyecto",
  title: "Arquitectura: dominio, repositorio, XML y protocolo",
  description:
    "Define dependencias simples entre componentes para poder probar el dominio sin red, archivos ni interfaz gráfica.",
  estimatedMinutes: 19,
  xpReward: 70,
  steps: [
    {
      type: "theory",
      markdown: `# La integración funciona mejor cuando las piezas ya son independientes

Una estructura mínima para el proyecto:

\`\`\`text
UI / Socket
    ↓
ProcesadorComandos
    ↓
Inventario
    ↓
Repositorio<Bien>

Inventario ↔ XmlInventario
\`\`\`

La dirección importa:

- la UI no accede directamente al diccionario/lista;
- el socket no cambia stock;
- \`ProcesadorComandos\` valida el mensaje y llama al inventario;
- \`Inventario\` protege las reglas;
- \`Repositorio<T>\` resuelve almacenamiento en memoria;
- \`XmlInventario\` serializa/deserializa.

Esta separación permite que cpp-ceti evalúe casi todo el proyecto con consola. Después el laboratorio local conecta WinForms y sockets a las mismas clases.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;
class Entidad{public string Id{get;private set;}public Entidad(string id){Id=id;}}
class Bien:Entidad{public int Stock{get;private set;}public Bien(string id,int stock):base(id){Stock=stock;}public void Ajustar(int c){if(Stock+c<0)throw new ArgumentException("Stock insuficiente");Stock+=c;}}
class Repositorio<T> where T:Entidad
{
    private Dictionary<string,T> datos=new Dictionary<string,T>();
    public bool Agregar(T x){if(datos.ContainsKey(x.Id))return false;datos.Add(x.Id,x);return true;}
    public T Buscar(string id){T x;return datos.TryGetValue(id,out x)?x:null;}
}
class Inventario
{
    private Repositorio<Bien> repo=new Repositorio<Bien>();
    public bool Alta(string id,int stock){return repo.Agregar(new Bien(id,stock));}
    public Bien Buscar(string id){return repo.Buscar(id);}
}`,
      explanation:
        "`Inventario` no expone el diccionario. Un futuro procesador de red sólo llama métodos públicos del servicio.",
      runnable: false,
      localOnlyNote:
        "Fragmento arquitectónico sin Main; la misma separación se ejercita en el reto siguiente.",
    },
    {
      type: "quiz",
      question:
        "¿dónde debería vivir la regla “el stock no puede quedar negativo”?",
      options: [
        "En `TcpListener`.",
        "En el botón de WinForms solamente.",
        "En la entidad/servicio de dominio para que todos los adaptadores respeten la misma regla.",
        "En el XML como comentario.",
      ],
      correctIndex: 2,
      explanation:
        "En la entidad/servicio de dominio para que todos los adaptadores respeten la misma regla.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Implementa un `Inventario` sobre `Dictionary<string,int>` privado con métodos `Alta`, `Ajustar`, `Consultar`.\n\nReglas:\n\n- `Alta(codigo,stock)` falla (`false`) si código existe o stock < 0;\n- `Ajustar(codigo,cambio)` falla si no existe o el nuevo stock sería negativo;\n- `Consultar` devuelve `int?` no es necesario: usa `bool Consultar(string codigo, out int stock)`.\n\nProcesa comandos `ALTA codigo stock`, `AJUSTAR codigo cambio`, `BUSCAR codigo`.\n\nRespuestas: `OK`, `ERROR`, o el stock para `BUSCAR`; si no existe, `NO`.",
        starterCode: `using System;
using System.Collections.Generic;
class Inventario { }
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Collections.Generic;
class Inventario
{
    private Dictionary<string,int> stock=new Dictionary<string,int>();
    public bool Alta(string c,int s){if(c.Length==0||s<0||stock.ContainsKey(c))return false;stock.Add(c,s);return true;}
    public bool Ajustar(string c,int cambio){if(!stock.ContainsKey(c)||stock[c]+cambio<0)return false;stock[c]+=cambio;return true;}
    public bool Consultar(string c,out int s){return stock.TryGetValue(c,out s);}
}
class Program
{
    static void Main()
    {
        int n=int.Parse(Console.ReadLine());Inventario inv=new Inventario();
        for(int i=0;i<n;i++)
        {
            string[] p=Console.ReadLine().Split(' ');
            if(p[0]=="ALTA")Console.WriteLine(inv.Alta(p[1],int.Parse(p[2]))?"OK":"ERROR");
            else if(p[0]=="AJUSTAR")Console.WriteLine(inv.Ajustar(p[1],int.Parse(p[2]))?"OK":"ERROR");
            else if(p[0]=="BUSCAR"){int s;Console.WriteLine(inv.Consultar(p[1],out s)?s.ToString():"NO");}
        }
    }
}`,
        hints: [
          "todas las reglas se concentran en `Inventario`",
          "`Program` sólo traduce entrada a llamadas",
          "no expongas el diccionario",
        ],
        difficulty: "hard",
        xpReward: 42,
        testCases: [
          {
            visible: true,
            stdin: "5\nALTA P1 5\nBUSCAR P1\nAJUSTAR P1 -2\nBUSCAR P1\nALTA P1 9\n",
            expectedStdout: "OK\n5\nOK\n3\nERROR\n",
          },
          {
            visible: false,
            stdin: "3\nALTA X -1\nBUSCAR X\nAJUSTAR X 2\n",
            expectedStdout: "ERROR\nNO\nERROR\n",
          },
          {
            visible: false,
            stdin: "4\nALTA A 0\nAJUSTAR A -1\nAJUSTAR A 7\nBUSCAR A\n",
            expectedStdout: "OK\nERROR\nOK\n7\n",
          },
        ],
      },
    },
  ],
});
