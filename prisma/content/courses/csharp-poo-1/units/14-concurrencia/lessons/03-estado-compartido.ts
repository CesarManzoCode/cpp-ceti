import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "estado-compartido",
  title: "Estado compartido y condición de carrera",
  description:
    "Identifica cuándo dos hilos compiten por el mismo estado y por qué una operación aparentemente simple puede perder actualizaciones.",
  estimatedMinutes: 16,
  xpReward: 55,
  steps: [
    {
      type: "theory",
      markdown: `# \`contador++\` no es una operación indivisible

Dos hilos pueden compartir una variable porque viven en el mismo proceso. Eso es útil, pero crea **recursos críticos** cuando ambos leen y escriben el mismo estado.

\`contador++\` parece una sola instrucción, pero conceptualmente implica:

1. leer \`contador\`;
2. calcular \`contador + 1\`;
3. escribir el nuevo valor.

Si dos hilos leen \`10\` antes de que alguno escriba, ambos pueden calcular \`11\` y terminar guardando un solo incremento. El resultado depende del intercalado del scheduler: eso es una **condición de carrera**.

No intentes “arreglarla” agregando \`Sleep\`. Necesitas una regla de exclusión sobre la sección crítica.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Threading;
class Program
{
    static int contador;
    static void Incrementar()
    {
        for(int i=0;i<100000;i++)contador++;
    }
    static void Main()
    {
        Thread a=new Thread(Incrementar), b=new Thread(Incrementar);
        a.Start();b.Start();a.Join();b.Join();
        Console.WriteLine(contador);
    }
}`,
      explanation:
        "El valor esperado conceptualmente es 200000, pero este programa tiene una carrera y puede producir menos. Precisamente por ser no determinista no debe calificarse por stdout.",
      runnable: false,
      localOnlyNote:
        "Demostración deliberadamente no determinista. Ejecútala localmente varias veces para observar la carrera; no se usa como reto evaluado.",
    },
    {
      type: "matching",
      pairs: [
        { left: "Estado compartido", right: "Dato accesible por más de un hilo." },
        { left: "Recurso crítico", right: "Estado cuya operación necesita coordinación." },
        { left: "Condición de carrera", right: "Resultado depende del intercalado temporal." },
        { left: "Sleep", right: "Retraso; no garantiza exclusión mutua." },
      ],
    },
    {
      type: "quiz",
      question:
        "Dos hilos hacen contador++ sobre la misma variable sin sincronización. ¿Qué afirmación es correcta?",
      options: [
        "Siempre termina exactamente en 2 * iteraciones.",
        "El incremento es automáticamente atómico en C#.",
        "Puede perder actualizaciones porque ambos hilos intercalan lectura y escritura.",
        "Join evita la carrera durante los incrementos.",
      ],
      correctIndex: 2,
      explanation:
        "Join espera al final; no evita que las operaciones internas compitan. La próxima lección protege la sección crítica.",
    },
  ],
});
