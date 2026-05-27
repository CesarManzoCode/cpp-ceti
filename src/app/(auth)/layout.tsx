import Link from "next/link";

import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-dvh lg:grid-cols-2">
      {/* Panel izquierdo: branding */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/15 via-background to-background p-10 lg:flex">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="relative z-10">
          <Link href="/">
            <Logo size="lg" />
          </Link>
        </div>
        <div className="relative z-10 max-w-md space-y-6">
          <blockquote className="text-2xl font-medium leading-relaxed text-foreground">
            “Programar se aprende programando.
            <br />
            No memorizando código del pizarrón.”
          </blockquote>
          <p className="text-sm text-muted-foreground">
            Lecciones cortas, ejercicios reales, un compilador C++ en tu navegador.
            Hecho para estudiantes del CETI Guadalajara.
          </p>
        </div>
        <div className="relative z-10 font-mono text-xs text-muted-foreground">
          <pre className="rounded-lg border bg-card/60 p-4 backdrop-blur-sm">
{`#include <iostream>
using namespace std;

int main() {
  cout << "Hola, CETI!" << endl;
  return 0;
}`}
          </pre>
        </div>
      </aside>

      {/* Panel derecho: form */}
      <main className="flex flex-col px-6 py-10 sm:px-10">
        <header className="mb-10 flex justify-between lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
        </header>
        <div className="m-auto w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
