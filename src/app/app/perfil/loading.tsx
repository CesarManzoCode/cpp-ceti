import { Skeleton } from "@/components/ui/skeleton";

export default function PerfilLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 shrink-0 rounded-full sm:size-20" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-56 max-w-full" />
        </div>
      </div>

      <Skeleton className="mt-7 h-[124px] w-full rounded-[var(--radius-lg)]" />

      <Skeleton className="mt-9 h-6 w-36" />
      <Skeleton className="mt-4 h-[132px] w-full rounded-[var(--radius-lg)]" />

      <Skeleton className="mt-10 h-6 w-28" />
      <Skeleton className="mt-4 h-[240px] w-full rounded-[var(--radius-lg)]" />
    </div>
  );
}
