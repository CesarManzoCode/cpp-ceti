import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { ResetPasswordForm } from "./reset-password-form";

export const metadata = {
  title: "Restablecer contraseña",
};

export default function ResetPasswordPage() {
  return (
    <div data-page-enter className="space-y-8">
      <div>
        <p className="label-micro text-muted-foreground">Recuperar acceso</p>
        <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.025em] sm:text-[30px]">
          Elige una contraseña nueva
        </h1>
      </div>

      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
