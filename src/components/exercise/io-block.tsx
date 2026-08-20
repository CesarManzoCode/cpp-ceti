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
      <p className="mb-1.5 text-[13px] font-bold text-muted-foreground">{label}</p>
      <pre
        className={cn(
          "max-h-44 overflow-auto rounded-[var(--radius-sm)] border border-border bg-surface-2 px-3 py-2 font-mono text-[13px] leading-[1.6]",
          muted && "text-subtle-foreground",
        )}
      >
        {value}
      </pre>
    </div>
  );
}
