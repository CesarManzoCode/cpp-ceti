import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "isp",
  title: "ISP — Segregación de interfaces",
  description: "Da a cada consumidor sólo las operaciones que necesita.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una interfaz enorme obliga a implementadores a depender de métodos irrelevantes. ISP prefiere contratos pequeños y cohesionados según necesidades de consumidores.

No significa “una interfaz por método”; significa no obligar a un tipo a prometer capacidades que no tiene sentido cumplir.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "ILector con Leer", right: "Contrato de lectura" },
        { left: "IEscritor con Escribir", right: "Contrato de escritura" },
        { left: "Dispositivo sólo lectura obligado a Escribir", right: "Interfaz demasiado amplia" },
      ],
      explanation: "Segrega por capacidad real.",
    },
    {
      type: "quiz",
      question: "¿Qué síntoma apunta a ISP?",
      options: [
        "Implementaciones con métodos que lanzan NotSupportedException por obligación",
        "Clase con constructor",
        "Uso de private",
        "Dos tests",
      ],
      correctIndex: 0,
      explanation: "El contrato exige capacidades que el tipo no puede cumplir honestamente.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Declara `ILector` con `Leer()` y `IEscritor` con `Escribir(string)`. `Memoria` implementa ambas. Main escribe y luego lee.",
        starterCode: `using System; // define interfaces, Memoria, Program`,
        solutionCode: `using System; interface ILector{string Leer();}interface IEscritor{void Escribir(string texto);}class Memoria:ILector,IEscritor{private string valor="";public string Leer(){return valor;}public void Escribir(string texto){valor=texto;}}class Program{static void Main(){Memoria m=new Memoria();m.Escribir(Console.ReadLine());Console.WriteLine(m.Leer());}}`,
        difficulty: "medium",
        xpReward: 30,
        testCases: [
          {
            stdin: "hola\n",
            expectedStdout: "hola\n",
            visible: true,
            description: "Ambas capacidades",
          },
          {
            stdin: "abc\n",
            expectedStdout: "abc\n",
            visible: false,
            description: "Variable",
          },
        ],
      },
    },
  ],
});
