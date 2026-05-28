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
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <pre
        className={cn(
          "overflow-x-auto rounded-md bg-surface-2 px-2.5 py-1.5 font-mono text-[11.5px] leading-relaxed",
          muted && "text-muted-foreground/70",
        )}
      >
        {value}
      </pre>
    </div>
  );
}
