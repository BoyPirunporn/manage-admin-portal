import report from "@/lib/report";
import { NextRequest, NextResponse } from "next/server";
import { apiRequest, responseError } from "../../_utils/api-request";
import { withAuth } from "../../_utils/with-auth";

export const POST = withAuth(async (req: NextRequest) => {
    const body = await req.json();
    const ipAddress = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") ?? "";

    const payload = {
        ...body,
        ipAddress: ipAddress,
        userAgent: userAgent,
    };
    // logger.debug({payload})
    try {
        const response = await apiRequest({
            method: "POST",
            url: "/api/v1/activity-logs",
            data: payload
        });
        return NextResponse.json(response, {
            status: 201
        });
    } catch (error) {
        report(error);
        return responseError(error);
    }
});