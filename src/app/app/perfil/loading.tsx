import { BrandSpinner } from "@/components/ui/brand-spinner";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";
import { Skeleton } from "@/components/ui/skeleton";

export default function PerfilLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Skeleton className="h-8 w-24 rounded-[var(--radius-md)]" />

      <header className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <Skeleton className="size-24 rounded-full" />
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex items-center gap-2 sm:justify-start justify-center">
              <ConsoleEyebrow tone="muted">cargando_perfil</ConsoleEyebrow>
              <BrandSpinner size="xs" />
            </div>
            <Skeleton className="mx-auto h-8 w-48 sm:mx-0" />
            <Skeleton className="mx-auto h-4 w-56 sm:mx-0" />
          </div>
        </div>
      </header>

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[68px] rounded-[var(--radius-lg)]" />
          ))}
        </div>
      </div>

      <Skeleton className="h-48 w-full rounded-[var(--radius-lg)]" />
    </div>
  );
}
