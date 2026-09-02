"use client";

import * as React from "react";
import Link from "next/link";
import { Users, X } from "lucide-react";

import { dismissAcademicPrompt } from "@/features/academic/actions";

export function AcademicPromptBanner() {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;

  return (
    <div className="mt-6 flex items-center gap-3 rounded-[var(--radius-lg)] border border-primary/25 bg-primary-tint p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-soft-foreground">
        <Users className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold leading-snug">Encuentra a tus compañeros</p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
          Cuéntanos tu plantel y carrera para encontrar gente de tu grupo.
        </p>
      </div>
      <Link
        href="/app/perfil#academico"
        className="shrink-0 rounded-[var(--radius-sm)] bg-primary px-3 py-1.5 text-[13px] font-bold text-primary-foreground hover:opacity-90"
      >
        Completar
      </Link>
      <button
        type="button"
        aria-label="Descartar"
        className="shrink-0 rounded-full p-1 text-subtle-foreground hover:bg-accent"
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
