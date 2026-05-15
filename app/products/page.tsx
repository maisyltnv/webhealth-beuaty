"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { useStore } from "@/lib/store";

const sortOptions = [
  { id: "newest", nameLao: "ໃໝ່ສຸດ" },
  { id: "price-low", nameLao: "ລາຄາຕ່ຳ - ສູງ" },
  { id: "price-high", nameLao: "ລາຄາສູງ - ຕ່ຳ" },
  { id: "bestseller", nameLao: "ຂາຍດີ" },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { products, productsLoading, productsError, categories } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categoryFilters = useMemo(
    () => [
      { id: "all", nameLao: "ທັງໝົດ" },
      ...categories.map((c) => ({
        id: c.slug?.trim() || `category-${c.id}`,
        nameLao: c.name,
      })),
    ],
    [categories]
  );

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.nameLao.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.priceLAK - b.priceLAK);
        break;
      case "price-high":
        result.sort((a, b) => b.priceLAK - a.priceLAK);
        break;
      case "bestseller":
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-primary-foreground text-center"
          >
            ສິນຄ້າທັງໝົດ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-primary-foreground/80 text-center mt-2"
          >
            ຄົ້ນຫາຜະລິດຕະພັນສຸຂະພາບ ແລະ ຄວາມງາມຄຸນນະພາບສູງ
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {productsError && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
            {productsError}
          </div>
        )}

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ຄົ້ນຫາສິນຄ້າ..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Categories */}
            <div className="flex items-center gap-2">
              {categoryFilters.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.nameLao}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg bg-muted border-0 text-sm"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.nameLao}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${
                  viewMode === "grid" ? "bg-background shadow-sm" : ""
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${
                  viewMode === "list" ? "bg-background shadow-sm" : ""
                }`}
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            ຕົວກອງ
          </Button>
        </div>

        {/* Results Count */}
        <p className="text-muted-foreground mb-6">
          {productsLoading ? "ກຳລັງໂຫຼດ..." : `ພົບ ${filteredProducts.length} ສິນຄ້າ`}
        </p>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="text-center py-16 text-muted-foreground">ກຳລັງໂຫຼດສິນຄ້າຈາກ API...</div>
        ) : filteredProducts.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              ບໍ່ພົບສິນຄ້າທີ່ຄົ້ນຫາ
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              ລ້າງການຄົ້ນຫາ
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={() => setIsFilterOpen(false)}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 p-6 max-h-[80vh] overflow-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">ຕົວກອງ</h3>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h4 className="font-medium mb-3">ໝວດໝູ່</h4>
                <div className="flex flex-wrap gap-2">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {cat.nameLao}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="font-medium mb-3">ຈັດລຽງ</h4>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSortBy(opt.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        sortBy === opt.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {opt.nameLao}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => setIsFilterOpen(false)}
              >
                ສະແດງຜົນ ({filteredProducts.length} ສິນຄ້າ)
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
