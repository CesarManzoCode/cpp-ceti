import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/landing/mobile-nav";

const navLinks = [
  { href: "#por-que", label: "Por qué" },
  { href: "#como", label: "Cómo funciona" },
  { href: "#temario", label: "Temario" },
  { href: "#preguntas", label: "Preguntas" },
];

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-1 text-sm text-muted-foreground md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-[var(--radius-sm)] px-3 py-1.5 font-medium transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
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
            <Link href="/registro">Empezar gratis</Link>
          </Button>
          <MobileNav links={navLinks} />
        </div>
      </div>
    </header>
  );
}
