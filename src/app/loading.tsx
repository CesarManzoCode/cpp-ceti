import { BrandSpinner } from "@/components/ui/brand-spinner";

/**
 * Fallback raíz — se ve solo en navegaciones entre layouts top-level
 * (landing ↔ auth ↔ app). Centrado y discreto.
 */
export default function RootLoading() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background">
      <BrandSpinner size="lg" label="Cargando…" />
    </div>
  );
}
