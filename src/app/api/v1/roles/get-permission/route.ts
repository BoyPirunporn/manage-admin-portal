import { withAuth } from "@/app/api/_utils/with-auth";
import { NextResponse } from "next/server";
import { apiRequest, responseError } from "../../../_utils/api-request";

export const GET = withAuth(async () => {
    try {
        const response = await apiRequest({
            url: "/api/v1/role-permission/get-permission",
            method: "GET",
        });
        return NextResponse.json(response, {
            status: 200
        });
    } catch (error) {
        return responseError(error);
    }
})