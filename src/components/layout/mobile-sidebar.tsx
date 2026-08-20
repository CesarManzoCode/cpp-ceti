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

export function MobileSidebar({
  units,
  pendingFriendsCount = 0,
}: {
  units: RoadmapUnit[];
  pendingFriendsCount?: number;
}) {
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
        className="flex w-[276px] flex-col bg-background p-0"
      >
        <SheetHeader className="flex h-14 justify-center border-b border-border px-4">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav
            units={units}
            onNavigate={handleNavigate}
            pendingFriendsCount={pendingFriendsCount}
          />
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
      </SheetContent>
    </Sheet>
  );
}
