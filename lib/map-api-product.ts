import type { ApiProduct } from "@/lib/api-types";
import type { Product } from "@/lib/store";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop";

const CATEGORY_SLUGS: { slug: string; lao: string }[] = [
  { slug: "supplements", lao: "ອາຫານເສີມ" },
  { slug: "skincare", lao: "ດູແລຜິວໜັງ" },
  { slug: "vitamins", lao: "ວິຕາມິນ" },
  { slug: "beauty", lao: "ຄວາມງາມ" },
];

export function laoCategoryToSlug(category: string): string {
  const c = category.trim();
  for (const row of CATEGORY_SLUGS) {
    if (c.includes(row.lao) || row.lao.includes(c)) return row.slug;
  }
  return "supplements";
}

export function slugToCategoryLao(slug: string): string {
  return CATEGORY_SLUGS.find((r) => r.slug === slug)?.lao ?? "ອາຫານເສີມ";
}

/** Backend profit_margin is often a ratio (e.g. 0.1 = 10%). */
export function profitMarginToPercent(value: number): number {
  if (value <= 1 && value >= 0) return Math.round(value * 100);
  return Math.round(value);
}

export function marginPercentToRatio(percent: number): number {
  return percent / 100;
}

export function apiProductToStoreProduct(api: ApiProduct): Product {
  const img = api.image_url?.trim() ? api.image_url : PLACEHOLDER_IMG;
  const slug = laoCategoryToSlug(api.category);
  const marginPct = profitMarginToPercent(api.profit_margin);

  return {
    id: String(api.id),
    name: api.name,
    nameLao: api.name,
    description: api.description,
    descriptionLao: api.description,
    howToUse: "",
    howToUseLao: "",
    priceCNY: api.original_price_cny,
    priceLAK: Math.round(api.final_price_lak),
    marginPercent: marginPct,
    images: [img],
    category: slug,
    categoryLao: api.category || slugToCategoryLao(slug),
    stock: 999,
    sourceUrl: api.source_url ?? "",
    trustBadges: ["ຂອງແທ້ 100%"],
    isNew: false,
    isBestSeller: false,
  };
}
