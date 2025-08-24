"use server";

import { apiRequest } from "@/app/api/_utils/api-request";
import { handleError } from "@/lib/handle-error";
import { MenuModel, ResponseApiWithPayload, RoleModelWithPermission } from "@/model";

export const getMenus = async () => {
    try {
        const response = await apiRequest<ResponseApiWithPayload<MenuModel[]>>({
            url: "/api/v1/menus/tree",
            method: "GET"
        });
        return response.payload;
    } catch (err) {
        throw handleError(err);
    }
};

export const getRoleById = async (id: string) => {
    try {
        const response = await apiRequest<ResponseApiWithPayload<RoleModelWithPermission>>({
            url: "/api/v1/roles/" + id,
            method: "GET"
        });
        return response.payload;
    } catch (err) {
        throw handleError(err);
    }
};