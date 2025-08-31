"use server";

import { MemberSchema } from "@/app/[locale]/(pages)/(groups)/settings/members/[...action]/components/form-member-input";
import { apiRequest } from "@/app/api/_utils/api-request";
import { handleError } from "@/lib/handle-error";
import { MenuModelWithRoleMenuPermission, PermissionModel, ResponseApiWithPayload, RoleModel } from "@/model";

export const getRoles = async () => {
    try {
        const response = await apiRequest<ResponseApiWithPayload<RoleModel[]>>({
            url: "/api/v1/roles",
            method: "GET"
        });
        return response.payload;
    } catch (err) {
       throw  handleError(err);
    }
};
export const getMenuItems = async () => {
    try {
        const response = await apiRequest<ResponseApiWithPayload<MenuModelWithRoleMenuPermission[]>>({
            url: "/api/v1/menu/all",
            method: "GET"
        });
        return response.payload;
    } catch (err) {
      throw   handleError(err);
    }
};
export const getPermissions = async () => {
    try {
        const response = await apiRequest<ResponseApiWithPayload<PermissionModel[]>>({
            url: "/api/v1/role-permission/get-permissions",
            method: "GET"
        });
        return response.payload;
    } catch (err) {
        throw  handleError(err);
    }
};

export const getUser = async (id: string) => {
    try {
        if(id === "create") return null;
        const response = await apiRequest<ResponseApiWithPayload<MemberSchema>>({
            url: "/api/v1/users/" +id,
            method: "GET"
        });
        return response.payload;
    } catch (err) {
        throw handleError(err);
    }
};