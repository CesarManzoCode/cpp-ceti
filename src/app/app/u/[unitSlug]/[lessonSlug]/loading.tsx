import { Skeleton } from "@/components/ui/skeleton";

/**
 * Mientras carga una lección, esqueleto editorial limpio.
 */
export default function LessonLoading() {
  return (
    <>
      <div className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
          <Skeleton className="h-8 w-32 rounded-[var(--radius-sm)]" />
          <div className="relative flex-1">
            <Skeleton className="h-1 w-full rounded-full" />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            >
              <span
                className="block h-full w-1/3 origin-left rounded-full bg-primary/60"
                style={{
                  animation: "brand-progress-indeterminate 1.4s ease-in-out infinite",
                }}
              />
            </span>
          </div>
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>

      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-5 py-7 sm:px-6 lg:py-9">
        <header className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-2/3" />
        </header>

        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-10/12" />
          <Skeleton className="h-5 w-9/12" />
        </div>

        <Skeleton className="h-56 w-full rounded-[var(--radius-lg)]" />

        <div className="flex justify-end border-t border-border/70 pt-6">
          <Skeleton className="h-11 w-32 rounded-[var(--radius-sm)]" />
        </div>
      </div>
    </>
  );
}
