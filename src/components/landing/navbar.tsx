"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { MobileNav } from "@/components/landing/mobile-nav";

const navLinks = [
  { href: "#por-que", label: "Por qué" },
  { href: "#como", label: "Cómo funciona" },
  { href: "#temario", label: "Temario" },
  { href: "#preguntas", label: "Preguntas" },
];

export function LandingNavbar() {
  // El filete inferior sólo aparece cuando hay contenido debajo de la
  // cabecera: mientras la portada está a la vista, la barra no se separa
  // del papel.
  const headerRef = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        el.dataset.scrolled = window.scrollY > 8 ? "true" : "false";
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      data-scrolled="false"
      className="sticky top-0 z-40 border-b border-transparent bg-background/95 backdrop-blur-sm transition-[border-color] duration-200"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-5 sm:px-6">
        <Link
          href="/"
          aria-label="C++ CETI — Inicio"
          className="-m-1 shrink-0 rounded-[var(--radius-xs)] p-1 transition-opacity hover:opacity-70"
        >
          <Logo />
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-6 text-sm md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground underline decoration-transparent decoration-1 underline-offset-[6px] transition-[color,text-decoration-color] hover:text-foreground hover:decoration-border-strong"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/registro">Crear cuenta</Link>
          </Button>
          <MobileNav links={navLinks} />
        </div>
      </div>
    </header>
  );
}
