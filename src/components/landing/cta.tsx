import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const perks = ["100% gratis", "Sin tarjeta", "Sin instalar nada"];

export function FinalCta() {
  return (
    <section className="border-b border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card p-10 text-center shadow-[var(--shadow-sm)] sm:p-16">
          {/* Patrón sutil — sin blur blobs */}
          <div
            aria-hidden
            className="dot-pattern absolute inset-0 opacity-50 dark:opacity-25"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-[30px] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[44px]">
              Deja de copiar código del pizarrón.
              <br />
              <span className="text-primary">Empieza a programarlo.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Si tu próximo examen es la próxima semana, el mejor momento para
              empezar es hoy.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="xl">
                <Link href="/registro">
                  Crear mi cuenta gratis
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="xl" variant="ghost">
                <Link href="/login">Ya tengo cuenta</Link>
              </Button>
            </div>

            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-foreground/75">
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
