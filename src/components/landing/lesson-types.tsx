import type { CSSProperties } from "react";
import {
  BookOpen,
  Check,
  Code2,
  Play,
  Puzzle,
  Sparkles,
  Terminal,
} from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Showcase visual de los 4 tipos de lección que tiene la app.
 * Cada card es un mini-mockup del tipo, con su personalidad visual
 * — demuestra que el producto es real, no vaporware.
 */
export function LessonTypes() {
  return (
    <section className="border-b border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="lo que vas a hacer"
          title="4 formas de aprender, todas en el navegador."
          description="Cada lección combina teoría justa, ejemplos ejecutables, preguntas y retos donde TÚ escribes el código."
          className="mx-auto items-center"
        />

        <ul
          data-stagger
          style={{ "--stagger": "70ms" } as CSSProperties}
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
  badge,
  badgeTone,
  title,
  description,
  children,
}: {
  badge: React.ReactNode;
  badgeTone: "primary" | "success" | "warning" | "info";
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const toneClasses = {
    primary: "bg-primary/15 text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning-foreground",
    info: "bg-info-soft text-info",
  }[badgeTone];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-xs)] transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-md)]">
      <div className="space-y-2 p-6 sm:p-7">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${toneClasses}`}
        >
          {badge}
        </span>
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
      badge={
        <>
          <BookOpen className="size-3" /> Teoría
        </>
      }
      badgeTone="primary"
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
      badge={
        <>
          <Code2 className="size-3" /> Ejemplo
        </>
      }
      badgeTone="info"
      title="Código que puedes correr."
      description="Ve el ejemplo. Cámbialo. Ejecútalo en el navegador y observa qué pasa."
    >
      <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--terminal-border)] bg-[var(--terminal-bg)]">
        <div className="flex items-center justify-between border-b border-[var(--terminal-border)] px-3 py-1.5 text-[10px] uppercase tracking-wider text-zinc-400">
          <span className="font-mono">ejemplo.cpp</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-1.5 py-0.5 font-semibold text-emerald-400">
            <Play className="size-2.5 fill-current" /> run
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
      badge={
        <>
          <Puzzle className="size-3" /> Quiz
        </>
      }
      badgeTone="warning"
      title="Verifica que entendiste."
      description="Preguntas cortas con feedback inmediato. Si fallas, te decimos por qué."
    >
      <div className="space-y-2 text-sm">
        <p className="text-xs font-medium text-muted-foreground">
          ¿Qué imprime <code className="code-inline">cout {"<<"} 5 + 3</code>?
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-[13px]">
            <span className="grid size-5 place-items-center rounded border border-border bg-surface-2 font-mono text-[10px] font-bold">
              A
            </span>
            <span>53</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-md border border-success bg-success-soft px-2.5 py-1.5 text-[13px] text-success">
            <span className="grid size-5 place-items-center rounded border border-success bg-success font-mono text-[10px] font-bold text-success-foreground">
              B
            </span>
            <span className="font-medium">8</span>
            <Check className="ml-auto size-4" strokeWidth={3} />
          </div>
        </div>
      </div>
    </TypeShell>
  );
}

function ChallengeCard() {
  return (
    <TypeShell
      badge={
        <>
          <Terminal className="size-3" /> Reto
        </>
      }
      badgeTone="success"
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
        <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success-soft px-2.5 py-1.5 text-xs text-success">
          <Check className="size-3.5" strokeWidth={3} />
          <span className="font-medium">3/3 tests · +30 XP</span>
          <Sparkles className="ml-auto size-3 text-warning" />
        </div>
      </div>
    </TypeShell>
  );
}
