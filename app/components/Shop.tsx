"use client";

const products = [
  {
    title: "AROMA Magazine Vol. 1",
    image: "/shop/aromamagasinvolym1.jpeg",
    desc: "Fragments, interviews and transmissions from below the city.",
    button: "Preorder",
    tag: "Coming Soon",
  },
  {
    title: "Den Sista Salongen T-Shirt",
    image: "/shop/densistasalongentshirt.jpeg",
    desc: "Heavy black cotton. Small batch print.",
    button: "Preorder",
    tag: "Limited Release",
  },
  {
    title: "After Hours Hoodie",
    image: "/shop/salongenhodie.jpeg",
    desc: "Built for screenings extending beyond midnight.",
    button: "Sold Out",
    tag: "Unavailable",
    soldOut: true,
  },
  {
    title: "SALONGEN Cap",
    image: "/shop/sistasalongenkeps.jpeg",
    desc: "Worn by projectionists and temporary guests.",
    button: "Preorder",
    tag: "Limited Release",
  },
  {
    title: "Sticker Pack",
    image: "/shop/salongensticker.jpeg",
    desc: "For laptops, tunnels and questionable decisions.",
    button: "Preorder",
    tag: "Limited Release",
  },
  {
    title: "Life Aquatic Sticker",
    image: "/shop/sistasalongensticker.jpeg",
    desc: "Recovered from the deeper archive.",
    button: "Preorder",
    tag: "Limited Release",
  },
];

export default function Shop() {
  return (
    <section
      id="shop"
      className="relative overflow-hidden border-t border-white/10 bg-black px-5 py-24 md:px-10"
    >
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.12),transparent_40%)]" />

      {/* noise texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

      <div className="relative z-10 mb-14 flex items-end justify-between gap-6">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-[#ff5a5a]">
            Shop
          </p>

          <h2 className="max-w-4xl text-4xl font-black uppercase tracking-tight md:text-6xl">
            Objects From The Salon
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#e5dccf]/50 md:text-base">
            Limited runs, recovered fragments and transmissions from below the
            city.
          </p>
        </div>
      </div>

      <div className="relative z-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((item) => (
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

              {/* gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.18),transparent_55%)] opacity-70" />

              {/* scanlines */}
              <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.08)_51%)] bg-[length:100%_4px]" />

              {/* tag */}
              <div className="absolute bottom-4 left-4 border border-[#ff4d4d]/20 bg-black/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff6b6b] backdrop-blur-sm">
                {item.tag}
              </div>

              {/* sold out overlay */}
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
              <h3 className="mb-3 text-2xl font-black uppercase leading-none">
                {item.title}
              </h3>

              <p className="mb-6 text-sm leading-relaxed text-[#e5dccf]/55">
                {item.desc}
              </p>

              <button
                className={`group/button relative overflow-hidden border px-5 py-3 text-xs uppercase tracking-[0.3em] transition duration-300 ${
                  item.soldOut
                    ? "cursor-not-allowed border-white/10 bg-white/5 text-white/30"
                    : "border-[#ff4d4d]/30 bg-[#ff2b2b]/10 text-[#ffb3b3] hover:bg-[#ff2b2b]/20 hover:shadow-[0_0_30px_rgba(255,0,0,0.35)]"
                }`}
              >
                <span className="relative z-10">{item.button}</span>

                {!item.soldOut && (
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ff4d4d]/20 to-transparent transition duration-700 group-hover/button:translate-x-full" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}