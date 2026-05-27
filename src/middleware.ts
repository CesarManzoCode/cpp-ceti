import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PUBLIC_PATHS = ["/", "/login", "/registro", "/api/auth"];
const AUTH_PATHS = ["/login", "/registro"];

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

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluye api de auth, archivos estáticos, imágenes, favicon
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
