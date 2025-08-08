// app/api/_utils/api-request.ts
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/utils";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getServerSession } from "next-auth";

const apiBaseUrl = process.env.API_SERVICE!;

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export async function apiRequest<T = unknown>(
  config: AxiosRequestConfig
): Promise<T> {
  const controller = new AbortController();
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (config.signal) {
    // ถ้า config.signal ถูก abort ให้ cancel axios ด้วย
    config.signal.addEventListener?.("abort", () => {
      controller.abort();
    });
  }
  try {
    const response = await api.request<T>({
      ...config,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return response.data;
  } catch (error) {
    logger.error({error})
    return Promise.reject(error)
  }
}
