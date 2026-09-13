/**
 * Enlace de salto (WCAG 2.2, blueprint UX/UI J1): invisible hasta que
 * recibe foco por teclado, y siempre el primer elemento enfocable de su
 * contenedor. `href` apunta a un `id` real en la misma página.
 */
export function SkipLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-3 focus-visible:top-3 focus-visible:z-[100] focus-visible:rounded-[var(--radius-sm)] focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2.5 focus-visible:text-[14px] focus-visible:font-bold focus-visible:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {children}
    </a>
  );
}
