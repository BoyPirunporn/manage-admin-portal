import { isAxiosError } from "axios";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export const handleError = async (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) {
      throw redirect(`/${await getLocale()}/auth`);
    }
  }
  throw error;
};
