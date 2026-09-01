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
  // NO publicada todavía: el laboratorio de Windows Forms sólo se acepta
  // reproduciéndolo en Windows + Visual Studio, y este entorno no los
  // tiene. Queda como PENDING MANUAL WINDOWS ACCEPTANCE
  // (`docs/decisiones-multilenguaje.md` §5). Se publica cuando alguien
  // corra el laboratorio en Windows y lo dé por bueno.
  published: false,
  lessons: [
    /**
     * Objetivo: Relate form, control, event, and handler in a WinForms application.
     * Requisitos previos: miniproyecto-dominio
     */
    {
      slug: "formularios-controles-eventos",
      title: "Formulario, controles y eventos",
      description: "Comprende el ciclo de interacción y crea la primera interfaz local.",
      estimatedMinutes: 24,
      xpReward: 48,
      steps: [
        {
          // Primer contacto con WinForms: qué es la ventana, de dónde
          // salen los controles, y por qué Name y Text son cosas distintas
          // — todo lo que alguien que abre Visual Studio por primera vez
          // necesita para no perderse en el resto de la unidad.
          type: "theory",
          markdown: `# Tu primera ventana

Hasta ahora tus programas de C# corrían en la consola: leían texto y escribían texto. **Windows Forms** es otra forma de correr un programa de C#: en vez de texto, el usuario ve una **ventana** con botones y cajas.

- **\`Form\`** es la ventana misma. Cuando creas un proyecto Windows Forms, Visual Studio te da una ventana vacía llamada \`Form1\`.
- El **Toolbox** (la caja de herramientas, normalmente a un lado del editor) es la lista de controles disponibles: \`Button\`, \`TextBox\`, \`Label\`, etc. **Arrastras** uno del Toolbox al \`Form\` para agregarlo — no lo escribes a mano.
- Cada control que arrastras tiene, entre muchas propiedades, dos que vale la pena distinguir desde ya:
  - **\`Name\`**: el identificador que vas a usar en tu código C# para referirte a ese control (\`txtNombre\`, \`btnSaludar\`). Nadie lo ve en la ventana.
  - **\`Text\`**: lo que el usuario SÍ ve dibujado — el texto de un botón, el contenido inicial de una caja.

Cambiar \`Text\` de un botón a "Saludar" no cambia su \`Name\`; puedes seguir llamándolo \`btnSaludar\` en el código aunque diga otra cosa en pantalla.`,
        },
        {
          type: "theory",
          markdown: `# De un clic a una respuesta

Un control puede disparar **eventos**: cosas que le pasan, como que le hagan \`Click\`. Tú no revisas "¿ya hicieron clic?" en un ciclo — en vez de eso, **conectas** un método tuyo a ese evento, y Windows Forms lo llama automáticamente cuando ocurre.

Para conectar un \`Click\`: seleccionas el botón en el diseñador y das doble clic sobre él (o usas la ventana de Propiedades → el ícono de rayo → \`Click\`). Visual Studio genera un método vacío con el nombre \`nombreDelBoton_Click\` y te deja escribiendo dentro de él.

Ese método es el **manejador** (handler). El flujo completo de la unidad es siempre el mismo:

**entrada del control → manejador → objeto de dominio → resultado → control de salida**`,
        },
        {
          type: "matching",
          pairs: [
            { left: "Form", right: "Ventana y contenedor principal" },
            { left: "Toolbox", right: "De aquí arrastras los controles al Form" },
            { left: "TextBox", right: "Entrada de texto" },
            { left: "Button.Click", right: "Evento" },
            { left: "btnGuardar_Click", right: "Manejador conectado al evento" },
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
          localOnlyNote:
            "Requiere Visual Studio en Windows. Es un fragmento de Windows Forms, no un programa de consola: se ejecuta en el laboratorio local de esta unidad, no en el navegador.",
        },
        {
          type: "theory",
          markdown: `# Form1.cs y el código del Designer

Cada formulario en realidad son DOS archivos:

- **\`Form1.cs\`**: donde tú escribes, incluidos los manejadores como \`btnSaludar_Click\`.
- **\`Form1.Designer.cs\`**: lo genera automáticamente Visual Studio cada vez que arrastras un control o cambias una propiedad desde el diseñador visual. Ahí es donde vive la línea que crea \`txtNombre\`, le pone su \`Name\`, su posición, etc.

No necesitas escribir el \`.Designer.cs\` a mano ni entender cada línea — sólo saber que existe, que lo genera el diseñador, y que tu código de verdad (los manejadores, la lógica) va en \`Form1.cs\`.`,
        },
        {
          type: "theory",
          markdown: `## Laboratorio local verificable

1. En Visual Studio crea **Windows Forms App (.NET)**, C#, con .NET 10 LTS si está instalado; .NET 8 es aceptable.
2. Desde el Toolbox, arrastra un \`TextBox\`, un \`Button\` y un \`Label\` al \`Form1\`. Con cada uno seleccionado, cambia su \`Name\` en la ventana de Propiedades a \`txtNombre\`, \`btnSaludar\` y \`lblResultado\` — y el \`Text\` del botón a "Saludar" (el \`Name\` no cambia por eso).
3. Da doble clic sobre \`btnSaludar\` para generar su manejador de \`Click\`, y escribe dentro el código mostrado arriba.
4. Ejecuta, escribe \`Franco\` en la caja y pulsa el botón.

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
          localOnlyNote:
            "Requiere Visual Studio en Windows. Es un fragmento de Windows Forms, no un programa de consola: se ejecuta en el laboratorio local de esta unidad, no en el navegador.",
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
          localOnlyNote:
            "Requiere Visual Studio en Windows. Es un fragmento de Windows Forms, no un programa de consola: se ejecuta en el laboratorio local de esta unidad, no en el navegador.",
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
        // --- Parte A: estado/referencias que sobreviven entre eventos ---
        {
          type: "theory",
          markdown: `# Parte 1: lo que sobrevive entre clics

Cada método manejador (\`btnX_Click\`) corre y termina. Sus variables locales mueren con él. Pero a veces necesitas que algo **recuerde** su valor de un clic al siguiente — por ejemplo, un servicio de dominio que no tiene sentido recrear cada vez.

Para eso, el \`Form\` puede tener sus propios **campos privados**, igual que cualquier otra clase que ya conoces. Un campo del \`Form\` se crea una sola vez (normalmente en el constructor, después de \`InitializeComponent();\`) y cada manejador puede leerlo y usarlo sin volver a construirlo.`,
        },
        {
          type: "quiz",
          question: "¿Cuál referencia debe ser campo privado del formulario, en vez de una variable local dentro del manejador?",
          options: [
            "Una variable temporal usada en una sola línea.",
            "El servicio que conserva el estado entre varios clics.",
            "El texto de un Label que nunca se lee.",
            "Cada argumento de un método.",
          ],
          correctIndex: 1,
          explanation: "Su ciclo de vida coincide con el de la ventana: se crea una vez y varios manejadores lo usan, en vez de recrearlo en cada clic.",
        },
        // --- Parte B: organización visual y publicación ---
        {
          type: "theory",
          markdown: `# Parte 2: organizar la ventana y publicarla

Con controles y manejadores ya resueltos, falta ordenar la ventana y entregarla como programa ejecutable. Son dos decisiones distintas de las de la Parte 1: aquí no se trata de qué recuerda el formulario, sino de cómo se ve y cómo se comparte.

Usa \`Panel\`, \`GroupBox\` o \`TableLayoutPanel\` para agrupar entrada, acciones y resultado — así el usuario reconoce de un vistazo qué hace cada zona. Dibuja antes el flujo de datos y de procesos.

Para entregar, usa **Publish** de Visual Studio o \`dotnet publish -c Release\`. Define sistema operativo, arquitectura y modo dependiente del framework o autónomo. Prueba el resultado en otra carpeta o equipo; publicar no sustituye probar.`,
        },
        {
          type: "matching",
          pairs: [
            { left: "TableLayoutPanel", right: "Alineación adaptable de controles" },
            { left: "GroupBox", right: "Agrupación con título" },
            { left: "Publish", right: "Salida desplegable" },
          ],
          explanation: "Organizar la ventana y publicarla son pasos posteriores a resolver el estado que conserva el formulario.",
        },
        {
          type: "theory",
          markdown: `## Laboratorio local verificable

Reorganiza la aplicación de pedidos en tres contenedores: Entrada, Acciones y Resultado. Conserva un \`ServicioPedidos\` como campo privado (Parte 1). Publica en Release para \`win-x64\` con el modo acordado por el docente (Parte 2).

**Evidencia observable:** captura de la interfaz, diagrama de flujo de datos, carpeta publicada y prueba desde el ejecutable publicado. Incluye \`README.txt\` con requisitos, pasos y versión de .NET. No subas \`bin/\` o \`obj/\` al contenido del curso.`,
        },
      ],
    },
  ],
};
