import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InlineCodeText } from "@/components/shared/inline-code-text";

interface LessonCompletedPanelProps {
  /** Recibe el foco programático al completar (blueprint UX/UI, H6). */
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  xpEarned: number;
  nextLessonLink: { href: string; title: string } | null;
  unitHref: string;
  containerMax: string;
}

/**
 * Cierre de lección EN FLUJO — no modal (blueprint UX/UI, C1/G8:
 * "Completado: estado en flujo, no modal"). Reemplaza el paso actual en
 * el mismo documento: la evidencia de lo practicado precede al XP, que
 * aquí es un dato secundario, no un hero number.
 */
export function LessonCompletedPanel({
  headingRef,
  xpEarned,
  nextLessonLink,
  unitHref,
  containerMax,
}: LessonCompletedPanelProps) {
  return (
    <div
      className={`animate-fade-up mx-auto flex flex-col gap-7 px-4 py-7 sm:px-6 lg:py-10 ${containerMax}`}
    >
      <header className="flex items-start gap-4 border-b border-border pb-7">
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-success text-success-foreground"
        >
          <Check className="size-6" strokeWidth={3} />
        </span>
        <div className="min-w-0">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-balance text-[26px] font-extrabold leading-[1.15] tracking-[-0.028em] outline-none sm:text-[32px]"
          >
            Lección completada
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            Completaste todos los pasos de esta lección.{" "}
            <span className="font-bold tabular-nums text-foreground">
              +{xpEarned} XP
            </span>
            .
          </p>
        </div>
      </header>

      {nextLessonLink ? (
        <section>
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-subtle-foreground">
            Sigue
          </p>
          <p className="mt-1.5 text-[18px] font-bold text-foreground">
            <InlineCodeText>{nextLessonLink.title}</InlineCodeText>
          </p>
        </section>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        {nextLessonLink ? (
          <Button asChild size="xl" className="sm:w-auto">
            <Link href={nextLessonLink.href}>
              Siguiente lección
              <ArrowRight />
            </Link>
          </Button>
        ) : (
          <Button asChild size="xl" className="sm:w-auto">
            <Link href={unitHref}>Ver mi progreso</Link>
          </Button>
        )}
        <Button asChild variant="ghost" size="lg" className="sm:w-auto">
          <Link href="/app">Ir al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
