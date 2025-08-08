import { logger } from "@/lib/utils";
import { DataTablesOutput, MenuModel } from "@/model";
import { NextRequest, NextResponse } from "next/server";
import { apiRequest } from "../_utils/api-request";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    try {
        const response: DataTablesOutput<MenuModel[]> = await apiRequest({
            url: "/api/v1/menu/datatable",
            method: "POST",
            data: body,
            headers: {
                "Content-Type": "application/json"
            }
        });
        // แปลง Spring Boot DataTablesOutput เป็น format ที่ frontend ใช้
        return NextResponse.json(response);
    } catch (error) {
        logger.debug({ error });
        return NextResponse.json({
            error: (error as Error).message
        }, {
            status: 500
        });
    }
};