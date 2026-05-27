import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  /** Hide the wordmark and show only the glyph. */
  glyphOnly?: boolean;
}

/**
 * Marca minimal: glifo monospace en placa cuadrada + wordmark.
 * Glyph usa "C++" en mono para que sea inmediatamente reconocible.
 */
export function Logo({ className, size = "default", glyphOnly = false }: LogoProps) {
  const wordSizes = {
    sm: "text-[15px]",
    default: "text-base",
    lg: "text-xl",
  };
  const glyphSizes = {
    sm: "size-7 text-[10px]",
    default: "size-8 text-[11px]",
    lg: "size-10 text-[13px]",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 font-semibold tracking-tight",
        wordSizes[size],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid place-items-center rounded-[10px] bg-foreground text-background",
          "shadow-[var(--shadow-sm)] ring-1 ring-inset ring-foreground/15",
          glyphSizes[size],
        )}
      >
        <span className="font-mono font-bold leading-none">C++</span>
      </span>
      {glyphOnly ? (
        <span className="sr-only">C++ CETI</span>
      ) : (
        <span className="leading-none">
          <span className="text-foreground">C++</span>
          <span className="ml-1.5 font-medium text-muted-foreground">CETI</span>
        </span>
      )}
    </div>
  );
}
