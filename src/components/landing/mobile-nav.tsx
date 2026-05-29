"use client";

import * as React from "react";
import Link from "next/link";
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

interface MobileNavProps {
  links: { href: string; label: string }[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

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
      <SheetContent side="right" className="flex w-[82%] max-w-xs flex-col p-0">
        <SheetHeader className="border-b border-border/70 px-5 py-4">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <nav
          aria-label="Principal"
          className="flex flex-1 flex-col gap-0.5 px-3 py-4"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              className="rounded-[var(--radius-sm)] px-3 py-2.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-2 border-t border-border/70 p-4">
          <Button asChild variant="outline" onClick={close}>
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild onClick={close}>
            <Link href="/registro">Empezar gratis</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
