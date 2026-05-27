import { BookX, Code2, GraduationCap } from "lucide-react";

const problems = [
  {
    icon: BookX,
    title: "El pizarrón no enseña",
    body: "Los maestros copian código sin explicar la lógica. Tú memorizas. Y el examen te cae encima.",
  },
  {
    icon: Code2,
    title: "Mimo no tiene C++",
    body: "Sololearn, Codecademy, Mimo — ninguna enseña C++. Y menos en español.",
  },
  {
    icon: GraduationCap,
    title: "Reprobar no es por flojera",
    body: "Es por falta de recursos. Esta plataforma te da lo que la escuela debería darte.",
  },
];

export function Why() {
  return (
    <section id="por-que" className="border-b py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-primary">
            El problema
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            En el CETI, C++ se reprueba en masa.
            <br />
            <span className="text-muted-foreground">Y no es tu culpa.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {problems.map((p) => (
            <div
              key={p.title}
              className="group rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <p.icon className="size-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
