import { Skeleton } from "@/components/ui/skeleton";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";
import { BrandSpinner } from "@/components/ui/brand-spinner";

export default function UnitLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Skeleton className="h-8 w-24 rounded-[var(--radius-md)]" />

      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <ConsoleEyebrow tone="muted">abriendo_unidad</ConsoleEyebrow>
          <BrandSpinner size="xs" />
        </div>
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-full max-w-2xl" />
        <Skeleton className="h-2 w-64 rounded-full" />
      </header>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-t border-border/70 p-5 first:border-t-0"
          >
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="hidden size-4 sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
