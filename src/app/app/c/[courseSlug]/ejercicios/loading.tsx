import { Skeleton } from "@/components/ui/skeleton";

export default function EjerciciosLoading() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <Skeleton className="h-10 w-52" />
      <Skeleton className="mt-4 h-5 w-[28rem] max-w-full" />
      <Skeleton className="mt-6 h-3 w-96 max-w-full rounded-full" />

      {Array.from({ length: 2 }).map((_, g) => (
        <section key={g} className="mt-10">
          <Skeleton className="h-6 w-56" />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[132px] rounded-[var(--radius-lg)]" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
