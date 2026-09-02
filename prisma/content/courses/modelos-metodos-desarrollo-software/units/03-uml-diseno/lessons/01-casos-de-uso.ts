import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "casos-de-uso",
  title: "Actores, objetivos y casos de uso",
  description: "Modela objetivos del usuario sin convertir cada clic en caso de uso.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un actor interactúa con el sistema para lograr un resultado con valor. "Presionar Guardar" es demasiado bajo nivel; "Registrar solicitud" expresa una meta.

El caso de uso conecta requisitos y diseño: deja visibles actor, precondición, flujo principal, alternativas y resultado.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Empleado", right: "Registrar solicitud" },
        { left: "Técnico", right: "Atender solicitud" },
        { left: "Administrador", right: "Gestionar catálogo" },
        { left: "Sistema de correo", right: "Actor externo si intercambia notificaciones" },
      ],
      explanation: "Actor se define por interacción y objetivo.",
    },
    {
      type: "quiz",
      question: "¿Cuál es un caso de uso mejor nombrado?",
      options: ["Botón azul", "Hacer clic", "Registrar solicitud de soporte", "Textbox descripción"],
      correctIndex: 2,
      explanation: "El nombre expresa una meta, no un detalle de UI.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Crea `Solicitud` con propiedades públicas Folio y Descripcion de setter privado, constructor de dos parámetros. Lee ambos datos e imprime `folio|descripcion`.",
        starterCode: `using System;
// escribe Solicitud
class Program
{
    static void Main()
    {
        string folio=Console.ReadLine();
        string descripcion=Console.ReadLine();
        // crea e imprime
    }
}`,
        solutionCode: `using System;
class Solicitud
{
    public string Folio { get; private set; }
    public string Descripcion { get; private set; }
    public Solicitud(string folio,string descripcion){Folio=folio;Descripcion=descripcion;}
}
class Program
{
    static void Main()
    {
        Solicitud s=new Solicitud(Console.ReadLine(),Console.ReadLine());
        Console.WriteLine(s.Folio+"|"+s.Descripcion);
    }
}`,
        difficulty: "easy",
        xpReward: 25,
        structure: {
          classes: [
            {
              name: "Solicitud",
              properties: [
                { name: "Folio", type: "string", visibility: "public" },
                { name: "Descripcion", type: "string", visibility: "public" },
              ],
              constructors: [{ paramCount: 2 }],
            },
          ],
        },
        testCases: [
          {
            visible: true,
            stdin: "T-10\nSin red\n",
            expectedStdout: "T-10|Sin red\n",
            description: "Caso normal",
          },
          {
            visible: false,
            stdin: "A1\nPantalla azul\n",
            expectedStdout: "A1|Pantalla azul\n",
            description: "Texto variable",
          },
        ],
      },
    },
  ],
});
