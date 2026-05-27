import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const perks = [
  "100% gratis",
  "Sin tarjeta",
  "Sin instalar nada",
];

export function FinalCta() {
  return (
    <section className="border-b border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-10 text-center shadow-[var(--shadow-lg)] sm:p-16">
          <div
            aria-hidden
            className="dot-pattern absolute inset-0 opacity-40 dark:opacity-25"
          />
          <div
            aria-hidden
            className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[600px] bg-primary/25 blur-3xl"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Deja de copiar código del pizarrón.
              <br />
              <span className="bg-gradient-to-br from-primary via-primary to-blue-700 bg-clip-text text-transparent">
                Empieza a programarlo.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Si tu próximo examen es la próxima semana, el mejor momento para
              empezar es hoy.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="xl" className="shadow-[var(--shadow-glow)]">
                <Link href="/registro">
                  Crear mi cuenta gratis
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="xl" variant="ghost">
                <Link href="/login">Ya tengo cuenta</Link>
              </Button>
            </div>

            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
