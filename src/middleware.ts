// middleware.ts
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ✅ helper สำหรับ redirect/rewrites
const redirectTo = (path: string, req: NextRequest) =>
  NextResponse.redirect(new URL(path, req.url));

const rewriteTo = (path: string, req: NextRequest) =>
  NextResponse.rewrite(new URL(path, req.url));

// ✅ middleware หลัก
export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const isAuth = !!token?.accessToken;

    // ป้องกันเข้าถึง /api/auth/session ผ่าน browser
    if (pathname === "/api/auth/session") {
      const userAgent = req.headers.get("user-agent") || "";

      // เช็คว่าเป็น browser
      const isBrowser = /Mozilla|Chrome|Safari|Firefox|Edge/.test(userAgent);

      if (isBrowser) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }
    // 1. ยังไม่ได้ login → ไป /auth (ยกเว้น path /auth เอง)
    if (!isAuth) {
      return pathname.startsWith("/auth")
        ? NextResponse.next()
        : redirectTo("/auth", req);
    }

    // 2. login แล้วแต่เข้าหน้า /auth → redirect ไป home
    if (pathname.startsWith("/auth")) {
      return redirectTo("/", req);
    }

    // // 3. login แล้วแต่ไม่มีสิทธิ์ → rewrite ไปหน้า 403
    // if (!canAccess(pathname, token.menus ?? [])) {
    //   return rewriteTo("/403", req);
    // }

    // // 4. ผ่านทุกเงื่อนไข → ไปต่อ
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
