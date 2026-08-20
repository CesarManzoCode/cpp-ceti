import { Skeleton } from "@/components/ui/skeleton";

export default function EjercicioLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-5 sm:px-6 lg:px-8 lg:py-7">
      <Skeleton className="h-8 w-28" />

      <div className="mt-3 space-y-3 border-b border-border pb-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-72 max-w-full" />
      </div>

      <div className="mt-6 grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
        <div className="space-y-3">
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-8/12" />
          <Skeleton className="mt-6 h-28 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-[420px] w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}
