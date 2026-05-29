import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";
import { Logo } from "@/components/shared/logo";

export const metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background px-5 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-9 text-center">
        <Link href="/" className="-m-2 rounded-md p-2">
          <Logo size="lg" />
        </Link>

        <div className="space-y-3">
          <ConsoleEyebrow tone="muted" className="font-mono">
            Error 404
          </ConsoleEyebrow>
          <h1 className="text-balance text-3xl font-bold tracking-[-0.025em] sm:text-4xl">
            Esa página no existe.
          </h1>
          <p className="text-balance text-[15px] leading-relaxed text-muted-foreground">
            Tal vez escribiste mal la URL, o el enlace ya no es válido.
            Vuelve a un terreno conocido.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <Home />
              Ir al inicio
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/app">
              Mi panel
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
