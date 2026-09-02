import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "estrategia-respaldo",
  title: "Alcance, frecuencia y restauración",
  description: "Diseña una estrategia simple basada en pérdida tolerable.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Pregunta primero cuánto dato puedes permitirte perder y cuánto tiempo puede tardar recuperar servicio. En BD I no profundizamos en RPO/RTO formal, pero sí en la lógica: más cambios y mayor impacto suelen exigir respaldos más frecuentes y restauración ensayada.

El comando exacto depende del SGBD y se practica localmente.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Datos cambian cada minuto", right: "Necesita estrategia más frecuente" },
        { left: "Catálogo casi estático", right: "Puede tolerar frecuencia menor" },
        { left: "Backup en mismo disco único", right: "Riesgo común" },
        { left: "Restore nunca probado", right: "Confianza no demostrada" },
      ],
      explanation: "La estrategia responde al riesgo.",
    },
    {
      type: "quiz",
      question:
        "¿Por qué el comando de backup no se evalúa en SQLite/Wandbox como si fuera universal?",
      options: [
        "Porque backup no existe",
        "Porque herramientas/formato dependen del SGBD y entorno",
        "Porque SQL no sirve",
        "Porque CETI no lo pide",
      ],
      correctIndex: 1,
      explanation: "El concepto es general; la herramienta es específica.",
    },
    {
      type: "code_completion",
      prompt: "Ordena correctamente.",
      lines: [
        "Definir qué proteger",
        "Elegir frecuencia/retención",
        "Crear respaldo",
        "Restaurar en entorno limpio",
        "Verificar datos/esquema",
      ],
      explanation: "La restauración es parte de la estrategia.",
    },
  ],
});
