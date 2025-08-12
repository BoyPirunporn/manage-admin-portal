import { NextRequest, NextResponse } from "next/server";
import { apiRequest, responseError } from "../../_utils/api-request";

export const GET = async (req: NextRequest) => {
    try {
        const response = await apiRequest({
            url: "/api/v1/role-permission/get-role-with-level",
            method: "GET",
        });
        return NextResponse.json(response, {
            status: 200
        });
    } catch (error) {
        return responseError(error);
    }
};