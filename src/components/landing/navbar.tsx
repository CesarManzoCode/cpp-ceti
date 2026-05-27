import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#por-que" className="transition hover:text-foreground">
            Por qué
          </a>
          <a href="#como" className="transition hover:text-foreground">
            Cómo funciona
          </a>
          <a href="#temario" className="transition hover:text-foreground">
            Temario
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/registro">Empezar gratis</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
