import Link from "next/link";
import { Bug } from "lucide-react";

import { Logo } from "@/components/logo";
import { SidebarNav, type SidebarUnit } from "@/components/app/sidebar-nav";

export function Sidebar({ units }: { units: SidebarUnit[] }) {
  return (
    <aside
      aria-label="Navegación principal"
      className="sticky top-0 hidden h-dvh w-[260px] shrink-0 flex-col border-r border-border/70 bg-surface-2/30 md:flex"
    >
      <div className="flex h-16 items-center border-b border-border/70 px-5">
        <Link href="/app" className="-m-2 rounded-md p-2">
          <Logo />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <SidebarNav units={units} />
      </div>

      <div className="border-t border-border/70 px-4 py-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] px-2 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <span className="inline-flex items-center gap-2">
            <Bug className="size-3.5" aria-hidden />
            reportar_bug
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider opacity-60">
            v0.1 :: beta
          </span>
        </a>
      </div>
    </aside>
  );
}
