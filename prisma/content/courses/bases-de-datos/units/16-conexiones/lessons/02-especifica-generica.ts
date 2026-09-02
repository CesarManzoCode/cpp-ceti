import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "especifica-generica",
  title: "Conexiones específicas y genéricas",
  description: "Distinguir provider nativo de abstracciones estándar.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una conexión específica aprovecha un proveedor concreto; una genérica usa una interfaz/estándar común (por ejemplo ODBC/ADO.NET abstraído), con trade-offs de portabilidad y capacidades.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Provider específico", right: "Capacidades concretas" },
        { left: "Interfaz genérica", right: "Portabilidad conceptual" },
        { left: "ODBC", right: "Ejemplo de capa genérica" },
        { left: "trade-off", right: "Portabilidad vs features" },
      ],
      explanation: "No hay una opción universal.",
    },
    {
      type: "quiz",
      question: "¿Qué suele ganar una conexión específica?",
      options: [
        "Cero dependencias",
        "Acceso directo a capacidades del motor",
        "Portabilidad total",
        "No requiere credenciales",
      ],
      correctIndex: 1,
      explanation: "Puede exponer features propias.",
    },
    {
      type: "fill_blank",
      template: "genérica favorece {{0}}; específica favorece capacidades concretas",
      blanks: [{ answer: "portabilidad" }],
      explanation: "Trade-off.",
    },
  ],
});
