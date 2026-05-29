import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

const proofPoints = [
  "Sin instalar nada",
  "100% en español",
  "Gratis para CETI",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Pattern de fondo único — sin blur blobs */}
      <div
        aria-hidden
        className="dot-pattern absolute inset-0 -z-10 opacity-50 dark:opacity-30"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-28">
        {/* Columna texto */}
        <div
          data-stagger
          style={{ "--stagger": "60ms" } as CSSProperties}
          className="flex flex-col gap-7"
        >
          <div
            style={{ "--i": 0 } as CSSProperties}
            className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-surface/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            <span>Hecho en Guadalajara para estudiantes del CETI</span>
          </div>

          <h1
            style={{ "--i": 1 } as CSSProperties}
            className="animate-fade-up text-balance text-[44px] font-bold leading-[1.02] tracking-[-0.04em] sm:text-[60px] lg:text-[68px]"
          >
            Aprende{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">C++</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-primary/15"
              />
            </span>{" "}
            programando,
            <br className="hidden sm:block" />
            <span className="text-muted-foreground">
              no copiando del pizarrón.
            </span>
          </h1>

          <p
            style={{ "--i": 2 } as CSSProperties}
            className="animate-fade-up max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Lecciones cortas, ejercicios reales y un compilador C++ en tu
            navegador. Practica de verdad, con feedback al instante.
          </p>

          <div
            style={{ "--i": 3 } as CSSProperties}
            className="animate-fade-up flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="xl">
              <Link href="/registro">
                Empezar gratis
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="#como">
                <PlayCircle />
                Ver cómo funciona
              </Link>
            </Button>
          </div>

          <ul
            style={{ "--i": 4 } as CSSProperties}
            className="animate-fade-up flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground"
          >
            {proofPoints.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Columna mockup — proof real del producto, expuesto a lectores de pantalla */}
        <div
          className="relative animate-scale-in"
          role="img"
          aria-label='Editor de código C++ con un programa que imprime "Hola, CETI!", compilado en 312 milisegundos.'
        >
          <CodeMockup />
        </div>
      </div>
    </section>
  );
}

function CodeMockup() {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-lg)]">
      {/* Cabecera limpia — sin window-dots */}
      <div className="flex items-center justify-between border-b border-border/80 bg-surface-2/60 px-4 py-2.5">
        <span className="font-mono text-xs text-muted-foreground">main.cpp</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
          g++17 · 24 mb
        </span>
      </div>

      <div className="grid grid-cols-[auto_1fr] bg-card">
        <pre className="select-none border-r border-border/60 bg-surface-2/30 px-3.5 py-5 text-right font-mono text-[11px] leading-[1.7] text-muted-foreground/70">
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
<span aria-hidden className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-foreground animate-blink" />
        </pre>
      </div>

      <div className="flex items-center justify-between border-t border-border/80 bg-surface-2/40 px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary">
          <PlayCircle className="size-3.5" aria-hidden />
          Ejecutar
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">⌘+Enter</span>
      </div>

      <div className="bg-[var(--terminal-bg)] px-4 py-3.5">
        <div className="mb-1.5 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-2 text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
            Compilado · 312 ms
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            stdout
          </span>
        </div>
        <pre className="font-mono text-[13.5px] text-zinc-100">Hola, CETI!</pre>
      </div>
    </div>
  );
}
