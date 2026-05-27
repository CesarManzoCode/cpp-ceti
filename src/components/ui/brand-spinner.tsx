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
  lg: { box: "size-9", stroke: 1.75 },
} as const;

/**
 * Spinner de marca: arco que rota suavemente. Sobrio, sin caret
 * parpadeante — el caret se reservaba al motivo terminal anterior.
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
      <span className={cn("relative", box)}>
        <svg
          viewBox="0 0 32 32"
          className="size-full"
          aria-hidden
          style={{ animation: "brand-arc 0.9s linear infinite" }}
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
        </svg>
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
 * Tres puntos que rebotan — para microestados inline ("Ejecutando…").
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
