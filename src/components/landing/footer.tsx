import Link from "next/link";

import { Logo } from "@/components/shared/logo";

const links: { href: string; label: string; external?: boolean }[] = [
  { href: "/login", label: "Iniciar sesión" },
  { href: "/registro", label: "Crear cuenta" },
  { href: "#temario", label: "Temario" },
  {
    href: "https://github.com/CesarManzoCode/cpp-ceti",
    label: "GitHub",
    external: true,
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface-2/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 sm:px-6 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Logo size="sm" />
          <p className="text-xs text-muted-foreground">
            Hecho en Guadalajara · {new Date().getFullYear()}
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <p className="text-center text-xs text-muted-foreground sm:text-right">
          Proyecto independiente.{" "}
          <span className="font-medium text-foreground">
            No oficial del CETI.
          </span>
        </p>
      </div>
    </footer>
  );
}
