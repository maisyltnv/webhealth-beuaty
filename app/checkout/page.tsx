"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Truck,
  CreditCard,
  CheckCircle,
  MapPin,
  User,
  Phone,
  QrCode,
  Banknote,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatLAK } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import { apiCreateOrder } from "@/lib/api";

const steps = [
  { id: 1, nameLao: "ທີ່ຢູ່ຈັດສົ່ງ", icon: Truck },
  { id: 2, nameLao: "ການຊຳລະເງິນ", icon: CreditCard },
  { id: 3, nameLao: "ຢືນຢັນຄຳສັ່ງ", icon: CheckCircle },
];

const provinces = [
  "ນະຄອນຫຼວງວຽງຈັນ",
  "ຫຼວງພະບາງ",
  "ສະຫວັນນະເຂດ",
  "ຈຳປາສັກ",
  "ຄຳມ່ວນ",
  "ອຸດົມໄຊ",
  "ຫຼວງນ້ຳທາ",
  "ໄຊຍະບູລີ",
  "ບໍລິຄຳໄຊ",
  "ຊຽງຂວາງ",
  "ວຽງຈັນ",
  "ຜົ້ງສາລີ",
  "ບໍ່ແກ້ວ",
  "ຫົວພັນ",
  "ອັດຕະປື",
  "ເຊກອງ",
  "ໄຊສົມບູນ",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, addOrder } = useStore();
  const { token } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    province: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("bcel");

  const shippingFee = cartTotal >= 500000 ? 0 : 30000;
  const totalAmount = cartTotal + shippingFee;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentSubmit = () => {
    setCurrentStep(3);
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    setOrderError(null);

    let serverId: string | undefined;
    if (token) {
      try {
        const receipt =
          paymentMethod === "bcel"
            ? "pending-receipt-upload"
            : "";
        const created = await apiCreateOrder({
          total_amount_lak: Math.round(totalAmount),
          payment_receipt_url: receipt,
        });
        serverId = created?.id != null ? String(created.id) : undefined;
      } catch {
        setOrderError(
          "ບັນທຶກຄຳສັ່ງຜ່ານ API ບໍ່ສຳເລັດ (ກວດ JWT ແລະ backend). ຍັງບັນທຶກໃນແອັບຕໍ່ໄປ."
        );
      }
    }

    addOrder({
      items: cart,
      customerInfo: shippingInfo,
      paymentMethod,
      status: "pending",
      totalLAK: totalAmount,
      ...(serverId ? { id: serverId } : {}),
    });

    clearCart();
    router.push("/checkout/success");
    setIsSubmitting(false);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">ກະຕ່າຂອງທ່ານຫວ່າງເປົ່າ</p>
          <Button onClick={() => router.push("/products")}>
            ເລີ່ມຊື້ເຄື່ອງ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Steps */}
      <div className="bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 ${
                    currentStep >= step.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="hidden sm:block font-medium">
                    {step.nameLao}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-5 w-5 mx-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">ທີ່ຢູ່ຈັດສົ່ງ</h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <User className="h-4 w-4" />
                        ຊື່ຜູ້ຮັບ
                      </label>
                      <Input
                        required
                        value={shippingInfo.name}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, name: e.target.value })
                        }
                        placeholder="ປ້ອນຊື່ຂອງທ່ານ"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Phone className="h-4 w-4" />
                        ເບີໂທລະສັບ
                      </label>
                      <Input
                        required
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, phone: e.target.value })
                        }
                        placeholder="020 XXXX XXXX"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <MapPin className="h-4 w-4" />
                        ແຂວງ
                      </label>
                      <select
                        required
                        value={shippingInfo.province}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, province: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                      >
                        <option value="">ເລືອກແຂວງ</option>
                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <MapPin className="h-4 w-4" />
                        ທີ່ຢູ່ລະອຽດ
                      </label>
                      <textarea
                        required
                        value={shippingInfo.address}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, address: e.target.value })
                        }
                        placeholder="ບ້ານ, ເມືອງ, ຈຸດສັງເກດ"
                        className="w-full px-4 py-2 rounded-lg border border-input bg-background min-h-[100px]"
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      ດຳເນີນການຕໍ່
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">ເລືອກວິທີຊຳລະເງິນ</h2>
                  <div className="space-y-4">
                    {/* BCEL One */}
                    <button
                      onClick={() => setPaymentMethod("bcel")}
                      className={`w-full p-4 rounded-xl border-2 transition-colors flex items-center gap-4 ${
                        paymentMethod === "bcel"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                        <QrCode className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">BCEL One QR</p>
                        <p className="text-sm text-muted-foreground">
                          ສະແກນ QR Code ຈ່າຍຜ່ານ BCEL One
                        </p>
                      </div>
                      {paymentMethod === "bcel" && (
                        <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                      )}
                    </button>

                    {/* COD */}
                    <button
                      onClick={() => setPaymentMethod("cod")}
                      className={`w-full p-4 rounded-xl border-2 transition-colors flex items-center gap-4 ${
                        paymentMethod === "cod"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                        <Banknote className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">ເກັບເງິນປາຍທາງ (COD)</p>
                        <p className="text-sm text-muted-foreground">
                          ຈ່າຍເງິນເມື່ອໄດ້ຮັບສິນຄ້າ
                        </p>
                      </div>
                      {paymentMethod === "cod" && (
                        <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                      )}
                    </button>

                    {/* BCEL QR Preview */}
                    {paymentMethod === "bcel" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-6 bg-muted rounded-xl text-center"
                      >
                        <p className="text-sm text-muted-foreground mb-4">
                          ສະແກນ QR Code ເພື່ອຊຳລະເງິນ
                        </p>
                        <div className="w-48 h-48 bg-background border border-border rounded-xl mx-auto flex items-center justify-center">
                          <div className="text-center">
                            <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">
                              QR Code ຈະປະກົດຫຼັງຢືນຢັນຄຳສັ່ງ
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-primary mt-4">
                          {formatLAK(totalAmount)}
                        </p>
                      </motion.div>
                    )}

                    <div className="flex items-center gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1"
                      >
                        ກັບຄືນ
                      </Button>
                      <Button
                        onClick={handlePaymentSubmit}
                        className="flex-1"
                        size="lg"
                      >
                        ດຳເນີນການຕໍ່
                        <ChevronRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">ຢືນຢັນຄຳສັ່ງຊື້</h2>

                  {!token && (
                    <p className="text-sm text-muted-foreground mb-4 rounded-lg border border-border bg-muted/40 px-3 py-2">
                      ບໍ່ໄດ້ເຂົ້າລະບົບແອັດມິນ — ຄຳສັ່ງບັນທຶກໃນແອັບເທົ່ານັ້ນ. ຖ້າຕ້ອງການ POST /orders ກະລຸນາເຂົ້າລະບົບກ່ອນ (ໃຊ້ JWT ດຽວກັນກັບ API).
                    </p>
                  )}

                  {orderError && (
                    <p className="text-sm text-destructive mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
                      {orderError}
                    </p>
                  )}

                  {/* Shipping Info Summary */}
                  <div className="bg-muted/50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">ທີ່ຢູ່ຈັດສົ່ງ</h3>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-sm text-primary"
                      >
                        ແກ້ໄຂ
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {shippingInfo.name} | {shippingInfo.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {shippingInfo.address}, {shippingInfo.province}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-muted/50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">ວິທີຊຳລະເງິນ</h3>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-sm text-primary"
                      >
                        ແກ້ໄຂ
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {paymentMethod === "bcel"
                        ? "BCEL One QR Code"
                        : "ເກັບເງິນປາຍທາງ (COD)"}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-4">ສິນຄ້າທີ່ສັ່ງ</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.nameLao}
                            className="w-16 h-16 object-cover rounded-md"
                            crossOrigin="anonymous"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {item.product.nameLao}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              x{item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            {formatLAK(item.product.priceLAK * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      ກັບຄືນ
                    </Button>
                    <Button
                      onClick={handleConfirmOrder}
                      className="flex-1 bg-primary"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "ກຳລັງດຳເນີນການ..." : "ຢືນຢັນຄຳສັ່ງຊື້"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold mb-4">ສະຫຼຸບຄຳສັ່ງຊື້</h3>

              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.nameLao}
                        className="w-12 h-12 object-cover rounded-md"
                        crossOrigin="anonymous"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.nameLao}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatLAK(item.product.priceLAK * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ລວມສິນຄ້າ</span>
                  <span>{formatLAK(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ຄ່າຈັດສົ່ງ</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-primary">ຟຣີ</span>
                    ) : (
                      formatLAK(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>ລວມທັງໝົດ</span>
                  <span className="text-primary">{formatLAK(totalAmount)}</span>
                </div>
              </div>

              {cartTotal < 500000 && (
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  ຊື້ເພີ່ມອີກ {formatLAK(500000 - cartTotal)} ເພື່ອຮັບການຈັດສົ່ງຟຣີ
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
