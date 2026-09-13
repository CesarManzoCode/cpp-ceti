"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input, type InputProps } from "@/components/ui/input";

/**
 * Password field with a show/hide toggle, built on the Input `trailing` slot.
 * Lets users verify what they typed — table stakes on a sign-up form.
 */
export function PasswordInput(props: Omit<InputProps, "type" | "trailing">) {
  const [show, setShow] = React.useState(false);

  return (
    <Input
      {...props}
      type={show ? "text" : "password"}
      trailing={
        // Texto + icono, no sólo el ojo (blueprint UX/UI, G2/H2): un
        // aria-label no ayuda a quien SÍ ve la pantalla pero no reconoce
        // el glifo como "mostrar contraseña".
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-pressed={show}
          className="-mr-1.5 flex h-8 items-center gap-1.5 rounded-[var(--radius-xs)] px-2 text-[13px] font-semibold text-muted-foreground transition-[background-color,color] hover:bg-accent hover:text-foreground aria-pressed:bg-primary-soft aria-pressed:text-primary-soft-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {show ? "Ocultar" : "Mostrar"}
        </button>
      }
    />
  );
}
