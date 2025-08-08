import { DataTablesOutput } from "@/model";
import { NextRequest, NextResponse } from "next/server";
import { apiRequest } from "../../_utils/api-request";
import { logger } from "@/lib/utils";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    try {
        const response: DataTablesOutput<any[]> = await apiRequest({
            url: "/api/v1/activity-logs/datatable",
            method: "POST",
            data: body,
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log({response})
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