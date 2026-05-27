import { CircleDot, PlayCircle, Trophy } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: PlayCircle,
    title: "Lecciones de 5 minutos",
    body: "Un concepto a la vez. Sin teoría infinita. Cada idea va acompañada de un ejemplo que puedes correr.",
  },
  {
    n: "02",
    icon: CircleDot,
    title: "Práctica inmediata",
    body: "Cada lección termina con un ejercicio que TÚ escribes. La plataforma lo compila y te da feedback al instante.",
  },
  {
    n: "03",
    icon: Trophy,
    title: "Progreso visible",
    body: "Tus XP, tu racha y tu avance por unidad — todo guardado. Vuelve cuando quieras y sigue donde lo dejaste.",
  },
];

export function HowItWorks() {
  return (
    <section id="como" className="border-b bg-muted/20 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-primary">
            Cómo funciona
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            90% práctica · 10% teoría
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Porque programar se aprende programando — no escuchando.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-primary/15 font-mono text-sm font-bold text-primary">
                  {s.n}
                </span>
                <s.icon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold leading-snug">
                {s.title}
              </h3>
              <p className="text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
