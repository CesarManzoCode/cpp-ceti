import { Skeleton } from "@/components/ui/skeleton";

export default function LogrosLoading() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <Skeleton className="h-10 w-44" />
      <Skeleton className="mt-4 h-5 w-80 max-w-full" />
      <Skeleton className="mt-6 h-3 w-96 max-w-full rounded-full" />

      <Skeleton className="mt-8 h-[124px] w-full rounded-[var(--radius-lg)]" />

      <Skeleton className="mt-10 h-6 w-44" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[112px] rounded-[var(--radius-lg)]" />
        ))}
      </div>
    </div>
  );
}
