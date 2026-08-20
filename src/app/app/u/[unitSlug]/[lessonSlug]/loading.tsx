import { Skeleton } from "@/components/ui/skeleton";

/** Silueta del reproductor de lección mientras carga. */
export default function LessonLoading() {
  return (
    <>
      <div className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="mx-auto flex h-14 max-w-[46rem] items-center gap-3 px-3 sm:h-16 sm:px-6">
          <Skeleton className="h-9 w-28" />
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 block w-1/3 origin-left rounded-full bg-primary/50"
              style={{
                animation: "brand-progress-indeterminate 1.4s ease-in-out infinite",
              }}
            />
          </div>
          <Skeleton className="size-9 rounded-[var(--radius-sm)]" />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[46rem] flex-col gap-7 px-4 py-7 sm:px-6 lg:py-10">
        <div className="space-y-3 border-b border-border pb-7">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-11/12" />
        </div>

        <Skeleton className="h-8 w-28 rounded-full" />

        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-10/12" />
          <Skeleton className="h-5 w-9/12" />
        </div>

        <Skeleton className="h-56 w-full rounded-[var(--radius-lg)]" />
      </div>
    </>
  );
}
