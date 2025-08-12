import { NextRequest, NextResponse } from "next/server";
import { apiRequest, responseError } from "./api-request";
import { DataTablesOutput } from "@/model";

export async function handleDataTableRequest<T>(req: NextRequest, apiUrl: string) {
    const body = await req.json();

    try {
        const response = await apiRequest<DataTablesOutput<T>>({
            url: apiUrl,
            method: "POST",
            data: body,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return NextResponse.json(response);
    } catch (error) {
        return responseError(error);
    }
}