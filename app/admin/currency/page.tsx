"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, RefreshCw, Save, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatLAK } from "@/lib/format";

export default function CurrencyManagerPage() {
  const { exchangeRate, setExchangeRate, products, setProducts } = useStore();
  const [newRate, setNewRate] = useState(exchangeRate.toString());
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate <= 0) return;

    setExchangeRate(rate);

    // Update all product prices based on new exchange rate
    const updatedProducts = products.map((product) => ({
      ...product,
      priceLAK: Math.round(
        product.priceCNY * rate * (1 + product.marginPercent / 100)
      ),
    }));
    setProducts(updatedProducts);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const previewPrices = [
    { cny: 10, lak: Math.round(10 * parseFloat(newRate || "0")) },
    { cny: 50, lak: Math.round(50 * parseFloat(newRate || "0")) },
    { cny: 100, lak: Math.round(100 * parseFloat(newRate || "0")) },
    { cny: 500, lak: Math.round(500 * parseFloat(newRate || "0")) },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">ຈັດການອັດຕາແລກປ່ຽນ</h1>
        <p className="text-muted-foreground">
          ປັບປ່ຽນອັດຕາແລກປ່ຽນ CNY ເປັນ LAK ເພື່ອອັບເດດລາຄາສິນຄ້າທັງໝົດ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exchange Rate Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">ອັດຕາແລກປ່ຽນປະຈຸບັນ</h2>
              <p className="text-sm text-muted-foreground">1 CNY (¥) = ? LAK (₭)</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              ອັດຕາແລກປ່ຽນ (LAK ຕໍ່ 1 CNY)
            </label>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₭
                </span>
                <Input
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  className="pl-8 text-lg"
                  placeholder="3500"
                />
              </div>
              <Button
                onClick={handleSave}
                className={isSaved ? "bg-green-600 hover:bg-green-600" : ""}
              >
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    ບັນທຶກແລ້ວ
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    ບັນທຶກ
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">ຕົວຢ່າງການແລກປ່ຽນ:</p>
            <div className="grid grid-cols-2 gap-3">
              {previewPrices.map((price) => (
                <div
                  key={price.cny}
                  className="flex items-center justify-between p-2 bg-background rounded-md"
                >
                  <span className="text-sm">{price.cny} ¥</span>
                  <span className="text-sm font-medium text-primary">
                    = {formatLAK(price.lak)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">ຜົນກະທົບ</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              ເມື່ອທ່ານປ່ຽນອັດຕາແລກປ່ຽນ, ລາຄາຂາຍຂອງສິນຄ້າທັງໝົດຈະຖືກຄິດໄລ່ໃໝ່ອັດຕະໂນມັດ ໂດຍອີງຕາມ:
            </p>
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <p className="font-mono">
                ລາຄາຂາຍ (LAK) = ລາຄາຕົ້ນທຶນ (CNY) × ອັດຕາແລກປ່ຽນ × (1 + ກຳໄລ%)
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold">ສິນຄ້າທີ່ຈະອັບເດດ</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{products.length}</p>
                <p className="text-sm text-muted-foreground">ສິນຄ້າທັງໝົດ</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-secondary">{formatLAK(exchangeRate)}</p>
                <p className="text-sm text-muted-foreground">ອັດຕາປະຈຸບັນ</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
