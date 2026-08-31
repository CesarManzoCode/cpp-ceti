import Link from "next/link";
import { Check } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { UNOFFICIAL_NOTICE } from "@/lib/branding";

/**
 * Registro / inicio de sesión. El panel izquierdo no vende: recuerda qué
 * es esto y qué vas a encontrar del otro lado. Sin fondos difusos —
 * la misma tinta sobre papel que el resto del producto.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1fr]">
      <aside className="hidden flex-col justify-between border-r border-border bg-surface-2 p-10 lg:flex xl:p-14">
        <Link
          href="/"
          className="-m-2 w-fit rounded-[var(--radius-sm)] p-2 transition-opacity hover:opacity-75"
        >
          <Logo size="lg" />
        </Link>

        <div className="max-w-md">
          <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-primary">
            La idea
          </p>
          <p className="font-display mt-5 text-balance text-[clamp(1.75rem,3vw,2.25rem)]">
            Programar se aprende programando.
          </p>
          <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-muted-foreground">
            Lecciones cortas, ejercicios reales y un compilador dentro de tu
            navegador. Hecho para estudiantes del CETI Guadalajara.
          </p>

          <ul className="mt-9 flex flex-col gap-3.5">
            {[
              "Escribes código de verdad, no llenas cuestionarios",
              "El compilador te dice qué falló y en qué línea",
              "Tu avance, tu racha y tus XP quedan guardados",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[15px] leading-relaxed text-foreground"
              >
                <Check
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  strokeWidth={2.8}
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[13px] font-medium text-muted-foreground">
          {UNOFFICIAL_NOTICE}
        </p>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="mb-8 lg:hidden">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>
        </div>
        <div className="m-auto w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
