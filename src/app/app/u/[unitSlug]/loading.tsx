import { Skeleton } from "@/components/ui/skeleton";

export default function UnitLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex items-center gap-3">
        <Skeleton className="size-11 shrink-0 rounded-[var(--radius-md)]" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <Skeleton className="mt-5 h-10 w-2/3" />
      <Skeleton className="mt-4 h-5 w-11/12" />
      <Skeleton className="mt-6 h-3 w-80 max-w-full rounded-full" />

      <div className="mt-8 flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[148px] w-full rounded-[var(--radius-lg)]" />
        ))}
      </div>
    </div>
  );
}
