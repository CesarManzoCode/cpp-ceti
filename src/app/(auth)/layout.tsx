import Link from "next/link";

import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Panel izquierdo: editorial con aurora + grid técnico */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border/60 bg-surface-2/40 p-12 lg:flex">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="aurora absolute inset-0 opacity-55 dark:opacity-85" />
          <div className="bg-grid absolute inset-0 opacity-40 dark:opacity-25" />
          <div className="bg-stars absolute inset-0 hidden opacity-40 dark:block" />
        </div>

        <Link href="/" className="relative z-10">
          <Logo size="lg" />
        </Link>

        <div className="relative z-10 max-w-md space-y-6">
          <p className="eyebrow text-primary">Manifiesto</p>
          <blockquote className="font-display text-balance text-[clamp(2rem,4vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.035em] text-foreground">
            Programar se aprende{" "}
            <span className="text-gradient-primary">programando.</span>
            <br />
            <span className="text-muted-foreground">
              Practicándolo hasta que se te queda.
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
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 lg:hidden">
          <div className="aurora absolute inset-0 opacity-40 dark:opacity-60" />
          <div className="bg-grid absolute inset-0 opacity-30 dark:opacity-20" />
        </div>
        <div className="mb-9 lg:hidden">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>
          <p className="eyebrow mt-5 text-primary/80">Manifiesto</p>
          <p className="mt-1.5 max-w-sm text-[15px] font-medium leading-snug tracking-tight text-foreground">
            Programar se aprende{" "}
            <span className="text-gradient-primary">programando</span>.
          </p>
        </div>
        <div className="m-auto w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
