"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { MobileNav } from "@/components/landing/mobile-nav";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#por-que", label: "Por qué" },
  { href: "#como", label: "Cómo funciona" },
  { href: "#temario", label: "Temario" },
  { href: "#preguntas", label: "Preguntas" },
];

export function LandingNavbar() {
  // Scroll-shadow: marca el header con data-scrolled cuando hay contenido encima.
  // Pasa la sombra premium definida en globals.css ([data-scrolled="true"]).
  const headerRef = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = window.scrollY > 8;
        el.dataset.scrolled = scrolled ? "true" : "false";
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
      className="sticky top-0 z-40 border-b border-border/0 bg-background/70 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-200"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-6">
        <Link
          href="/"
          aria-label="C++ CETI — Inicio"
          className="-m-1 shrink-0 rounded-[var(--radius-sm)] p-1 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo />
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-1 text-sm md:flex"
        >
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <span aria-hidden className="mx-1 hidden h-5 w-px bg-border/70 sm:inline-block" />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild size="sm" variant="glow" className="hidden sm:inline-flex">
            <Link href="/registro">Empezar gratis</Link>
          </Button>
          <MobileNav links={navLinks} />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group relative rounded-[var(--radius-sm)] px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground",
      )}
    >
      <span className="relative">{children}</span>
      {/* Underline animado que aparece en hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-3 bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-[color:var(--brand-2)] to-transparent transition-transform duration-300 ease-[var(--ease-out-quart)] group-hover:scale-x-100"
      />
    </a>
  );
}
