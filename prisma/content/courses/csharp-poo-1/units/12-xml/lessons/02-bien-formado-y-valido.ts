import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "bien-formado-y-valido",
  title: "Bien formado no significa válido para tu sistema",
  description:
    "Separa errores de sintaxis XML de reglas de estructura y negocio que el programa debe verificar.",
  estimatedMinutes: 15,
  xpReward: 50,
  steps: [
    {
      type: "theory",
      markdown: `# Dos niveles de validez

Un XML está **bien formado** cuando respeta las reglas sintácticas del lenguaje: etiquetas cerradas, un único elemento raíz, anidamiento correcto, atributos con comillas, etc.

Esto puede estar bien formado:

\`\`\`xml
<producto><color>azul</color></producto>
\`\`\`

pero quizá no sea **válido para tu aplicación** si un producto exige \`codigo\`, \`nombre\` y \`stock\`.

En XML formal, la validez también puede declararse mediante DTD o XSD. En cpp-ceti no abrimos ahora un curso de esquemas: la habilidad mínima es distinguir:

1. sintaxis XML válida para el parser;
2. estructura esperada por el contrato de tu programa;
3. datos válidos para el dominio.

\`XmlException\` detecta errores sintácticos. Tus propias comprobaciones detectan nodos faltantes o valores inválidos.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Xml;
class Program
{
    static void Main()
    {
        string xml = "<producto><nombre>Mouse</producto>";
        try
        {
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml);
            Console.WriteLine("Bien formado");
        }
        catch (XmlException)
        {
            Console.WriteLine("XML mal formado");
        }
    }
}`,
      explanation:
        "el cierre de `nombre` falta; el parser rechaza la estructura antes de que el dominio intente leer productos.",
      runnable: true,
      expectedOutput: "XML mal formado",
    },
    {
      type: "quiz",
      question:
        '`<producto><stock>-3</stock></producto>` está bien formado. Si tu dominio prohíbe stock negativo, ¿qué conclusión es correcta?',
      options: [
        "XML bien formado implica producto válido.",
        "El parser XML debe conocer todas las reglas del negocio.",
        "La sintaxis puede ser válida y los datos seguir violando el dominio.",
        "El documento deja de ser XML.",
      ],
      correctIndex: 2,
      explanation:
        "La sintaxis puede ser válida y los datos seguir violando el dominio.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee una línea XML. Si `XmlDocument.LoadXml` falla, imprime `MAL FORMADO`. Si carga correctamente pero no existe el elemento `nombre`, imprime `FALTA NOMBRE`. En otro caso imprime `OK: valor`.",
        starterCode: `using System;
using System.Xml;
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Xml;
class Program
{
    static void Main()
    {
        string xml = Console.ReadLine();
        try
        {
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml);
            XmlElement raiz = doc.DocumentElement;
            XmlNode nombre = raiz["nombre"];
            if (nombre == null) Console.WriteLine("FALTA NOMBRE");
            else Console.WriteLine("OK: " + nombre.InnerText);
        }
        catch (XmlException)
        {
            Console.WriteLine("MAL FORMADO");
        }
    }
}`,
        hints: [
          "Separa `try/catch` de la validación del nodo.",
          "Un nodo ausente produce `null`.",
          "No captures cualquier excepción para ocultar errores de programación.",
        ],
        difficulty: "medium",
        xpReward: 30,
        testCases: [
          {
            visible: true,
            stdin: "<producto><nombre>Mouse</nombre></producto>\n",
            expectedStdout: "OK: Mouse\n",
          },
          {
            visible: false,
            stdin: "<producto><stock>4</stock></producto>\n",
            expectedStdout: "FALTA NOMBRE\n",
          },
          {
            visible: false,
            stdin: "<producto><nombre>X</producto>\n",
            expectedStdout: "MAL FORMADO\n",
          },
        ],
      },
    },
  ],
});
