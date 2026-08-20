import { Skeleton } from "@/components/ui/skeleton";

export default function LogrosLoading() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-6 sm:px-6 lg:px-8 lg:py-9">
      <div className="space-y-4 border-b border-border pb-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
        <Skeleton className="h-1 w-64 max-w-full" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 border-b border-border pb-5 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-3">
        <Skeleton className="h-4 w-36" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}
