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

El alumno debe conectar el mismo dominio verificado (\`Ticket\`, \`ServicioTickets\`, \`IRepositorioTickets\` de la lección anterior) a una persistencia local y una interfaz Windows Forms, sin mover reglas de negocio a eventos. La evidencia de entrega incluye capturas/ejecución local y explicación de qué adaptador llama a qué servicio.

## Cómo hacer la parte local, paso a paso

1. **Entorno.** Abre Visual Studio (Windows) e instala, si falta, la carga
   de trabajo "Desarrollo de escritorio con .NET".
2. **Proyecto.** Crea un proyecto nuevo tipo **Windows Forms App (.NET)**,
   C#. Este es un proyecto DISTINTO al de consola donde ya probaste
   \`Ticket\`/\`ServicioTickets\` — no lo reemplaza: agrega ese mismo código
   de dominio al nuevo proyecto (como archivos \`.cs\` o como referencia a
   un proyecto de librería de clases).
3. **Controles mínimos** en \`Form1\`: un \`TextBox\` para el folio
   (\`txtFolio\`), uno para el técnico (\`txtTecnico\`), un \`Button\` para
   asignar (\`btnAsignar\`), un \`Button\` para cerrar (\`btnCerrar\`) y un
   \`Label\` de estado (\`lblEstado\`). Los arrastras del Toolbox al Form y
   les cambias el \`Name\` desde Propiedades.
4. **Conectar dominio con interfaz.** Da doble clic en cada botón para
   generar su manejador \`Click\` y, dentro, llama al servicio de dominio
   (ver el ejemplo de código de abajo) — el formulario sólo lee controles,
   invoca \`ServicioTickets\` y muestra el resultado en \`lblEstado\`.
5. **Persistencia real.** Implementa \`IRepositorioTickets\` con un
   mecanismo local simple (archivo de texto/JSON en disco, o una base
   SQLite local) — cualquiera es válido siempre que el dominio siga sin
   conocer el detalle de almacenamiento.
6. **Ejecuta y evidencia.** Corre la app, asigna y cierra al menos un
   ticket. Entrega: captura(s) de la ventana con el resultado, el archivo
   \`Form1.cs\`, la implementación del repositorio, y una corrida de
   consola del dominio (la de la lección anterior) para mostrar que la
   regla vive ahí y no en el evento del botón.`,
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
