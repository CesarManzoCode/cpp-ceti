import type { UnitDefinition } from "../types";

// =====================================================================
// Proyecto integrador
// Entrega una aplicación de escritorio pequeña para un negocio, desde requisitos y UML hasta publicación e informe.
// =====================================================================

export const unidad08: UnitDefinition = {
  slug: "csharp-poo-08-integrador",
  title: "Proyecto integrador",
  description: "Entrega una aplicación de escritorio pequeña para un negocio, desde requisitos y UML hasta publicación e informe.",
  icon: "🚀",
  // NO publicada todavía: el proyecto integrador se entrega como app de
  // escritorio con Windows Forms, así que depende de la misma aceptación
  // manual en Windows que la U7 (PENDING MANUAL WINDOWS ACCEPTANCE,
  // `docs/decisiones-multilenguaje.md` §5).
  published: false,
  lessons: [
    /**
     * Objetivo: Define scope, UML, and observable acceptance cases for the final project.
     * Requisitos previos: contenedores-flujo-publicacion
     */
    {
      slug: "requisitos-uml-aceptacion",
      title: "Requisitos, UML y criterios de aceptación",
      description: "Convierte una necesidad de negocio en un modelo comprobable antes de programar.",
      estimatedMinutes: 25,
      xpReward: 60,
      steps: [
        {
          type: "theory",
          markdown: `# Caso guía: cotizador de papelería

El negocio necesita capturar producto, precio, cantidad y porcentaje de descuento; calcular el total; rechazar precios, cantidades o descuentos fuera de rango; y mostrar un resumen. Alcance POO I: una sesión en memoria, sin base de datos, red, XML, concurrencia ni colecciones genéricas.

Clases del modelo — y sólo ésas se implementan en toda la unidad, sin agregar ni quitar ninguna después: \`Producto\` (nombre, precio; valida precio positivo) y \`Cotizacion\` (referencia a un Producto existente, cantidad, descuento; valida cantidad y descuento, y calcula el total). El formulario es frontera, no entidad. Cada criterio debe describir una entrada y un resultado observable.`,
        },
        {
          type: "matching",
          pairs: [
            { left: "“Cantidad mayor que cero”", right: "Invariante" },
            { left: "Cotizacion referencia un Producto que ya existía antes de cotizar", right: "Asociación" },
            { left: "Formulario", right: "Frontera de interfaz" },
            { left: "Precio 100, cantidad 2, descuento 10% → 180", right: "Criterio de aceptación" },
          ],
          explanation: "El diagrama y los casos deben contar la misma historia. Producto no nace ni muere con la Cotizacion que lo usa — el mismo producto podría cotizarse varias veces — así que la relación es asociación, no composición.",
        },
        {
          type: "quiz",
          question: "¿Cuál requisito debe aplazarse por pertenecer a POO II o infraestructura adicional?",
          options: [
            "Validar cantidad positiva.",
            "Calcular subtotal.",
            "Sincronizar cotizaciones por sockets entre sucursales.",
            "Mostrar un resumen.",
          ],
          correctIndex: 2,
          explanation: "Sockets/redes están explícitamente en POO II y agrandan el proyecto sin validar mejor POO I.",
        },
        {
          type: "theory",
          markdown: `## Entregable de diseño

Produce: (1) alcance de cinco a ocho requisitos; (2) diagrama UML con visibilidad, atributos, operaciones y relaciones; (3) flujo de proceso; (4) seis criterios de aceptación, incluidos dos inválidos; (5) matriz requisito → clase responsable → prueba.

No se exigen multiplicidades (1, 0..1, 0..*, etc.): no se enseñaron en U3/U4, así que no forman parte de lo que este diagrama tiene que mostrar.

Revisión obligatoria: ninguna regla vive únicamente en el formulario; toda relación del UML aparece en código; ningún elemento “futuro” se implementa por accidente.`,
        },
      ],
    },
    /**
     * Objetivo: Implement the final project's domain layer with browser-verifiable behavior.
     * Requisitos previos: requisitos-uml-aceptacion
     */
    {
      slug: "implementar-capa-dominio",
      title: "Implementar y probar la capa de dominio",
      description: "Construye un núcleo independiente de la GUI y compruébalo en el navegador.",
      estimatedMinutes: 30,
      xpReward: 80,
      steps: [
        {
          type: "theory",
          markdown: `# El dominio funciona antes que la ventana

Implementa constructores, propiedades, relaciones y reglas en clases que no referencien \`System.Windows.Forms\`. Un \`Program.Main\` temporal sirve como adaptador de prueba. Cuando todos los casos pasen, copia las clases sin cambios al proyecto WinForms.`,
        },
        {
          type: "code_example",
          code: `using System;
class Producto
{
    public string Nombre { get; private set; }
    public decimal Precio { get; private set; }
    public Producto(string n, decimal p) { if (p <= 0) throw new ArgumentException("Precio invalido"); Nombre=n; Precio=p; }
}
class Cotizacion
{
    private Producto producto; private int cantidad; private decimal descuento;
    public Cotizacion(Producto p, int c, decimal d) { if(c<=0) throw new ArgumentException("Cantidad invalida"); if(d<0 || d>1) throw new ArgumentException("Descuento invalido"); producto=p; cantidad=c; descuento=d; }
    public decimal Total() { return producto.Precio * cantidad * (1m-descuento); }
}
class Program { static void Main() { Console.WriteLine(new Cotizacion(new Producto("Papel",100m),2,0.10m).Total().ToString("0.00")); } }`,
          explanation: "El núcleo no conoce controles y puede ejecutarse con Mono en el navegador.",
          runnable: true,
          expectedOutput: "180.00",
        },
        {
          type: "code_challenge",
          exercise: {
            prompt: "Implementa Producto y Cotizacion como en el contrato. Lee nombre, precio, cantidad y porcentaje entero de descuento. Imprime \"N | Total: X.XX\" o \"Error: MENSAJE\". Mensajes exactos: Precio invalido, Cantidad invalida, Descuento invalido.",
            starterCode: `using System;
class Producto { /* completa */ }
class Cotizacion { /* completa */ }
class Program { static void Main() { /* adapta consola al dominio */ } }`,
            solutionCode: `using System;
class Producto
{
    public string Nombre { get; private set; }
    public decimal Precio { get; private set; }
    public Producto(string n, decimal p) { if (p <= 0) throw new ArgumentException("Precio invalido"); Nombre=n; Precio=p; }
}
class Cotizacion
{
    private Producto producto; private int cantidad; private decimal descuento;
    public Cotizacion(Producto p, int c, decimal d)
    {
        if(c<=0) throw new ArgumentException("Cantidad invalida");
        if(d<0 || d>1) throw new ArgumentException("Descuento invalido");
        producto=p; cantidad=c; descuento=d;
    }
    public decimal Total() { return producto.Precio * cantidad * (1m-descuento); }
    public string Resumen() { return producto.Nombre + " | Total: " + Total().ToString("0.00"); }
}
class Program
{
    static void Main()
    {
        string nombre=Console.ReadLine(); decimal precio=decimal.Parse(Console.ReadLine());
        int cantidad=int.Parse(Console.ReadLine()); decimal descuento=decimal.Parse(Console.ReadLine())/100m;
        try { Console.WriteLine(new Cotizacion(new Producto(nombre,precio),cantidad,descuento).Resumen()); }
        catch(ArgumentException ex) { Console.WriteLine("Error: " + ex.Message); }
    }
}`,
            hints: [
              "Convierte el porcentaje dividiendo entre 100m.",
              "Valida dentro de las clases.",
              "El descuento válido está entre 0 y 1.",
            ],
            difficulty: "hard",
            xpReward: 48,
            // Reto final de dominio de la unidad integradora: no puede
            // aprobarse reproduciendo la salida esperada desde un Main
            // sin clases. El contrato exige la forma real del modelo
            // acordado en requisitos-uml-aceptacion.
            structure: {
              classes: [
                {
                  name: "Producto",
                  properties: [
                    { name: "Nombre", visibility: "public", type: "string" },
                    { name: "Precio", visibility: "public", type: "decimal" },
                  ],
                  constructors: [{ paramCount: 2 }],
                },
                {
                  name: "Cotizacion",
                  constructors: [{ paramCount: 3 }],
                  methods: [
                    { name: "Total", visibility: "public", returnType: "decimal" },
                    { name: "Resumen", visibility: "public", returnType: "string" },
                  ],
                  stores: [{ type: "Producto" }],
                },
              ],
            },
            testCases: [
              {
                stdin: "Papel\n100\n2\n10\n",
                expectedStdout: "Papel | Total: 180.00\n",
                visible: true,
                description: "Caso guía",
              },
              {
                stdin: "Tinta\n49.90\n3\n0\n",
                expectedStdout: "Tinta | Total: 149.70\n",
                visible: false,
                description: "Sin descuento",
              },
              {
                stdin: "Caja\n10\n0\n5\n",
                expectedStdout: "Error: Cantidad invalida\n",
                visible: false,
                description: "Cantidad inválida",
              },
              {
                stdin: "Caja\n10\n1\n101\n",
                expectedStdout: "Error: Descuento invalido\n",
                visible: false,
                description: "Descuento inválido",
              },
            ],
          },
        },
        {
          type: "quiz",
          question: "¿Qué cambio debe requerir modificar Cotizacion pero no Form1?",
          options: [
            "Mover un botón.",
            "Cambiar el color del Label.",
            "Cambiar la fórmula del descuento.",
            "Renombrar txtPrecio.",
          ],
          correctIndex: 2,
          explanation: "La fórmula pertenece al dominio; el formulario sólo consume el resultado.",
        },
      ],
    },
    /**
     * Objetivo: Integrate domain and GUI, execute acceptance tests, publish, and report the result.
     * Requisitos previos: implementar-capa-dominio
     */
    {
      slug: "integrar-publicar-informar",
      title: "Integrar, publicar e informar",
      description: "Conecta el núcleo probado con WinForms y entrega evidencia reproducible.",
      estimatedMinutes: 40,
      xpReward: 100,
      steps: [
        {
          type: "theory",
          markdown: `# Integración final

El formulario construye \`Producto\` y \`Cotizacion\`, captura \`ArgumentException\` y presenta \`Resumen()\`. No copies la fórmula al evento. Organiza controles por entrada/acción/resultado y conserva únicamente las referencias cuyo estado deba sobrevivir.

El informe debe demostrar trazabilidad: requisito → UML → clase/método → caso de prueba → evidencia. Documenta también una limitación real y una mejora aplazada.`,
        },
        {
          type: "code_example",
          code: `// Fragmento local de Form1.cs; Producto y Cotizacion son las clases ya probadas.
private void btnCotizar_Click(object sender, EventArgs e)
{
    decimal precio; int cantidad; decimal porcentaje;
    if (!decimal.TryParse(txtPrecio.Text, out precio) ||
        !int.TryParse(txtCantidad.Text, out cantidad) ||
        !decimal.TryParse(txtDescuento.Text, out porcentaje))
    {
        lblError.Text = "Revisa los formatos";
        return;
    }
    try
    {
        Cotizacion c = new Cotizacion(new Producto(txtProducto.Text.Trim(), precio), cantidad, porcentaje / 100m);
        lblResultado.Text = c.Resumen();
        lblError.Text = "";
    }
    catch (ArgumentException ex) { lblError.Text = ex.Message; }
}`,
          explanation: "El manejador adapta controles al mismo dominio validado en el navegador.",
          runnable: false,
          localOnlyNote:
            "Requiere Visual Studio en Windows. Es un fragmento de Windows Forms, no un programa de consola: se ejecuta en el laboratorio local de esta unidad, no en el navegador.",
        },
        {
          type: "matching",
          pairs: [
            { left: "Pruebas ocultas del dominio", right: "Evitan soluciones codificadas para un solo caso" },
            { left: "Matriz de trazabilidad", right: "Relaciona requisito, diseño, código y prueba" },
            { left: "Carpeta publicada", right: "Permite ejecutar fuera del IDE" },
            { left: "Limitación documentada", right: "Hace honesto y reproducible el alcance" },
          ],
          explanation: "La entrega no es sólo código: también debe poder verificarse y explicarse.",
        },
        {
          type: "theory",
          markdown: `## Entrega final y rúbrica operativa

1. Proyecto WinForms sin \`bin/\` ni \`obj/\`; núcleo sin referencias a WinForms.
2. UML final coherente con el código y diagrama de flujo de procesos/datos.
3. Ejecución de los seis criterios de aceptación; incluye formato inválido, regla inválida y caso límite.
4. Publicación Release probada desde la carpeta publicada.
5. Informe breve: problema, alcance, decisiones, capturas, matriz de trazabilidad, resultados, limitaciones y conclusión.

**Evidencia observable:** un evaluador puede clonar/copiar, abrir la solución, ejecutar pruebas, publicar y reproducir los resultados usando el README. La aplicación no se cierra ante entradas inválidas y ninguna regla de negocio está duplicada en los manejadores.`,
        },
      ],
    },
  ],
};
