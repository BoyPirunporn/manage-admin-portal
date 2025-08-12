import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token?.accessToken;

  const { pathname } = req.nextUrl;

  if (!isAuth && !pathname.startsWith("/auth")) {
    const loginUrl = new URL("/auth", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/auth") && isAuth) {
    return NextResponse.redirect(new URL("/",req.url));
  }

  return NextResponse.next({request:req});
}

export const config = {
  matcher: [
    "/((?!api|_next|images|favicon.ico|\\.well-known).*)",
  ],
};
