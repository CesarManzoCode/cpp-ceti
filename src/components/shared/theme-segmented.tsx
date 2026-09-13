"use client";

import * as React from "react";
import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Laptop },
] as const;

/**
 * Control de tema para Ajustes (blueprint UX/UI, H15): radio/segmented
 * control con las tres opciones siempre visibles, texto y check en la
 * seleccionada — no un menú que esconde el resto tras un clic.
 */
export function ThemeSegmented() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- guarda de hidratación intencional: el tema real sólo se conoce en cliente
    setMounted(true);
  }, []);

  return (
    <div
      role="radiogroup"
      aria-label="Tema de la interfaz"
      className="grid grid-cols-3 gap-2"
    >
      {OPTIONS.map((opt) => {
        const active = mounted && theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "flex h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] border text-[14px] font-semibold transition-colors",
              "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active
                ? "border-primary bg-primary-tint text-primary-soft-foreground"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            <opt.icon className="size-4" aria-hidden />
            {opt.label}
            {active ? <Check className="size-3.5" aria-hidden /> : null}
          </button>
        );
      })}
    </div>
  );
}
