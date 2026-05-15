/** Types aligned with the backend OpenAPI-style contract */

export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: string;
  original_price_cny: number;
  exchange_rate: number;
  profit_margin: number;
  final_price_lak: number;
  source_url: string;
  created_at: string;
  updated_at: string;
}

export interface ApiProductListResponse {
  items: ApiProduct[];
}

export interface ApiLoginResponse {
  access_token: string;
}

export interface ApiUser {
  username?: string;
  role?: string;
  id?: number;
  [key: string]: unknown;
}

export interface ApiCreateProductBody {
  name: string;
  description: string;
  image_url: string;
  category: string;
  original_price_cny: number;
  exchange_rate: number;
  profit_margin: number;
  /** Backend expects this on POST /products (same formula as admin preview). */
  final_price_lak: number;
  source_url: string;
}

export type ApiUpdateProductBody = Partial<ApiCreateProductBody>;

export interface ApiCreateOrderBody {
  total_amount_lak: number;
  payment_receipt_url: string;
}

export interface ApiOrder {
  id: number | string;
  total_amount_lak?: number;
  payment_receipt_url?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ApiOrderListResponse {
  items?: ApiOrder[];
}
