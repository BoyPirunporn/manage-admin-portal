import { ResponseApi } from "@/model";
import { NextRequest, NextResponse } from "next/server";
import { apiRequest, responseError } from "../_utils/api-request";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    try {
        const response = await apiRequest<ResponseApi>({
            url: "/api/v1/auth/verify-email/" + body.token,
            method: "POST"
        });
        return NextResponse.json(response, { status: response.status });
    } catch (error) {
        return responseError(error);
    }
};