-- Reportar discrepancias con la clase real (o "mala sesión/unidad") desde
-- el mismo widget de Feedback, sin pasar por GitHub.
--
-- ALTER TYPE ... ADD VALUE es seguro (idempotente con IF NOT EXISTS) y
-- ningún valor nuevo se usa en esta misma migración.
ALTER TYPE "FeedbackKind" ADD VALUE IF NOT EXISTS 'discrepancy';
ALTER TYPE "ProductSurface" ADD VALUE IF NOT EXISTS 'unit';

-- Reporte a nivel de unidad completa (no de una lección puntual).
ALTER TABLE "feedback" ADD COLUMN "unitId" TEXT;

ALTER TABLE "feedback"
  ADD CONSTRAINT "feedback_unitId_fkey"
  FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
