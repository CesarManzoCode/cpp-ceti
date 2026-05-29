import { Skeleton } from "@/components/ui/skeleton";

/**
 * Silueta exacta del dashboard para evitar layout shift.
 */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-72" />
      </header>

      <Skeleton className="h-44 w-full rounded-[var(--radius-xl)] sm:h-48" />

      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] rounded-[var(--radius-lg)]" />
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-[320px] w-full rounded-[var(--radius-lg)]" />
      </div>
    </div>
  );
}
