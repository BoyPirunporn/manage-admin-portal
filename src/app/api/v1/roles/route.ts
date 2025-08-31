import { NextRequest, NextResponse } from "next/server";
import { apiRequest, responseError } from "../../_utils/api-request";
import { withAuth } from "../../_utils/with-auth";

export const POST = withAuth(async (req: NextRequest) => {
    const body = await req.json();
    try {
        const response = await apiRequest({
            url: "/api/v1/roles",
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
});