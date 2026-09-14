import Link from "next/link";

import { LandingFooter } from "@/components/landing/footer";
import { LandingNavbar } from "@/components/landing/navbar";
import { PRODUCT_NAME, UNOFFICIAL_NOTICE } from "@/lib/branding";

export const metadata = {
  title: "Aviso de privacidad",
  description:
    "Qué datos trata la plataforma, para qué los usa y cómo pedir acceso, corrección o eliminación. Proyecto independiente, no oficial del CETI.",
};

/**
 * Describe fielmente lo que el producto YA hace, leído del schema y de los
 * flujos reales (auth, progreso, analítica, social, feedback) — no una
 * plantilla legal genérica. Donde falta un dato real (domicilio, correo
 * dedicado) se deja una marca explícita en vez de inventarlo.
 */
export default function PrivacyPage() {
  return (
    <>
      <LandingNavbar />
      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-6 lg:py-20">
        <p className="label-micro text-muted-foreground">Legal</p>
        <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.025em] sm:text-[30px]">
          Aviso de privacidad
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Última actualización: 13 de septiembre de 2026.
        </p>

        <div className="reading reading-measure mt-8 space-y-10 text-foreground">
          <section className="space-y-3">
            <p>
              {PRODUCT_NAME} es un proyecto independiente hecho por un solo
              desarrollador para apoyar a estudiantes del CETI Guadalajara.{" "}
              <strong>{UNOFFICIAL_NOTICE}</strong> Este aviso describe, sin
              relleno legal, qué información recopila el producto realmente,
              para qué la usa y cómo puedes pedir que la corrijamos o la
              borremos.
            </p>
          </section>

          <Section title="1. Responsable">
            <p>
              El responsable de esta plataforma y del tratamiento de tus
              datos es César Manzo Olivares (usuario de GitHub{" "}
              <a
                href="https://github.com/CesarManzoCode"
                target="_blank"
                rel="noreferrer noopener"
                className="underline decoration-border-strong underline-offset-4 hover:decoration-current"
              >
                CesarManzoCode
              </a>
              ), quien la desarrolla y opera de forma independiente. No es
              una empresa constituida ni una entidad del CETI ni de ninguna
              institución educativa o gubernamental.
            </p>
            <p className="rounded-[var(--radius-md)] border border-dashed border-border-strong bg-surface-2 px-4 py-3 text-sm text-muted-foreground">
              <strong className="text-foreground">Pendiente:</strong> este
              proyecto no tiene un domicilio fiscal ni de operación
              publicado. Complétalo aquí manualmente si el CETI u otra
              autoridad lo requiere para fines de cumplimiento.
            </p>
          </Section>

          <Section title="2. Qué información tratamos">
            <p>Sólo la que el producto usa de verdad, agrupada por para qué sirve:</p>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                <strong>Cuenta y autenticación.</strong> Nombre, correo,
                nombre de usuario, contraseña (guardada con hash, nunca en
                claro) o el enlace con tu cuenta de Google si entras con
                &ldquo;Continuar con Google&rdquo;, foto de perfil y
                biografía opcionales. El sistema de sesiones guarda además un
                token de sesión y, por sesión, la dirección IP y el user
                agent del dispositivo — se usan para mantenerte conectado y
                detectar accesos anómalos, nunca para analítica de producto.
              </li>
              <li>
                <strong>Identidad académica (opcional).</strong> Campus,
                programa, semestre y grupo, sólo si decides declararlos.
                Nunca es obligatorio para aprender.
              </li>
              <li>
                <strong>Progreso académico.</strong> Qué unidades, lecciones
                y pasos completaste, tu racha de días, tu XP y tu nivel.
              </li>
              <li>
                <strong>Intentos y actividad de aprendizaje.</strong> El
                código que envías a calificar en un reto o práctica (se
                guarda el envío calificado, no cada tecla que presionas), si
                pasó las pruebas, y qué pistas pediste.
              </li>
              <li>
                <strong>Sesiones de estudio.</strong> Tiempo activo
                aproximado por visita a una lección o práctica —pestaña
                visible y actividad reciente—, no tiempo de pantalla total ni
                grabaciones de lo que haces.
              </li>
              <li>
                <strong>Analítica de producto.</strong> Eventos internos como
                qué lección viste o en qué paso estás, para entender dónde se
                atoran los alumnos. No incluye tu IP, tu user agent,
                grabaciones de pantalla ni las teclas que presionas.
              </li>
              <li>
                <strong>Funciones sociales (opcionales).</strong> Amigos,
                rachas compartidas, invitaciones, kudos y ligas — sólo
                existen si tú decides usarlas.
              </li>
              <li>
                <strong>Reportes y feedback.</strong> Si reportas un error de
                contenido o mandas retroalimentación desde el botón dedicado,
                guardamos tu mensaje, tu cuenta y la lección, ejercicio o
                ruta (sin parámetros de la URL) donde lo enviaste, para darle
                seguimiento.
              </li>
              <li>
                <strong>Operación y seguridad.</strong> Conteos de uso por
                endpoint (para evitar abuso del compilador) y los registros
                de servidor necesarios para operar el servicio.
              </li>
            </ul>
          </Section>

          <Section title="3. Para qué usamos tus datos">
            <ul className="list-disc space-y-2 pl-5">
              <li>Darte acceso a tu cuenta y conservar tu progreso entre sesiones y dispositivos.</li>
              <li>Compilar y ejecutar el código que envías a un reto o práctica, y calificarlo contra los casos de prueba.</li>
              <li>Entender qué tan bien funciona el contenido —qué lección confunde, dónde se abandona un curso— para mejorarlo.</li>
              <li>Darte seguimiento cuando reportas un error o mandas feedback.</li>
              <li>Prevenir abuso del compilador con límites de envíos.</li>
              <li>Si activas las funciones sociales, mostrar tu progreso a los amigos que agregaste.</li>
            </ul>
          </Section>

          <Section title="4. Con quién se comparte">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                El código que envías a un reto o práctica se manda al
                proveedor de ejecución configurado (hoy, Wandbox) sólo para
                compilarlo y correrlo contra los casos de prueba; recibe el
                código y las entradas, no tu identidad.
              </li>
              <li>
                Si entras con &ldquo;Continuar con Google&rdquo;, Google
                procesa esa autenticación conforme a su propia política.
              </li>
              <li>
                Si usas &ldquo;olvidé mi contraseña&rdquo;, ese correo se
                envía a través de Resend, el proveedor de correo
                transaccional del proyecto.
              </li>
              <li>
                Todo lo demás —progreso, intentos, analítica, datos sociales,
                reportes— vive únicamente en la base de datos del proyecto y
                en su infraestructura de hosting. No se vende ni se comparte
                con terceros para fines comerciales o publicitarios.
              </li>
            </ul>
          </Section>

          <Section title="5. Conservación y eliminación">
            <p>
              Mientras tu cuenta exista, conservamos los datos anteriores
              para que tu progreso no se pierda entre sesiones. Puedes
              eliminar tu cuenta tú mismo, en cualquier momento, desde{" "}
              <Link
                href="/app/perfil"
                className="underline decoration-border-strong underline-offset-4 hover:decoration-current"
              >
                tu perfil
              </Link>
              , sin tener que escribirle a nadie. Al hacerlo se borra tu
              cuenta y, en cascada, tu progreso, intentos, sesiones de
              estudio, pistas vistas, reportes, feedback y datos sociales —
              de forma permanente e inmediata. No existe una copia que se
              restaure después.
            </p>
          </Section>

          <Section title="6. Tus derechos: acceso, rectificación, cancelación y oposición">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Acceder</strong> a lo que sabemos de ti: tu progreso,
                tu perfil y tu actividad son visibles directamente en tu
                cuenta.
              </li>
              <li>
                <strong>Rectificar</strong> tu nombre, biografía, foto e
                identidad académica desde tu perfil, en cualquier momento.
              </li>
              <li>
                <strong>Cancelar</strong> (eliminar) tu cuenta y tus datos
                desde tu perfil, con efecto inmediato, como se describe
                arriba.
              </li>
              <li>
                <strong>Oponerte</strong> al tratamiento, o pedir algo que la
                interfaz no resuelva directamente (por ejemplo, corregir tu
                correo), escribiendo por el medio de contacto de abajo.
              </li>
            </ul>
          </Section>

          <Section title="7. Contacto">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Para privacidad y solicitudes sobre tus datos —acceso,
                rectificación, cancelación u oposición— que la interfaz no
                resuelva directamente, escribe a{" "}
                <a
                  href="mailto:indice0.ceti@gmail.com"
                  className="underline decoration-border-strong underline-offset-4 hover:decoration-current"
                >
                  indice0.ceti@gmail.com
                </a>
                , la dirección dedicada del proyecto para este tipo de
                solicitudes.
              </li>
              <li>
                Para reportar un problema de contenido o dejar
                retroalimentación general sobre una lección o ejercicio, usa
                el botón de reporte dentro de la plataforma (lo ve cualquier
                cuenta con sesión iniciada).
              </li>
            </ul>
          </Section>

          <Section title="8. Cambios a este aviso">
            <p>
              Si el producto empieza a tratar datos de una forma distinta a
              la descrita aquí, esta página se actualiza para reflejarlo —
              no hay una versión &ldquo;real&rdquo; distinta a la publicada.
            </p>
          </Section>
        </div>
      </main>
      <LandingFooter />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 border-t border-border pt-8">
      <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
        {title}
      </h2>
      {children}
    </section>
  );
}
