import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "segunda-forma-normal",
  title: "Dependencia de toda la clave",
  description: "Separa atributos que dependen sólo de parte de una clave compuesta.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `2FN importa especialmente cuando la clave es compuesta. En \`detalle_venta(venta_id, producto_id, producto_nombre, cantidad)\`, \`producto_nombre\` depende sólo de \`producto_id\`, no del par completo.

Ese hecho pertenece a Producto; \`cantidad\` sí describe la combinación venta-producto.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "cantidad", right: "Depende de venta_id + producto_id" },
        { left: "producto_nombre", right: "Depende sólo de producto_id" },
        { left: "fecha_venta", right: "Depende sólo de venta_id" },
      ],
      explanation: "Los hechos parciales deben moverse a su entidad.",
    },
    {
      type: "quiz",
      question: "¿Qué atributo viola 2FN en detalle(venta_id,producto_id,producto_nombre,cantidad)?",
      options: ["cantidad", "producto_nombre", "ambas PK", "ninguno"],
      correctIndex: 1,
      explanation: "Nombre es hecho del producto.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Atributo no clave debe depender de {{0}} la clave compuesta.",
      blanks: [{ answer: "toda" }],
      explanation: "Esa es la intuición de 2FN.",
    },
  ],
});
