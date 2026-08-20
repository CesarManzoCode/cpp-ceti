import { Skeleton } from "@/components/ui/skeleton";

export default function EjerciciosLoading() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-6 sm:px-6 lg:px-8 lg:py-9">
      <div className="space-y-4 border-b border-border pb-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-[26rem] max-w-full" />
      </div>

      {Array.from({ length: 2 }).map((_, g) => (
        <section key={g} className="mt-10">
          <Skeleton className="h-4 w-52" />
          <ul className="mt-4 border-y border-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="flex items-start gap-4 border-t border-border py-4 first:border-t-0"
              >
                <Skeleton className="size-4 shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
