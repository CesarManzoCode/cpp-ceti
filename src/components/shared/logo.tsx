import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  glyphOnly?: boolean;
}

/**
 * Marca: una placa cuadrada con `C++` en monoespaciada y el wordmark
 * `CETI` en la sans. Mismo par tipográfico que el resto del producto —
 * código y texto, la placa y la palabra. Sin degradado y sin esquinas
 * redondeadas: es un sello, no un botón.
 */
export function Logo({ className, size = "default", glyphOnly = false }: LogoProps) {
  const layout = {
    sm: { glyph: "h-6 px-1.5 text-[10px]", word: "text-[13px]", gap: "gap-2" },
    default: { glyph: "h-7 px-2 text-[11px]", word: "text-[15px]", gap: "gap-2.5" },
    lg: { glyph: "h-9 px-2.5 text-[14px]", word: "text-[19px]", gap: "gap-3" },
  }[size];

  const glyph = (
    <span
      aria-hidden={!glyphOnly}
      className={cn(
        "inline-grid place-items-center rounded-[var(--radius-xs)] bg-primary font-mono font-semibold leading-none tracking-tight text-primary-foreground",
        layout.glyph,
        glyphOnly && className,
      )}
    >
      C++
    </span>
  );

  if (glyphOnly) {
    return (
      <span aria-label="C++ CETI" className="inline-flex">
        {glyph}
      </span>
    );
  }

  return (
    <div className={cn("inline-flex items-center leading-none", layout.gap, className)}>
      {glyph}
      <span
        className={cn(
          "font-semibold tracking-[-0.01em] text-foreground",
          layout.word,
        )}
      >
        CETI
      </span>
    </div>
  );
}
