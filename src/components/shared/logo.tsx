import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  glyphOnly?: boolean;
}

/**
 * Marca. El glifo son tres bloques que se van apilando — el mismo
 * objeto con el que el producto dibuja el progreso del curso. La
 * identidad y el sistema de progreso son la misma idea.
 */
export function Logo({ className, size = "default", glyphOnly = false }: LogoProps) {
  const layout = {
    sm: { box: "size-7 rounded-[var(--radius-xs)]", word: "text-[15px]", gap: "gap-2" },
    default: { box: "size-8 rounded-[var(--radius-sm)]", word: "text-[17px]", gap: "gap-2.5" },
    lg: { box: "size-11 rounded-[var(--radius-md)]", word: "text-[22px]", gap: "gap-3" },
  }[size];

  const glyph = (
    <span
      aria-hidden={!glyphOnly}
      className={cn(
        "inline-grid shrink-0 place-items-center bg-primary text-primary-foreground",
        layout.box,
        glyphOnly && className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[62%]" fill="currentColor">
        {/* Tres piezas colocadas, de más corta a más larga: un programa
            creciendo línea por línea. */}
        <rect x="4" y="5" width="9" height="4" rx="1.4" opacity="0.55" />
        <rect x="4" y="10" width="13" height="4" rx="1.4" opacity="0.8" />
        <rect x="4" y="15" width="16" height="4" rx="1.4" />
      </svg>
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
          "font-extrabold tracking-[-0.035em] text-foreground",
          layout.word,
        )}
      >
        C++ CETI
      </span>
    </div>
  );
}
