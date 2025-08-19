import { apiRequest, report } from "@/app/api/_utils/api-request";
import { MenuModelWithRoleMenuPermission, ResponseApiWithPayload } from "@/model";
import { NextAuthOptions, Session, User } from "next-auth";
import { JWT, MenuMapped } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { logger } from "./utils";

export async function refreshAccessToken(token: JWT) {
  // logger.debug("Refreshing access token", { token });
  try {
    const res = await fetch(process.env.API_SERVICE + "/api/v1/auth/refresh-tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });
    console.log(res.status, res.statusText);
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
            menus: MenuModelWithRoleMenuPermission[];
          }>;
          logger.debug("USER PAYLOAD " + user.payload);

          // const menuRequest = await fetch(process.env.API_SERVICE + "/api/v1/menu", {
          //   headers: {
          //     "Content-Type": "application/json"
          //   }
          // });

          // const responseMenu = await menuRequest.json();



          const mapMenu = (menus: MenuModelWithRoleMenuPermission[] = []): MenuMapped[] => {
            console.log(menus)
            return menus.flatMap(menu => {
              if (menu.items && menu.items.length > 0) {
                return mapMenu(menu.items); // flatten child ลงมา
              }
              return {
                title: menu.title,
                url: menu.url!,
                permissions: menu.roleMenuPermissions.map(r => r.permission.name),
              };
            });
          };
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
            menus: mapMenu(user.payload.menus)
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
    async jwt({ token, trigger, user, session }) {
      // กรณีมี user ใหม่ (ตอน login หรือ session ใหม่)
      if (trigger === "update" && session?.menus) {
        token.menus = session.menus;
        return token;
      }

      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires; // สมมติเป็น ms
        token.menus = user.menus;
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
          return {
            ...token,
            error: "RefreshAccessTokenError",
          };
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
      session.accessToken = token.accessToken!;
      session.refreshToken = token.refreshToken!;
      session.roles = token.roles;
      session.menus = token.menus;
      session = {
        ...session,
        user: { ...session.user!, firstName: token.firstName, lastName: token.lastName, image: token.image, roles: token.roles }
      };
      if (token.error) {
        session.error = token.error;
      }
      if (token.menus) {
        session.menus = token.menus;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};