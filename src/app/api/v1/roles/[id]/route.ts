import { apiRequest, responseError } from "@/app/api/_utils/api-request";
import { withAuth } from "@/app/api/_utils/with-auth";
import { NextRequest, NextResponse } from "next/server";

export const PUT = withAuth<Promise<{
    id: string;
}>>(async (req: NextRequest, {params}) => {
    const { id } = await params;
    const body = await req.json();
    try {
        const response = await apiRequest({
            url: "/api/v1/roles/" + id,
            method: "PUT",
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
