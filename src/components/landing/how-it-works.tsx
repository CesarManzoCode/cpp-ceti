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

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="absolute -left-3 -top-3 font-mono text-6xl font-bold text-primary/10">
                {s.n}
              </div>
              <div className="relative">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                  <s.icon className="size-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-muted-foreground">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
