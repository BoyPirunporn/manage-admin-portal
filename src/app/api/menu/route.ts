import { MenuModel, ResponseApiWithPayload } from "@/model";
import { NextRequest, NextResponse } from "next/server";
import { handleDataTableRequest } from "../_utils/handle-datatable-request";
import { apiRequest, responseError } from "../_utils/api-request";

export const POST = async (req: NextRequest) => handleDataTableRequest<MenuModel[]>(req,"/api/v1/menu/datatable");
export const GET = async (req:NextRequest) => {
    try {
        const response = await apiRequest<ResponseApiWithPayload<MenuModel[]>>({
            url:"/api/v1/menu",
            method:"GET"
        });
        return NextResponse.json(response.payload);
    }catch(error){
        return responseError(error)
    }
}