import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PracticeNotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-5 py-12">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
          <Search className="size-7" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-balance text-2xl font-bold tracking-tight">
            Ejercicio no encontrado.
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Quizá lo despublicaron o cambió de slug.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/app/ejercicios">Ver todos los ejercicios</Link>
        </Button>
      </div>
    </div>
  );
}
