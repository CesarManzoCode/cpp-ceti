import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import { COURSE_COOKIE, COURSE_SLUG_HEADER } from "@/lib/course-selection";
import { legacyRedirect } from "@/lib/courses";

const PUBLIC_PATHS = ["/", "/login", "/registro", "/invitar", "/api/auth"];
const AUTH_PATHS = ["/login", "/registro"];

/** `/app/c/<curso>/...` */
const COURSE_PATH = /^\/app\/c\/([^/]+)(?:\/|$)/;

/**
 * URLs legacy sin curso. Se resuelven aquí, antes de renderizar, para que
 * un marcador viejo reciba un 308 de verdad: `permanentRedirect` dentro de
 * un Server Component se emite como redirección de cliente (200 + payload)
 * cuando la respuesta ya empezó a transmitirse, y un 200 no sirve para un
 * enlace compartido ni para un buscador.
 */
const LEGACY_UNIT = /^\/app\/u\/([^/]+)$/;
const LEGACY_LESSON = /^\/app\/u\/([^/]+)\/([^/]+)$/;
const LEGACY_PRACTICE_LIST = /^\/app\/ejercicios$/;
const LEGACY_PRACTICE = /^\/app\/ejercicios\/([^/]+)$/;

/** Destino canónico de una URL legacy, o null si no lo es. */
function legacyDestination(pathname: string, search: string): string | null {
  const lesson = LEGACY_LESSON.exec(pathname);
  if (lesson) {
    const step = new URLSearchParams(search).get("p");
    return legacyRedirect.lesson(
      decodeURIComponent(lesson[1]),
      decodeURIComponent(lesson[2]),
      step,
    );
  }
  const unit = LEGACY_UNIT.exec(pathname);
  if (unit) return legacyRedirect.unit(decodeURIComponent(unit[1]));

  const practice = LEGACY_PRACTICE.exec(pathname);
  if (practice) {
    return legacyRedirect.practice(decodeURIComponent(practice[1]));
  }
  if (LEGACY_PRACTICE_LIST.test(pathname)) return legacyRedirect.practiceList();

  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "cpp-ceti",
  });
  const isAuthenticated = Boolean(sessionCookie);

  // Usuario autenticado tratando de ir a login/registro → al dashboard
  if (isAuthenticated && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  const isPublic =
    PUBLIC_PATHS.some(
      (p) => pathname === p || (p !== "/" && pathname.startsWith(p)),
    ) || pathname.startsWith("/_next") || pathname.startsWith("/static");

  if (!isAuthenticated && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Marcador viejo: 308 permanente al MISMO recurso bajo su curso. Va
  // después del guard de sesión para que un usuario sin sesión siga yendo
  // a login (y regrese a la URL que pidió).
  const legacy = legacyDestination(pathname, request.nextUrl.search);
  if (legacy) {
    return NextResponse.redirect(new URL(legacy, request.url), 308);
  }

  // Si el alumno entró directo a un curso (marcador, enlace compartido,
  // redirección desde una URL legacy, o el switcher), esa es su selección
  // AHORA MISMO: el rail y la navegación deben seguirla en la MISMA
  // respuesta, no en la siguiente.
  //
  // Una cookie escrita aquí (`response.cookies.set`) no es garantía de
  // lectura inmediata por el Server Layout dentro de esta misma request, así
  // que la URL viaja como header de request: eso sí reemplaza lo que ve el
  // resto del árbol de esta request (`NextResponse.next({ request: { headers } })`).
  // La cookie se sigue escribiendo, pero sólo como memoria para cuando el
  // alumno navegue a una ruta global (`/app`, `/app/cursos`).
  const courseMatch = COURSE_PATH.exec(pathname);
  if (courseMatch) {
    const slug = decodeURIComponent(courseMatch[1]);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(COURSE_SLUG_HEADER, slug);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    if (request.cookies.get(COURSE_COOKIE)?.value !== slug) {
      response.cookies.set(COURSE_COOKIE, slug, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluye api de auth, archivos estáticos, imágenes, favicon
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
