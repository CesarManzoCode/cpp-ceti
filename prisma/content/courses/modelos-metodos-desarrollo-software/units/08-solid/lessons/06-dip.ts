import { defineLesson } from "../../../../../authoring";

export const leccion06 = defineLesson({
  slug: "dip",
  title: "DIP — Inversión de dependencias",
  description: "Haz que la política dependa de contratos, no de detalles rígidos.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Si \`ServicioTickets\` construye directamente \`ArchivoXml\`, su lógica queda unida a un detalle concreto. DIP hace que política de alto nivel dependa de una abstracción que también cumple el detalle.

Esto permite probar con un sustituto simple y cambiar persistencia sin reescribir reglas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "ServicioTickets", right: "Política de alto nivel" },
        { left: "IRepositorio", right: "Abstracción" },
        { left: "RepositorioMemoria", right: "Detalle sustituible" },
        { left: "RepositorioArchivo", right: "Otro detalle" },
      ],
      explanation: "La dirección de dependencia apunta al contrato.",
    },
    {
      type: "quiz",
      question: "¿Qué beneficio directo ofrece DIP en pruebas?",
      options: [
        "No requiere asserts",
        "Permite sustituir dependencias externas por implementaciones controladas",
        "Elimina constructores",
        "Evita Git",
      ],
      correctIndex: 1,
      explanation: "La política puede probarse sin infraestructura real.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Define `IContador` con `Siguiente()`. `ContadorMemoria` implementa. `ServicioFolio` recibe IContador por constructor y devuelve `T-<n>`.",
        starterCode: `using System; // define IContador, ContadorMemoria, ServicioFolio y Program`,
        solutionCode: `using System; interface IContador{int Siguiente();}class ContadorMemoria:IContador{private int n;public ContadorMemoria(int inicio){n=inicio;}public int Siguiente(){return n++;}}class ServicioFolio{private IContador contador;public ServicioFolio(IContador c){contador=c;}public string Nuevo(){return "T-"+contador.Siguiente();}}class Program{static void Main(){int i=int.Parse(Console.ReadLine());ServicioFolio s=new ServicioFolio(new ContadorMemoria(i));Console.WriteLine(s.Nuevo());Console.WriteLine(s.Nuevo());}}`,
        difficulty: "medium",
        xpReward: 35,
        structure: {
          classes: [
            { name: "ServicioFolio", stores: [{ type: "IContador" }], constructors: [{ paramCount: 1 }] },
          ],
        },
        testCases: [
          {
            stdin: "10\n",
            expectedStdout: "T-10\nT-11\n",
            visible: true,
            description: "Inyección",
          },
          {
            stdin: "1\n",
            expectedStdout: "T-1\nT-2\n",
            visible: false,
            description: "Variable",
          },
        ],
      },
    },
  ],
});
