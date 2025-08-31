import { MenuPermissionNode, ResponseApiWithPayload } from "@/model";
import { NextRequest, NextResponse } from "next/server";
import { apiRequest, responseError } from "../../../_utils/api-request";

export const GET = async (req: NextRequest) => {
    try {
        const response = await apiRequest<ResponseApiWithPayload<MenuPermissionNode[]>>({
            url: "/api/v1/menus/me",
            method: "GET"
        });
        return NextResponse.json(response.payload);
    } catch (error) {
        return responseError(error);
    }
};