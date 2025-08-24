import { isAxiosError } from "axios";
import { redirect } from "next/navigation";

export const handleError = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) {
      throw redirect("/auth");
    }
  }
  throw error;
};
