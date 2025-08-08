import { logger } from "@/lib/utils";
import { MenuModel, ResponseApiWithPayload } from "@/model";
import { NextRequest, NextResponse } from "next/server";
import { apiRequest } from "../../_utils/api-request";

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    logger.info(body)
    try {
        const response: ResponseApiWithPayload<MenuModel[]> = await apiRequest({
            url: "/api/v1/menu/find-by-title",
            method: "POST",
            data: body
        });
        logger.info(response.payload)
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        logger.error({ error });
        return NextResponse.json({
            error: (error as Error).message
        }, {
            status: 500
        });
    }
};