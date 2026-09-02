import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "documentos-colecciones",
  title: "Documento, colección y campos",
  description: "Representar un ticket como documento.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un documento contiene campos y valores; una colección agrupa documentos del mismo propósito general. Un ticket puede incluir subdocumentos o arreglos si esos datos se consumen como parte de la misma unidad.`,
    },
    {
      type: "code_example",
      code: `{
  "_id": 10,
  "estado": "ABIERTO",
  "cliente": {"id": 1, "nombre": "Ana"},
  "etiquetas": ["red", "urgente"]
}`,
      explanation: "Ejemplo conceptual JSON de un documento.",
      runnable: false,
      localOnlyNote: "Representación documental; se practica con MongoDB local.",
    },
    {
      type: "quiz",
      question: "¿Qué agrupa documentos?",
      options: ["Tabla", "Colección", "Trigger", "Rol"],
      correctIndex: 1,
      explanation: "Colección es el contenedor lógico.",
    },
    {
      type: "matching",
      pairs: [
        { left: "_id", right: "Identidad" },
        { left: "cliente", right: "Subdocumento" },
        { left: "etiquetas", right: "Arreglo" },
        { left: "colección tickets", right: "Grupo de documentos" },
      ],
      explanation: "Lee la estructura.",
    },
  ],
});
