import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "capas-conexion",
  title: "Aplicación, driver y SGBD",
  description: "Entender las capas de una conexión.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `La aplicación no "habla SQL por magia". Usa un driver/proveedor que implementa un protocolo para conectarse al SGBD. La cadena de conexión describe destino y credenciales/configuración.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Aplicación", right: "Lógica/UI" },
        { left: "Driver", right: "Adaptador/protocolo" },
        { left: "Connection string", right: "Destino/configuración" },
        { left: "SGBD", right: "Ejecuta operaciones" },
      ],
      explanation: "Separa capas.",
    },
    {
      type: "quiz",
      question: "¿Qué componente traduce la API de la app al protocolo del SGBD?",
      options: ["Driver", "Tabla", "Trigger", "View"],
      correctIndex: 0,
      explanation: "El driver implementa la conexión.",
    },
    {
      type: "fill_blank",
      template: "app → {{0}} → SGBD",
      blanks: [{ answer: "driver" }],
      explanation: "Flujo conceptual.",
    },
  ],
});
