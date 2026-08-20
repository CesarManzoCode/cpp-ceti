import { Skeleton } from "@/components/ui/skeleton";

/** Silueta del panel para evitar layout shift al cargar. */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-6 sm:px-6 lg:px-8 lg:py-9">
      <Skeleton className="h-4 w-40" />

      <div className="mt-5 space-y-4 border-y border-border py-6">
        <Skeleton className="h-3 w-44" />
        <Skeleton className="h-10 w-2/3" />
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

      <div className="mt-10 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  );
}
