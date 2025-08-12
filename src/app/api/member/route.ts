import { NextRequest, NextResponse } from "next/server";
import { apiRequest } from "../_utils/api-request";
import { handleDataTableRequest } from "../_utils/handle-datatable-request";
import { UserModel } from "@/model";

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

export const POST = async (req: NextRequest) => handleDataTableRequest<UserModel[]>(req,"/api/v1/auth/datatable");