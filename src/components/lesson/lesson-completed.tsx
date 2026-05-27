"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, PartyPopper, Sparkles } from "lucide-react";

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
        {/* Cabecera con halo de color */}
        <div className="relative px-8 pb-2 pt-9 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-40 w-40 rounded-full bg-warning/30 blur-3xl"
          />
          <div
            className="animate-scale-in relative mx-auto flex size-16 items-center justify-center rounded-full border border-warning/30 bg-warning-soft text-warning-foreground"
            style={{ animationDuration: "500ms" }}
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full ring-2 ring-warning/30 animate-pulse-ring"
            />
            <PartyPopper className="size-7 text-warning" aria-hidden />
          </div>

          <DialogTitle className="animate-fade-up mt-5 text-balance text-2xl font-semibold tracking-tight" style={{ animationDelay: "120ms" }}>
            ¡Lección completada!
          </DialogTitle>
          <DialogDescription className="animate-fade-up mt-2 text-[15px]" style={{ animationDelay: "200ms" }}>
            Sumaste{" "}
            <span className="inline-flex items-center gap-1 font-semibold text-warning-foreground">
              <Sparkles className="size-3.5" aria-hidden />
              +{xpEarned} XP
            </span>{" "}
            a tu progreso.
          </DialogDescription>
        </div>

        {nextLessonLink ? (
          <div className="mx-6 mb-2 mt-4 rounded-[var(--radius-md)] border border-border bg-surface-2/60 p-3 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Siguiente
            </p>
            <p className="mt-0.5 truncate text-sm font-medium text-foreground">
              {nextLessonLink.title}
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 px-6 pb-6 pt-2">
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
