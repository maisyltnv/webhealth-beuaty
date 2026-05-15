/** Types aligned with the backend OpenAPI-style contract */

/** Nested on GET/POST /products response when backend expands category */
export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  parent_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  category_id: number;
  /** Populated when API embeds category on product responses */
  category?: ApiCategory;
  original_price_cny: number;
  exchange_rate: number;
  profit_margin: number;
  final_price_lak: number;
  source_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiProductListResponse {
  items: ApiProduct[];
}

export interface ApiLoginResponse {
  access_token: string;
}

/** Response from POST /auth/admin/login */
export interface ApiAdminLoginResponse {
  access_token: string;
  expires_at?: string;
  user?: ApiUser;
}

export interface ApiUser {
  username?: string;
  role?: string;
  id?: number;
  [key: string]: unknown;
}

/** POST /products — backend ຄິດໄລ່ final_price_lak ຈາກລາຄາ × ອັດຕາ × (1 + profit_margin) */
export interface ApiCreateProductBody {
  name: string;
  category_id: number;
  original_price_cny: number;
  exchange_rate: number;
  profit_margin: number;
  description?: string;
  image_url?: string;
  source_url?: string;
}

/** PUT /products/:id — partial update (ສົ່ງແຕ່ຟິວທີ່ຕ້ອງປ່ຽນ; ບໍ່ສົ່ງ clear_category ກັບ category_id ພ້ອມກັນ) */
export interface ApiUpdateProductBody {
  name?: string;
  description?: string;
  image_url?: string;
  category_id?: number;
  clear_category?: boolean;
  original_price_cny?: number;
  exchange_rate?: number;
  profit_margin?: number;
  final_price_lak?: number;
  source_url?: string;
}

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

export interface ApiCategoryListResponse {
  items: ApiCategory[];
}

export interface ApiCreateCategoryBody {
  name: string;
  slug: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
  parent_id?: number | null;
}

export type ApiUpdateCategoryBody = Partial<ApiCreateCategoryBody>;

export interface ApiExchangeRateExample {
  cny: number;
  lak: number;
}

/** GET /exchange-rate */
export interface ApiExchangeRate {
  rate_lak_per_cny: number;
  products_count?: number;
  updated_at?: string;
  examples?: ApiExchangeRateExample[];
}

/** PUT /exchange-rate */
export interface ApiUpdateExchangeRateBody {
  rate_lak_per_cny: number;
}

/** PUT /exchange-rate response */
export interface ApiUpdateExchangeRateResponse {
  rate_lak_per_cny: number;
  products_updated: number;
  updated_at: string;
}
