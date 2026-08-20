import { Skeleton } from "@/components/ui/skeleton";

export default function EjercicioLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Skeleton className="h-9 w-32" />

      <div className="mt-4 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-80 max-w-full" />
      </div>

      <div className="mt-8 grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
        <div className="space-y-3">
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-10/12" />
          <Skeleton className="h-5 w-8/12" />
          <Skeleton className="mt-6 h-40 w-full rounded-[var(--radius-lg)]" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-[420px] w-full rounded-[var(--radius-lg)]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-[var(--radius-sm)]" />
            <Skeleton className="h-10 w-40 rounded-[var(--radius-sm)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
