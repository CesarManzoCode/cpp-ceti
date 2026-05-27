"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { SidebarNav, type SidebarUnit } from "@/components/app/sidebar-nav";

export function MobileSidebar({ units }: { units: SidebarUnit[] }) {
  const [open, setOpen] = React.useState(false);

  // Cerrar al cambiar de ruta (cuando se hace click en un link)
  React.useEffect(() => {
    function close() {
      setOpen(false);
    }
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center justify-start">
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <SidebarNav units={units} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
