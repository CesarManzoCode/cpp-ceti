import type { UnitDefinition } from "../types";

// =====================================================================
// Aplicaciones de escritorio con Windows Forms
// Conecta clases de dominio con formularios, controles y eventos en un laboratorio local verificable.
// =====================================================================

export const unidad07: UnitDefinition = {
  slug: "csharp-poo-07-gui",
  title: "Aplicaciones de escritorio con Windows Forms",
  description: "Conecta clases de dominio con formularios, controles y eventos en un laboratorio local verificable.",
  icon: "🪟",
  published: true,
  lessons: [
    /**
     * Objetivo: Relate form, control, event, and handler in a WinForms application.
     * Requisitos previos: miniproyecto-dominio
     */
    {
      slug: "formularios-controles-eventos",
      title: "Formulario, controles y eventos",
      description: "Comprende el ciclo de interacción y crea la primera interfaz local.",
      estimatedMinutes: 20,
      xpReward: 45,
      steps: [
        {
          type: "theory",
          markdown: `# La interfaz reacciona a eventos

Un \`Form\` es una ventana/contenedor; \`TextBox\`, \`Button\` y \`Label\` son controles. El usuario dispara un evento como \`Click\`; un manejador lee la entrada, llama al dominio y actualiza la salida.

Flujo: **entrada del control → manejador → objeto de dominio → resultado → control de salida**. El diseñador genera parte de la inicialización; no copies ese código al ejecutor web.`,
        },
        {
          type: "matching",
          pairs: [
            { left: "Form", right: "Ventana y contenedor principal" },
            { left: "TextBox", right: "Entrada de texto" },
            { left: "Button.Click", right: "Evento" },
            { left: "btnGuardar_Click", right: "Manejador" },
            { left: "Label", right: "Salida breve" },
          ],
          explanation: "El evento no contiene por sí mismo la regla de negocio; sólo activa el manejador.",
        },
        {
          type: "code_example",
          code: `// Fragmento de Form1.cs; requiere un proyecto Windows Forms local.
private void btnSaludar_Click(object sender, EventArgs e)
{
    string nombre = txtNombre.Text.Trim();
    lblResultado.Text = "Hola, " + nombre;
}`,
          explanation: "El diseñador enlaza Click con el manejador. Este fragmento no es un programa de consola.",
          runnable: false,
        },
        {
          type: "theory",
          markdown: `## Laboratorio local verificable

1. En Visual Studio crea **Windows Forms App (.NET)**, C#, con .NET 10 LTS si está instalado; .NET 8 es aceptable.
2. Agrega \`txtNombre\`, \`btnSaludar\` y \`lblResultado\`; asigna esos valores a \`Name\`.
3. Enlaza \`btnSaludar.Click\` al manejador mostrado.
4. Ejecuta, escribe \`Franco\` y pulsa el botón.

**Evidencia observable:** la ventana permanece abierta y \`lblResultado\` muestra \`Hola, Franco\`. Entrega captura y el archivo \`Form1.cs\`; explica en una frase qué control originó el evento.`,
        },
      ],
    },
    /**
     * Objetivo: Call a domain object from a thin event handler.
     * Requisitos previos: formularios-controles-eventos
     */
    {
      slug: "manejadores-y-dominio",
      title: "Manejadores delgados, dominio reutilizable",
      description: "Separa la regla de negocio del código del formulario.",
      estimatedMinutes: 20,
      xpReward: 50,
      steps: [
        {
          type: "theory",
          markdown: `# El formulario coordina; el dominio decide

Si el cálculo vive en \`btnCalcular_Click\`, sólo puede reutilizarse desde ese botón. Colócalo en una clase de dominio y deja al manejador tres tareas: traducir entrada, invocar el método y presentar salida. Así la lógica se prueba en consola y se usa igual en WinForms.`,
        },
        {
          type: "code_example",
          code: `class Cotizacion
{
    public decimal Calcular(decimal precio, int cantidad) { return precio * cantidad; }
}

// Dentro de Form1; no ejecutable en el navegador.
private void btnCalcular_Click(object sender, EventArgs e)
{
    decimal precio = decimal.Parse(txtPrecio.Text);
    int cantidad = int.Parse(txtCantidad.Text);
    Cotizacion cotizacion = new Cotizacion();
    lblTotal.Text = cotizacion.Calcular(precio, cantidad).ToString("0.00");
}`,
          explanation: "Cotizacion no conoce TextBox ni Label; por ello puede verificarse sin abrir la ventana.",
          runnable: false,
        },
        {
          type: "quiz",
          question: "¿Qué código debe permanecer en el formulario?",
          options: [
            "La fórmula de descuentos de toda la empresa.",
            "La persistencia de todas las entidades.",
            "Leer controles, invocar el dominio y presentar el resultado.",
            "Todas las reglas para evitar crear clases.",
          ],
          correctIndex: 2,
          explanation: "El manejador es un adaptador entre interfaz y dominio.",
        },
        {
          type: "theory",
          markdown: `## Laboratorio local verificable

Construye un formulario con \`txtPrecio\`, \`txtCantidad\`, \`btnCalcular\`, \`lblTotal\` y la clase \`Cotizacion\` del ejemplo. Ejecuta los casos \`25.50 × 2 = 51.00\` y \`10 × 0 = 0.00\`.

**Evidencia observable:** dos capturas o una breve grabación con ambos resultados, más una prueba de consola que llame directamente a \`Cotizacion.Calcular\`. La fórmula no debe aparecer en el manejador.`,
        },
      ],
    },
    /**
     * Objetivo: Validate UI input and translate domain exceptions into user feedback.
     * Requisitos previos: manejadores-y-dominio
     */
    {
      slug: "validacion-en-la-interfaz",
      title: "Validación y retroalimentación en la interfaz",
      description: "Convierte entradas y errores del dominio en mensajes claros.",
      estimatedMinutes: 20,
      xpReward: 50,
      steps: [
        {
          type: "theory",
          markdown: `# Dos niveles de validación

La interfaz valida formato con \`TryParse\`; el dominio valida significado, por ejemplo cantidad mayor que cero. El formulario puede usar un \`ErrorProvider\` o un \`Label\` para explicar el fallo. Nunca dejes que una excepción esperable cierre la aplicación y nunca dupliques la invariante sólo en la ventana.`,
        },
        {
          type: "code_example",
          code: `private void btnRegistrar_Click(object sender, EventArgs e)
{
    int cantidad;
    if (!int.TryParse(txtCantidad.Text, out cantidad))
    {
        lblError.Text = "Escribe una cantidad entera";
        return;
    }
    try
    {
        Pedido pedido = new Pedido(cantidad); // Pedido exige cantidad > 0
        lblError.Text = "";
        lblResultado.Text = "Pedido registrado";
    }
    catch (ArgumentException ex)
    {
        lblError.Text = ex.Message;
    }
}`,
          explanation: "TryParse resuelve formato; Pedido protege la regla del dominio.",
          runnable: false,
        },
        {
          type: "fill_blank",
          prompt: "Completa la conversión segura y la salida temprana del manejador.",
          template: `int cantidad;
if (!int.{{0}}(txtCantidad.Text, out cantidad))
{
    lblError.Text = "Escribe una cantidad entera";
    {{1}};
}`,
          blanks: [
            { answer: "TryParse", hint: "Convierte sin lanzar una excepción de formato." },
            { answer: "return", hint: "Evita continuar con una entrada inválida." },
          ],
          explanation: "El retorno temprano evita ejecutar el dominio con una conversión fallida.",
        },
        {
          type: "theory",
          markdown: `## Laboratorio local verificable

Implementa \`Pedido\` con la regla \`cantidad > 0\` y el manejador mostrado. Verifica tres casos: \`abc\` → “Escribe una cantidad entera”; \`0\` → mensaje del dominio; \`3\` → “Pedido registrado”.

**Evidencia observable:** tabla de los tres casos con entrada, salida esperada y salida real; captura del caso válido. Al corregir una entrada, el mensaje anterior debe limpiarse.`,
        },
      ],
    },
    /**
     * Objetivo: Organize a multi-panel form, manage object references, and publish a WinForms app.
     * Requisitos previos: validacion-en-la-interfaz
     */
    {
      slug: "contenedores-flujo-publicacion",
      title: "Contenedores, flujo y publicación",
      description: "Organiza la ventana, conserva referencias y produce una entrega ejecutable.",
      estimatedMinutes: 20,
      xpReward: 45,
      steps: [
        {
          type: "theory",
          markdown: `# Una ventana con flujo visible

Usa \`Panel\`, \`GroupBox\` o \`TableLayoutPanel\` para agrupar entrada, acciones y resultado. El formulario puede conservar una referencia privada a un servicio de dominio; no debe recrearlo si el estado necesita sobrevivir entre clics. Dibuja antes el flujo de datos y de procesos.

Para entregar, usa **Publish** de Visual Studio o \`dotnet publish -c Release\`. Define sistema operativo, arquitectura y modo dependiente del framework o autónomo. Prueba el resultado en otra carpeta o equipo; publicar no sustituye probar.`,
        },
        {
          type: "matching",
          pairs: [
            { left: "TableLayoutPanel", right: "Alineación adaptable de controles" },
            { left: "GroupBox", right: "Agrupación con título" },
            { left: "Campo privado del Form", right: "Referencia que sobrevive entre eventos" },
            { left: "Publish", right: "Salida desplegable" },
          ],
          explanation: "La organización visual y la vida de los objetos son decisiones distintas pero coordinadas.",
        },
        {
          type: "quiz",
          question: "¿Cuál referencia debe ser campo del formulario?",
          options: [
            "Una variable temporal usada en una sola línea.",
            "El servicio que conserva el estado entre varios clics.",
            "El texto de un Label que nunca se lee.",
            "Cada argumento de un método.",
          ],
          correctIndex: 1,
          explanation: "Su ciclo de vida coincide con el de la ventana.",
        },
        {
          type: "theory",
          markdown: `## Laboratorio local verificable

Reorganiza la aplicación de pedidos en tres contenedores: Entrada, Acciones y Resultado. Conserva un \`ServicioPedidos\` como campo privado. Publica en Release para \`win-x64\` con el modo acordado por el docente.

**Evidencia observable:** captura de la interfaz, diagrama de flujo de datos, carpeta publicada y prueba desde el ejecutable publicado. Incluye \`README.txt\` con requisitos, pasos y versión de .NET. No subas \`bin/\` o \`obj/\` al contenido del curso.`,
        },
      ],
    },
  ],
};
