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
      className="sticky top-0 hidden h-dvh w-[244px] shrink-0 flex-col border-r border-border bg-background md:flex"
    >
      <div className="flex h-14 items-center px-4">
        <Link
          href="/app"
          className="-m-2 rounded-[var(--radius-xs)] p-2 transition-opacity hover:opacity-70"
        >
          <Logo />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav units={units} pendingFriendsCount={pendingFriendsCount} />
      </div>

      <div className="border-t border-border px-4 py-2.5">
        <a
          href="https://github.com/CesarManzoCode/cpp-ceti/issues"
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bug className="size-3.5" aria-hidden />
          Reportar un bug
          <span className="label-micro ml-auto text-muted-foreground/60">
            v0.1
          </span>
        </a>
      </div>
    </aside>
  );
}
