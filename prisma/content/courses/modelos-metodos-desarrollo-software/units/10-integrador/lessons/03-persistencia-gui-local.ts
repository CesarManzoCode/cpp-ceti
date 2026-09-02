import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "persistencia-gui-local",
  title: "Persistencia e interfaz gráfica: laboratorio local",
  description: "Separa el núcleo verificable de los adaptadores requeridos por el producto oficial.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `El producto oficial exige persistencia e interfaz gráfica. En cpp-ceti, ambos se trabajan como **laboratorio local**.

El alumno debe conectar el mismo dominio verificado a una persistencia local y una interfaz Windows Forms, sin mover reglas de negocio a eventos. La evidencia de entrega incluye capturas/ejecución local y explicación de qué adaptador llama a qué servicio.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Dominio C# de consola", right: "Verificable en plataforma" },
        { left: "Persistencia real", right: "Laboratorio local" },
        { left: "Windows Forms", right: "Laboratorio local" },
        { left: "Reglas de cierre", right: "Nunca sólo en UI" },
      ],
      explanation: "La separación permite verificar lógica aun cuando el adaptador no corre en navegador.",
    },
    {
      type: "quiz",
      question: "¿Qué patrón de implementación es correcto?",
      options: [
        "Click del botón contiene toda regla",
        "Formulario llama a ServicioTickets; servicio protege reglas",
        "Base de datos decide todo",
        "Duplicar regla en cada pantalla",
      ],
      correctIndex: 1,
      explanation: "La UI coordina interacción; el dominio conserva invariantes.",
    },
    {
      type: "code_example",
      code: `// Esqueleto conceptual; NO copiar reglas al evento.
private void btnCerrar_Click(object sender, EventArgs e)
{
    bool cerrado = servicio.Cerrar(txtFolio.Text);
    lblEstado.Text = cerrado ? "CERRADO" : "NO SE PUDO CERRAR";
}`,
      explanation: "El formulario delega; el servicio/dominio sigue siendo la autoridad de la regla.",
      runnable: false,
      localOnlyNote:
        "Laboratorio local: conecta el dominio del proyecto a Windows Forms y persistencia en Visual Studio/entorno local. No se ejecuta en el juez del navegador.",
    },
  ],
});
