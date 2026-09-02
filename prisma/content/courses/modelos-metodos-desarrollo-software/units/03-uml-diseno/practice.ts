import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "mm-diseno-ticket-asignado",
    title: "Ticket asignado",
    description: "Modela una relación almacenada.",
    prompt: "Lee folio y técnico; crea Tecnico y Ticket; imprime folio|tecnico.",
    starterCode: `using System; class Tecnico{public string Nombre{get;private set;} public Tecnico(string n){Nombre=n;}} // completa`,
    solutionCode: `using System; class Tecnico{public string Nombre{get;private set;} public Tecnico(string n){Nombre=n;}} class Ticket{public string Folio{get;private set;} public Tecnico Asignado{get;private set;} public Ticket(string f,Tecnico t){Folio=f;Asignado=t;}} class Program{static void Main(){Ticket x=new Ticket(Console.ReadLine(),new Tecnico(Console.ReadLine()));Console.WriteLine(x.Folio+"|"+x.Asignado.Nombre);}}`,
    difficulty: "medium",
    xpReward: 28,
    structure: {
      classes: [{ name: "Ticket", stores: [{ type: "Tecnico" }] }],
    },
    testCases: [
      { stdin: "F1\nAna\n", expectedStdout: "F1|Ana\n", visible: true, description: "Normal" },
      { stdin: "Z7\nBeto\n", expectedStdout: "Z7|Beto\n", visible: false, description: "Variable" },
    ],
  },
  {
    slug: "mm-diseno-separar-reporte",
    title: "Cálculo y formato",
    description: "Separa responsabilidades.",
    prompt: "Lee cantidad y precio. Calculadora calcula subtotal; Formateador devuelve `SUBTOTAL:N`.",
    starterCode: `using System; // crea Calculadora y Formateador`,
    solutionCode: `using System; class Calculadora{public int Subtotal(int c,int p){return c*p;}} class Formateador{public string Texto(int n){return "SUBTOTAL:"+n;}} class Program{static void Main(){int c=int.Parse(Console.ReadLine());int p=int.Parse(Console.ReadLine());Calculadora x=new Calculadora();Formateador f=new Formateador();Console.WriteLine(f.Texto(x.Subtotal(c,p)));}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      { stdin: "3\n20\n", expectedStdout: "SUBTOTAL:60\n", visible: true, description: "Normal" },
      { stdin: "0\n99\n", expectedStdout: "SUBTOTAL:0\n", visible: false, description: "Cero" },
    ],
  },
  {
    slug: "mm-diseno-historial",
    title: "Historial de estados",
    description: "Modela propiedad de datos.",
    prompt:
      "Ticket recibe tres estados en secuencia y los guarda en un arreglo interno de tamaño 3; imprime en orden.",
    starterCode: `using System; // crea Ticket con historial`,
    solutionCode: `using System; class Ticket{private string[] historial=new string[3]; private int n=0; public void Agregar(string e){historial[n++]=e;} public void Mostrar(){for(int i=0;i<n;i++)Console.WriteLine(historial[i]);}} class Program{static void Main(){Ticket t=new Ticket();t.Agregar(Console.ReadLine());t.Agregar(Console.ReadLine());t.Agregar(Console.ReadLine());t.Mostrar();}}`,
    difficulty: "medium",
    xpReward: 28,
    testCases: [
      {
        stdin: "ABIERTO\nEN_PROCESO\nCERRADO\n",
        expectedStdout: "ABIERTO\nEN_PROCESO\nCERRADO\n",
        visible: true,
        description: "Orden",
      },
      { stdin: "A\nB\nC\n", expectedStdout: "A\nB\nC\n", visible: false, description: "General" },
    ],
  },
  {
    slug: "mm-diseno-dependencia",
    title: "Dependencia sin almacenamiento",
    description: "Distingue usar un objeto de guardarlo.",
    prompt:
      "ServicioCierre recibe Ticket por parámetro en `Cerrar(Ticket)` y cambia su estado; NO guarda Ticket como campo.",
    starterCode: `using System; class Ticket{public string Estado{get;set;}} // crea ServicioCierre y Program`,
    solutionCode: `using System; class Ticket{public string Estado{get;set;}} class ServicioCierre{public void Cerrar(Ticket t){t.Estado="CERRADO";}} class Program{static void Main(){Ticket t=new Ticket();t.Estado=Console.ReadLine();new ServicioCierre().Cerrar(t);Console.WriteLine(t.Estado);}}`,
    difficulty: "medium",
    xpReward: 28,
    structure: {
      classes: [
        {
          name: "ServicioCierre",
          methods: [{ name: "Cerrar", paramCount: 1 }],
          notStores: [{ type: "Ticket" }],
        },
      ],
    },
    testCases: [
      { stdin: "ABIERTO\n", expectedStdout: "CERRADO\n", visible: true, description: "Dependencia" },
      { stdin: "EN_PROCESO\n", expectedStdout: "CERRADO\n", visible: false, description: "Variable" },
    ],
  },
] satisfies PracticeExerciseDefinition[];
