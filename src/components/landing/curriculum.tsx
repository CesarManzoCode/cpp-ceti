import { Badge } from "@/components/ui/badge";

const units = [
  {
    n: 1,
    title: "Tu primer programa en C++",
    topics: ["Hola Mundo", "Estructura de un programa", "Compilar y ejecutar", "Comentarios"],
    available: true,
  },
  {
    n: 2,
    title: "Variables y tipos de datos",
    topics: ["int, float, double", "char y string", "bool", "Constantes", "Operadores"],
    available: true,
  },
  {
    n: 3,
    title: "Entrada y salida",
    topics: ["cin / cout", "getline", "Formateo"],
    available: false,
  },
  {
    n: 4,
    title: "Estructuras de control",
    topics: ["if / else", "switch", "while", "for", "do-while"],
    available: false,
  },
  {
    n: 5,
    title: "Funciones",
    topics: ["Definición", "Parámetros", "Retorno", "Sobrecarga", "Recursión"],
    available: false,
  },
  {
    n: 6,
    title: "Arreglos y vectores",
    topics: ["Arrays", "vector<T>", "Iteración", "std::string"],
    available: false,
  },
  {
    n: 7,
    title: "Punteros y referencias",
    topics: ["* y &", "Paso por valor vs referencia", "Aritmética de punteros"],
    available: false,
  },
  {
    n: 8,
    title: "Programación orientada a objetos",
    topics: ["Clases", "Objetos", "Constructores", "Herencia", "Polimorfismo"],
    available: false,
  },
];

export function Curriculum() {
  return (
    <section id="temario" className="border-b py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-primary">
            Temario
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Basado en el plan oficial del CETI
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            8 unidades que van del primer <code className="code-inline">cout</code> hasta POO.
            Nuevas lecciones cada semana.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {units.map((u) => (
            <div
              key={u.n}
              className="group relative rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  U{u.n.toString().padStart(2, "0")}
                </span>
                {u.available ? (
                  <Badge variant="success">Disponible</Badge>
                ) : (
                  <Badge variant="secondary">Próximo</Badge>
                )}
              </div>
              <h3 className="mb-3 text-base font-semibold leading-snug">
                {u.title}
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {u.topics.slice(0, 3).map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <span className="size-1 rounded-full bg-muted-foreground/40" />
                    {t}
                  </li>
                ))}
                {u.topics.length > 3 ? (
                  <li className="text-muted-foreground/60">
                    + {u.topics.length - 3} más
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
