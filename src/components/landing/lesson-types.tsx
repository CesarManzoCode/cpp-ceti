import { Check } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

/**
 * Los cuatro tipos de paso que existen en la app, cada uno con una
 * muestra real de cómo se ve. Van separados por filetes en una retícula
 * de dos por dos —no son tarjetas flotantes— para que se lean como
 * páginas de un mismo cuaderno.
 */
export function LessonTypes() {
  return (
    <section className="border-b border-border py-14 lg:py-20">
      <Reveal className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="Lo que vas a hacer"
          title="Cuatro formas de practicar, todas en el navegador."
          description="Teoría justa, ejemplos que puedes correr, quizzes con feedback y retos donde tú escribes el código desde cero."
        />

        <ul className="mt-12 grid gap-px border-y border-border bg-border sm:grid-cols-2">
          <TypeCell
            label="Teoría"
            title="Conceptos al grano."
            description="Sin teoría infinita. Solo lo que necesitas para entender el siguiente ejercicio."
          >
            <div className="space-y-1.5 text-sm leading-relaxed">
              <p>
                En C++, un programa siempre empieza por la función{" "}
                <code className="code-inline">main</code>.
              </p>
              <p className="text-muted-foreground">
                Es como decir <em>“empieza aquí”</em>. El compilador busca esa
                función y la ejecuta.
              </p>
            </div>
          </TypeCell>

          <TypeCell
            label="Ejemplo"
            title="Código que puedes correr."
            description="Ve el ejemplo, cámbialo, ejecútalo en el navegador y observa qué pasa."
          >
            <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--terminal-border)] bg-terminal">
              <div className="label-micro flex items-center justify-between border-b border-[var(--terminal-border)] px-3 py-1.5 text-terminal-faint">
                <span className="font-mono normal-case tracking-normal">
                  ejemplo.cpp
                </span>
                <span className="text-terminal-success">run</span>
              </div>
              <pre className="px-3 py-2.5 font-mono text-[11.5px] leading-[1.65] text-terminal-fg">
<span className="text-syntax-type">int</span>{" "}
<span className="text-syntax-type">main</span>(){" {"}{"\n"}
{"  "}cout {"<<"} <span className="text-syntax-string">{`"Hola"`}</span>;{"\n"}
{"}"}
              </pre>
            </div>
          </TypeCell>

          <TypeCell
            label="Quiz"
            title="Verifica que entendiste."
            description="Preguntas cortas con feedback inmediato. Si fallas, te decimos por qué."
          >
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                ¿Qué imprime <code className="code-inline">cout {"<<"} 5 + 3</code>?
              </p>
              <ul className="border-y border-border">
                <li className="flex items-center gap-2.5 border-b border-border py-2 text-[13px]">
                  <span
                    aria-hidden
                    className="grid size-5 place-items-center rounded-[var(--radius-xs)] border border-border-strong bg-surface-2 font-mono text-[10px] text-muted-foreground"
                  >
                    A
                  </span>
                  <span className="text-muted-foreground">53</span>
                </li>
                <li className="flex items-center gap-2.5 bg-success-soft/60 py-2 pl-0 text-[13px]">
                  <span
                    aria-hidden
                    className="grid size-5 place-items-center rounded-[var(--radius-xs)] border border-success bg-success font-mono text-[10px] text-success-foreground"
                  >
                    B
                  </span>
                  <span className="font-medium text-success">8</span>
                  <Check
                    className="ml-auto mr-2 size-3.5 text-success"
                    strokeWidth={3}
                    aria-hidden
                  />
                </li>
              </ul>
            </div>
          </TypeCell>

          <TypeCell
            label="Reto"
            title="Tú escribes el código."
            description="La plataforma compila, corre los tests y te dice qué caso falló. Ganas XP al pasar."
          >
            <div className="space-y-2.5">
              <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--terminal-border)] bg-terminal">
                <pre className="px-3 py-2.5 font-mono text-[11.5px] leading-[1.6] text-terminal-fg">
<span className="text-syntax-comment">{"// imprime el promedio de a y b\n"}</span>
<span className="text-syntax-type">double</span>{" "}promedio = <span className="text-syntax-comment">{"/* ... */"}</span>;
                </pre>
              </div>
              <p className="flex items-center gap-2 border-l-2 border-success py-0.5 pl-3 font-mono text-[11px] tabular-nums text-success">
                3/3 tests · +30 XP
              </p>
            </div>
          </TypeCell>
        </ul>
      </Reveal>
    </section>
  );
}

function TypeCell({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-5 bg-background p-6 sm:p-7">
      <div>
        <p className="label-micro text-primary">{label}</p>
        <h3 className="mt-2.5 text-[19px] font-semibold leading-snug">
          {title}
        </h3>
        <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="mt-auto">{children}</div>
    </li>
  );
}
