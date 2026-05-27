import { Skeleton } from "@/components/ui/skeleton";

export default function LogrosLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Skeleton className="h-9 w-20 rounded-[var(--radius-sm)]" />

      <header className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
        <Skeleton className="h-2 w-72 max-w-full rounded-full" />
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] rounded-[var(--radius-lg)]" />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-[var(--radius-lg)]" />
        ))}
      </div>
    </div>
  );
}
