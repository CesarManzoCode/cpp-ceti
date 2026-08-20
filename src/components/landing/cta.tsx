import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-b border-border bg-surface-2 py-16 lg:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div>
          <h2 className="font-display max-w-[16ch] text-balance text-[clamp(1.75rem,4.5vw,2.75rem)]">
            Lo que ves en clase, vuélvelo tuyo programando.
          </h2>
          <p className="mt-4 max-w-[48ch] text-pretty text-[15px] leading-relaxed text-muted-foreground">
            Si tu próximo examen es la semana que entra, el mejor momento para
            empezar a practicar es hoy.
          </p>
        </div>

        <div className="shrink-0">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl">
              <Link href="/registro">
                Crear mi cuenta gratis
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/login">Ya tengo cuenta</Link>
            </Button>
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            100% gratis · sin tarjeta · sin instalar nada
          </p>
        </div>
      </div>
    </section>
  );
}
