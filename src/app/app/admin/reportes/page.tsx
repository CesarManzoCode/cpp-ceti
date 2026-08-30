import Link from "next/link";

import { MetricTile } from "@/features/admin/components/metric-tile";
import { TriageRow } from "@/features/admin/components/triage-row";
import { getReportCounts, getTriageQueue } from "@/features/admin/queries";
import { requireAdminPage } from "@/lib/admin";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ cerrados?: string }>;
}

/** Cola de triage de bugs de contenido y feedback general. */
export default async function AdminReportsPage({ searchParams }: PageProps) {
  // Autorización propia de la página, no heredada del layout.
  await requireAdminPage();

  const { cerrados } = await searchParams;
  const includeClosed = cerrados === "1";

  const [counts, queue] = await Promise.all([
    getReportCounts(),
    getTriageQueue({ includeClosed }),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          label="Bugs abiertos"
          value={counts.bugs.open + counts.bugs.triaged}
          hint={`${counts.bugs.open} sin ver · ${counts.bugs.triaged} en triage`}
        />
        <MetricTile
          label="Feedback abierto"
          value={counts.feedback.open + counts.feedback.triaged}
          hint={`${counts.feedback.open} sin ver · ${counts.feedback.triaged} en triage`}
        />
        <MetricTile
          label="Bugs cerrados"
          value={
            counts.bugs.resolved + counts.bugs.duplicate + counts.bugs.wontfix
          }
          hint={`${counts.bugs.resolved} resueltos`}
        />
        <MetricTile
          label="Feedback cerrado"
          value={
            counts.feedback.resolved +
            counts.feedback.duplicate +
            counts.feedback.wontfix
          }
          hint={`${counts.feedback.resolved} resueltos`}
        />
      </div>

      <div className="flex gap-2">
        <Link
          href="/app/admin/reportes"
          className={
            includeClosed
              ? "rounded-full border border-border px-3 py-1.5 text-[13px] font-semibold text-muted-foreground"
              : "rounded-full bg-primary px-3 py-1.5 text-[13px] font-bold text-primary-foreground"
          }
        >
          Pendientes
        </Link>
        <Link
          href="/app/admin/reportes?cerrados=1"
          className={
            includeClosed
              ? "rounded-full bg-primary px-3 py-1.5 text-[13px] font-bold text-primary-foreground"
              : "rounded-full border border-border px-3 py-1.5 text-[13px] font-semibold text-muted-foreground"
          }
        >
          Todos
        </Link>
      </div>

      {queue.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-border bg-card p-6 text-center text-muted-foreground">
          Nada pendiente. 🎉
        </p>
      ) : (
        <div className="space-y-3">
          {queue.map((item) => (
            <TriageRow key={`${item.kind}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
