import type { CSSProperties } from "react";
import { BookOpen, Check, Code2, Play, Puzzle, Terminal } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Showcase de los 4 tipos de lección que tiene la app.
 * Cada card muestra un mini-mockup real del tipo,
 * para demostrar que el producto existe.
 */
export function LessonTypes() {
  return (
    <section className="border-b border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="lo que vas a hacer"
          title="Cuatro formas de aprender, todas en el navegador."
          description="Cada lección combina teoría justa, ejemplos ejecutables, preguntas y retos donde TÚ escribes el código."
          className="mx-auto items-center"
        />

        <ul
          data-stagger
          style={{ "--stagger": "60ms" } as CSSProperties}
          className="mt-14 grid gap-5 sm:grid-cols-2"
        >
          <li style={{ "--i": 0 } as CSSProperties} className="animate-fade-up">
            <TheoryCard />
          </li>
          <li style={{ "--i": 1 } as CSSProperties} className="animate-fade-up">
            <ExampleCard />
          </li>
          <li style={{ "--i": 2 } as CSSProperties} className="animate-fade-up">
            <QuizCard />
          </li>
          <li style={{ "--i": 3 } as CSSProperties} className="animate-fade-up">
            <ChallengeCard />
          </li>
        </ul>
      </div>
    </section>
  );
}

function TypeShell({
  label,
  icon: Icon,
  title,
  description,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
      <div className="space-y-2.5 p-6 sm:p-7">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <Icon className="size-3.5" aria-hidden />
          {label}
        </div>
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="mt-auto border-t border-border/70 bg-surface-2/40 p-5">
        {children}
      </div>
    </article>
  );
}

function TheoryCard() {
  return (
    <TypeShell
      label="Teoría"
      icon={BookOpen}
      title="Conceptos al grano."
      description="Sin teoría infinita. Solo lo que necesitas para entender el siguiente ejercicio."
    >
      <div className="space-y-1.5 text-sm leading-relaxed">
        <p>
          En C++, un programa siempre empieza por la función{" "}
          <code className="code-inline">main</code>.
        </p>
        <p className="text-muted-foreground">
          Es como decir <em>“empieza aquí”</em>. El compilador busca esa función
          y la ejecuta.
        </p>
      </div>
    </TypeShell>
  );
}

function ExampleCard() {
  return (
    <TypeShell
      label="Ejemplo"
      icon={Code2}
      title="Código que puedes correr."
      description="Ve el ejemplo. Cámbialo. Ejecútalo en el navegador y observa qué pasa."
    >
      <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--terminal-border)] bg-[var(--terminal-bg)]">
        <div className="flex items-center justify-between border-b border-[var(--terminal-border)] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
          <span className="font-mono normal-case tracking-normal">ejemplo.cpp</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
            <Play className="size-2.5 fill-current" aria-hidden /> run
          </span>
        </div>
        <pre className="px-3 py-2.5 font-mono text-[11.5px] leading-[1.6] text-zinc-100">
<span className="text-sky-400">int</span>{" "}
<span className="text-blue-400">main</span>(){" {"}{"\n"}
{"  "}cout {"<<"} <span className="text-emerald-400">{`"Hola"`}</span>;{"\n"}
{"}"}
        </pre>
      </div>
    </TypeShell>
  );
}

function QuizCard() {
  return (
    <TypeShell
      label="Quiz"
      icon={Puzzle}
      title="Verifica que entendiste."
      description="Preguntas cortas con feedback inmediato. Si fallas, te decimos por qué."
    >
      <div className="space-y-2 text-sm">
        <p className="text-xs text-muted-foreground">
          ¿Qué imprime <code className="code-inline">cout {"<<"} 5 + 3</code>?
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-border bg-surface-2/40 px-2.5 py-1.5 text-[13px]">
            <span className="grid size-5 place-items-center rounded border border-border bg-card font-mono text-[10px] font-bold">
              A
            </span>
            <span className="text-muted-foreground">53</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-success bg-success-soft px-2.5 py-1.5 text-[13px] text-success">
            <span className="grid size-5 place-items-center rounded border border-success bg-success font-mono text-[10px] font-bold text-success-foreground">
              B
            </span>
            <span className="font-medium">8</span>
            <Check className="ml-auto size-4" strokeWidth={3} aria-hidden />
          </div>
        </div>
      </div>
    </TypeShell>
  );
}

function ChallengeCard() {
  return (
    <TypeShell
      label="Reto"
      icon={Terminal}
      title="Tú escribes el código."
      description="La plataforma compila, corre tests y te da feedback. Ganas XP al pasar."
    >
      <div className="space-y-2">
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--terminal-border)] bg-[var(--terminal-bg)]">
          <pre className="px-3 py-2 font-mono text-[11.5px] leading-[1.55] text-zinc-100">
{"// imprime el promedio de a y b\n"}
<span className="text-sky-400">double</span>{" "}promedio = <span className="text-zinc-400">{"/* ... */"}</span>;
          </pre>
        </div>
        <div className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-success/30 bg-success-soft px-2.5 py-1.5 text-xs text-success">
          <Check className="size-3.5" strokeWidth={3} aria-hidden />
          <span className="font-medium">3/3 tests · +30 XP</span>
        </div>
      </div>
    </TypeShell>
  );
}
