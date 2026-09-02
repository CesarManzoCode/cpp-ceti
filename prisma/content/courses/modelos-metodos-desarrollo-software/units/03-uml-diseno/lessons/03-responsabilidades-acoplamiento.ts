import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "responsabilidades-acoplamiento",
  title: "Responsabilidades, cohesión y dependencias",
  description: "Evita objetos que concentran responsabilidades no relacionadas.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Si \`Ticket\` valida reglas, guarda XML, imprime reportes, manda correo y dibuja formularios, cualquier cambio toca la misma clase.

La **cohesión** mejora cuando una clase agrupa comportamiento del mismo propósito. El acoplamiento es riesgoso cuando una pieza conoce detalles que no necesita.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Ticket", right: "Estado e invariantes" },
        { left: "RepositorioTickets", right: "Cargar/guardar" },
        { left: "Notificador", right: "Enviar notificaciones" },
        { left: "ReporteTickets", right: "Preparar reportes" },
      ],
      explanation: "Separar por responsabilidad prepara el terreno para SOLID.",
    },
    {
      type: "quiz",
      question: "¿Qué cambio NO debería obligar a editar Ticket?",
      options: [
        "Regla de transición",
        "Invariante de descripción",
        "Cambiar persistencia XML por otro medio",
        "Prohibir doble cierre",
      ],
      correctIndex: 2,
      explanation: "Persistencia es responsabilidad diferente del dominio.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Separa cálculo y presentación: `CalculadoraCosto.Calcular(int horas)` devuelve horas*50; `FormatoCosto.Texto(int total)` devuelve `TOTAL:N`. Main usa ambas.",
        starterCode: `using System;
// escribe las dos clases
class Program { static void Main(){ int h=int.Parse(Console.ReadLine()); /* completa */ } }`,
        solutionCode: `using System;
class CalculadoraCosto { public int Calcular(int horas){return horas*50;} }
class FormatoCosto { public string Texto(int total){return "TOTAL:"+total;} }
class Program { static void Main(){ int h=int.Parse(Console.ReadLine()); CalculadoraCosto c=new CalculadoraCosto(); FormatoCosto f=new FormatoCosto(); Console.WriteLine(f.Texto(c.Calcular(h))); } }`,
        difficulty: "medium",
        xpReward: 30,
        structure: {
          classes: [
            { name: "CalculadoraCosto", methods: [{ name: "Calcular" }] },
            { name: "FormatoCosto", methods: [{ name: "Texto" }] },
          ],
        },
        testCases: [
          {
            visible: true,
            stdin: "2\n",
            expectedStdout: "TOTAL:100\n",
            description: "Normal",
          },
          {
            visible: false,
            stdin: "0\n",
            expectedStdout: "TOTAL:0\n",
            description: "Cero",
          },
          {
            visible: false,
            stdin: "7\n",
            expectedStdout: "TOTAL:350\n",
            description: "Variable",
          },
        ],
      },
    },
  ],
});
