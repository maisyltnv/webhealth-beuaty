"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [orderNumber] = useState(`ORD-${Date.now().toString().slice(-8)}`);

  useEffect(() => {
    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#064E3B", "#F59E0B", "#10B981"],
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="h-12 w-12 text-primary" />
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          ສັ່ງຊື້ສຳເລັດ!
        </h1>
        <p className="text-muted-foreground mb-6">
          ຂອບໃຈທີ່ຊື້ສິນຄ້າກັບພວກເຮົາ
        </p>

        {/* Order Number */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-1">ເລກທີ່ຄຳສັ່ງຊື້</p>
          <p className="text-xl font-bold text-primary">{orderNumber}</p>
        </div>

        {/* What's Next */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6 text-left">
          <h3 className="font-semibold mb-4">ຂັ້ນຕອນຕໍ່ໄປ</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-medium">ຢືນຢັນຄຳສັ່ງຊື້</p>
                <p className="text-sm text-muted-foreground">
                  ພວກເຮົາຈະຕິດຕໍ່ຫາທ່ານພາຍໃນ 24 ຊົ່ວໂມງ
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <p className="font-medium">ກະກຽມສິນຄ້າ</p>
                <p className="text-sm text-muted-foreground">
                  ສິນຄ້າຈະຖືກກະກຽມພາຍໃນ 1-2 ວັນ
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <p className="font-medium">ຈັດສົ່ງສິນຄ້າ</p>
                <p className="text-sm text-muted-foreground">
                  ສິນຄ້າຈະຖືກສົ່ງເຖິງທ່ານພາຍໃນ 3-5 ວັນ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
          <Phone className="h-4 w-4" />
          <span className="text-sm">ມີຄຳຖາມ? ໂທຫາ 020 5555 1234</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button onClick={() => router.push("/products")} className="w-full">
            ສືບຕໍ່ຊື້ເຄື່ອງ
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full"
          >
            ກັບຄືນໜ້າຫຼັກ
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
