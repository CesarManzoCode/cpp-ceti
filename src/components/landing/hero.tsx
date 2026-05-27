import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const proofPoints = [
  "Sin instalar nada",
  "100% en español",
  "Gratis para CETI",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Backgrounds */}
      <div
        aria-hidden
        className="dot-pattern absolute inset-0 -z-10 opacity-60 dark:opacity-40"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 -top-32 -z-10 mx-auto h-[680px] max-w-5xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:py-28">
        {/* Text column */}
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
            <span>Hecho en Guadalajara para estudiantes del CETI</span>
          </div>

          <h1
            style={{ "--i": 1 } as CSSProperties}
            className="animate-fade-up text-balance text-[44px] font-bold leading-[1] tracking-[-0.035em] sm:text-[60px] lg:text-[68px]"
          >
            Aprende{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-br from-primary via-primary to-blue-700 bg-clip-text text-transparent">
                C++
              </span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 -z-0 h-4 bg-primary/15"
              />
            </span>{" "}
            programando,
            <br className="hidden sm:block" />
            no copiando del pizarrón.
          </h1>

          <p
            style={{ "--i": 2 } as CSSProperties}
            className="animate-fade-up max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Lecciones cortas, ejercicios reales y un compilador C++ en tu
            navegador. La plataforma que tus maestros nunca te dieron.
          </p>

          <div
            style={{ "--i": 3 } as CSSProperties}
            className="animate-fade-up flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="xl" className="shadow-[var(--shadow-glow)]">
              <Link href="/registro">
                Empezar gratis
                <ArrowRight />
              </Link>
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

        {/* Visual column: layered mockup */}
        <div className="relative animate-scale-in" aria-hidden>
          {/* Glow */}
          <div
            className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-primary/30 via-primary/5 to-transparent blur-2xl"
          />

          <CodeMockup />

          {/* Floating: XP achievement */}
          <div className="absolute -top-4 -right-2 hidden translate-x-2 animate-fade-up rounded-2xl border border-warning/40 bg-card p-3 shadow-[var(--shadow-lg)] backdrop-blur sm:flex sm:items-center sm:gap-3"
            style={{ animationDelay: "500ms" }}
          >
            <div className="grid size-10 place-items-center rounded-xl bg-warning-soft text-warning-foreground">
              <Trophy className="size-5 text-warning" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Logro desbloqueado
              </p>
              <p className="text-sm font-semibold leading-tight">
                Primer paso
              </p>
            </div>
          </div>

          {/* Floating: XP gain */}
          <div className="absolute -bottom-4 -left-2 hidden -translate-x-2 animate-fade-up items-center gap-2 rounded-full border border-primary/40 bg-card px-3 py-1.5 shadow-[var(--shadow-lg)] backdrop-blur sm:inline-flex"
            style={{ animationDelay: "700ms" }}
          >
            <Sparkles className="size-3.5 text-primary" />
            <span className="text-sm font-bold tabular-nums text-foreground">+30 XP</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeMockup() {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-xl)]">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-border/80 bg-surface-2/60 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-red-400/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-emerald-400/70" />
          </span>
          <span className="ml-2 font-mono">main.cpp</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
          <Zap className="size-2.5" />
          live
        </span>
      </div>

      {/* Code area */}
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
<span aria-hidden className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-foreground animate-blink" />
        </pre>
      </div>

      {/* Run bar */}
      <div className="flex items-center justify-between border-y border-border/80 bg-surface-2/40 px-4 py-2">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 font-medium text-primary">
            <PlayCircle className="size-3" />
            Ejecutar
          </span>
          <span className="font-mono text-[10px]">⌘+Enter</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          g++17 · linux · 24mb
        </span>
      </div>

      {/* Output panel */}
      <div className="bg-[var(--terminal-bg)] px-4 py-3.5">
        <div className="mb-1.5 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-2 text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Compilado · 312 ms
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            stdout
          </span>
        </div>
        <pre className="font-mono text-[13.5px] text-zinc-100">
          Hola, CETI!
        </pre>
      </div>
    </div>
  );
}
