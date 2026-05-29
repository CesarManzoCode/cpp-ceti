"use client";

import * as React from "react";
import { Bug, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import type { RoadmapUnit } from "@/features/roadmap/types";

export function MobileSidebar({ units }: { units: RoadmapUnit[] }) {
  const [open, setOpen] = React.useState(false);

  const handleNavigate = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[272px] flex-col bg-surface-2/30 p-0"
      >
        <SheetHeader className="flex h-16 justify-center border-b border-border/70 px-5">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav units={units} onNavigate={handleNavigate} />
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
      </SheetContent>
    </Sheet>
  );
}
