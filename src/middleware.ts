// middleware.ts
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ✅ helper สำหรับ redirect/rewrites
const redirectTo = (path: string, req: NextRequest) =>
  NextResponse.redirect(new URL(path, req.url));

const rewriteTo = (path: string, req: NextRequest) =>
  NextResponse.rewrite(new URL(path, req.url));

const PUBLIC_ROUTES = [
  "/auth/verify-email", // หน้า verify email จากลิงก์
  "/auth/register",     // ถ้ามีหน้า register
  "/auth",              // หน้า login / auth
];
// ✅ middleware หลัก
export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;



    if (PUBLIC_ROUTES.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // ตอนนี้เช็ค login / verify สำหรับ route อื่น ๆ
    const isAuth = !!token?.accessToken;

    // 1. ยังไม่ได้ login → redirect /auth
    if (!isAuth) {
      return redirectTo("/auth", req);
    }

    // 2. login แล้วแต่เข้าหน้า /auth/login → redirect /
    if (pathname === "/auth" || pathname.startsWith("/auth/login")) {
      return redirectTo("/", req);
    }

    // 3. login แล้วแต่ยังไม่ verify → redirect /auth/email-not-verified
    if (token.verifyEmail === false && pathname !== "/auth/email-not-verified") {
      return redirectTo("/auth/email-not-verified", req);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // ให้ always authorize, แต่ logic จริงไปเช็คใน middleware ด้านบน
      authorized: () => true,
    },
  }
);

// ✅ matcher: ข้ามไฟล์ static / api / internals
export const config = {
  matcher: [
    "/((?!api|_next|images|favicon.ico|\\.well-known).*)",
  ],
};
