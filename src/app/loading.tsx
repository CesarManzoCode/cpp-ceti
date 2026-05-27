import { BrandSpinner } from "@/components/ui/brand-spinner";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";

/**
 * Fallback raíz — se ve solo en navegaciones entre layouts top-level
 * (landing ↔ auth ↔ app). Centrado para no parecer una página real
 * a medio cargar.
 */
export default function RootLoading() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background">
      <div className="flex flex-col items-center gap-3 text-center">
        <BrandSpinner size="lg" />
        <ConsoleEyebrow tone="muted" caret>
          cargando
        </ConsoleEyebrow>
      </div>
    </div>
  );
}
