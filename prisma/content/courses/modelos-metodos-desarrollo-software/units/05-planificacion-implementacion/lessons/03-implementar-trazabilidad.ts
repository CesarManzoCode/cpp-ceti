import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "implementar-trazabilidad",
  title: "Implementar contra requisitos y diseño",
  description: "Evitar reinterpretación silenciosa durante implementación.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Durante implementación aparecen detalles no especificados. Si cambian comportamiento observable, no deben decidirse silenciosamente dentro del código: se aclara requisito o se registra decisión.

Trazabilidad mínima permite revisar una feature desde requisito hasta commit y pruebas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "REQ-07 no cerrar sin técnico", right: "Regla" },
        { left: "Ticket.PuedeCerrar", right: "Implementación" },
        { left: "test sin técnico→NO", right: "Evidencia" },
        { left: "commit asociado", right: "Historial" },
      ],
      explanation: "Cada nivel responde una pregunta diferente.",
    },
    {
      type: "quiz",
      question: "Detectas dos interpretaciones válidas del requisito con resultados distintos. ¿Qué haces?",
      options: [
        "Elegir menos código",
        "Hacer ambas",
        "Aclarar/registrar y luego implementar",
        "Ocultar en comentario",
      ],
      correctIndex: 2,
      explanation: "Implementación no debe resolver ambigüedad de negocio silenciosamente.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Ticket inicia ABIERTO. `CambiarEstado` permite ABIERTO→EN_PROCESO y EN_PROCESO→CERRADO; inválida no cambia y devuelve false.",
        starterCode: `using System;
class Ticket
{
    public string Estado { get; private set; }
    public Ticket() { Estado = "ABIERTO"; }
    public bool CambiarEstado(string nuevo)
    {
        return false;
    }
}
class Program
{
    static void Main()
    {
        Ticket t = new Ticket();
        string a = Console.ReadLine();
        string b = Console.ReadLine();
        Console.WriteLine(t.CambiarEstado(a) ? t.Estado : "INVALIDA");
        Console.WriteLine(t.CambiarEstado(b) ? t.Estado : "INVALIDA");
    }
}`,
        solutionCode: `using System;
class Ticket
{
    public string Estado { get; private set; }
    public Ticket() { Estado = "ABIERTO"; }
    public bool CambiarEstado(string nuevo)
    {
        bool ok = (Estado == "ABIERTO" && nuevo == "EN_PROCESO") || (Estado == "EN_PROCESO" && nuevo == "CERRADO");
        if (ok) Estado = nuevo;
        return ok;
    }
}
class Program
{
    static void Main()
    {
        Ticket t = new Ticket();
        string a = Console.ReadLine();
        string b = Console.ReadLine();
        Console.WriteLine(t.CambiarEstado(a) ? t.Estado : "INVALIDA");
        Console.WriteLine(t.CambiarEstado(b) ? t.Estado : "INVALIDA");
    }
}`,
        difficulty: "medium",
        xpReward: 35,
        structure: {
          classes: [
            {
              name: "Ticket",
              properties: [{ name: "Estado", type: "string", visibility: "public" }],
              methods: [{ name: "CambiarEstado", visibility: "public", paramCount: 1 }],
            },
          ],
        },
        testCases: [
          {
            visible: true,
            stdin: "EN_PROCESO\nCERRADO\n",
            expectedStdout: "EN_PROCESO\nCERRADO\n",
            description: "Camino válido",
          },
          {
            visible: false,
            stdin: "CERRADO\nEN_PROCESO\n",
            expectedStdout: "INVALIDA\nEN_PROCESO\n",
            description: "Primer cambio inválido",
          },
        ],
      },
    },
  ],
});
