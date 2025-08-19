import { MenuModelWithRoleMenuPermission } from "@/model";
import { clsx, type ClassValue } from "clsx";
import { MenuMapped } from "next-auth/jwt";
import { Children } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const EachElement = <T,>({
  of,
  render
}: {
  of: readonly T[];
  render: (t: T, i: number) => React.ReactNode;
}) => {
  return Children.toArray(of.map(render));
};



export const logger = {
  info: (...args: any) => logger.debug(...args),
  debug: (...args: any) => process.env.NODE_ENV === "development" && console.debug(...args),
  warn: (...args: any) => process.env.NODE_ENV === "development" && console.warn(...args),
  error: (...args: any) => process.env.NODE_ENV === "development" && console.error(...args),
};


export const canAccess = (path: string, userPermission: string[], menus: MenuMapped[]) => {
  const menu = menus.find((m) => m.url === path);
  if (!menu) return false;
  return menu.permissions.some((p) => {
    const permissionName = concatMenuTitleAndPermission(menu.title, p);
    console.log({permissionName})
    return userPermission.includes(permissionName);
  });
};

const concatMenuTitleAndPermission = (title: string, permissionName: string) => title.replace(" ", "_").toUpperCase() + "_" + permissionName.toUpperCase();