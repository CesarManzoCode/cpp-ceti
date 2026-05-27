import Link from "next/link";
import { ArrowRight, CheckCircle2, Play, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      {/* Pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-[600px] max-w-7xl bg-gradient-to-b from-primary/15 via-transparent to-transparent blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-16 lg:py-32">
        {/* Texto */}
        <div className="flex flex-col justify-center space-y-6">
          <Badge variant="default" className="w-fit">
            <Sparkles className="size-3" />
            Hecho en Guadalajara para estudiantes del CETI
          </Badge>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Aprende{" "}
            <span className="bg-gradient-to-br from-primary via-primary to-blue-700 bg-clip-text text-transparent">
              C++
            </span>{" "}
            programando,
            <br className="hidden sm:block" />
            no memorizando del pizarrón.
          </h1>

          <p className="max-w-lg text-lg text-muted-foreground">
            Lecciones cortas, ejercicios reales y un compilador C++ en tu navegador.
            La plataforma que tus maestros nunca te dieron.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl" className="text-base">
              <Link href="/registro">
                Empezar gratis
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="text-base">
              <Link href="#como">
                <Play className="size-4" />
                Ver cómo funciona
              </Link>
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-success" />
              Sin instalar nada
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-success" />
              100% en español
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-success" />
              Gratis para CETI
            </li>
          </ul>
        </div>

        {/* Editor mockup */}
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-700/20 blur-2xl" />
          <CodeMockup />
        </div>
      </div>
    </section>
  );
}

function CodeMockup() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
        </div>
        <span className="font-mono text-xs text-muted-foreground">main.cpp</span>
        <span className="w-12" />
      </div>

      {/* Code area */}
      <div className="grid grid-cols-[auto_1fr]">
        <pre className="select-none border-r bg-muted/20 px-3 py-4 text-right font-mono text-xs leading-[1.65] text-muted-foreground">
{`1
2
3
4
5
6
7
8`}
        </pre>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-[1.65]">
<span className="text-fuchsia-500">#include</span>{" "}<span className="text-emerald-500">{`<iostream>`}</span>{"\n"}
<span className="text-fuchsia-500">using namespace</span>{" "}<span className="text-foreground">std;</span>{"\n"}
{"\n"}
<span className="text-cyan-500">int</span>{" "}<span className="text-blue-500">main</span>() {"{"}{"\n"}
{"  "}<span className="text-foreground">cout</span> {"<<"} <span className="text-emerald-500">{`"¡Hola, CETI!"`}</span> {"<<"} <span className="text-foreground">endl;</span>{"\n"}
{"  "}<span className="text-fuchsia-500">return</span> <span className="text-amber-500">0</span>;{"\n"}
{"}"}{"\n"}
        </pre>
      </div>

      {/* Output panel */}
      <div className="border-t bg-zinc-950/95 px-4 py-3 font-mono text-xs">
        <div className="mb-1 flex items-center gap-2 text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Compilado · 312ms
        </div>
        <div className="text-zinc-300">¡Hola, CETI!</div>
      </div>
    </div>
  );
}
