import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "ocp",
  title: "OCP — Abierto a extensión, cerrado a modificación",
  description: "Agrega variantes sin reescribir lógica estable.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `OCP busca que una nueva variante pueda añadirse extendiendo un contrato en vez de editar un bloque central lleno de condiciones. No significa “nunca modificar código”.

Tiene sentido cuando existe variación real y repetida; abstraer una única posibilidad futura imaginaria puede empeorar el diseño.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Nuevo tipo de descuento obliga a editar if central", right: "Señal para OCP" },
        { left: "Regla nunca cambia y es simple", right: "No abstraer por deporte" },
        { left: "Variantes comparten contrato Calcular", right: "Extensión controlada" },
      ],
      explanation: "OCP responde a ejes reales de variación.",
    },
    {
      type: "quiz",
      question: "¿Cuándo es razonable introducir una abstracción para OCP?",
      options: [
        "Siempre antes de saber variantes",
        "Cuando existe un eje real de variantes/cambios repetidos",
        "Para tener más archivos",
        "Para evitar tests",
      ],
      correctIndex: 1,
      explanation: "La abstracción debe pagar un coste real.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Crea `abstract class Descuento` con `Aplicar(int total)` y dos derivadas `SinDescuento` y `DiezPorCiento`. Main lee `NINGUNO` o `DIEZ` y total.",
        starterCode: `using System; // crea jerarquía y Program`,
        solutionCode: `using System; abstract class Descuento{public abstract int Aplicar(int total);}class SinDescuento:Descuento{public override int Aplicar(int total){return total;}}class DiezPorCiento:Descuento{public override int Aplicar(int total){return total*90/100;}}class Program{static void Main(){string tipo=Console.ReadLine();int total=int.Parse(Console.ReadLine());Descuento d=tipo=="DIEZ"?(Descuento)new DiezPorCiento():new SinDescuento();Console.WriteLine(d.Aplicar(total));}}`,
        difficulty: "medium",
        xpReward: 35,
        structure: {
          classes: [
            { name: "Descuento", abstract: true, methods: [{ name: "Aplicar", abstract: true }] },
            { name: "SinDescuento", extends: "Descuento", methods: [{ name: "Aplicar", override: true }] },
            { name: "DiezPorCiento", extends: "Descuento", methods: [{ name: "Aplicar", override: true }] },
          ],
        },
        testCases: [
          {
            stdin: "NINGUNO\n1000\n",
            expectedStdout: "1000\n",
            visible: true,
            description: "Base",
          },
          {
            stdin: "DIEZ\n1000\n",
            expectedStdout: "900\n",
            visible: false,
            description: "Variante",
          },
        ],
      },
    },
  ],
});
