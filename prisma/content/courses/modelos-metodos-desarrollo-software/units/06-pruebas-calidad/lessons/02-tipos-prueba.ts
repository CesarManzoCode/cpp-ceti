import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "tipos-prueba",
  title: "Tipos de pruebas",
  description: "Elige unidad, integración, sistema o aceptación según la pregunta.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una prueba unitaria aísla una pieza. Integración verifica colaboración entre piezas. Sistema observa el producto integrado. Aceptación compara la entrega con criterios acordados.

Cuanto más pequeña sea la prueba que reproduce correctamente el defecto, más fácil suele ser diagnosticarlo.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Prioridad.Calcular aislada", right: "Unitaria" },
        { left: "Servicio + repositorio", right: "Integración" },
        { left: "Registrar/asignar/cerrar completo", right: "Sistema" },
        { left: "REQ-12 contra criterio del cliente", right: "Aceptación" },
      ],
      explanation: "El nivel depende de cuántas fronteras necesitas comprobar.",
    },
    {
      type: "quiz",
      question:
        "Falla al guardar aunque `Ticket.Validar()` pasa aislado. ¿Dónde buscar primero?",
      options: [
        "Sólo Ticket",
        "Integración servicio/repositorio/persistencia",
        "Colores UI",
        "Mensaje commit",
      ],
      correctIndex: 1,
      explanation: "El síntoma aparece al cruzar componentes.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "`ClasificarNota`: 0..59 REPROBADO, 60..79 SUFICIENTE, 80..100 ALTO, fuera INVALIDA.",
        starterCode: `using System; class Program{static string Clasificar(int n){return "";}static void Main(){Console.WriteLine(Clasificar(int.Parse(Console.ReadLine())));}}`,
        solutionCode: `using System; class Program{static string Clasificar(int n){if(n<0||n>100)return "INVALIDA";if(n<60)return "REPROBADO";if(n<80)return "SUFICIENTE";return "ALTO";}static void Main(){Console.WriteLine(Clasificar(int.Parse(Console.ReadLine())));}}`,
        difficulty: "medium",
        xpReward: 30,
        testCases: [
          {
            stdin: "59\n",
            expectedStdout: "REPROBADO\n",
            visible: true,
            description: "Borde",
          },
          {
            stdin: "60\n",
            expectedStdout: "SUFICIENTE\n",
            visible: false,
            description: "Borde",
          },
          {
            stdin: "80\n",
            expectedStdout: "ALTO\n",
            visible: false,
            description: "Borde",
          },
          {
            stdin: "101\n",
            expectedStdout: "INVALIDA\n",
            visible: false,
            description: "Fuera",
          },
        ],
      },
    },
  ],
});
