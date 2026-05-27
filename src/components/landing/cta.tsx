import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoadingLink } from "@/components/ui/loading-link";

export function FinalCta() {
  return (
    <section className="border-b border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card p-10 text-center sm:p-16">
          <div
            aria-hidden
            className="dot-pattern absolute inset-0 opacity-50 dark:opacity-30"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 -top-24 mx-auto h-64 w-full max-w-2xl bg-gradient-to-b from-primary/25 via-transparent to-transparent blur-3xl"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Deja de copiar código del pizarrón.
              <br />
              <span className="text-primary">Empieza a programarlo.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Gratis. Sin tarjeta. Para todos los estudiantes del CETI
              Guadalajara.
            </p>
            <Button asChild size="xl" className="mt-9">
              <LoadingLink
                href="/registro"
                hintClassName="bg-primary-foreground"
              >
                Crear mi cuenta
                <ArrowRight />
              </LoadingLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
