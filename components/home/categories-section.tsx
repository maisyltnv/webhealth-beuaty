"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "ອາຫານເສີມ",
    nameEn: "supplements",
    description: "ຄໍລາເຈນ, ວິຕາມິນ, ກູຕາໄທໂອນ",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop",
    productCount: 45,
  },
  {
    name: "ດູແລຜິວໜັງ",
    nameEn: "skincare",
    description: "ເຊລັ່ມ, ຄຣີມບຳລຸງ, ແຜ່ນມາສ",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400&h=300&fit=crop",
    productCount: 62,
  },
  {
    name: "ວິຕາມິນ",
    nameEn: "vitamins",
    description: "ວິຕາມິນລວມ, ນ້ຳມັນປາ, ແຄລຊຽມ",
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=300&fit=crop",
    productCount: 38,
  },
  {
    name: "ຄວາມງາມ",
    nameEn: "beauty",
    description: "ເຄື່ອງສຳອາງ, ດູແລຜົມ, ນ້ຳຫອມ",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop",
    productCount: 29,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            ໝວດໝູ່ສິນຄ້າ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            ເລືອກຊື້ຜະລິດຕະພັນດ້ານສຸຂະພາບ ແລະ ຄວາມງາມທີ່ຫຼາກຫຼາຍ ນຳເຂົ້າໂດຍກົງຈາກຕ່າງປະເທດ
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.nameEn}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/category/${category.nameEn}`}>
                <div className="group relative h-72 rounded-xl overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-primary-foreground">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-primary-foreground/80 mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{category.productCount} ສິນຄ້າ</span>
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
