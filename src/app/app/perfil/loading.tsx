import { Skeleton } from "@/components/ui/skeleton";

export default function PerfilLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Skeleton className="h-9 w-20 rounded-[var(--radius-sm)]" />

      <Skeleton className="h-[160px] w-full rounded-[var(--radius-xl)]" />

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px] rounded-[var(--radius-lg)]" />
          ))}
        </div>
      </div>

      <Skeleton className="h-[300px] w-full rounded-[var(--radius-lg)]" />
    </div>
  );
}
