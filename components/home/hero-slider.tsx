"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const slides = [
  {
    id: 1,
    titleLao: "ສິນຄ້າໃໝ່ຈາກຈີນ",
    subtitleLao: "ຄໍລາເຈນ & ວິຕາມິນຄຸນນະພາບສູງ",
    descriptionLao: "ນຳເຂົ້າໂດຍກົງຈາກໂຮງງານ ຮັບປະກັນຂອງແທ້ 100%",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&h=600&fit=crop",
    ctaLao: "ຊື້ດຽວນີ້",
    href: "/products",
  },
  {
    id: 2,
    titleLao: "ດູແລຜິວໜັງ",
    subtitleLao: "ເຊລັ່ມ & ຄຣີມບຳລຸງຜິວ",
    descriptionLao: "ສູດພິເສດຈາກເກົາຫຼີ ແລະ ຍີ່ປຸ່ນ",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=1200&h=600&fit=crop",
    ctaLao: "ເບິ່ງສິນຄ້າ",
    href: "/category/skincare",
  },
  {
    id: 3,
    titleLao: "ໂປຣໂມຊັນພິເສດ",
    subtitleLao: "ຫຼຸດລາຄາ 30% ສຳລັບສິນຄ້າທີ່ເລືອກ",
    descriptionLao: "ມີໃຫ້ສະເພາະອາທິດນີ້ເທົ່ານັ້ນ",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=600&fit=crop",
    ctaLao: "ຮັບສ່ວນຫຼຸດ",
    href: "/products",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-muted">
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={slide.image}
                    alt={slide.titleLao}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full container mx-auto px-4 flex items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="max-w-xl text-primary-foreground"
                  >
                    <span className="inline-block px-4 py-1.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-full mb-4">
                      {slide.subtitleLao}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-balance">
                      {slide.titleLao}
                    </h1>
                    <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
                      {slide.descriptionLao}
                    </p>
                    <Link href={slide.href}>
                      <Button
                        size="lg"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 group"
                      >
                        {slide.ctaLao}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/20 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-foreground hover:bg-background/40 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/20 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-foreground hover:bg-background/40 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-secondary"
                : "w-2 bg-primary-foreground/50 hover:bg-primary-foreground/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
