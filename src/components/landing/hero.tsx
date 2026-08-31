import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Portada. Composición asimétrica: el argumento a la izquierda, el
 * producto real a la derecha. El panel de código usa exactamente el
 * mismo cromo que el editor de la app — no es una ilustración, es lo
 * que vas a ver al entrar.
 */
export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:py-28">
        <div>
          <p className="label-micro text-muted-foreground">
            Hecho en Guadalajara para estudiantes del CETI
          </p>

          <h1 className="font-display mt-5 text-balance text-[clamp(2.25rem,7vw,3.75rem)]">
            Aprende a programar escribiendo código.
          </h1>

          <p className="mt-5 max-w-[46ch] text-pretty text-[17px] leading-relaxed text-muted-foreground">
            Cursos de C++ y de Programación Orientada a Objetos con C#, con
            el compilador dentro del navegador. Escribes el código, se compila,
            y te dice qué falló y en qué línea.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="xl">
              <Link href="/registro">
                Crear cuenta gratis
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="#temario">Ver el temario</Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            <li>Sin instalar nada</li>
            <li>100% en español</li>
            <li>Gratis</li>
          </ul>
        </div>

        <CodePanel />
      </div>
    </section>
  );
}

function CodePanel() {
  return (
    <div
      role="img"
      aria-label='Editor de C++ con un programa que imprime "Hola, CETI!" y la consola mostrando esa salida.'
      className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--terminal-border)] bg-terminal shadow-[var(--shadow-lg)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--terminal-border)] px-4 py-2.5">
        <span className="font-mono text-[12px] font-medium text-terminal-muted">
          main.cpp
        </span>
        <span className="text-[12px] font-semibold text-terminal-faint">C++</span>
      </div>

      <div className="grid grid-cols-[2.5rem_1fr]">
        <pre
          aria-hidden
          className="select-none border-r border-[var(--terminal-border)] py-4 pr-3 text-right font-mono text-[11px] leading-[1.75] text-terminal-faint"
        >
{`1
2
3
4
5
6
7`}
        </pre>
        <pre className="overflow-x-auto py-4 pl-4 pr-4 font-mono text-[13px] leading-[1.75] text-terminal-fg">
<span className="text-syntax-keyword">#include</span> <span className="text-syntax-string">{`<iostream>`}</span>{"\n"}
<span className="text-syntax-keyword">using namespace</span> std;{"\n"}
{"\n"}
<span className="text-syntax-type">int</span> <span className="text-syntax-type">main</span>() {"{"}{"\n"}
{"  "}cout {"<<"} <span className="text-syntax-string">{`"Hola, CETI!"`}</span> {"<<"} endl;{"\n"}
{"  "}<span className="text-syntax-keyword">return</span> <span className="text-syntax-number">0</span>;{"\n"}
{"}"}
        </pre>
      </div>

      <div className="border-t border-[var(--terminal-border)] px-4 py-3">
        <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-terminal-muted">
          Salida
        </p>
        <pre className="mt-1.5 font-mono text-[13px] text-terminal-success">
          Hola, CETI!
        </pre>
      </div>
    </div>
  );
}
