import { Skeleton } from "@/components/ui/skeleton";

/** Silueta del reproductor de lección mientras carga. */
export default function LessonLoading() {
  return (
    <>
      <div className="sticky top-0 z-20 border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-3 py-2.5 sm:px-6">
          <Skeleton className="h-8 w-28" />
          <div className="relative h-3 flex-1 overflow-hidden">
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 block h-1.5 bg-surface-3"
            />
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 block h-1.5 w-1/3 origin-left bg-primary/50"
              style={{
                animation: "brand-progress-indeterminate 1.4s ease-in-out infinite",
              }}
            />
          </div>
          <Skeleton className="size-8" />
        </div>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-7 px-5 py-6 sm:px-6 lg:py-9">
        <div className="space-y-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-9 w-2/3" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-10/12" />
          <Skeleton className="h-5 w-9/12" />
        </div>

        <Skeleton className="h-56 w-full" />

        <div className="flex justify-end border-t border-border pt-5">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </>
  );
}
