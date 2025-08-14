import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { logger } from "./utils";
import { MenuModel, ResponseApiWithPayload } from "@/model";
import { apiRequest, report } from "@/app/api/_utils/api-request";

export async function refreshAccessToken(token: JWT) {
  try {
    const res = await fetch(process.env.API_SERVICE + "/api/v1/auth/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const refreshed = await res.json();

    if (!res.ok) return { ...token, error: "RefreshAccessTokenError" };

    return {
      ...token,
      accessToken: refreshed.payload.token,
      accessTokenExpires: extractToken(refreshed.payload.token).exp * 1000, // e.g. 15 mins
      refreshToken: refreshed.payload.refreshToken,
    };
  } catch (error) {
    console.error("Refresh error:", error);
    return { ...token as JWT, error: "RefreshAccessTokenError" };
  }
}

const extractToken = (token: string) => JSON.parse(atob(token.split(".").at(1)!));

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        logger.debug({ credentials });
        try {
          const res = await apiRequest({
            url: "/api/v1/auth/sign-in",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data: credentials,
          });
          // if (!res.ok) {
          //   // const error = JSON.stringify(await res.text());
          //   const error = await res.json();
          //   logger.debug(error);
          //   throw new Error(error && error.message ? error.message : "Invalid Credential");
          // }
          const user = res as ResponseApiWithPayload<{
            token: string;
            refreshToken: string;
            roles: string[];
            firstName: string;
            lastName: string;
            image: string;
            // menus: MenuModel[];
          }>;
          logger.debug("USER PAYLOAD "+user.payload);

          // const menuRequest = await fetch(process.env.API_SERVICE + "/api/v1/menu", {
          //   headers: {
          //     "Content-Type": "application/json"
          //   }
          // });

          // const responseMenu = await menuRequest.json();

          const authentication = {
            // id: "1",
            email: credentials?.email,
            accessToken: user.payload.token,
            refreshToken: user.payload.refreshToken,
            firstName: user.payload.firstName,
            lastName: user.payload.lastName,
            image: user.payload.image,
            roles: user.payload.roles,
            accessTokenExpires: JSON.parse(atob(user.payload.token.split(".").at(1)!)).exp * 1000, //ที่ *1000 เพราะ ได้ค่าเป็น second เลยต่อง * 1000
            // menus: user.payload.menus.map(menu => {
            //   const mapMenu = (m: MenuModel): MenuModel => {
            //     return {
            //       ...m,
            //       items: m.items?.map((child) => mapMenu(child)) || []
            //     };
            //   };
            //   return mapMenu(menu);
            // }) //TODO:: ดึงจาก api 
          } as User;

          return authentication;
        } catch (error) {
          throw new Error(report(error));
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // เปลี่ยนบรรทัดนี้
      },
    },
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | undefined; }) {
      // กรณีมี user ใหม่ (ตอน login หรือ session ใหม่)
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires; // สมมติเป็น ms
        // token.menus = user.menus;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.image = user.image;
        token.roles = user.roles;
        return token;
      }

      // เช็คว่า accessToken หมดอายุหรือยัง
      const isAccessTokenValid = token.accessTokenExpires
        ? Date.now() < (token.accessTokenExpires as number)
        : false;

      if (isAccessTokenValid) {
        // ยังไม่หมดอายุ ใช้ token เดิม
        return token;
      }

      // accessToken หมดอายุแล้ว ต้อง refresh
      try {
        const refreshedToken = await refreshAccessToken(token);
        if (refreshedToken.error) {
          logger.debug("ERROR REFRESH TOKEN");
          throw Error(refreshedToken.error);
        }
        return refreshedToken;
      } catch (error) {
        console.error("Failed to refresh access token", error);
        // ถ้า refresh ไม่ได้ คืน token เดิม (หรือใส่ error flag)
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },
    async session({ session, token }: { session: Session, token: JWT; }) {
      session.accessToken = token.accessToken;
      // session.menus = token.menus;
      session.roles = token.roles;
      session = {
        ...session,
        user: { ...session.user!, firstName: token.firstName, lastName: token.lastName, image: token.image, roles: token.roles }
      };
      if (token.error) {
        session.error = token.error;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};