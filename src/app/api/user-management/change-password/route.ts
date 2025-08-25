import { ResponseApiWithPayload } from "@/model";
import { NextRequest, NextResponse } from "next/server";
import { apiRequest, responseError } from "../../_utils/api-request";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    try {
        const response = await apiRequest<ResponseApiWithPayload<string>>({
            url: "/api/v1/auth/change-password",
            method: "POST",
            data: body
        });
        return NextResponse.json(response, { status: response.status });
    } catch (error) {
        return responseError(error);
    }
};