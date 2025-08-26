import report from "@/lib/report";
import { NextResponse } from "next/server";
import { apiRequest, responseError } from "../_utils/api-request";

export const POST = async () => {
    try {
       const data= await apiRequest({
            method:"POST",
            url:"/api/v1/auth/logout"
        });
        return NextResponse.json(data);
    } catch (error) {
        report(error)
        throw responseError(error);
    }
}