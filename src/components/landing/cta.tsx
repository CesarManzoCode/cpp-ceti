import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const perks = ["100% gratis", "Sin tarjeta", "Sin instalar nada"];

export function FinalCta() {
  return (
    <section className="border-b border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card p-10 text-center shadow-[var(--shadow-md)] sm:p-16">
          {/* Stack de fondo: aurora + grid sutil — el centro de gravedad del cierre */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="aurora absolute inset-0 opacity-65 dark:opacity-95" />
            <div className="bg-grid absolute inset-0 opacity-40 dark:opacity-25" />
            <div className="bg-stars absolute inset-0 hidden opacity-40 dark:block" />
          </div>
          {/* Línea decorativa arriba */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-[25%] top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
          />

          <div className="relative">
            <h2 className="font-display mx-auto max-w-3xl text-balance text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              Lo que ves en clase,
              <br />
              <span className="text-gradient-primary">
                vuélvelo tuyo programando.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Si tu próximo examen es la próxima semana, el mejor momento para
              empezar a practicar es hoy.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <span className="glow-primary inline-flex rounded-[var(--radius-md)]">
                <Button asChild size="xl" variant="glow">
                  <Link href="/registro">
                    Crear mi cuenta gratis
                    <ArrowRight />
                  </Link>
                </Button>
              </span>
              <Button asChild size="xl" variant="ghost">
                <Link href="/login">Ya tengo cuenta</Link>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-foreground/75">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" aria-hidden />
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
