import Link from "next/link";

import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Crear cuenta",
};

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">
          Crea tu cuenta
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Empieza a programar C++ en menos de 1 minuto. Sin tarjeta.
        </p>
      </div>

      <RegisterForm />

      <div className="space-y-3 border-t border-border/70 pt-5 text-center">
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Inicia sesión
          </Link>
        </p>
        <p className="text-xs text-muted-foreground/80">
          Al registrarte aceptas que tus datos se usen únicamente para tu progreso académico.
        </p>
      </div>
    </div>
  );
}
