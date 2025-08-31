import { ResponseApi } from "@/model";
import { NextRequest, NextResponse } from "next/server";
import { apiRequest, responseError } from "../../../_utils/api-request";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    // logger.debug({body})
    try {
        const response: ResponseApi = await apiRequest({
            url: "/api/v1/menu",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: body
        });
        return NextResponse.json(response, {
            status: 201
        });
    } catch (error) {
        return responseError(error);
    }
};