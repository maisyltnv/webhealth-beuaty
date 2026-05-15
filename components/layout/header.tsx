"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  User,
  Heart,
  Sparkles,
  Pill,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { formatLAK } from "@/lib/format";

const categories = [
  {
    name: "ອາຫານເສີມ",
    nameEn: "Supplements",
    icon: Pill,
    subcategories: [
      "ຄໍລາເຈນ",
      "ວິຕາມິນ",
      "ກູຕາໄທໂອນ",
      "ນ້ຳມັນປາ",
      "ໂປຣໄບໂອຕິກ",
    ],
  },
  {
    name: "ດູແລຜິວໜັງ",
    nameEn: "Skincare",
    icon: Droplets,
    subcategories: [
      "ເຊລັ່ມ",
      "ຄຣີມບຳລຸງ",
      "ແຜ່ນມາສ",
      "ໂທນເນີ",
      "ຄຣີມກັນແດດ",
    ],
  },
  {
    name: "ຄວາມງາມ",
    nameEn: "Beauty",
    icon: Sparkles,
    subcategories: [
      "ເຄື່ອງສຳອາງ",
      "ດູແລຜົມ",
      "ນ້ຳຫອມ",
      "ເຄື່ອງປະທິນໂສມ",
    ],
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { cart, cartTotal, cartCount, removeFromCart, updateQuantity } = useStore();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-sm">
        <p>ຈັດສົ່ງຟຣີສຳລັບຄຳສັ່ງຊື້ເກີນ 500.000 ₭ | ຂອງແທ້ 100% ນຳເຂົ້າໂດຍກົງ</p>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary hidden sm:block">
                ສຸຂະພາບ & ຄວາມງາມ
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(category.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-foreground hover:text-primary transition-colors">
                    <category.icon className="h-4 w-4" />
                    {category.name}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <AnimatePresence>
                    {activeCategory === category.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-56 bg-card border border-border rounded-lg shadow-lg p-4"
                      >
                        <ul className="space-y-2">
                          {category.subcategories.map((sub) => (
                            <li key={sub}>
                              <Link
                                href={`/category/${category.nameEn.toLowerCase()}`}
                                className="block py-1.5 px-3 rounded-md hover:bg-accent text-foreground hover:text-primary transition-colors"
                              >
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <Link
                href="/products"
                className="px-4 py-2 text-foreground hover:text-primary transition-colors"
              >
                ສິນຄ້າທັງໝົດ
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="ຄົ້ນຫາສິນຄ້າ..."
                  className="pl-10 bg-muted border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/login"
                className="p-2 hover:text-primary transition-colors hidden sm:flex sm:items-center sm:gap-1.5 rounded-md"
                title="ເຂົ້າລະບົບລູກຄ້າ"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium max-w-[7rem] truncate hidden lg:inline">
                  ລູກຄ້າ
                </span>
              </Link>
              <Link
                href="/admin/login"
                className="p-2 hover:text-amber-600 transition-colors hidden sm:flex sm:items-center sm:gap-1.5 rounded-md text-muted-foreground"
                title="ເຂົ້າແອັດມິນ"
              >
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Admin
                </span>
              </Link>
              <Link href="/wishlist" className="p-2 hover:text-primary transition-colors hidden sm:block">
                <Heart className="h-5 w-5" />
              </Link>
              <button
                className="relative p-2 hover:text-primary transition-colors"
                onClick={() => setIsCartOpen(true)}
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-background z-50 shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-lg font-bold text-primary">ເມນູ</span>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="ຄົ້ນຫາສິນຄ້າ..."
                    className="pl-10"
                  />
                </div>

                <nav className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.name} className="border-b border-border pb-2">
                      <button className="flex items-center justify-between w-full py-2 font-medium">
                        <span className="flex items-center gap-2">
                          <category.icon className="h-4 w-4 text-primary" />
                          {category.name}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <ul className="ml-6 space-y-1 mt-1">
                        {category.subcategories.map((sub) => (
                          <li key={sub}>
                            <Link
                              href={`/category/${category.nameEn.toLowerCase()}`}
                              className="block py-1 text-muted-foreground hover:text-primary"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {sub}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Link
                    href="/products"
                    className="block py-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ສິນຄ້າທັງໝົດ
                  </Link>
                  <Link
                    href="/login"
                    className="block py-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ເຂົ້າລະບົບລູກຄ້າ
                  </Link>
                  <Link
                    href="/admin/login"
                    className="block py-2 font-medium text-amber-700 dark:text-amber-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ເຂົ້າແອັດມິນ
                  </Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-50 shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-lg font-bold">ກະຕ່າສິນຄ້າ ({cartCount})</span>
                <button onClick={() => setIsCartOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">ກະຕ່າຂອງທ່ານຫວ່າງເປົ່າ</p>
                    <Button
                      className="mt-4"
                      onClick={() => setIsCartOpen(false)}
                    >
                      ເລີ່ມຊື້ເຄື່ອງ
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li
                        key={item.product.id}
                        className="flex gap-4 p-3 bg-muted rounded-lg"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.nameLao}
                          className="w-20 h-20 object-cover rounded-md"
                          crossOrigin="anonymous"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {item.product.nameLao}
                          </h4>
                          <p className="text-primary font-bold text-sm mt-1">
                            {formatLAK(item.product.priceLAK)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                            >
                              -
                            </button>
                            <span className="text-sm w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                            <button
                              className="ml-auto text-destructive text-sm"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              ລົບ
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">ລວມທັງໝົດ:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatLAK(cartTotal)}
                    </span>
                  </div>
                  <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      ດຳເນີນການຊຳລະເງິນ
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
