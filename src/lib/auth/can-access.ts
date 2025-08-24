import { PermissionNode } from "next-auth/jwt";
import logger from "../logger";

export const canAccess = (
    path: string,
    menus: PermissionNode[]
) => {

    if (path === "/") {
        return true;
    }

    const pathSegments = path.split("/").filter(Boolean);
    // sort menu longest first, root "/" last
    const sortedMenus = menus.sort((a, b) => (b.url?.length ?? 0) - (a.url?.length ?? 0));
    const menu = sortedMenus.find((m) => {
        if (m.url === "/") return path === "/"; // root only
        const menuSegments = m.url?.split("/").filter(Boolean) ?? [];
        return menuSegments.every((seg, i) => seg === pathSegments[i]);
    });

    if (!menu) return false;


    const lastSegment = pathSegments[pathSegments.length - 1];
    const normalizedAction = ["create", "update", "delete"].includes(lastSegment ?? "")
        ? lastSegment
        : "view";

    const allowMap: Record<string, boolean> = {
        view: menu.canView,
        create: menu.canCreate,
        update: menu.canUpdate,
        delete: menu.canDelete,
    };
    logger.debug({ normalizedAction, can: allowMap[normalizedAction] });

    return allowMap[normalizedAction];
};

const concatMenuTitleAndPermission = (title: string, permissionName: string) =>
    title.replace(/\s+/g, "_").toUpperCase() + "_" + permissionName.toUpperCase();
