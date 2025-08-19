import { Menu, MenuModelWithRoleMenuPermission } from "@/model";
import "next-auth";

declare module 'next-auth' {
    interface DefaultUser { }
    interface User {
        accessToken: string;
        refreshToken: string;
        accessTokenExpires?: number;
        firstName: string;
        lastName: string;
        image: string;
        roles: string[];
        menus: MenuMapped[];
    }

    interface Session {
        user: Omit<User, "id"> | null;
        accessToken: string;
        refreshToken: string;
        menus: MenuMapped[];
        roles: string[];
        error?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        // id?: string;
        exp?: number;
        lat?: number;
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        error?: string;
        menus: MenuMapped[];
        firstName: string;
        lastName: string;
        image: string;
        roles: string[];
    }
    type MenuMapped = {
        title: string;
        url: string;
        permissions: string[];
    };
}