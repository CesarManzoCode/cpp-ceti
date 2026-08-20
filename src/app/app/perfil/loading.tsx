import { Skeleton } from "@/components/ui/skeleton";

export default function PerfilLoading() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-6 sm:px-6 lg:px-8 lg:py-9">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Skeleton className="size-14 shrink-0 sm:size-16" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-56 max-w-full" />
        </div>
      </div>

      <div className="mt-7 space-y-3 border-b border-border pb-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-3 w-56" />
      </div>

      <div className="mt-9 grid grid-cols-2 gap-6 border-y border-border py-5 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-3">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}
