import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  invalid?: boolean;
  /** Optional leading icon, rendered inside the input. */
  leadingIcon?: React.ReactNode;
  /** Optional trailing element (icon, button, etc). */
  trailing?: React.ReactNode;
}

function Input({
  className,
  type,
  invalid,
  leadingIcon,
  trailing,
  ...props
}: InputProps) {
  const hasAdornment = Boolean(leadingIcon || trailing);

  const baseInput = (
    <input
      type={type}
      data-slot="input"
      aria-invalid={invalid || undefined}
      className={cn(
        "peer flex h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "outline-none",
        hasAdornment
          ? "px-0"
          : "rounded-[var(--radius-sm)] border border-input bg-surface px-3.5 transition-[border-color,box-shadow] focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)]",
        invalid && !hasAdornment && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );

  if (!hasAdornment) return baseInput;

  return (
    <div
      data-slot="input-wrapper"
      className={cn(
        "flex h-11 w-full items-center gap-2.5 rounded-[var(--radius-sm)] border border-input bg-surface px-3.5 transition-[border-color,box-shadow]",
        "focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-[var(--primary-ring)]",
        invalid && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
        props.disabled && "cursor-not-allowed opacity-60",
      )}
    >
      {leadingIcon ? (
        <span className="shrink-0 text-muted-foreground/80 [&>svg]:size-4">
          {leadingIcon}
        </span>
      ) : null}
      {baseInput}
      {trailing ? <span className="shrink-0 text-muted-foreground">{trailing}</span> : null}
    </div>
  );
}

export { Input };
export type { InputProps };
