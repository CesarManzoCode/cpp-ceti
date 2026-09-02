import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "buscar-objetos",
  title: "Buscar en datos ordenados",
  description:
    "Compara búsqueda lineal y binaria y entiende por qué la segunda exige el mismo criterio de orden.",
  estimatedMinutes: 17,
  xpReward: 60,
  steps: [
    {
      type: "theory",
      markdown: `# El orden puede ahorrar búsqueda

La búsqueda lineal revisa elementos uno por uno. Funciona aunque la colección esté desordenada y es suficiente para conjuntos pequeños.

Si los elementos están ordenados por la misma clave que buscas, puedes aplicar **búsqueda binaria**:

1. revisas el elemento central;
2. si la clave es menor, descartas la mitad derecha;
3. si es mayor, descartas la mitad izquierda;
4. repites hasta encontrar o vaciar el intervalo.

La condición crítica es el orden: una lista ordenada por precio no permite buscar código con binaria a menos que también esté ordenada por código.`,
    },
    {
      type: "code_example",
      code: `using System;
class Program
{
    static int Buscar(int[] valores,int objetivo)
    {
        int izquierda=0, derecha=valores.Length-1;
        while(izquierda<=derecha)
        {
            int medio=izquierda+(derecha-izquierda)/2;
            if(valores[medio]==objetivo)return medio;
            if(valores[medio]<objetivo)izquierda=medio+1;
            else derecha=medio-1;
        }
        return -1;
    }
    static void Main()
    {
        int[] datos={2,5,9,13,20};
        Console.WriteLine(Buscar(datos,13));
    }
}`,
      explanation:
        "cada comparación descarta aproximadamente la mitad restante; la función depende de que datos esté ascendente.",
      runnable: true,
      expectedOutput: "3",
    },
    {
      type: "quiz",
      question:
        "una lista de productos está ordenada por `Precio`. ¿Puedes buscar `Codigo` con búsqueda binaria directamente?",
      options: [
        "Sí, cualquier orden sirve.",
        "No; la binaria debe comparar con el mismo criterio que determina el orden.",
        "Sí, pero sólo si hay menos de diez productos.",
        "No, porque la búsqueda binaria sólo funciona con enteros.",
      ],
      correctIndex: 1,
      explanation:
        "la binaria debe comparar con el mismo criterio que determina el orden.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Recibes `n` códigos enteros **ya ordenados ascendentemente** y un código objetivo. Implementa búsqueda binaria sin usar métodos de búsqueda de biblioteca. Imprime el índice base 0 o `-1`.",
        starterCode: `using System;
class Program { static void Main() { } }`,
        solutionCode: `using System;
class Program
{
    static void Main()
    {
        int n=int.Parse(Console.ReadLine()); int[] codigos=new int[n];
        for(int i=0;i<n;i++)codigos[i]=int.Parse(Console.ReadLine());
        int objetivo=int.Parse(Console.ReadLine());
        int izq=0,der=n-1,resultado=-1;
        while(izq<=der)
        {
            int medio=izq+(der-izq)/2;
            if(codigos[medio]==objetivo){resultado=medio;break;}
            if(codigos[medio]<objetivo)izq=medio+1;
            else der=medio-1;
        }
        Console.WriteLine(resultado);
    }
}`,
        hints: [
          "conserva un intervalo [izq, der]",
          "calcula el medio en cada vuelta",
          "mueve sólo el límite que puede contener el objetivo",
        ],
        difficulty: "medium",
        xpReward: 34,
        testCases: [
          {
            stdin: "5\n2\n5\n9\n13\n20\n13\n",
            expectedStdout: "3\n",
            visible: true,
          },
          {
            stdin: "4\n1\n3\n5\n7\n2\n",
            expectedStdout: "-1\n",
            visible: false,
          },
          {
            stdin: "1\n42\n42\n",
            expectedStdout: "0\n",
            visible: false,
          },
        ],
      },
    },
  ],
});
