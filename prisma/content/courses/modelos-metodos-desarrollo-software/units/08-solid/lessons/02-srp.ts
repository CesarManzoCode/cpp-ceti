import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "srp",
  title: "SRP — Responsabilidad única",
  description: "Separa razones independientes de cambio.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `SRP no significa “una clase sólo puede tener un método”. Significa que una unidad debe agrupar responsabilidades que cambian por la misma razón.

Si \`Ticket\` conoce reglas de estado, formato de reporte y persistencia, tres decisiones independientes están acopladas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Ticket", right: "Reglas/invariantes del dominio" },
        { left: "Repositorio", right: "Persistencia" },
        { left: "Formateador", right: "Presentación de texto" },
        { left: "Notificador", right: "Entrega de mensajes" },
      ],
      explanation: "Separa razones de cambio.",
    },
    {
      type: "quiz",
      question: "¿Cuál clase viola más claramente SRP?",
      options: [
        "Ticket con CambiarEstado",
        "Reporte que sólo formatea",
        "Ticket que valida, guarda archivo y manda correo",
        "Repositorio que guarda/carga",
      ],
      correctIndex: 2,
      explanation: "Tiene razones de cambio independientes.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Separa cálculo de descuento y formato. `Calculadora.Descuento(int total,int porcentaje)` y `Formato.Texto(int total)`.",
        starterCode: `using System; // crea Calculadora, Formato y Program`,
        solutionCode: `using System; class Calculadora{public int Descuento(int total,int p){return total-total*p/100;}}class Formato{public string Texto(int total){return "TOTAL:"+total;}}class Program{static void Main(){int t=int.Parse(Console.ReadLine());int p=int.Parse(Console.ReadLine());Calculadora c=new Calculadora();Formato f=new Formato();Console.WriteLine(f.Texto(c.Descuento(t,p)));}}`,
        difficulty: "medium",
        xpReward: 30,
        structure: {
          classes: [
            { name: "Calculadora", methods: [{ name: "Descuento" }] },
            { name: "Formato", methods: [{ name: "Texto" }] },
          ],
        },
        testCases: [
          {
            stdin: "1000\n10\n",
            expectedStdout: "TOTAL:900\n",
            visible: true,
            description: "Normal",
          },
          {
            stdin: "500\n0\n",
            expectedStdout: "TOTAL:500\n",
            visible: false,
            description: "Sin descuento",
          },
        ],
      },
    },
  ],
});
