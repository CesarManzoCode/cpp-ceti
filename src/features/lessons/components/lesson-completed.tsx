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
 * Cierre de lección: el bloque que acabas de colocar. La palomita y el
 * XP son la recompensa, y debajo queda una sola decisión obvia —
 * seguir con la siguiente.
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
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <div className="flex flex-col items-center bg-success-soft/60 px-6 pb-7 pt-8 text-center">
          <span
            aria-hidden
            className="grid size-14 place-items-center rounded-[var(--radius-lg)] bg-success text-success-foreground shadow-[var(--shadow-md)]"
          >
            <Check className="size-8" strokeWidth={3} />
          </span>

          <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.06em] text-success">
            Lección completada
          </p>

          <DialogTitle className="mt-2 text-[40px] font-extrabold leading-none tabular-nums tracking-[-0.04em] text-foreground">
            +<AnimatedNumber value={xpEarned} />
            <span className="ml-1.5 text-[20px] font-bold text-muted-foreground">
              XP
            </span>
          </DialogTitle>

          <DialogDescription className="mt-3 text-[15px] leading-relaxed">
            Un bloque más en tu camino. Así se construye.
          </DialogDescription>
        </div>

        {nextLessonLink ? (
          <div className="border-t border-border px-6 py-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-subtle-foreground">
              Sigue
            </p>
            <p className="mt-1.5 truncate text-[16px] font-bold text-foreground">
              <InlineCodeText>{nextLessonLink.title}</InlineCodeText>
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 border-t border-border p-4">
          {nextLessonLink ? (
            <Button size="xl" onClick={() => router.push(nextLessonLink.href)}>
              Siguiente lección
              <ArrowRight />
            </Button>
          ) : (
            <Button asChild size="xl">
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
