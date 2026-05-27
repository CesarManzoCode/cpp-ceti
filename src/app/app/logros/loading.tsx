import { BrandSpinner } from "@/components/ui/brand-spinner";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";
import { Skeleton } from "@/components/ui/skeleton";

export default function LogrosLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Skeleton className="h-8 w-24 rounded-[var(--radius-md)]" />

      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <ConsoleEyebrow tone="muted">cargando_logros</ConsoleEyebrow>
          <BrandSpinner size="xs" />
        </div>
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-2 w-72 rounded-full" />
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] rounded-[var(--radius-lg)]" />
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-44" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-[var(--radius-lg)]" />
          ))}
        </div>
      </div>
    </div>
  );
}
