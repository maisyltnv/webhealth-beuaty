"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PRODUCT_PLACEHOLDER_IMAGE,
  isKommodoShareUrl,
  normalizeProductImageUrl,
} from "@/lib/product-image";

type ProductImageProps = {
  src: string | undefined | null;
  alt: string;
  className?: string;
};

/** Renders product image; resolves Kommodo share links to CDN image URL */
export function ProductImage({ src, alt, className }: ProductImageProps) {
  const normalized = normalizeProductImageUrl(src);
  const [currentSrc, setCurrentSrc] = useState(normalized);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const next = normalizeProductImageUrl(src);
    setCurrentSrc(next);
    setResolved(false);

    const raw = src?.trim() ?? "";
    if (!raw || !isKommodoShareUrl(raw)) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/resolve-product-image?url=${encodeURIComponent(raw)}`
        );
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { directUrl?: string };
        if (cancelled || !data.directUrl) return;
        if (data.directUrl !== raw) {
          setCurrentSrc(data.directUrl);
        }
      } catch {
        /* keep normalized src */
      } finally {
        if (!cancelled) setResolved(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={cn(className)}
      data-kommodo-resolved={isKommodoShareUrl(src ?? "") ? resolved : undefined}
      onError={() => {
        if (currentSrc !== PRODUCT_PLACEHOLDER_IMAGE) {
          setCurrentSrc(PRODUCT_PLACEHOLDER_IMAGE);
        }
      }}
    />
  );
}
