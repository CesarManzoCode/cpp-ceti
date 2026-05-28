import { Skeleton } from "@/components/ui/skeleton";

export default function EjerciciosLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Skeleton className="h-9 w-20 rounded-[var(--radius-sm)]" />

      <header className="space-y-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-5 w-[28rem] max-w-full" />
      </header>

      {Array.from({ length: 2 }).map((_, g) => (
        <section key={g} className="space-y-4">
          <Skeleton className="h-6 w-60" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[140px] rounded-[var(--radius-lg)]"
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
