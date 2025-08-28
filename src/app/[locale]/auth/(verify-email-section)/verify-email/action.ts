'use server';

import { apiRequest } from "@/app/api/_utils/api-request";
import { ResponseApiWithPayload } from "@/model";
import { redirect, RedirectType } from "next/navigation";

export const verifyToken = async (token: string) => {
    const response = await apiRequest<ResponseApiWithPayload<{ isValid: boolean; state: 'invalid' | 'valid' | 'expired'; }>>({
        method: "GET",
        url: "/api/v1/auth/verify-token?token=" + token
    });
    if (response.payload.state === "expired") {
        return redirect("/auth/email-not-verified?message=" + response.payload.state, RedirectType.replace);
    } else if (response.payload.state === "invalid") {
        return redirect("/auth/email-not-verified?message=" + response.payload.state, RedirectType.replace);
    }
    return response.payload;
};