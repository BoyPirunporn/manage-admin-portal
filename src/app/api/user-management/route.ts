import { NextRequest, NextResponse } from "next/server";
import { apiRequest, responseError } from "../_utils/api-request";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    try {
        const response = await apiRequest({
            url: "/api/v1/users",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: body
        });
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return responseError(error);
    }
};
export const PUT = async (req: NextRequest) => {
    const body = await req.json();
    try {
        const response = await apiRequest({
            url: "/api/v1/users",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            data: body
        });
        return NextResponse.json({response}, { status: 200 });
    } catch (error) {
        return responseError(error);
    }
};