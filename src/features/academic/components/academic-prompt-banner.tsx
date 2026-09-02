"use client";

import * as React from "react";
import Link from "next/link";
import { Users, X } from "lucide-react";

import { dismissAcademicPrompt } from "@/features/academic/actions";

export function AcademicPromptBanner() {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;

  return (
    <div className="relative mt-6 flex flex-wrap items-center gap-x-3 gap-y-4 rounded-[var(--radius-lg)] border border-primary/25 bg-primary-tint p-4 pr-12">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-soft-foreground">
        <Users className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1 basis-48">
        <p className="text-[14px] font-bold leading-snug">Encuentra a tus compañeros</p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
          Dinos tu plantel y carrera y te sugerimos gente de tu grupo.
        </p>
      </div>
      {/* En móvil el botón baja a su propia línea a ancho completo. */}
      <Link
        href="/app/perfil#academico"
        className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-primary px-4 text-[14px] font-bold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto"
      >
        Completar
      </Link>
      <button
        type="button"
        aria-label="Descartar esta sugerencia"
        className="absolute right-1 top-1 grid size-11 place-items-center rounded-full text-subtle-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        onClick={() => {
          setDismissed(true);
          void dismissAcademicPrompt();
        }}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
