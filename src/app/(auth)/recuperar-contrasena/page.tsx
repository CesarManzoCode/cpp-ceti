import Link from "next/link";

import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata = {
  title: "Recuperar contraseña",
};

export default function ForgotPasswordPage() {
  return (
    <div data-page-enter className="space-y-8">
      <div>
        <p className="label-micro text-muted-foreground">Recuperar acceso</p>
        <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.025em] sm:text-[30px]">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Escribe el correo con el que te registraste y te mandamos un enlace
          para elegir una contraseña nueva.
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="border-t border-border pt-5 text-sm text-muted-foreground">
        <Link
          href="/login"
          className="text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-current"
        >
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}
