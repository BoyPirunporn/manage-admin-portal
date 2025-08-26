// // middleware.ts
// import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
// import createIntlMiddleware from 'next-intl/middleware';
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";


// // helper สำหรับ redirect/rewrites
// const redirectTo = (path: string, req: NextRequest) =>
//   NextResponse.redirect(new URL(path, req.url));

// const PUBLIC_ROUTES = [
//   "/auth/verify-email",
//   "/auth/register",
//   "/auth",
// ];

// // รองรับ locales จาก next-intl
// const LOCALES = ["en", "th"]; // เพิ่ม locales ตาม project ของคุณ
// const DEFAULT_LOCALE = "en";

// const extractLocale = (pathname: string) => {
//   const parts = pathname.split("/");
//   if (parts.length > 1 && LOCALES.includes(parts[1])) {
//     return parts[1];
//   }
//   return DEFAULT_LOCALE;
// };

// const intlMiddleware = createIntlMiddleware({
//   locales:LOCALES,
//   defaultLocale:DEFAULT_LOCALE,
// });

// export default withAuth(
//   async function middleware(req: NextRequestWithAuth) {
//     let { pathname } = req.nextUrl;
//     // if(!pathname.startsWith(`/${req.nextUrl.locale}`)){
//     //   pathname = `/${req.nextUrl.locale}/`+pathname;
//     // }
//     const token = req.nextauth.token;
//     const publicPathnameRegex = RegExp(
//       `^(/(${LOCALES.join('|')}))?(${PUBLIC_ROUTES.join('|')})/?$`,
//       'i'
//     );
//     const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
//     if(isPublicPage){
//       return NextResponse.next();
//     }
//     // ดึง locale จาก path /th/dashboard → th
//     const locale = extractLocale(pathname);
//     if (pathname === "/") {
//       return redirectTo("/" + locale, req);
//     }
//     // ถ้าเป็น public route → ไม่ต้อง redirect
//     if (PUBLIC_ROUTES.some((path) => pathname.startsWith(`/${locale}${path}`) || pathname.startsWith(path))) {
//       return NextResponse.next();
//     }

//     const isAuth = !!token?.accessToken;

//     // 1. ยังไม่ได้ login → redirect /auth
//     if (!isAuth) {
//       return redirectTo(`/${locale}/auth`, req);
//     }

//     // 2. login แล้วแต่เข้าหน้า /auth/login → redirect /
//     if (pathname === `/${locale}/auth` || pathname.startsWith(`/${locale}/auth/login`)) {
//       return redirectTo(`/${locale}/`, req);
//     }

//     // 3. login แล้วแต่ยังไม่ verify → redirect /auth/email-not-verified
//     if (token.verifyEmail === false && pathname !== `/${locale}/auth/email-not-verified`) {
//       return redirectTo(`/${locale}/auth/email-not-verified`, req);
//     }

//     return intlMiddleware(req);
//   },
//   {
//     callbacks: {
//       // ให้ always authorize, logic ตรวจ login/verify อยู่ด้านบน
//       authorized: () => true,
//     },
//   }
// );


// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|_next/font|images|favicon.ico|\\.well-known|i18n).*)"
//   ]
// };


import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const publicPages = [
  "/auth",
  "/auth/email-not-verified",
  "/auth/verify-email"
];

// 1. สร้าง intlMiddleware เพื่อจัดการเรื่องภาษาโดยเฉพาะ
const intlMiddleware = createIntlMiddleware(routing);

// 2. สร้าง authMiddleware เพื่อจัดการเรื่องสิทธิ์โดยเฉพาะ
const authMiddleware = withAuth(
  // ฟังก์ชันนี้จะทำงาน "หลัง" จากที่ intlMiddleware จัดการ URL แล้ว
  function middleware(req: NextRequestWithAuth) {
    // ไม่ต้องทำอะไรเป็นพิเศษ เพราะ next-auth จะจัดการ redirect เอง
    // และ intlMiddleware ได้จัดการเรื่อง path ไปแล้ว
  },
  {
    callbacks: {
      // Logic การตรวจสอบสิทธิ์จะอยู่ที่นี่
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        // next-intl จะลบ locale ออกจาก pathname ให้เราอัตโนมัติ
        // ดังนั้น /th/dashboard จะกลายเป็น /dashboard
        const isPublic = publicPages.some((path) => pathname.startsWith(path));

        // ถ้าเป็นหน้า public หรือมี token (login แล้ว) ให้ผ่าน
        if (isPublic || token) {
          return true;
        }

        // ถ้าไม่ใช่หน้า public และยังไม่ login จะถูก redirect ไปหน้า login
        return false;
      },
    },
    // ระบุหน้า login (next-auth จะเติม locale ให้เอง)
    pages: {
      signIn: "/auth",
    },
  }
);

// 3. Middleware หลักที่ทำหน้าที่ "ต่อท่อ"
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;


  // ตรวจสอบว่าเป็นหน้า public หรือไม่ (โดยไม่สน locale)
  const isPublic = publicPages.some((path) => pathname.endsWith(path));

  // ถ้าเป็นหน้า public ให้ intlMiddleware ทำงานอย่างเดียว
  if (isPublic) {
    return intlMiddleware(req);
  }

  // ถ้าไม่ใช่หน้า public ให้ authMiddleware (ที่ข้างในมี intl) ทำงาน
  // แต่เราจะเรียกใช้ authMiddleware ซึ่งจะจัดการทุกอย่างให้
  return (authMiddleware as any)(req);
}

// 4. Matcher ที่ถูกต้อง
export const config = {
  // Matcher จะทำงานกับทุก path ยกเว้นที่ระบุ
  // ทำให้ /api/... ไม่ถูกแตะต้องโดย middleware ของเรา
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};