import Link from "next/link";

import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Crear cuenta",
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Crea tu cuenta</h1>
        <p className="text-sm text-muted-foreground">
          Empieza a programar C++ en menos de 1 minuto.
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          Inicia sesión
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        Al registrarte aceptas que tus datos se usen únicamente para tu progreso académico.
      </p>
    </div>
  );
}
