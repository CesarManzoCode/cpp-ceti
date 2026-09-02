import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "lsp",
  title: "LSP — Sustitución de Liskov",
  description: "Exige que una derivada respete las expectativas del contrato base.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Si \`B\` es subtipo de \`A\`, un consumidor de \`A\` debería poder usar \`B\` sin descubrir sorpresas que contradicen el contrato de \`A\`.

LSP no se prueba sólo con \`class B : A\`; se prueba con comportamiento: precondiciones no más estrictas, postcondiciones compatibles e invariantes preservadas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Derivada lanza donde base promete aceptar", right: "Viola sustitución" },
        { left: "Derivada produce resultado compatible", right: "Sustituible" },
        { left: "Herencia sólo para reutilizar campos", right: "Motivo insuficiente" },
      ],
      explanation: "La semántica importa más que la sintaxis.",
    },
    {
      type: "quiz",
      question: "Base `Procesar` acepta cualquier cantidad >=0. Derivada rechaza 0. ¿Qué riesgo hay?",
      options: [
        "Ninguno",
        "La derivada fortalece precondición y puede romper consumidores",
        "Sólo rendimiento",
        "Git",
      ],
      correctIndex: 1,
      explanation: "Un consumidor válido para la base deja de ser válido para la derivada.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "`Tarifa` define virtual `Calcular(int horas)` para horas>=0. `TarifaPremium` override mantiene 0→0 y cobra 80 por hora; base cobra 100 por hora. Main usa referencia base.",
        starterCode: `using System; class Tarifa{public virtual int Calcular(int h){return h*100;}} // crea TarifaPremium y Program`,
        solutionCode: `using System; class Tarifa{public virtual int Calcular(int h){return h*100;}}class TarifaPremium:Tarifa{public override int Calcular(int h){return h*80;}}class Program{static void Main(){string tipo=Console.ReadLine();int h=int.Parse(Console.ReadLine());Tarifa t=tipo=="PREMIUM"?(Tarifa)new TarifaPremium():new Tarifa();Console.WriteLine(t.Calcular(h));}}`,
        difficulty: "medium",
        xpReward: 35,
        structure: {
          classes: [
            { name: "TarifaPremium", extends: "Tarifa", methods: [{ name: "Calcular", override: true }] },
          ],
        },
        testCases: [
          {
            stdin: "NORMAL\n2\n",
            expectedStdout: "200\n",
            visible: true,
            description: "Base",
          },
          {
            stdin: "PREMIUM\n2\n",
            expectedStdout: "160\n",
            visible: false,
            description: "Derivada",
          },
          {
            stdin: "PREMIUM\n0\n",
            expectedStdout: "0\n",
            visible: false,
            description: "Contrato",
          },
        ],
      },
    },
  ],
});
