/** Default when image is missing */
export const PRODUCT_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop";

const KOMODO_SHARE_RE = /kommodo\.ai\/i\/([^/?#]+)/i;

export function isKommodoShareUrl(url: string): boolean {
  return KOMODO_SHARE_RE.test(url.trim());
}

export function extractKommodoShareId(url: string): string | null {
  const m = url.trim().match(KOMODO_SHARE_RE);
  return m?.[1] ?? null;
}

/** Other viewer pages that are not direct image files */
export function isImageViewerPageUrl(url: string): boolean {
  const u = url.trim().toLowerCase();
  if (!u) return false;
  if (isKommodoShareUrl(u)) return false;
  if (/imgur\.com\/(a|gallery)\//.test(u)) return true;
  if (/drive\.google\.com\/file\//.test(u)) return true;
  if (/dropbox\.com\/(s|sh)\//.test(u) && !u.includes("raw=1")) return true;
  return false;
}

export function normalizeProductImageUrl(
  url: string | undefined | null
): string {
  const trimmed = url?.trim() ?? "";
  if (!trimmed) return PRODUCT_PLACEHOLDER_IMAGE;
  if (isImageViewerPageUrl(trimmed)) return PRODUCT_PLACEHOLDER_IMAGE;
  return trimmed;
}

export const IMAGE_URL_FIELD_HINT =
  "ລິ້ງ Kommodo (/i/...) ໃຊ້ໄດ້ — ແອັບຈະດຶງ URL ຮູບຈາກ CDN ອັດຕະໂນມັດ. ຫຼືວາງລິ້ງ .jpg/.png ໂດຍກົງ";

export const IMAGE_VIEWER_PAGE_WARNING =
  "ລິ້ງນີ້ເປັນໜ້າເວັບແບ່ງຮູບ ບໍ່ແມ່ນ URL ຮູບໂດຍກົງ — ກະລຸນາໃຊ້ລິ້ງໄຟລ໌ຮູບ ຫຼື Kommodo /i/...";
