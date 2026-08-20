"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
import { InlineCodeText } from "@/components/shared/inline-code-text";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface LessonCompletedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  xpEarned: number;
  nextLessonLink: { href: string; title: string } | null;
  unitHref: string;
}

/**
 * Cierre de lección. El XP ganado se muestra como cifra grande —
 * es la recompensa, así que es lo único grande del diálogo — y debajo
 * queda clarísimo cuál es el siguiente paso.
 */
export function LessonCompleted({
  open,
  onOpenChange,
  xpEarned,
  nextLessonLink,
  unitHref,
}: LessonCompletedProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-sm">
        <div className="px-6 pb-6 pt-7">
          <p className="label-micro flex items-center gap-2 text-success">
            <span
              aria-hidden
              className="grid size-4 place-items-center rounded-[1px] bg-success text-success-foreground"
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
            Lección completada
          </p>

          <DialogTitle className="mt-4 font-mono text-[40px] font-medium leading-none tabular-nums text-foreground">
            +<AnimatedNumber value={xpEarned} />
            <span className="ml-2 font-sans text-base font-medium text-muted-foreground">
              XP
            </span>
          </DialogTitle>

          <DialogDescription className="mt-3 text-sm leading-relaxed">
            Sumados a tu progreso del curso.
          </DialogDescription>
        </div>

        {nextLessonLink ? (
          <div className="border-t border-border px-6 py-3.5">
            <p className="label-micro text-muted-foreground">Siguiente</p>
            <p className="mt-1.5 truncate text-sm font-medium text-foreground">
              <InlineCodeText>{nextLessonLink.title}</InlineCodeText>
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 border-t border-border p-4">
          {nextLessonLink ? (
            <Button size="lg" onClick={() => router.push(nextLessonLink.href)}>
              Siguiente lección
              <ArrowRight />
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href={unitHref}>Ver mi progreso</Link>
            </Button>
          )}
          <Button asChild variant="ghost" size="lg">
            <Link href="/app">Ir al inicio</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
