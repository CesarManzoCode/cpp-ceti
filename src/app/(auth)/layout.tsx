import Link from "next/link";

import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Panel izquierdo: editorial */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border/60 bg-surface-2/40 p-12 lg:flex">
        <div
          aria-hidden
          className="dot-pattern absolute inset-0 opacity-40 dark:opacity-25"
        />

        <Link href="/" className="relative z-10">
          <Logo size="lg" />
        </Link>

        <div className="relative z-10 max-w-md space-y-6">
          <p className="eyebrow text-primary">Manifiesto</p>
          <blockquote className="text-balance text-3xl font-bold leading-[1.15] tracking-[-0.025em] text-foreground sm:text-[34px]">
            Programar se aprende programando.
            <br />
            <span className="text-muted-foreground">
              No memorizando código del pizarrón.
            </span>
          </blockquote>
          <p className="max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            Lecciones cortas, ejercicios reales y un compilador C++ en tu
            navegador. Hecho para estudiantes del CETI Guadalajara.
          </p>
        </div>

        <p className="relative z-10 text-xs text-muted-foreground">
          Proyecto independiente · No oficial del CETI
        </p>
      </aside>

      {/* Panel derecho: form */}
      <main className="relative flex flex-col px-5 py-8 sm:px-10">
        <div
          aria-hidden
          className="dot-pattern absolute inset-0 -z-10 opacity-30 dark:opacity-15 lg:hidden"
        />
        <div className="mb-9 lg:hidden">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>
          <p className="eyebrow mt-5 text-primary/80">Manifiesto</p>
          <p className="mt-1.5 max-w-sm text-[15px] font-medium leading-snug tracking-tight text-foreground">
            Programar se aprende{" "}
            <span className="text-primary">programando</span>.
          </p>
        </div>
        <div className="m-auto w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
