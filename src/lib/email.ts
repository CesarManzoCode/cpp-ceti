import { Resend } from "resend";

import { env } from "@/env";
import { PRODUCT_NAME } from "@/lib/branding";
import { logger } from "@/lib/logger";

// Único proveedor de correo transaccional de la plataforma. Hoy sólo lo usa
// el flujo de "olvidé mi contraseña" (`sendResetPassword` en `src/lib/auth.ts`).
// Sin `RESEND_API_KEY`/`EMAIL_FROM` configurados, `sendPasswordResetEmail`
// falla explícitamente — nunca resuelve en silencio simulando un envío que
// no ocurrió.
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
): Promise<void> {
  if (!resend || !env.EMAIL_FROM) {
    logger.error(
      { to },
      "RESEND_API_KEY o EMAIL_FROM no configurados: no se pudo enviar el correo de restablecimiento de contraseña",
    );
    throw new Error(
      "El envío de correo no está configurado en este entorno.",
    );
  }

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: `Restablece tu contraseña de ${PRODUCT_NAME}`,
    html: `
      <p>Recibimos una solicitud para restablecer tu contraseña de ${PRODUCT_NAME}.</p>
      <p><a href="${resetUrl}">Haz clic aquí para elegir una nueva contraseña</a>.</p>
      <p>Si tú no pediste esto, ignora este correo — tu contraseña sigue igual.</p>
      <p>El enlace expira pronto por seguridad.</p>
    `,
  });

  if (error) {
    logger.error(
      { error, to },
      "Resend falló al enviar el correo de restablecimiento de contraseña",
    );
    throw new Error("No pudimos enviar el correo. Intenta de nuevo más tarde.");
  }
}
