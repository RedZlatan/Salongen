"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ProductSize {
  label: string;
  printfulVariantId: number;
  price: number;
  image?: string;
}

export interface ProductDetail {
  title: string;
  desc: string;
  tag: string;
  images: string[];        // gallery images
  price: number;           // öre — base / fallback
  sizes?: ProductSize[];
  soldOut?: boolean;
  notifyOnly?: boolean;
}

interface Props {
  product: ProductDetail;
  initialSize?: ProductSize;
  onAddToCart: (variantId: number, price: number, label: string) => void;
  onClose: () => void;
}

export default function ProductDetailModal({ product, initialSize, onAddToCart, onClose }: Props) {
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(initialSize ?? product.sizes?.[0]);
  const [activeImg, setActiveImg]       = useState(0);

  // When a size with its own image is selected, show that image
  const mainImage = selectedSize?.image ?? product.images[activeImg] ?? product.images[0];
  const thumbs    = product.sizes?.some((s) => s.image)
    ? product.sizes.filter((s) => s.image).map((s) => s.image!)
    : product.images;

  const displayPrice = Math.round((selectedSize?.price ?? product.price) / 100);

  function handleBuy() {
    const variantId = selectedSize?.printfulVariantId ?? 0;
    const price     = selectedSize?.price ?? product.price;
    const sizeLabel = selectedSize?.label ?? "";
    onAddToCart(variantId, price, sizeLabel);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-3xl overflow-hidden border border-white/10 bg-[#080808] shadow-[0_0_80px_rgba(255,0,0,0.12)]"
      >
        <div className="grid md:grid-cols-2">

          {/* ── Left: images ── */}
          <div className="relative bg-black">
            <div className="relative aspect-square overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={mainImage}
                  src={mainImage}
                  alt={product.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Thumbnails — only show if more than one distinct image */}
            {thumbs.length > 1 && (
              <div className="flex gap-2 border-t border-white/10 p-3">
                {thumbs.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveImg(i);
                      // If sizes have images, select matching size
                      const matchingSize = product.sizes?.find((s) => s.image === src);
                      if (matchingSize) setSelectedSize(matchingSize);
                    }}
                    className={`h-14 w-14 shrink-0 overflow-hidden border transition duration-200 ${
                      mainImage === src
                        ? "border-[#ff4d4d]/60"
                        : "border-white/10 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: info ── */}
          <div className="flex flex-col p-7">
            {/* Close */}
            <button
              onClick={onClose}
              className="mb-6 self-end font-mono text-xs uppercase tracking-[0.2em] text-[#e5dccf]/40 transition hover:text-[#ff5a5a]"
            >
              ✕ Close
            </button>

            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.35em] text-[#ff5a5a]">
              {product.tag}
            </p>

            <h2 className="mb-3 text-2xl font-black uppercase leading-tight">
              {product.title}
            </h2>

            <p className="mb-5 font-mono text-xl text-[#ffb3b3]">
              {displayPrice} kr
            </p>

            <p className="mb-6 text-sm leading-relaxed text-[#e5dccf]/60">
              {product.desc}
            </p>

            {/* Size picker */}
            {product.sizes && (
              <div className="mb-6">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-[#e5dccf]/35">
                  Storlek
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize?.printfulVariantId === size.printfulVariantId;
                    return (
                      <button
                        key={size.printfulVariantId}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 font-mono text-xs border transition duration-200 ${
                          isSelected
                            ? "border-[#ff4d4d]/60 bg-[#ff2b2b]/15 text-[#ffb3b3]"
                            : "border-white/10 bg-black/40 text-[#e5dccf]/40 hover:border-[#ff4d4d]/30 hover:text-[#e5dccf]/70"
                        }`}
                      >
                        {size.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-auto">
              {product.soldOut ? (
                <button disabled className="w-full cursor-not-allowed border border-white/10 bg-white/5 px-5 py-3 font-mono text-xs uppercase tracking-[0.3em] text-white/30">
                  Sold Out
                </button>
              ) : product.notifyOnly ? (
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#e5dccf]/40">
                  Inte tillgänglig ännu — fyll i intresselistan på produktkortet.
                </p>
              ) : (
                <button
                  onClick={handleBuy}
                  className="group/btn relative w-full overflow-hidden border border-[#ff4d4d]/40 bg-[#ff2b2b]/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.3em] text-[#ffb3b3] shadow-[0_0_20px_rgba(255,0,0,0.2)] transition duration-300 hover:bg-[#ff2b2b]/20 hover:shadow-[0_0_40px_rgba(255,0,0,0.45)]"
                >
                  <span className="relative z-10">Lägg i cart →</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ff4d4d]/15 to-transparent transition duration-700 group/btn-hover:translate-x-full" />
                </button>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
