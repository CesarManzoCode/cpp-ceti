import Link from "next/link";

import { UNOFFICIAL_NOTICE } from "@/lib/branding";

import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Crear cuenta",
};

export default function RegisterPage() {
  return (
    <div data-page-enter className="space-y-8">
      <div>
        <p className="label-micro text-muted-foreground">Crear cuenta</p>
        <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.025em] sm:text-[30px]">
          Empieza a escribir código
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Toma menos de un minuto. Sin tarjeta.
        </p>
      </div>

      <RegisterForm />

      <div className="space-y-3 border-t border-border pt-5">
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-current"
          >
            Inicia sesión
          </Link>
        </p>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Al crear tu cuenta, usamos tus datos para tu cuenta, tu progreso
          académico y mejorar la plataforma, como se explica en el{" "}
          <Link
            href="/privacidad"
            className="text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-current"
          >
            aviso de privacidad
          </Link>
          . {UNOFFICIAL_NOTICE}
        </p>
      </div>
    </div>
  );
}
