import { Skeleton } from "@/components/ui/skeleton";

/** Silueta de Amigos: encabezado, carril de pestañas y filas de gente. */
export default function AmigosLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <Skeleton className="h-9 w-40 sm:h-11" />
      <Skeleton className="mt-4 h-5 w-full max-w-[46ch]" />

      <Skeleton className="mt-8 h-12 w-full rounded-full" />

      <div className="mt-5 flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] w-full rounded-[var(--radius-lg)]" />
        ))}
      </div>
    </div>
  );
}
