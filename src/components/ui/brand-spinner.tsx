import { cn } from "@/lib/utils";

interface BrandSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const dimensions = {
  xs: { box: "size-4", stroke: 2.5 },
  sm: { box: "size-5", stroke: 2.25 },
  md: { box: "size-7", stroke: 2 },
  lg: { box: "size-10", stroke: 1.75 },
} as const;

/**
 * Spinner de marca: arco que rota + caret parpadeante en el centro.
 * Reemplaza Loader2 en todas las superficies prominentes para crear
 * una huella de marca consistente — "algo se está compilando".
 */
export function BrandSpinner({
  size = "md",
  label,
  className,
}: BrandSpinnerProps) {
  const { box, stroke } = dimensions[size];

  return (
    <span
      role="status"
      aria-label={label ?? "Cargando"}
      className={cn("inline-flex items-center gap-2 text-primary", className)}
    >
      <span className={cn("relative grid place-items-center", box)}>
        <svg
          viewBox="0 0 32 32"
          className="absolute inset-0 size-full"
          aria-hidden
          style={{ animation: "brand-arc 1.1s linear infinite" }}
        >
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray="48 28"
            opacity="0.85"
          />
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray="6 70"
            strokeDashoffset="-24"
            opacity="0.35"
          />
        </svg>
        <span
          aria-hidden
          className="block size-[3px] rounded-[1px] bg-primary"
          style={{ animation: "brand-caret 1s steps(2, start) infinite" }}
        />
      </span>
      {label ? (
        <span className="text-sm font-medium tabular-nums text-muted-foreground">
          {label}
        </span>
      ) : null}
    </span>
  );
}

/**
 * Tres puntos que rebotan en secuencia — para microestados
 * inline ("Ejecutando…"). Más sutil que BrandSpinner.
 */
export function TypingDots({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex items-end gap-[3px] animate-dot-typing",
        className,
      )}
    >
      <span className="block size-1 rounded-full bg-current" />
      <span className="block size-1 rounded-full bg-current" />
      <span className="block size-1 rounded-full bg-current" />
    </span>
  );
}
