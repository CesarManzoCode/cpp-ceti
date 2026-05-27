import { Logo } from "@/components/logo";

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <Logo size="sm" />
        <p className="text-center text-xs text-muted-foreground sm:text-right">
          Hecho con ❤️ en Guadalajara · {new Date().getFullYear()} ·{" "}
          <span className="font-medium text-foreground">No oficial del CETI</span>
        </p>
      </div>
    </footer>
  );
}
