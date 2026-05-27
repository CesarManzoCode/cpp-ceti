import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoadingLink } from "@/components/ui/loading-link";

const proofPoints = [
  "Sin instalar nada",
  "100% en español",
  "Gratis para CETI",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Soft dot-pattern + radial fade — replaces the heavy grid */}
      <div
        aria-hidden
        className="dot-pattern absolute inset-0 -z-10 opacity-60 dark:opacity-40"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 -top-32 -z-10 mx-auto h-[520px] max-w-5xl bg-gradient-to-b from-primary/15 via-transparent to-transparent blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28">
        {/* Texto */}
        <div
          data-stagger
          style={{ "--stagger": "70ms" } as CSSProperties}
          className="flex flex-col gap-7"
        >
          <div
            style={{ "--i": 0 } as CSSProperties}
            className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-surface/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <span className="relative flex size-2 items-center justify-center">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-success animate-pulse-ring"
              />
              <span className="relative size-1.5 rounded-full bg-success" />
            </span>
            Hecho en Guadalajara para estudiantes del CETI
          </div>

          <h1
            style={{ "--i": 1 } as CSSProperties}
            className="animate-fade-up text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]"
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
            no memorizando del pizarrón.
          </h1>

          <p
            style={{ "--i": 2 } as CSSProperties}
            className="animate-fade-up max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            Lecciones cortas, ejercicios reales y un compilador C++ en tu
            navegador. La plataforma que tus maestros nunca te dieron.
          </p>

          <div
            style={{ "--i": 3 } as CSSProperties}
            className="animate-fade-up flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="xl">
              <LoadingLink
                href="/registro"
                hintClassName="bg-primary-foreground"
              >
                Empezar gratis
                <ArrowRight />
              </LoadingLink>
            </Button>
            <Button asChild size="xl" variant="ghost">
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
                <CheckCircle2 className="size-4 text-success" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Editor mockup */}
        <div className="animate-scale-in relative">
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/25 via-primary/5 to-transparent blur-2xl"
          />
          <CodeMockup />
        </div>
      </div>
    </section>
  );
}

function CodeMockup() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-xl)]">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-border/80 bg-surface-2/60 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-success" aria-hidden />
          main.cpp
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          C++ · g++17
        </span>
      </div>

      {/* Code area */}
      <div className="grid grid-cols-[auto_1fr] bg-card">
        <pre
          aria-hidden
          className="select-none border-r border-border/60 bg-surface-2/40 px-3.5 py-4 text-right font-mono text-[11px] leading-[1.7] text-muted-foreground/70"
        >
{`1
2
3
4
5
6
7`}
        </pre>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-[1.7] text-foreground">
<span className="text-fuchsia-500 dark:text-fuchsia-400">#include</span>{" "}<span className="text-emerald-600 dark:text-emerald-400">{`<iostream>`}</span>{"\n"}
<span className="text-fuchsia-500 dark:text-fuchsia-400">using namespace</span>{" "}<span>std;</span>{"\n"}
{"\n"}
<span className="text-sky-600 dark:text-sky-400">int</span>{" "}<span className="text-blue-600 dark:text-blue-400">main</span>() {"{"}{"\n"}
{"  "}<span>cout</span> {"<<"} <span className="text-emerald-600 dark:text-emerald-400">{`"¡Hola, CETI!"`}</span> {"<<"} <span>endl;</span>{"\n"}
{"  "}<span className="text-fuchsia-500 dark:text-fuchsia-400">return</span> <span className="text-amber-600 dark:text-amber-400">0</span>;{"\n"}
{"}"}
        </pre>
      </div>

      {/* Output panel */}
      <div className="border-t border-border/80 bg-[var(--terminal-bg)] px-4 py-3">
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-2 text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
            Compilado · 312 ms
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            stdout
          </span>
        </div>
        <pre className="font-mono text-[13px] text-zinc-100">
          ¡Hola, CETI!
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-zinc-100 animate-blink"
          />
        </pre>
      </div>
    </div>
  );
}
