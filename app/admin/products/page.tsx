"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Package,
  X,
  Upload,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore, Product } from "@/lib/store";
import { formatLAK, calculateSellingPrice } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import {
  apiCreateProduct,
  apiDeleteProduct,
  isApiConfigured,
} from "@/lib/api";
import {
  marginPercentToRatio,
  slugToCategoryLao,
} from "@/lib/map-api-product";

const categories = [
  { id: "supplements", nameLao: "ອາຫານເສີມ" },
  { id: "skincare", nameLao: "ດູແລຜິວໜັງ" },
  { id: "vitamins", nameLao: "ວິຕາມິນ" },
  { id: "beauty", nameLao: "ຄວາມງາມ" },
];

export default function AdminProductsPage() {
  const { products, setProducts, exchangeRate, refreshProducts } = useStore();
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    nameLao: "",
    description: "",
    descriptionLao: "",
    howToUse: "",
    howToUseLao: "",
    priceCNY: "",
    marginPercent: "50",
    category: "supplements",
    stock: "50",
    sourceUrl: "",
    imageUrl: "",
  });

  const filteredProducts = products.filter(
    (p) =>
      p.nameLao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = async () => {
    setApiError(null);
    const priceCNY = parseFloat(newProduct.priceCNY);
    const marginPercent = parseFloat(newProduct.marginPercent);
    const stock = parseInt(newProduct.stock);

    if (isNaN(priceCNY) || isNaN(marginPercent) || isNaN(stock)) return;

    const category = categories.find((c) => c.id === newProduct.category);
    const categoryLao = category?.nameLao ?? slugToCategoryLao(newProduct.category);

    const finishLocal = () => {
      const cat = categories.find((c) => c.id === newProduct.category);
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        nameLao: newProduct.nameLao,
        description: newProduct.description,
        descriptionLao: newProduct.descriptionLao,
        howToUse: newProduct.howToUse,
        howToUseLao: newProduct.howToUseLao,
        priceCNY,
        priceLAK: calculateSellingPrice(priceCNY, marginPercent, exchangeRate),
        marginPercent,
        images: [
          newProduct.imageUrl ||
            "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
        ],
        category: cat?.id || "supplements",
        categoryLao: cat?.nameLao || "ອາຫານເສີມ",
        stock,
        sourceUrl: newProduct.sourceUrl,
        trustBadges: ["ຂອງແທ້ 100%", "ນຳເຂົ້າໂດຍກົງ"],
        isNew: true,
        isBestSeller: false,
      };
      setProducts([product, ...products]);
      setIsModalOpen(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      setNewProduct({
        name: "",
        nameLao: "",
        description: "",
        descriptionLao: "",
        howToUse: "",
        howToUseLao: "",
        priceCNY: "",
        marginPercent: "50",
        category: "supplements",
        stock: "50",
        sourceUrl: "",
        imageUrl: "",
      });
    };

    if (!isApiConfigured() || !token) {
      finishLocal();
      if (isApiConfigured() && !token) {
        setApiError(
          "ບໍ່ມີ JWT — ບັນທຶກແບບທ້ອງຖິ່ນເທົ່ານັ້ນ. ໄປ /admin/login ເພື່ອ sync ກັບ API"
        );
      }
      return;
    }

    setPendingAction(true);
    try {
      await apiCreateProduct({
        name: newProduct.nameLao || newProduct.name || "ສິນຄ້າ",
        description: newProduct.descriptionLao || newProduct.description || "",
        image_url:
          newProduct.imageUrl.trim() ||
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
        category: categoryLao,
        original_price_cny: priceCNY,
        exchange_rate: exchangeRate,
        profit_margin: marginPercentToRatio(marginPercent),
        final_price_lak: Math.round(
          calculateSellingPrice(priceCNY, marginPercent, exchangeRate)
        ),
        source_url: newProduct.sourceUrl || "https://example.com",
      });
      await refreshProducts();
      setIsModalOpen(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      setNewProduct({
        name: "",
        nameLao: "",
        description: "",
        descriptionLao: "",
        howToUse: "",
        howToUseLao: "",
        priceCNY: "",
        marginPercent: "50",
        category: "supplements",
        stock: "50",
        sourceUrl: "",
        imageUrl: "",
      });
    } catch {
      setApiError("ເພີ່ມສິນຄ້າຜ່ານ API ບໍ່ສຳເລັດ — ກວດຂໍ້ມູນ ແລະ backend");
    } finally {
      setPendingAction(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("ລຶບສິນຄ້ານີ້ບໍ?")) return;
    setApiError(null);
    if (token && isApiConfigured()) {
      setPendingAction(true);
      try {
        await apiDeleteProduct(id);
        await refreshProducts();
      } catch {
        setApiError("ລຶບຜ່ານ API ບໍ່ສຳເລັດ");
      } finally {
        setPendingAction(false);
      }
      return;
    }
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div>
      {apiError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {apiError}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ຈັດການສິນຄ້າ</h1>
          <p className="text-muted-foreground">
            ເພີ່ມ ແລະ ຈັດການສິນຄ້າສຳລັບ Dropship
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          ເພີ່ມສິນຄ້າໃໝ່
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ຄົ້ນຫາສິນຄ້າ..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-sm">ສິນຄ້າ</th>
                <th className="text-left p-4 font-medium text-sm">ລາຄາຕົ້ນ (CNY)</th>
                <th className="text-left p-4 font-medium text-sm">ລາຄາຂາຍ (LAK)</th>
                <th className="text-left p-4 font-medium text-sm">ກຳໄລ %</th>
                <th className="text-left p-4 font-medium text-sm">ສະຕ໋ອກ</th>
                <th className="text-left p-4 font-medium text-sm">ແຫຼ່ງສິນຄ້າ</th>
                <th className="text-right p-4 font-medium text-sm">ຈັດການ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-muted/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.nameLao}
                        className="w-12 h-12 rounded-lg object-cover"
                        crossOrigin="anonymous"
                      />
                      <div>
                        <p className="font-medium">{product.nameLao}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.categoryLao}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">¥{product.priceCNY}</td>
                  <td className="p-4 text-sm font-medium text-primary">
                    {formatLAK(product.priceLAK)}
                  </td>
                  <td className="p-4 text-sm">{product.marginPercent}%</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.stock < 10
                          ? "bg-red-100 text-red-600"
                          : product.stock < 20
                          ? "bg-orange-100 text-orange-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {product.stock} ຊິ້ນ
                    </span>
                  </td>
                  <td className="p-4">
                    {product.sourceUrl && (
                      <a
                        href={product.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        ໄປຫາແຫຼ່ງ
                      </a>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">ບໍ່ພົບສິນຄ້າ</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={() => setIsModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-auto bg-background border border-border rounded-xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">ເພີ່ມສິນຄ້າໃໝ່</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  ຊື່ສິນຄ້າ (ລາວ)
                </label>
                <Input
                  value={newProduct.nameLao}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, nameLao: e.target.value })
                  }
                  placeholder="ເຊັ່ນ: ຄໍລາເຈນເປັບໄທດ໌"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  ຊື່ສິນຄ້າ (ອັງກິດ)
                </label>
                <Input
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder="e.g., Collagen Peptide"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  ລາຍລະອຽດ (ລາວ)
                </label>
                <textarea
                  value={newProduct.descriptionLao}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, descriptionLao: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background min-h-[80px]"
                  placeholder="ລາຍລະອຽດສິນຄ້າ..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  ວິທີໃຊ້ (ລາວ)
                </label>
                <textarea
                  value={newProduct.howToUseLao}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, howToUseLao: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background min-h-[60px]"
                  placeholder="ວິທີໃຊ້ສິນຄ້າ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  ລາຄາຕົ້ນທຶນ (CNY)
                </label>
                <Input
                  type="number"
                  value={newProduct.priceCNY}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, priceCNY: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  ເປີເຊັນກຳໄລ (%)
                </label>
                <Input
                  type="number"
                  value={newProduct.marginPercent}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, marginPercent: e.target.value })
                  }
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ໝວດໝູ່</label>
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameLao}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ຈຳນວນສະຕ໋ອກ</label>
                <Input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                  placeholder="50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  ລິ້ງແຫຼ່ງສິນຄ້າ (1688/Taobao)
                </label>
                <Input
                  type="url"
                  value={newProduct.sourceUrl}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, sourceUrl: e.target.value })
                  }
                  placeholder="https://1688.com/product/..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">ລິ້ງຮູບພາບ</label>
                <Input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              {/* Preview */}
              {newProduct.priceCNY && (
                <div className="md:col-span-2 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">ຄາດຄະເນລາຄາຂາຍ:</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatLAK(
                      calculateSellingPrice(
                        parseFloat(newProduct.priceCNY) || 0,
                        parseFloat(newProduct.marginPercent) || 50,
                        exchangeRate
                      )
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (ລາຄາຕົ້ນ ¥{newProduct.priceCNY} × ອັດຕາແລກ{" "}
                    {formatLAK(exchangeRate)} × ກຳໄລ {newProduct.marginPercent}%)
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                ຍົກເລີກ
              </Button>
              <Button onClick={handleAddProduct} className="flex-1" disabled={pendingAction}>
                <Upload className="h-4 w-4 mr-2" />
                {pendingAction ? "ກຳລັງບັນທຶກ..." : "ເພີ່ມສິນຄ້າ"}
              </Button>
            </div>
          </motion.div>
        </>
      )}

      {/* Success Toast */}
      {isSaved && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
        >
          <Check className="h-5 w-5" />
          ເພີ່ມສິນຄ້າສຳເລັດ!
        </motion.div>
      )}
    </div>
  );
}
