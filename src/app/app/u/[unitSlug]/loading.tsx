import { Skeleton } from "@/components/ui/skeleton";

export default function UnitLoading() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-6 sm:px-6 lg:px-8 lg:py-9">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 h-9 w-2/3" />
      <Skeleton className="mt-3 h-4 w-11/12" />
      <Skeleton className="mt-5 h-1 w-64 max-w-full" />

      <ul className="mt-8 border-y border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className="flex items-start gap-4 border-t border-border py-4 first:border-t-0"
          >
            <Skeleton className="size-4 shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-3 w-40" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
