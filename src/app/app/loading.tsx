import { Skeleton } from "@/components/ui/skeleton";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";
import { BrandSpinner } from "@/components/ui/brand-spinner";

/**
 * Fallback instantáneo del dashboard. Muestra la silueta exacta de la
 * página para que no haya layout shift al cargar el contenido real.
 */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <ConsoleEyebrow tone="muted">cargando_panel</ConsoleEyebrow>
          <BrandSpinner size="xs" />
        </div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-80" />
      </header>

      <Skeleton className="h-40 w-full rounded-[var(--radius-xl)]" />

      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[84px] rounded-[var(--radius-lg)]" />
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[112px] rounded-[var(--radius-lg)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
