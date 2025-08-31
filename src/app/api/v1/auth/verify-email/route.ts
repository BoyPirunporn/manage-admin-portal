import { withAuth } from "@/app/api/_utils/with-auth";
import { ResponseApi, ResponseWithError } from "@/model";
import { NextRequest, NextResponse } from "next/server";
import { apiRequest, responseError } from "../../../_utils/api-request";

export const GET = withAuth(async () => {
    return NextResponse.json({message:"Hello world"})
})
export const POST = async (req: NextRequest) => {
    const data = await req.json();
    try {
        const response = await apiRequest<ResponseApi | ResponseWithError>({
            url: "/api/v1/auth/verify-email",
            method: "POST",
            data
        });
        return NextResponse.json(response, { status: response.status });
    } catch (error) {
        return responseError(error);
    }
};