import { logger } from "@/lib/utils";
import { DataTablesOutput } from "@/model";
import { NextRequest, NextResponse } from "next/server";
import { apiRequest } from "../_utils/api-request";

interface Response { id: string, name: string, [key: string]: string; }


export const GET = async (req: NextRequest) => {
    const param = req.nextUrl;
    const response: Response[] = await apiRequest({
        url: "/cats?tags=cute&skip=0&limit=10",
        method: "GET"
    });
    return NextResponse.json({
        content: response,
        totalPages: response.length / 10,
        totalElements: response.length!,
        size: 10
    });
};

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    logger.info({body})
    // แปลง query ที่ client ส่งมาเป็น DataTablesInput object
    const dataTablesInput = {
        draw: (body.draw ?? 1),
        start: (body.start ?? 0) ,
        length: body.length ?? 10,
        search: { value: body.searchCriteria?.q || "", regex: false },
        order: [],
        columns: [],
    };
    try {
        const response: DataTablesOutput<any> = await apiRequest({
            url: "/api/v1/category/datatable",
            method: "POST",
            data: dataTablesInput,
            headers: {
                "Content-Type": "application/json"
            }
        });
        // logger.info(response)
        // แปลง Spring Boot DataTablesOutput เป็น format ที่ frontend ใช้
        return NextResponse.json(response);
    } catch (error) {
        logger.error({error})
        return NextResponse.json({
            error: (error as Error).message
        }, {
            status: 500
        });
    }
};