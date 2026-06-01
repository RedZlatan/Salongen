"use client";

import { useState } from "react";

interface SizeVariant {
  label: string;
  printfulVariantId: number;
  price: number; // öre
}

interface Product {
  title: string;
  image: string;
  desc: string;
  tag: string;
  soldOut?: boolean;
  notifyOnly?: boolean;
  printfulVariantId: number;
  price: number; // öre (SEK × 100)
  sizes?: SizeVariant[];
}

const products: Product[] = [
  // ── Available now ──────────────────────────────────────────────────────────
  {
    title: "SALONGEN Cap",
    image: "https://files.cdn.printful.com/files/136/136fc76f208ceff0994c2c1bc75c33fa_preview.png",
    desc: "Worn by projectionists and temporary guests.",
    tag: "In Stock",
    printfulVariantId: 5332359042,
    price: 20000,
  },
  {
    title: "Sticker Pack",
    image: "https://files.cdn.printful.com/files/1b7/1b72bcf1afda0fd0dc5e09c0ff6daa5a_preview.png",
    desc: "For laptops, tunnels and questionable decisions.",
    tag: "In Stock",
    printfulVariantId: 5332854195,
    price: 3500,
    sizes: [
      { label: '3×3"',     printfulVariantId: 5332854195, price: 3500 },
      { label: '4×4"',     printfulVariantId: 5332854196, price: 3500 },
      { label: '5.5×5.5"', printfulVariantId: 5332854197, price: 4100 },
    ],
  },
  // ── Coming soon ────────────────────────────────────────────────────────────
  {
    title: "AROMA Magazine Vol. 1",
    image: "/shop/Aromamagasinvolym1.jpeg",
    desc: "Fragments, interviews and transmissions from below the city.",
    tag: "Coming Soon",
    notifyOnly: true,
    printfulVariantId: 1001,
    price: 14900,
  },
  {
    title: "Den Sista Salongen T-Shirt",
    image: "/shop/densistasalongentshirt.jpeg",
    desc: "Heavy black cotton. Small batch print.",
    tag: "Limited Release",
    notifyOnly: true,
    printfulVariantId: 1002,
    price: 39900,
  },
  {
    title: "After Hours Hoodie",
    image: "/shop/salongenhodie.jpeg",
    desc: "Built for screenings extending beyond midnight.",
    tag: "Unavailable",
    soldOut: true,
    printfulVariantId: 1003,
    price: 59900,
  },
];

interface CartItem {
  product: Product;
  quantity: number;
}

// Initialise selected size to first variant for each product that has sizes
const defaultSizes: Record<string, SizeVariant> = Object.fromEntries(
  products
    .filter((p) => p.sizes?.length)
    .map((p) => [p.title, p.sizes![0]])
);

