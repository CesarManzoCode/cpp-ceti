import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const proofPoints = [
  "Sin instalar nada",
  "100% en español",
  "Gratis para CETI",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Stack de fondo: aurora difusa + grid técnico + stars sutiles en dark.
          Cada capa se compone para profundidad sin saturar — el copy sigue siendo el héroe. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora absolute inset-0 opacity-70 dark:opacity-90" />
        <div className="bg-grid absolute inset-0 opacity-50 dark:opacity-35" />
        <div className="bg-stars absolute inset-0 hidden opacity-50 dark:block" />
        {/* Fade al final del hero para "amarrar" con la siguiente sección. */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-32">
        {/* Columna texto */}
        <div
          data-stagger
          style={{ "--stagger": "70ms" } as CSSProperties}
          className="flex flex-col gap-7"
        >
          {/* Pill premium — más refinado: dot animado + texto + arrow chevron */}
          <Link
            href="#por-que"
            style={{ "--i": 0 } as CSSProperties}
            className="animate-fade-up group inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-surface/70 py-1 pl-1 pr-3 text-xs font-medium text-muted-foreground backdrop-blur-xl transition-[border-color,background-color] hover:border-primary/40 hover:bg-surface/90"
          >
            <span className="grid size-5 place-items-center rounded-full bg-success-soft">
              <span className="relative inline-flex size-1.5" aria-hidden>
                <span className="absolute inset-0 animate-pulse-soft rounded-full bg-success" />
                <span className="relative size-1.5 rounded-full bg-success" />
              </span>
            </span>
            <span className="text-foreground/85">
              Hecho en Guadalajara para estudiantes del CETI
            </span>
            <ArrowRight className="size-3 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>

          {/* H1 — tipografía brutal con clamp y segundo verso en gradient.
              El gradient anima la posición → respiración del color subliminal. */}
          <h1
            style={{ "--i": 1 } as CSSProperties}
            className="animate-fade-up font-display text-balance text-[clamp(2.75rem,8vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.045em]"
          >
            Aprende C++
            <br />
            <span className="text-gradient-primary">programando de verdad.</span>
          </h1>

          <p
            style={{ "--i": 2 } as CSSProperties}
            className="animate-fade-up max-w-xl text-pretty text-[17px] leading-relaxed text-muted-foreground sm:text-[19px]"
          >
            Lecciones cortas, ejercicios reales y un compilador C++ en tu
            navegador. Practica con feedback al instante —{" "}
            <span className="text-foreground/85">sin tutoriales infinitos.</span>
          </p>

          <div
            style={{ "--i": 3 } as CSSProperties}
            className="animate-fade-up flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            {/* CTA principal envuelto en glow — el halo se intensifica en hover. */}
            <span className="glow-primary inline-flex rounded-[var(--radius-md)]">
              <Button asChild size="xl" variant="glow">
                <Link href="/registro">
                  Empezar gratis
                  <ArrowRight />
                </Link>
              </Button>
            </span>
            <Button asChild size="xl" variant="outline">
              <Link href="#como">
                <PlayCircle />
                Ver cómo funciona
              </Link>
            </Button>
          </div>

          <ul
            style={{ "--i": 4 } as CSSProperties}
            className="animate-fade-up flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-foreground/75"
          >
            {proofPoints.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Columna mockup — editor con gradient-border y glow sutil. */}
        <div
          className="relative hidden animate-scale-in sm:block"
          role="img"
          aria-label='Editor de código C++ con un programa que imprime "Hola, CETI!", compilado en 312 milisegundos.'
        >
          {/* Glow detrás del mockup — alimenta el "premium" sin tocar el contenido */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[var(--radius-2xl)] bg-gradient-to-br from-primary/15 via-transparent to-[color:var(--brand-2)]/15 blur-2xl dark:from-primary/25 dark:to-[color:var(--brand-2)]/25"
          />
          <CodeMockup />
        </div>
      </div>
    </section>
  );
}

function CodeMockup() {
  return (
    <div className="gradient-border relative overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)]">
      {/* Capa interna que vive sobre la card; el ::before del gradient-border
          dibuja el contorno y este div mantiene el bg sólido. */}
      <div className="relative rounded-[calc(var(--radius-xl)-1px)] bg-card">
        {/* Cabecera limpia */}
        <div className="flex items-center justify-between border-b border-border/80 bg-surface-2/70 px-4 py-2.5">
          <span className="flex items-center gap-1.5">
            <span className="flex gap-1" aria-hidden>
              <span className="size-2 rounded-full bg-destructive/55" />
              <span className="size-2 rounded-full bg-warning/55" />
              <span className="size-2 rounded-full bg-success/55" />
            </span>
            <span className="ml-2 font-mono text-xs text-muted-foreground">main.cpp</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
            g++17 · 24 mb
          </span>
        </div>

        <div className="grid grid-cols-[auto_1fr] bg-card">
          <pre className="select-none border-r border-border/60 bg-surface-2/40 px-3.5 py-5 text-right font-mono text-[11px] leading-[1.7] text-muted-foreground/70">
{`1
2
3
4
5
6
7
8`}
          </pre>
          <pre className="overflow-x-auto px-4 py-5 font-mono text-[13.5px] leading-[1.7] text-foreground">
<span className="text-fuchsia-500 dark:text-fuchsia-400">#include</span>{" "}<span className="text-emerald-600 dark:text-emerald-400">{`<iostream>`}</span>{"\n"}
<span className="text-fuchsia-500 dark:text-fuchsia-400">using namespace</span>{" "}<span>std;</span>{"\n"}
{"\n"}
<span className="text-sky-600 dark:text-sky-400">int</span>{" "}<span className="text-blue-600 dark:text-blue-400">main</span>() {"{"}{"\n"}
{"  "}<span>cout</span> {"<<"} <span className="text-emerald-600 dark:text-emerald-400">{`"Hola, CETI!"`}</span> {"<<"} <span>endl;</span>{"\n"}
{"  "}<span className="text-fuchsia-500 dark:text-fuchsia-400">return</span> <span className="text-amber-600 dark:text-amber-400">0</span>;{"\n"}
{"}"}
<span aria-hidden className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] animate-blink bg-foreground" />
          </pre>
        </div>

        <div className="flex items-center justify-between border-t border-border/80 bg-surface-2/40 px-4 py-2.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            Compilando en el navegador
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">⌘+Enter</span>
        </div>

        <div className="relative overflow-hidden bg-[var(--terminal-bg)] px-4 py-3.5">
          {/* Scan line MUY sutil sobre el output — vida sin distracción */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"
          />
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="size-1.5 animate-pulse-soft rounded-full bg-emerald-400" aria-hidden />
              Compilado · 312 ms
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              stdout
            </span>
          </div>
          <pre className="font-mono text-[13.5px] text-zinc-100">Hola, CETI!</pre>
        </div>
      </div>
    </div>
  );
}
