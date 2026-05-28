import { Skeleton } from "@/components/ui/skeleton";

export default function EjercicioLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Skeleton className="h-9 w-32 rounded-[var(--radius-sm)]" />

      <div className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-80 max-w-full" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-32 w-full rounded-[var(--radius-md)]" />
          <Skeleton className="h-24 w-full rounded-[var(--radius-md)]" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-[420px] w-full rounded-[var(--radius-md)]" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-[var(--radius-sm)]" />
            <Skeleton className="h-9 w-24 rounded-[var(--radius-sm)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
