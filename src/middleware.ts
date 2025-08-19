import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canAccess } from "./lib/utils";
import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { cookies } from "next/headers";
import { MenuModelWithRoleMenuPermission } from "./model";
// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // skip static files / API / next internals
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/images") ||
//     pathname === "/favicon.ico" ||
//     pathname.startsWith("/.well-known")
//   ) {
//     return NextResponse.next();
//   }

//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const isAuth = !!token?.accessToken;

//   // 1. User not logged in → redirect to /auth
//   if (!isAuth) {
//     if (!pathname.startsWith("/auth")) {
//       return NextResponse.redirect(new URL("/auth", req.url));
//     }
//     return NextResponse.next();
//   }

//   // 2. Logged in user trying to access /auth → redirect home
//   if (pathname.startsWith("/auth")) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   // // 3. Logged in user → check permissions
//   // const hasAccess = canAccess(pathname, token.roles ?? [], token.menus ?? []);
//   // if (isAuth && !hasAccess) {
//   //   // rewrite to /403 page (user is logged in but forbidden)
//   //   return NextResponse.rewrite(new URL("/403", req.url));
//   // }

//   // 4. User logged in and has access → continue
//   return NextResponse.next();
// }



export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const pathname = req.nextUrl.pathname;
    const isAuth = req.nextauth.token?.accessToken;
    const permissions = req.nextauth.token?.roles;
    const menus = req.nextauth.token?.menus;
    if (!isAuth) {
      if (!pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/auth", req.url));
      }
      return NextResponse.next();
    }

    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if(isAuth && !canAccess(pathname,permissions!,menus!)){
      return NextResponse.rewrite(new URL("/403",req.url));
    }
  }, {
  callbacks: {
    authorized: (args) => {
      return true;
    }
  }
});

export const config = {
  matcher: [
    "/((?!api|_next|images|favicon.ico|\\.well-known).*)",
  ],
};
