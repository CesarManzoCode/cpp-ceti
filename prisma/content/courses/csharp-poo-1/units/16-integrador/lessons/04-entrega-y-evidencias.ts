import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "entrega-y-evidencias",
  title: "Entrega local: GUI, XML, sockets y evidencias",
  description:
    "Cierra el proyecto con una integración local verificable y un reporte que demuestre requisitos, diseño y funcionamiento.",
  estimatedMinutes: 20,
  xpReward: 75,
  steps: [
    {
      type: "theory",
      markdown: `# El producto final demuestra integración, no cantidad de archivos

La entrega local debe reutilizar el dominio que ya pasó pruebas de consola.

## Aplicación mínima

- **UI de escritorio:** alta, consulta, ajuste y eliminación de bienes.
- **Colecciones:** inventario dinámico y acceso por clave.
- **XML:** guardar/cargar o transferir una representación del inventario.
- **Genérico:** repositorio reutilizable para entidades/bienes.
- **Hilos:** trabajo concurrente real con estado protegido.
- **Sockets:** cliente/servidor en localhost o LAN usando un protocolo documentado.

## Evidencias mínimas

1. descripción y análisis del problema;
2. requisitos/casos de uso;
3. UML de clases y casos de uso;
4. protocolo de mensajes con ejemplos y errores;
5. capturas o logs que demuestren operaciones;
6. código fuente ejecutable;
7. explicación de decisiones y limitaciones.

No ocultes una parte no terminada detrás de una captura: cada evidencia debe corresponder a un comportamiento reproducible.`,
    },
    {
      type: "code_example",
      code: `// Esqueleto conceptual del adaptador TCP. El dominio no aparece aquí por completo.
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;

class ServidorInventario
{
    private ProcesadorComandos procesador;
    public ServidorInventario(ProcesadorComandos procesador){this.procesador=procesador;}

    public void AtenderUnaConexion(int puerto)
    {
        TcpListener listener=new TcpListener(IPAddress.Loopback,puerto);
        listener.Start();
        using(TcpClient cliente=listener.AcceptTcpClient())
        using(NetworkStream red=cliente.GetStream())
        using(StreamReader entrada=new StreamReader(red))
        using(StreamWriter salida=new StreamWriter(red){AutoFlush=true})
        {
            string solicitud=entrada.ReadLine();
            salida.WriteLine(procesador.Procesar(solicitud));
        }
        listener.Stop();
    }
}`,
      explanation:
        "el adaptador sólo recibe/envía strings; `ProcesadorComandos` concentra protocolo y dominio. Esa separación permite probarlo sin red.",
      runnable: false,
      localOnlyNote:
        "Parte del proyecto final local: requiere sockets reales, dos procesos y, para la entrega completa, la UI de escritorio. No se ejecuta en el juez web.",
    },
    {
      type: "matching",
      pairs: [
        {
          left: "Requisito “buscar producto”",
          right: "Caso de uso + test/evidencia de consulta.",
        },
        {
          left: "ProcesadorComandos",
          right: "Pruebas de protocolo sin red.",
        },
        {
          left: "TcpListener",
          right: "Evidencia local de transporte cliente-servidor.",
        },
        {
          left: "XmlInventario",
          right: "Evidencia de serialización/persistencia.",
        },
        {
          left: "UML",
          right: "Debe coincidir con las clases que realmente se entregan.",
        },
        {
          left: "Captura sin pasos reproducibles",
          right: "Evidencia insuficiente por sí sola.",
        },
      ],
    },
    {
      type: "quiz",
      question:
        "¿qué entrega demuestra mejor que la arquitectura está separada correctamente?",
      options: [
        "Toda la lógica de stock vive dentro del evento Click del botón.",
        "El servidor modifica directamente un diccionario público.",
        "El dominio y `ProcesadorComandos` pasan pruebas de consola, y la UI/socket los reutilizan como adaptadores.",
        "El UML muestra clases que no existen en el código.",
      ],
      correctIndex: 2,
      explanation:
        "el proyecto final debe mostrar la misma lógica funcionando detrás de varias fronteras, no duplicada dentro de cada interfaz.",
    },
  ],
});