export default function Shop() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, SizeVariant>>(defaultSizes);

  // Per-product notify-me state
  const [notifyEmails, setNotifyEmails]   = useState<Record<string, string>>({});
  const [notifyStatus, setNotifyStatus]   = useState<Record<string, "idle" | "loading" | "done">>({});

  const totalItems = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  function addToCart(product: Product) {
    // For size-variants, use the currently selected size
    const size = product.sizes ? selectedSizes[product.title] : undefined;
    const effective: Product = size
      ? { ...product, title: `${product.title} (${size.label})`, printfulVariantId: size.printfulVariantId, price: size.price }
      : product;

    setCart((prev) => {
      const existing = prev.find((ci) => ci.product.printfulVariantId === effective.printfulVariantId);
      if (existing) {
        return prev.map((ci) =>
          ci.product.printfulVariantId === effective.printfulVariantId
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      return [...prev, { product: effective, quantity: 1 }];
    });
  }

  async function handleNotify(product: Product) {
    const email = notifyEmails[product.title]?.trim() ?? "";
    if (!email) return;
    setNotifyStatus((prev) => ({ ...prev, [product.title]: "loading" }));
    await fetch("/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, product: product.title }),
    });
    setNotifyStatus((prev) => ({ ...prev, [product.title]: "done" }));
  }

  async function handleCheckout() {
    if (cart.length === 0 || loading) return;
    setLoading(true);

    const items = cart.map((ci) => ({
      printfulVariantId: ci.product.printfulVariantId,
      quantity: ci.quantity,
      name: ci.product.title,
      price: ci.product.price,
    }));

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("Checkout error:", data);
      setLoading(false);
    }
  }

  return (
    <>
      <section
        id="shop"
        className="relative overflow-hidden border-t border-white/10 bg-black px-5 py-24 md:px-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.12),transparent_40%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

        <div className="relative z-10 mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-[#ff5a5a]">Shop</p>
            <h2 className="max-w-4xl text-4xl font-black uppercase tracking-tight md:text-6xl">
              Objects From The Salon
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#e5dccf]/50 md:text-base">
              Limited runs, recovered fragments and transmissions from below the city.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((item) => {
            const status = notifyStatus[item.title] ?? "idle";

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden border border-white/10 bg-[#090909] transition duration-500 hover:-translate-y-1 hover:border-[#ff4d4d]/40 hover:shadow-[0_0_60px_rgba(255,0,0,0.15)]"
              >
                {/* image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.18),transparent_55%)] opacity-70" />
                  <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.08)_51%)] bg-[length:100%_4px]" />
                  <div className="absolute bottom-4 left-4 border border-[#ff4d4d]/20 bg-black/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff6b6b] backdrop-blur-sm">
                    {item.tag}
                  </div>
                  {item.soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                      <div className="rotate-[-12deg] border border-[#ff4d4d]/40 bg-black/70 px-6 py-3 font-mono text-lg uppercase tracking-[0.4em] text-[#ff5a5a] shadow-[0_0_30px_rgba(255,0,0,0.3)]">
                        SOLD OUT
                      </div>
                    </div>
                  )}
                </div>

                {/* content */}
                <div className="p-5">
                  <h3 className="mb-3 text-2xl font-black uppercase leading-none">{item.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#e5dccf]/55">{item.desc}</p>

                  {/* ── Sold out ── */}
                  {item.soldOut && (
                    <button
                      disabled
                      className="cursor-not-allowed border border-white/10 bg-white/5 px-5 py-3 text-xs uppercase tracking-[0.3em] text-white/30"
                    >
                      Sold Out
                    </button>
                  )}

                  {/* ── Buy (real Printful ID) ── */}
                  {!item.soldOut && !item.notifyOnly && (
                    <div className="space-y-3">
                      {/* Size picker */}
                      {item.sizes && (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#e5dccf]/35 shrink-0">
                            Size
                          </span>
                          <div className="flex gap-1.5">
                            {item.sizes.map((size) => {
                              const isSelected = selectedSizes[item.title]?.printfulVariantId === size.printfulVariantId;
                              return (
                                <button
                                  key={size.printfulVariantId}
                                  onClick={() => setSelectedSizes((prev) => ({ ...prev, [item.title]: size }))}
                                  className={`px-2.5 py-1 font-mono text-[10px] border transition duration-200 ${
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
                          {item.sizes && (
                            <span className="ml-auto font-mono text-[10px] text-[#ffb3b3]/70">
                              {((selectedSizes[item.title]?.price ?? item.price) / 100)} kr
                            </span>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => addToCart(item)}
                        className="group/button relative overflow-hidden border border-[#ff4d4d]/30 bg-[#ff2b2b]/10 px-5 py-3 text-xs uppercase tracking-[0.3em] text-[#ffb3b3] transition duration-300 hover:bg-[#ff2b2b]/20 hover:shadow-[0_0_30px_rgba(255,0,0,0.35)]"
                      >
                        <span className="relative z-10">Buy</span>
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ff4d4d]/20 to-transparent transition duration-700 group-hover/button:translate-x-full" />
                      </button>
                    </div>
                  )}

                  {/* ── Notify Me (no real Printful ID yet) ── */}
                  {!item.soldOut && item.notifyOnly && (
                    status === "done" ? (
                      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#4aff8c]/70">
                        You&apos;re on the list.
                      </p>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={notifyEmails[item.title] ?? ""}
                          onChange={(e) =>
                            setNotifyEmails((prev) => ({ ...prev, [item.title]: e.target.value }))
                          }
                          onKeyDown={(e) => e.key === "Enter" && handleNotify(item)}
                          className="min-w-0 flex-1 border border-white/10 bg-black/60 px-3 py-2 font-mono text-xs text-[#e5dccf] outline-none transition placeholder:text-white/20 focus:border-[#ff4d4d]/40"
                        />
                        <button
                          onClick={() => handleNotify(item)}
                          disabled={status === "loading" || !notifyEmails[item.title]?.trim()}
                          className="shrink-0 border border-[#ff4d4d]/30 bg-[#ff2b2b]/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[#ffb3b3] transition hover:bg-[#ff2b2b]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {status === "loading" ? "…" : "Notify Me"}
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sticky cart bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#ff4d4d]/30 bg-black/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-10">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff2b2b] font-mono text-xs font-bold text-white">
                {totalItems}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#e5dccf]/70">
                {totalItems === 1 ? "1 item" : `${totalItems} items`} in cart
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCart([])}
                className="font-mono text-xs uppercase tracking-[0.2em] text-white/30 transition hover:text-white/60"
              >
                Clear
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="relative overflow-hidden border border-[#ff4d4d]/50 bg-[#ff2b2b]/15 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] text-[#ffb3b3] transition duration-300 hover:bg-[#ff2b2b]/25 hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Redirecting…" : "Checkout →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
