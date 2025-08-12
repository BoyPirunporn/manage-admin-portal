"use server";

import { apiRequest, report } from "@/app/api/_utils/api-request";
import {  MenuModelWithRoleMenuPermission, PermissionModel, ResponseApiWithPayload, UserRoleModel } from "@/model";

export const getRoles = async () => {
    try {
        const response = await apiRequest<ResponseApiWithPayload<UserRoleModel[]>>({
            url: "/api/v1/role-permission/get-role-with-level",
            method: "GET"
        });
        return response.payload;
    } catch (err) {
        throw err;
    }
};
export const getMenuItems = async () => {
    try {
        const response = await apiRequest<ResponseApiWithPayload<MenuModelWithRoleMenuPermission[]>>({
            url: "/api/v1/menu/all",
            method: "GET"
        });
        console.log(response.payload)
        return response.payload;
    } catch (err) {
        throw err;
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
        console.log(report(err))
        throw err;
    }
};