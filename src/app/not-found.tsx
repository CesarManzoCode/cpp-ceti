import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { StatusMessage } from "@/components/shared/status-message";

export const metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background px-5 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="-m-2 mb-10 inline-block rounded-[var(--radius-xs)] p-2"
        >
          <Logo size="lg" />
        </Link>

        <StatusMessage
          code="error 404"
          title="Esa página no existe."
          description="Tal vez escribiste mal la URL, o el enlace ya no es válido."
        >
          <Button asChild size="lg">
            <Link href="/">
              <Home />
              Ir al inicio
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/app">
              Mi curso
              <ArrowRight />
            </Link>
          </Button>
        </StatusMessage>
      </div>
    </div>
  );
}
