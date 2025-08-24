import { ColumnDef, RowData } from "@tanstack/react-table";
import * as Icons from "lucide-react";
import { PermissionNode } from "next-auth/jwt";
import { PageSize } from "./components/datatable/data-table";

interface DataTablesOutput<T> {
    draw: number,
    recordsTotal: number,
    recordsFiltered: number,
    data: T[],
    searchPanes?: any,
    error?: string;
}
interface PagedResponse<T> {
    data: T[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    isLast: boolean;
}
interface TableState {
    // pageIndex: number;      // หน้าปัจจุบัน (เริ่มจาก 0)
    pageSize?: PageSize;       // จำนวนข้อมูลต่อหน้า
    sorting?: {              // การเรียงข้อมูล
        id: string;
        desc: boolean;
    }[];
    globalFilter?: string;   // คำค้นหา
}
export interface MenuModel {
    id?: string | null;
    title: string;
    url?: string | null;
    icon?: keyof typeof Icons | null;
    isVisible: boolean;
    children: MenuModel[];
    parent?: MenuModel | null;
    isGroup: boolean;
}

interface PermissionNodeWithOutTitleAndUrl extends Omit<PermissionNode, "title" | "url"> {
    menuId: string;
}
interface RoleModelWithPermission extends RoleModel {
    permissions: {
        menuId:string;
        canView:boolean;
        canCreate:boolean;
        canUpdate:boolean;
        canDelete:boolean;
    }[];
}

interface MenuModelWithRoleMenuPermission extends MenuModel {
    items: MenuModelWithRoleMenuPermission[];
    parent?: MenuModelWithRoleMenuPermission | null;
    roleMenuPermissions: RoleMenuAndPermissionModel[];
}

interface MenuPermissionNode {
    menuId: string;
    menuName: string;
    url: string;
    icon: string;
    menuDisplayOrder: number;
    isGroup: boolean;
    isVisible: boolean;
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    children: MenuPermissionNode[];
}

interface PermissionModel {
    id?: number;
    name: string;
    description: string;
}

interface BaseResponse {
    status: number;
    success: boolean;
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
    roleMenuPermissions: RoleMenuAndPermissionModel[];
    createdAt: string;
    updatedAt: string;
}
interface RoleModel {
    id?: string | null;
    name: string;
    description?: string | null;
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
    id?: string | null;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    image?: string;
    // authProviders: UserAuthProviderModel[];
    roles: UserRoleModel[];
    createdAt?: string;
    updatedAt?: string;
}

interface UserAuthProviderModel {
    accessToken?: string | null;
    provider: string;

}