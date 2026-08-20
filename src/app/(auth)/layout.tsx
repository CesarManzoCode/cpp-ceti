import Link from "next/link";

import { Logo } from "@/components/shared/logo";

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
          className="-m-2 w-fit rounded-[var(--radius-xs)] p-2 transition-opacity hover:opacity-70"
        >
          <Logo size="lg" />
        </Link>

        <div className="max-w-md">
          <p className="label-micro text-muted-foreground">La idea</p>
          <p className="font-display mt-5 text-balance text-[clamp(1.75rem,3vw,2.25rem)]">
            Programar se aprende programando.
          </p>
          <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-muted-foreground">
            Lecciones cortas, ejercicios reales y un compilador de C++ en tu
            navegador. Hecho para estudiantes del CETI Guadalajara.
          </p>

          <ul className="mt-9 border-t border-border">
            {[
              "Escribes código de verdad, no llenas cuestionarios",
              "El compilador te dice qué falló y en qué línea",
              "Tu avance, tu racha y tus XP quedan guardados",
            ].map((item, i) => (
              <li
                key={item}
                className="flex gap-4 border-b border-border py-3.5 text-sm leading-relaxed text-foreground/90"
              >
                <span
                  aria-hidden
                  className="shrink-0 font-mono text-[11px] tabular-nums text-primary"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono text-[11px] text-muted-foreground">
          Proyecto independiente · No oficial del CETI
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
