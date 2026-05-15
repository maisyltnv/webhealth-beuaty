import axios, { type AxiosInstance } from "axios";
import type {
  ApiAdminLoginResponse,
  ApiCategory,
  ApiCategoryListResponse,
  ApiCreateCategoryBody,
  ApiCreateOrderBody,
  ApiCreateProductBody,
  ApiExchangeRate,
  ApiLoginResponse,
  ApiUpdateExchangeRateBody,
  ApiUpdateExchangeRateResponse,
  ApiOrder,
  ApiOrderListResponse,
  ApiProduct,
  ApiProductListResponse,
  ApiUpdateCategoryBody,
  ApiUpdateProductBody,
  ApiUser,
} from "@/lib/api-types";

const USER_TOKEN_KEY = "hb_access_token";
const ADMIN_TOKEN_KEY = "hb_admin_access_token";

export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  return base;
}

/** Customer / client JWT */
export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_TOKEN_KEY);
}

export function setStoredAccessToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(USER_TOKEN_KEY, token);
  else localStorage.removeItem(USER_TOKEN_KEY);
}

/** Admin JWT (from POST /auth/admin/login) */
export function getStoredAdminAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setStoredAdminAccessToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function createPublicClient(): AxiosInstance {
  return axios.create({
    baseURL: getApiBaseUrl(),
    headers: { "Content-Type": "application/json" },
    timeout: 30_000,
  });
}

function createUserClient(): AxiosInstance {
  const instance = createPublicClient();
  instance.interceptors.request.use((config) => {
    const token = getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
}

function createAdminClient(): AxiosInstance {
  const instance = createPublicClient();
  instance.interceptors.request.use((config) => {
    const token = getStoredAdminAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
}

const publicClient = createPublicClient();
const userClient = createUserClient();
const adminClient = createAdminClient();

export async function apiHealth(): Promise<{ status?: string }> {
  const { data } = await publicClient.get<{ status?: string }>("/health");
  return data;
}

export async function apiRegister(body: {
  username: string;
  password: string;
  role?: string;
}): Promise<unknown> {
  const { data } = await publicClient.post("/auth/register", body);
  return data;
}

/** Customer login — POST /auth/login */
export async function apiLogin(body: {
  username: string;
  password: string;
}): Promise<ApiLoginResponse> {
  const { data } = await publicClient.post<ApiLoginResponse>(
    "/auth/login",
    body
  );
  return data;
}

/** Admin login — POST /auth/admin/login */
export async function apiAdminLogin(body: {
  username: string;
  password: string;
}): Promise<ApiAdminLoginResponse> {
  const { data } = await publicClient.post<ApiAdminLoginResponse>(
    "/auth/admin/login",
    body
  );
  return data;
}

/** Current user (client JWT) */
export async function apiMe(): Promise<ApiUser> {
  const { data } = await userClient.get<ApiUser>("/auth/me");
  return data;
}

/** Current admin (admin JWT) */
export async function apiMeAdmin(): Promise<ApiUser> {
  const { data } = await adminClient.get<ApiUser>("/auth/me");
  return data;
}

export async function apiListProducts(params?: {
  limit?: number;
  offset?: number;
}): Promise<ApiProduct[]> {
  const { data } = await publicClient.get<
    ApiProductListResponse | ApiProduct[]
  >("/products", { params });
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}

export async function apiGetProduct(id: number | string): Promise<ApiProduct> {
  const { data } = await publicClient.get<ApiProduct>(`/products/${id}`);
  return data;
}

export async function apiCreateProduct(
  body: ApiCreateProductBody
): Promise<ApiProduct> {
  const { data } = await adminClient.post<ApiProduct>("/products", body);
  return data;
}

export async function apiUpdateProduct(
  id: number | string,
  body: ApiUpdateProductBody
): Promise<ApiProduct> {
  const { data } = await adminClient.put<ApiProduct>(`/products/${id}`, body);
  return data;
}

export async function apiDeleteProduct(id: number | string): Promise<void> {
  await adminClient.delete(`/products/${id}`);
}

/** Public — GET /categories */
export async function apiListCategories(params?: {
  roots_only?: boolean;
  parent_id?: number;
}): Promise<ApiCategory[]> {
  const { data } = await publicClient.get<
    ApiCategoryListResponse | ApiCategory[]
  >("/categories", { params });
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}

/** Public — GET /categories/:id */
export async function apiGetCategory(id: number): Promise<ApiCategory> {
  const { data } = await publicClient.get<ApiCategory>(`/categories/${id}`);
  return data;
}

/** Admin JWT — POST /categories */
export async function apiCreateCategory(
  body: ApiCreateCategoryBody
): Promise<ApiCategory> {
  const { data } = await adminClient.post<ApiCategory>("/categories", body);
  return data;
}

/** Admin JWT — PUT /categories/:id */
export async function apiUpdateCategory(
  id: number,
  body: ApiUpdateCategoryBody
): Promise<ApiCategory> {
  const { data } = await adminClient.put<ApiCategory>(
    `/categories/${id}`,
    body
  );
  return data;
}

/** Admin JWT — DELETE /categories/:id */
export async function apiDeleteCategory(id: number): Promise<void> {
  await adminClient.delete(`/categories/${id}`);
}

export async function apiListOrders(params?: {
  limit?: number;
  offset?: number;
}): Promise<ApiOrder[]> {
  const { data } = await adminClient.get<ApiOrderListResponse | ApiOrder[]>(
    "/orders",
    { params }
  );
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}

/** Customer order — uses client JWT */
export async function apiCreateOrder(
  body: ApiCreateOrderBody
): Promise<ApiOrder> {
  const { data } = await userClient.post<ApiOrder>("/orders", body);
  return data;
}

/** Public — GET /exchange-rate */
export async function apiGetExchangeRate(): Promise<ApiExchangeRate> {
  const { data } = await publicClient.get<ApiExchangeRate>("/exchange-rate");
  return data;
}

/** Admin JWT — PUT /exchange-rate (recalculates all product prices on backend) */
export async function apiUpdateExchangeRate(
  body: ApiUpdateExchangeRateBody
): Promise<ApiUpdateExchangeRateResponse> {
  const { data } = await adminClient.put<ApiUpdateExchangeRateResponse>(
    "/exchange-rate",
    body
  );
  return data;
}

export function isApiConfigured(): boolean {
  return Boolean(getApiBaseUrl());
}
