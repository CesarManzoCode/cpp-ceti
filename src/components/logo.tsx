import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  /** Hide the wordmark and show only the brand mark. */
  glyphOnly?: boolean;
}

/**
 * Editorial Compiler logo: lockup tipográfico `cpp::ceti` en
 * JetBrains Mono. El `::` (scope operator de C++) en color primary
 * es la firma visual recurrente de la marca.
 *
 * Sin placa cuadrada genérica — la tipografía ES la marca.
 */
export function Logo({ className, size = "default", glyphOnly = false }: LogoProps) {
  const sizes = {
    sm: "text-[14px]",
    default: "text-[16px]",
    lg: "text-[22px]",
  };

  if (glyphOnly) {
    return (
      <span
        aria-label="C++ CETI"
        className={cn(
          "font-mono font-bold tracking-[-0.04em] text-primary",
          sizes[size],
          className,
        )}
      >
        ::
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-0 font-mono font-bold tracking-[-0.04em] leading-none text-foreground",
        sizes[size],
        className,
      )}
    >
      <span>cpp</span>
      <span aria-hidden className="text-primary mx-[0.05em]">::</span>
      <span>ceti</span>
    </span>
  );
}
