import { Menu } from "@/model";
import "next-auth";

declare module 'next-auth' {
    interface User {
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        menus: Menu[];
        firstName: string;
        lastName: string;
        image: string;
        roles: string[];
    }

    interface Session {
        user: Omit<User, "id"> | null;
        accessToken?: string;
        refreshToken?: string;
        menus: Menu[];
        error?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        exp?: number;
        lat?: number;
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        error?: string;
        menus: Menu[];
        firstName: string;
        lastName: string;
        image: string;
        roles: string[];
    }
}