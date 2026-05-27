import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";
import { Kbd } from "@/components/ui/kbd";
import { Logo } from "@/components/logo";

export const metadata = {
  title: "Página no encontrada",
};

/**
 * 404 con identidad de terminal — imita un compile error de C++,
 * que es la situación más reconocible para nuestro público.
 */
export default function NotFound() {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-background px-5 py-10">
      <div
        aria-hidden
        className="dot-pattern absolute inset-0 opacity-50 dark:opacity-30"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 -top-40 -z-0 mx-auto h-[400px] max-w-2xl bg-gradient-to-b from-destructive/10 via-transparent to-transparent blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-8 text-center">
        <Link href="/" className="-m-2 rounded-md p-2">
          <Logo size="lg" />
        </Link>

        <div className="w-full overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-lg)]">
          <div className="flex items-center justify-between border-b border-border/80 bg-surface-2/60 px-4 py-2.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-destructive" aria-hidden />
              compile-error.log
            </span>
            <span className="font-mono uppercase tracking-wider">404</span>
          </div>
          <pre className="overflow-x-auto px-5 py-5 text-left font-mono text-[13px] leading-[1.7] text-foreground">
<span className="text-destructive">error: </span>
<span>no se encontró la ruta solicitada</span>{"\n"}
<span className="text-muted-foreground">  --&gt; </span>
<span className="text-primary">/</span>
<span className="text-muted-foreground">{"<página inexistente>"}</span>{"\n"}
{"\n"}
<span className="text-muted-foreground">{"// Tal vez escribiste mal la URL,"}</span>{"\n"}
<span className="text-muted-foreground">{"// o este enlace ya no existe."}</span>
          </pre>
        </div>

        <div className="flex flex-col items-center gap-3">
          <ConsoleEyebrow tone="muted">sugerencia</ConsoleEyebrow>
          <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Vuelve a un terreno conocido.
          </h1>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <Home />
              Ir al inicio
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/app">
              Mi panel
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <p className="hidden text-xs text-muted-foreground sm:inline-flex sm:items-center sm:gap-1.5">
          <Kbd>Esc</Kbd> para volver atrás
        </p>
      </div>
    </div>
  );
}
