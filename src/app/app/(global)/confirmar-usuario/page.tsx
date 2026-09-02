import { redirect } from "next/navigation";

import { ConfirmUsernameForm } from "@/features/profile/components/confirm-username-form";
import { requireSession } from "@/lib/get-session";
import { safeInternalRedirect } from "@/lib/social/redirect";

export const metadata = {
  title: "Elige tu nombre de usuario",
};

interface PageProps {
  searchParams: Promise<{ redirectTo?: string }>;
}

/**
 * Confirmación one-shot del username provisional de OAuth. Sólo la
 * necesitan cuentas `usernameSetupRequired=true` — si ya está confirmado,
 * no hay nada que hacer aquí.
 */
export default async function ConfirmUsernamePage({ searchParams }: PageProps) {
  const session = await requireSession();
  const { redirectTo: rawRedirect } = await searchParams;
  const redirectTo = safeInternalRedirect(rawRedirect, "/app");

  if (!session.user.usernameSetupRequired) {
    redirect(redirectTo);
  }

  return (
    <div data-page-enter className="mx-auto w-full max-w-md px-4 py-10 sm:px-6">
      <p className="label-micro text-muted-foreground">Un último paso</p>
      <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.025em] sm:text-[30px]">
        Elige tu nombre de usuario
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Con Google entraste con un handle provisional. Elige el definitivo
        para que tus compañeros puedan encontrarte — no podrás cambiarlo
        después.
      </p>

      <div className="mt-7">
        <ConfirmUsernameForm redirectTo={rawRedirect ?? null} />
      </div>
    </div>
  );
}
