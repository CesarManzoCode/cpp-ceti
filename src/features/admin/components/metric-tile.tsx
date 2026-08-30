import { cn } from "@/lib/utils";

/** Indicador chico: número grande, etiqueta y una nota que lo define. */
export function MetricTile({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-card p-4",
        className,
      )}
    >
      <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-subtle-foreground">
        {label}
      </p>
      <p className="mt-1.5 text-[26px] font-extrabold tabular-nums leading-none text-foreground">
        {value}
      </p>
      {hint ? (
        <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Barra de proporción en CSS puro (0..1). Sin librería de charts. */
export function RatioBar({
  value,
  tone = "primary",
}: {
  value: number;
  tone?: "primary" | "success" | "warning" | "destructive";
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const bg = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning-vivid",
    destructive: "bg-destructive",
  }[tone];
  return (
    <span
      className="inline-flex h-2 w-20 overflow-hidden rounded-full bg-surface-2 align-middle"
      role="presentation"
    >
      <span className={cn("h-full", bg)} style={{ width: `${pct}%` }} />
    </span>
  );
}

export function formatPct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatMinutes(ms: number): string {
  const minutes = ms / 60_000;
  if (minutes < 1) return `${Math.round(ms / 1000)} s`;
  if (minutes < 90) return `${minutes.toFixed(1)} min`;
  return `${(minutes / 60).toFixed(1)} h`;
}
