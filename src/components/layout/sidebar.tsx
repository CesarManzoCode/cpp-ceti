import Link from "next/link";
import { Bug } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import type { RoadmapUnit } from "@/features/roadmap/types";

export function Sidebar({
  units,
  pendingFriendsCount = 0,
}: {
  units: RoadmapUnit[];
  pendingFriendsCount?: number;
}) {
  return (
    <aside
      aria-label="Navegación principal"
      className="sticky top-0 hidden h-dvh w-[256px] shrink-0 flex-col border-r border-border/70 bg-surface-2/30 md:flex"
    >
      <div className="flex h-16 items-center border-b border-border/70 px-5">
        <Link
          href="/app"
          className="-m-2 rounded-[var(--radius-sm)] p-2 transition-opacity hover:opacity-80"
        >
          <Logo />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <SidebarNav units={units} pendingFriendsCount={pendingFriendsCount} />
      </div>

      <div className="border-t border-border/70 px-4 py-3">
        <a
          href="https://github.com/CesarManzoCode/cpp-ceti/issues"
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Bug className="size-3.5" aria-hidden />
          Reportar un bug
          <span className="ml-auto text-[9px] font-medium uppercase tracking-wider opacity-70">
            v0.1
          </span>
        </a>
      </div>
    </aside>
  );
}
