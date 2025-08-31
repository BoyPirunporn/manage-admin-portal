import { handleError } from "@/lib/handle-error";
import { ResponseApi, ResponseApiWithPayload } from "@/model";
import { ChangePasswordSchema } from "./page";

export const changePasswordAction = async (data: ChangePasswordSchema): Promise<{ message: string; status: boolean; }> => {
    try {
        const response = await fetch("/api/v1/user-management/change-password", {
            method: "POST",
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const json = await response.json() as ResponseApi;
            return { message: json.message, status: false };
        }
        const json = await response.json() as ResponseApiWithPayload<string>;
        return { message: json.payload, status: true };
    } catch (error) {
        throw handleError(error);
    }
};