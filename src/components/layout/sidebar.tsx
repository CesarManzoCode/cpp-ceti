import Link from "next/link";
import { Bug, MessageSquarePlus } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { UNOFFICIAL_NOTICE } from "@/lib/branding";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import type { CourseSwitcherItem } from "@/features/courses/components/course-switcher";
import { FeedbackDialog } from "@/features/feedback/components/feedback-dialog";
import type { RoadmapUnit } from "@/features/roadmap/types";

/**
 * Rail de escritorio. En móvil no existe: allí la navegación es una
 * barra inferior propia (ver `MobileNav`), no este rail encogido.
 */
export function Sidebar({
  courseSlug,
  courses = [],
  units,
  pendingFriendsCount = 0,
}: {
  courseSlug: string | null;
  courses?: CourseSwitcherItem[];
  units: RoadmapUnit[];
  pendingFriendsCount?: number;
}) {
  return (
    /* El contenedor exterior se estira a todo el alto del documento para
       que el fondo del rail no se corte a mitad de una página larga; el
       contenido queda pegajoso dentro de él. */
    <div className="hidden w-[268px] shrink-0 border-r border-border bg-surface lg:block">
      <aside
        aria-label="Navegación principal"
        className="sticky top-0 flex h-dvh flex-col"
      >
        <div className="flex h-16 shrink-0 items-center px-6">
          <Link
            href="/app"
            className="-m-2 rounded-[var(--radius-sm)] p-2 transition-opacity hover:opacity-75"
          >
            <Logo />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          <SidebarNav
            courseSlug={courseSlug}
            courses={courses}
            units={units}
            pendingFriendsCount={pendingFriendsCount}
          />
        </div>

        <div className="shrink-0 space-y-1.5 border-t border-border px-6 py-3">
          {/* Feedback general de la experiencia. Para contenido roto está el
              botón de reporte dentro de la propia lección/ejercicio. */}
          <FeedbackDialog>
            <button
              type="button"
              className="flex w-full items-center gap-2 text-[13px] font-medium text-subtle-foreground transition-colors hover:text-foreground"
            >
              <MessageSquarePlus className="size-4" aria-hidden />
              Enviar comentario
            </button>
          </FeedbackDialog>
          <a
            href="https://github.com/CesarManzoCode/cpp-ceti/issues"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-2 text-[13px] font-medium text-subtle-foreground transition-colors hover:text-foreground"
          >
            <Bug className="size-4" aria-hidden />
            Reportar un bug
            <span className="ml-auto tabular-nums">v0.1</span>
          </a>
          <p className="pt-1 text-[12px] leading-snug text-subtle-foreground">
            {UNOFFICIAL_NOTICE}
          </p>
        </div>
      </aside>
    </div>
  );
}
