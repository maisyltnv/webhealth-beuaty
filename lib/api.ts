import axios, { type AxiosInstance } from "axios";
import type {
  ApiCreateOrderBody,
  ApiCreateProductBody,
  ApiLoginResponse,
  ApiOrder,
  ApiOrderListResponse,
  ApiProduct,
  ApiProductListResponse,
  ApiUpdateProductBody,
  ApiUser,
} from "@/lib/api-types";

const TOKEN_KEY = "hb_access_token";

export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  return base;
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredAccessToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function createClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: getApiBaseUrl(),
    headers: { "Content-Type": "application/json" },
    timeout: 30_000,
  });

  instance.interceptors.request.use((config) => {
    const token = getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}

const client = createClient();

export async function apiHealth(): Promise<{ status?: string }> {
  const { data } = await client.get<{ status?: string }>("/health");
  return data;
}

export async function apiRegister(body: {
  username: string;
  password: string;
  role?: string;
}): Promise<unknown> {
  const { data } = await client.post("/auth/register", body);
  return data;
}

export async function apiLogin(body: {
  username: string;
  password: string;
}): Promise<ApiLoginResponse> {
  const { data } = await client.post<ApiLoginResponse>("/auth/login", body);
  return data;
}

export async function apiMe(): Promise<ApiUser> {
  const { data } = await client.get<ApiUser>("/auth/me");
  return data;
}

export async function apiListProducts(params?: {
  limit?: number;
  offset?: number;
}): Promise<ApiProduct[]> {
  const { data } = await client.get<ApiProductListResponse | ApiProduct[]>(
    "/products",
    { params }
  );
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}

export async function apiGetProduct(id: number | string): Promise<ApiProduct> {
  const { data } = await client.get<ApiProduct>(`/products/${id}`);
  return data;
}

export async function apiCreateProduct(
  body: ApiCreateProductBody
): Promise<ApiProduct> {
  const { data } = await client.post<ApiProduct>("/products", body);
  return data;
}

export async function apiUpdateProduct(
  id: number | string,
  body: ApiUpdateProductBody
): Promise<ApiProduct> {
  const { data } = await client.put<ApiProduct>(`/products/${id}`, body);
  return data;
}

export async function apiDeleteProduct(id: number | string): Promise<void> {
  await client.delete(`/products/${id}`);
}

export async function apiListOrders(params?: {
  limit?: number;
  offset?: number;
}): Promise<ApiOrder[]> {
  const { data } = await client.get<ApiOrderListResponse | ApiOrder[]>(
    "/orders",
    { params }
  );
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}

export async function apiCreateOrder(
  body: ApiCreateOrderBody
): Promise<ApiOrder> {
  const { data } = await client.post<ApiOrder>("/orders", body);
  return data;
}

export function isApiConfigured(): boolean {
  return Boolean(getApiBaseUrl());
}
