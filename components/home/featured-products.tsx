"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { useStore } from "@/lib/store";

interface FeaturedProductsProps {
  title: string;
  filter?: "new" | "bestseller" | "all";
}

export function FeaturedProducts({ title, filter = "all" }: FeaturedProductsProps) {
  const { products } = useStore();

  const filteredProducts = products.filter((product) => {
    if (filter === "new") return product.isNew;
    if (filter === "bestseller") return product.isBestSeller;
    return true;
  }).slice(0, 4);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-foreground"
          >
            {title}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/products">
              <Button variant="ghost" className="group text-primary">
                ເບິ່ງທັງໝົດ
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
