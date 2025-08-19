"use server";

import { apiRequest, report } from "@/app/api/_utils/api-request";
import { MenuModelWithRoleMenuPermission, PermissionModel, ResponseApiWithPayload, UserRoleModel } from "@/model";
import { MemberSchema } from "./components/form-member-input";
import { isAxiosError } from "axios";
import { redirect } from "next/navigation";
const handleError = (error: unknown) => {
    if(isAxiosError(error)){
        if(error.response?.status === 401){
           throw redirect("/auth")
        }
    }
    throw error;
}
export const getRoles = async () => {
    try {
        const response = await apiRequest<ResponseApiWithPayload<UserRoleModel[]>>({
            url: "/api/v1/role-permission/get-role-with-level",
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
        console.log(report(err));
        throw  handleError(err);
    }
};

export const getUser = async (id: string | number) => {
    try {
        if(!Number(id)){
            return null;
        }
        const response = await apiRequest<ResponseApiWithPayload<MemberSchema>>({
            url: "/api/v1/user-management/" + Number(id),
            method: "GET"
        });
        return response.payload;
    } catch (err) {
        console.log(report(err));
        throw handleError(err);
    }
};