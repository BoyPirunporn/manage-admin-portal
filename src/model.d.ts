import { ColumnDef, RowData } from "@tanstack/react-table";
import * as Icons from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface DataTablesOutput<T> {
    draw: number,
    recordsTotal: number,
    recordsFiltered: number,
    data: T[],
    searchPanes?: any,
    error?: string;
}

export interface MenuModel {
    id?: number | null;
    title: string;
    url?: string | null;
    icon?: keyof typeof Icons | null;
    visible: boolean;
    items: MenuModel[];
    parent?: MenuModel | null;
    isGroup: boolean;
}

interface MenuModelWithRoleMenuPermission extends MenuModel {
    items: MenuModelWithRoleMenuPermission[];
    parent?:MenuModelWithRoleMenuPermission | null;
    roleMenuPermissions: RoleMenuAndPermissionModel[];

}

interface RoleMenuAndPermissionModel {
    id?: number | null;
    role: UserRoleModel;
    menuItem: MenuModel;
    permission: PermissionModel;
}

interface PermissionModel {
    id?: number;
    name: string;
    description: string;
}

interface BaseResponse {
    status: number;
}
interface ResponseApi extends BaseResponse {
    message: string;
}
interface ResponseApiWithPayload<T> extends BaseResponse {
    payload: T;
}


interface UserRoleModel {
    id?: number | null;
    name: string;
    description?: string | null;
    permissions: RolePermission[];
    createdAt: string;
    updatedAt: string;
}

interface RolePermissionModel {
    id?: number | null;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
}


type Align = "left" | "center" | "right";

export type CustomColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<TData, TValue> & {
    alignItem?: Align;
};


interface UserModel {
    id?: number | null;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    image?: string;
    authProviders: UserAuthProviderModel[];
    roles: UserRoleModel[];
    createdAt: string;
    updatedAt: string;
}

interface UserAuthProviderModel {
    accessToken?: string | null;
    provider: string;

}