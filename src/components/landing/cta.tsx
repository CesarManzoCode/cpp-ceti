import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-b py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-card to-card p-10 text-center shadow-xl sm:p-16">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Deja de copiar código del pizarrón.
              <br />
              <span className="bg-gradient-to-br from-primary to-blue-700 bg-clip-text text-transparent">
                Empieza a programarlo.
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Gratis. Sin tarjeta. Para todos los estudiantes del CETI Guadalajara.
            </p>
            <Button asChild size="xl" className="mt-8 text-base">
              <Link href="/registro">
                Crear mi cuenta
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
