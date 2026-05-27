"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Trophy } from "lucide-react";

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
      <DialogContent className="text-center sm:max-w-md">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-gradient-to-br from-warning to-amber-500 shadow-lg">
          <Trophy className="size-10 text-white" />
        </div>
        <DialogTitle className="text-2xl">¡Lección completada!</DialogTitle>
        <DialogDescription className="text-base">
          <span className="inline-flex items-center gap-1.5 font-semibold text-warning">
            <Sparkles className="size-4" />
            +{xpEarned} XP
          </span>{" "}
          añadidos a tu progreso.
        </DialogDescription>

        <div className="flex flex-col gap-2 pt-2">
          {nextLessonLink ? (
            <Button
              size="lg"
              onClick={() => {
                router.push(nextLessonLink.href);
              }}
            >
              Siguiente lección
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href={unitHref}>Ver mi progreso</Link>
            </Button>
          )}
          <Button asChild variant="ghost">
            <Link href="/app">Ir al inicio</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
