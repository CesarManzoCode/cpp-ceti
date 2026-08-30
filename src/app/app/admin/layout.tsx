import Link from "next/link";

import { requireAdminPage } from "@/lib/admin";

/**
 * Panel interno. El layout autoriza para que nadie vea la cáscara, pero la
 * autorización REAL vive además en cada página y en cada Server Action:
 * un layout no protege un POST directo a una action.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-3 border-b border-border pb-4">
        <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-subtle-foreground">
          Panel interno
        </p>
        <nav className="flex flex-wrap gap-2">
          <Link
            href="/app/admin"
            className="rounded-[var(--radius-md)] border border-border px-3 py-1.5 text-[14px] font-semibold text-foreground hover:border-primary/45"
          >
            Métricas
          </Link>
          <Link
            href="/app/admin/reportes"
            className="rounded-[var(--radius-md)] border border-border px-3 py-1.5 text-[14px] font-semibold text-foreground hover:border-primary/45"
          >
            Reportes y feedback
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
