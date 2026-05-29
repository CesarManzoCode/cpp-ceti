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
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={show}
          className="grid -mr-1 size-7 place-items-center rounded-[var(--radius-xs)] text-muted-foreground transition-[background-color,color] hover:bg-accent hover:text-foreground aria-pressed:bg-primary-soft aria-pressed:text-primary-soft-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  );
}
