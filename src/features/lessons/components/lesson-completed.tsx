"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
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
      <DialogContent className="overflow-hidden p-0 sm:max-w-md">
        <div className="px-7 pb-2 pt-8 text-center">
          <div className="relative mx-auto w-fit">
            <span
              aria-hidden
              className="animate-pulse-soft absolute inset-0 rounded-full bg-success/25 blur-xl"
            />
            <div className="animate-scale-in relative grid size-14 place-items-center rounded-full bg-success-soft text-success ring-4 ring-success/15">
              <CheckCircle2 className="size-7" aria-hidden />
            </div>
          </div>

          <DialogTitle className="mt-5 text-balance text-[22px] font-bold tracking-[-0.02em]">
            Lección completada
          </DialogTitle>
          <DialogDescription className="mt-2 text-[15px]">
            Sumaste{" "}
            <span className="inline-flex items-center gap-1 font-semibold text-warning">
              <Sparkles className="size-3.5" aria-hidden />+
              <AnimatedNumber value={xpEarned} /> XP
            </span>{" "}
            a tu progreso.
          </DialogDescription>
        </div>

        {nextLessonLink ? (
          <div className="mx-6 mt-4 rounded-[var(--radius-md)] border border-border bg-surface-2/60 p-3.5 text-left">
            <p className="eyebrow text-muted-foreground">Siguiente</p>
            <p className="mt-1 truncate text-sm font-medium text-foreground">
              {nextLessonLink.title}
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 px-6 pb-6 pt-4">
          {nextLessonLink ? (
            <Button
              size="lg"
              onClick={() => router.push(nextLessonLink.href)}
            >
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
