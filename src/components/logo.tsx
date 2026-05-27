import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  glyphOnly?: boolean;
}

/**
 * Logo: placa redondeada con glifo "C++" + wordmark "CETI".
 * Glifo en font-mono para mantener la afinidad con el oficio,
 * wordmark en Inter Semibold para calidez editorial.
 */
export function Logo({ className, size = "default", glyphOnly = false }: LogoProps) {
  const layout = {
    sm: { glyph: "size-7 text-[10px] rounded-[7px]", word: "text-[14px]" },
    default: { glyph: "size-8 text-[11px] rounded-[8px]", word: "text-[15px]" },
    lg: { glyph: "size-10 text-[13px] rounded-[10px]", word: "text-[19px]" },
  }[size];

  if (glyphOnly) {
    return (
      <span
        aria-label="C++ CETI"
        className={cn(
          "inline-grid place-items-center bg-primary text-primary-foreground font-bold",
          layout.glyph,
          className,
        )}
      >
        <span className="font-mono leading-none">C++</span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 font-semibold tracking-tight leading-none",
        layout.word,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid place-items-center bg-primary text-primary-foreground font-bold",
          layout.glyph,
        )}
      >
        <span className="font-mono leading-none">C++</span>
      </span>
      <span className="text-foreground">CETI</span>
    </div>
  );
}
