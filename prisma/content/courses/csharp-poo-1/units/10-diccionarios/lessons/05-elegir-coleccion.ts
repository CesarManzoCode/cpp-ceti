import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "elegir-coleccion",
  title: "Elegir la colección correcta",
  description:
    "Selecciona lista, pila, cola o diccionario según las operaciones dominantes en lugar de usar siempre la misma estructura.",
  estimatedMinutes: 16,
  xpReward: 55,
  steps: [
    {
      type: "theory",
      markdown: `# La estructura expresa qué operaciones importan

No existe una colección “mejor” en abstracto.

- \`List<T>\`: secuencia general; recorres, accedes por índice y mantienes orden de inserción.
- \`Stack<T>\`: el elemento más reciente debe salir primero.
- \`Queue<T>\`: el elemento más antiguo debe salir primero.
- \`Dictionary<TKey,TValue>\`: la operación dominante es localizar por una clave estable.

Antes de escribir código pregunta: **¿cómo se identifica un elemento y en qué orden debe salir?** Esa respuesta suele indicar la estructura.

También puedes combinar estructuras. Un sistema de soporte puede usar un diccionario para localizar tickets por folio y una cola para decidir cuál atender después.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Historial de deshacer", right: "`Stack<Accion>`" },
        { left: "Turnos de ventanilla", right: "`Queue<Turno>`" },
        { left: "Productos localizados por SKU", right: "`Dictionary<string,Producto>`" },
        { left: "Secuencia editable de materias", right: "`List<Materia>`" },
      ],
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;
class Ticket
{
    public int Folio { get; private set; }
    public string Asunto { get; private set; }
    public Ticket(int folio, string asunto) { Folio = folio; Asunto = asunto; }
}
class Program
{
    static void Main()
    {
        Dictionary<int, Ticket> porFolio = new Dictionary<int, Ticket>();
        Queue<int> pendientes = new Queue<int>();

        Ticket t = new Ticket(101, "Sin red");
        porFolio.Add(t.Folio, t);
        pendientes.Enqueue(t.Folio);

        int siguiente = pendientes.Dequeue();
        Console.WriteLine(porFolio[siguiente].Asunto);
    }
}`,
      explanation:
        "el diccionario resuelve “qué ticket es” y la cola resuelve “cuál sigue”. Dos preguntas distintas justifican dos estructuras.",
      runnable: true,
      expectedOutput: `Sin red`,
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Modela pedidos con dos estructuras:\n\n- `Dictionary<string,int>` guarda `folio → piezas`;\n- `Queue<string>` guarda el orden de atención.\n\nLee `n` pedidos (`folio` y `piezas`, una línea por dato). Después atiéndelos todos en orden FIFO e imprime `FOLIO: PIEZAS`.",
        starterCode: `using System;
using System.Collections.Generic;
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Collections.Generic;
class Program
{
    static void Main()
    {
        int n = int.Parse(Console.ReadLine());
        Dictionary<string, int> porFolio = new Dictionary<string, int>();
        Queue<string> orden = new Queue<string>();
        for (int i = 0; i < n; i++)
        {
            string folio = Console.ReadLine();
            int piezas = int.Parse(Console.ReadLine());
            porFolio.Add(folio, piezas);
            orden.Enqueue(folio);
        }
        while (orden.Count > 0)
        {
            string folio = orden.Dequeue();
            Console.WriteLine(folio + ": " + porFolio[folio]);
        }
    }
}`,
        hints: [
          "guarda la misma clave en la cola",
          "la cola determina orden, el diccionario recupera datos",
          "no recorras el diccionario para decidir qué sigue",
        ],
        difficulty: "medium",
        xpReward: 32,
        testCases: [
          {
            visible: true,
            stdin: "2\nF1\n3\nF2\n7\n",
            expectedStdout: "F1: 3\nF2: 7\n",
          },
          {
            visible: false,
            stdin: "1\nX9\n0\n",
            expectedStdout: "X9: 0\n",
          },
          {
            visible: false,
            stdin: "3\nA\n2\nC\n1\nB\n9\n",
            expectedStdout: "A: 2\nC: 1\nB: 9\n",
          },
        ],
      },
    },
  ],
});
