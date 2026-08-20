import { Skeleton } from "@/components/ui/skeleton";

/** Silueta del inicio para evitar saltos de layout al cargar. */
export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <Skeleton className="h-4 w-40" />

      <div className="mt-5 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-10">
        <div className="min-w-0">
          <Skeleton className="h-[236px] w-full rounded-[var(--radius-xl)]" />

          <div className="mt-10 space-y-4">
            <Skeleton className="h-6 w-40" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="size-9 shrink-0 rounded-[var(--radius-md)]" />
                <Skeleton className="h-[104px] flex-1 rounded-[var(--radius-lg)]" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-[124px] w-full rounded-[var(--radius-lg)]" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-[110px] rounded-[var(--radius-lg)]" />
            <Skeleton className="h-[110px] rounded-[var(--radius-lg)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
