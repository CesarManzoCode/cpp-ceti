import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "arquitectura-dominio",
  title: "Arquitectura del dominio verificable",
  description: "Construye un núcleo de consola que luego pueda alimentar persistencia y GUI locales.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `El proyecto tendrá \`Ticket\`, \`Tecnico\`, un servicio de asignación/cierre y un repositorio abstracto. El dominio debe poder probarse sin Windows Forms ni almacenamiento real.

La interfaz gráfica local es un adaptador: no debe contener reglas que sólo existan dentro de eventos de botones.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Ticket", right: "Estado/invariantes" },
        { left: "ServicioTickets", right: "Casos de uso" },
        { left: "IRepositorioTickets", right: "Contrato de persistencia" },
        { left: "Windows Forms", right: "Interfaz local/adaptador" },
      ],
      explanation: "Las reglas viven donde pueden probarse.",
    },
    {
      type: "quiz",
      question: "¿Dónde debe vivir la regla “no cerrar sin técnico asignado”?",
      options: [
        "En el color del botón",
        "En dominio/servicio verificable",
        "Sólo en formulario",
        "En README",
      ],
      correctIndex: 1,
      explanation: "La UI puede prevenir, pero la regla debe protegerse en el núcleo.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Crea Ticket con Folio, Estado inicialmente ABIERTO, Tecnico opcional string. `Asignar` guarda técnico; `Cerrar` devuelve false si no hay técnico o ya está cerrado, si no cambia a CERRADO. Main lee folio, técnico (puede vacío), llama Asignar si no vacío, luego Cerrar e imprime `SI/NO|estado`.",
        starterCode: `using System; // crea Ticket y Program`,
        solutionCode: `using System; class Ticket{public string Folio{get;private set;}public string Estado{get;private set;}public string Tecnico{get;private set;}public Ticket(string f){Folio=f;Estado="ABIERTO";Tecnico="";}public void Asignar(string t){Tecnico=t;}public bool Cerrar(){if(Tecnico.Length==0||Estado=="CERRADO")return false;Estado="CERRADO";return true;}}class Program{static void Main(){Ticket t=new Ticket(Console.ReadLine());string tecnico=Console.ReadLine();if(tecnico.Length>0)t.Asignar(tecnico);Console.WriteLine((t.Cerrar()?"SI":"NO")+"|"+t.Estado);}}`,
        difficulty: "medium",
        xpReward: 35,
        structure: {
          classes: [
            {
              name: "Ticket",
              properties: [{ name: "Folio" }, { name: "Estado" }, { name: "Tecnico" }],
              methods: [{ name: "Asignar" }, { name: "Cerrar" }],
            },
          ],
        },
        testCases: [
          {
            stdin: "T1\nAna\n",
            expectedStdout: "SI|CERRADO\n",
            visible: true,
            description: "Asignado",
          },
          {
            stdin: "T2\n\n",
            expectedStdout: "NO|ABIERTO\n",
            visible: false,
            description: "Sin técnico",
          },
        ],
      },
    },
  ],
});
