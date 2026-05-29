import { cn } from "@/lib/utils";

interface IOBlockProps {
  label: string;
  value: string;
  muted?: boolean;
}

/** A labelled stdin/stdout sample, rendered on light card surfaces. */
export function IOBlock({ label, value, muted }: IOBlockProps) {
  return (
    <div className="min-w-0">
      <p className="eyebrow mb-1 text-muted-foreground">{label}</p>
      <pre
        className={cn(
          "max-h-44 overflow-auto rounded-[var(--radius-xs)] bg-surface-2 px-3 py-1.5 font-mono text-[12.5px] leading-[1.55]",
          muted && "text-muted-foreground/70",
        )}
      >
        {value}
      </pre>
    </div>
  );
}
