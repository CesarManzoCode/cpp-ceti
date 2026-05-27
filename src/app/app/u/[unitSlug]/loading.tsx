import { Skeleton } from "@/components/ui/skeleton";

export default function UnitLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Skeleton className="h-9 w-20 rounded-[var(--radius-sm)]" />

      <header className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-5 w-full max-w-2xl" />
        <Skeleton className="h-2 w-72 max-w-full rounded-full" />
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
