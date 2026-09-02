import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "uml-trazable",
  title: "Del requisito al diagrama de clases",
  description: "Justifica cada clase y relación por una responsabilidad del problema.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un diagrama útil permite preguntar: "¿qué requisito justifica esta responsabilidad?". No diseñes una clase por cada sustantivo. Identifica comportamiento, invariantes y propiedad de datos; luego decide estructura.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Ticket conoce al técnico asignado", right: "Asociación almacenada" },
        { left: "Ticket posee entradas de historial", right: "Composición conceptual" },
        { left: "Servicio recibe Ticket sólo para operar", right: "Dependencia" },
        { left: "TicketUrgente sustituye legítimamente Ticket", right: "Posible generalización" },
      ],
      explanation: "La relación depende del significado/ciclo de vida.",
    },
    {
      type: "quiz",
      question: "¿Qué pregunta mejora más un diagrama?",
      options: [
        "¿Tiene suficientes cajas?",
        "¿Cada responsabilidad/relación responde a requisito o invariante?",
        "¿Todo hereda?",
        "¿Tiene colores?",
      ],
      correctIndex: 1,
      explanation: "El modelo es una decisión trazable.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Implementa `Tecnico` y `Ticket`; Ticket almacena al técnico asignado y Main imprime `Folio|NombreTecnico`.",
        starterCode: `using System;
class Tecnico { public string Nombre { get; private set; } public Tecnico(string n){Nombre=n;} }
// escribe Ticket
class Program { static void Main(){ string f=Console.ReadLine(); string n=Console.ReadLine(); Tecnico t=new Tecnico(n); /* completa */ } }`,
        solutionCode: `using System;
class Tecnico { public string Nombre { get; private set; } public Tecnico(string n){Nombre=n;} }
class Ticket { public string Folio { get; private set; } public Tecnico Asignado { get; private set; } public Ticket(string f,Tecnico t){Folio=f;Asignado=t;} }
class Program { static void Main(){ string f=Console.ReadLine(); string n=Console.ReadLine(); Tecnico t=new Tecnico(n); Ticket x=new Ticket(f,t); Console.WriteLine(x.Folio+"|"+x.Asignado.Nombre); } }`,
        difficulty: "medium",
        xpReward: 30,
        structure: {
          classes: [
            {
              name: "Ticket",
              properties: [
                { name: "Folio", type: "string" },
                { name: "Asignado", type: "Tecnico" },
              ],
              stores: [{ type: "Tecnico" }],
            },
          ],
        },
        testCases: [
          {
            visible: true,
            stdin: "T1\nAna\n",
            expectedStdout: "T1|Ana\n",
            description: "Relación",
          },
          {
            visible: false,
            stdin: "X9\nLuis\n",
            expectedStdout: "X9|Luis\n",
            description: "Valores variables",
          },
        ],
      },
    },
  ],
});
