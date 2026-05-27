import Link from "next/link";

import { Logo } from "@/components/logo";
import { SidebarNav, type SidebarUnit } from "@/components/app/sidebar-nav";

export function Sidebar({ units }: { units: SidebarUnit[] }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-card/30 md:flex">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/app">
          <Logo />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <SidebarNav units={units} />
      </div>

      <div className="border-t border-border p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Hecho para CETI
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Reporta bugs vía GitHub.
        </p>
      </div>
    </aside>
  );
}
