import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import { COURSE_COOKIE } from "@/lib/course-selection";

const PUBLIC_PATHS = ["/", "/login", "/registro", "/invitar", "/api/auth"];
const AUTH_PATHS = ["/login", "/registro"];

/** `/app/c/<curso>/...` */
const COURSE_PATH = /^\/app\/c\/([^/]+)(?:\/|$)/;

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

  // Si el alumno entró directo a un curso (marcador, enlace compartido,
  // redirección desde una URL legacy), esa es su selección: el rail y la
  // navegación deben seguirlo en la MISMA respuesta, no en la siguiente.
  // `request.cookies.set` + `NextResponse.next({ request })` hace que los
  // server components ya lean el valor nuevo.
  const courseMatch = COURSE_PATH.exec(pathname);
  if (courseMatch) {
    const slug = decodeURIComponent(courseMatch[1]);
    if (request.cookies.get(COURSE_COOKIE)?.value !== slug) {
      request.cookies.set(COURSE_COOKIE, slug);
      const response = NextResponse.next({ request });
      response.cookies.set(COURSE_COOKIE, slug, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluye api de auth, archivos estáticos, imágenes, favicon
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
