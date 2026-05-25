import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth);

  const isAuthRoute = nextUrl.pathname.startsWith("/login");
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

  if (isApiAuthRoute) {
    return;
  }

  if (!isLoggedIn && !isAuthRoute) {
    const loginUrl = new URL("/login", nextUrl);
    return Response.redirect(loginUrl);
  }

  if (isLoggedIn && isAuthRoute) {
    const dashboardUrl = new URL("/dashboard", nextUrl);
    return Response.redirect(dashboardUrl);
  }
});

export const config = {
  matcher: [
    /*
     * Protege tudo, exceto:
     * - api/auth
     * - arquivos estáticos
     * - _next
     * - favicon
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
