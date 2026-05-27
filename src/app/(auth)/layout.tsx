import Link from "next/link";

import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Panel izquierdo: branding editorial */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border/60 bg-surface-2/40 p-12 lg:flex">
        <div
          aria-hidden
          className="dot-pattern absolute inset-0 opacity-60 dark:opacity-30"
        />
        <div
          aria-hidden
          className="absolute -left-32 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
        />

        <Link href="/" className="relative z-10">
          <Logo size="lg" />
        </Link>

        <div className="relative z-10 max-w-md space-y-7">
          <p className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            <span aria-hidden className="opacity-70">::</span>
            manifiesto
          </p>
          <blockquote className="font-display text-balance text-[28px] leading-[1.1] sm:text-[34px] text-foreground">
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

        <div className="relative z-10">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card/90 shadow-[var(--shadow-md)] backdrop-blur">
            <div className="flex items-center gap-2 border-b border-border/80 bg-surface-2/60 px-4 py-2 text-[11px] text-muted-foreground">
              <span className="size-2 rounded-full bg-success" aria-hidden />
              main.cpp
            </div>
            <pre className="overflow-x-auto px-4 py-3 font-mono text-[12px] leading-[1.65] text-foreground/85">
{`#include <iostream>
using namespace std;

int main() {
  cout << "Hola, CETI!" << endl;
  return 0;
}`}
            </pre>
          </div>
        </div>
      </aside>

      {/* Panel derecho: form */}
      <main className="flex flex-col px-5 py-8 sm:px-10">
        <header className="mb-10 flex items-center justify-between lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
        </header>
        <div className="m-auto w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
