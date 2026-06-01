"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Shop from "./Shop";
import HiddenToken from "./HiddenToken";
import Events from "./Events";
import GatenheimPreview from "./gatenheimgame/GatenheimPreview";
import HiddenArcadeEntrance from "./HiddenArcadeEntrance";
import BookingModal from "./BookingModal";

export default function HomeContent() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [navOpen, setNavOpen]         = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
  <main className="relative min-h-screen overflow-hidden bg-black text-[#e5dccf] selection:bg-red-700/40">

      {/* CRT + Noise */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.08] mix-blend-screen">
        <div className="h-full w-full bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.08)_51%)] bg-[length:100%_4px]" />
      </div>

      {/* Red Glow */}
      <div className="pointer-events-none fixed inset-0 z-40 opacity-20">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.14),transparent_60%)]" />
      </div>

      {/* TOP BAR */}
      <div className="relative z-30 border-b border-red-900/40 bg-[#080808] px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[#ff5a5a] md:px-8">

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>Salongen / The Last Salon</span>
          <span>Gothenburg Sweden · Est. 2026</span>
        </div>

      </div>

      {/* HERO */}
      <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pb-8 pt-8 md:px-10 md:pb-12 md:pt-10">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.2),transparent_35%)]" />

        {/* NAV */}
        <nav className="relative z-20 border border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 p-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.45em] text-[#ff4d4d]">Now Showing</div>
              <div className="mt-1 font-mono text-xs text-[#e5dccf]/50">www.salongen.se</div>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-5 text-xs uppercase tracking-[0.25em] text-[#e5dccf]/70">
              <button onClick={() => scrollToSection("events")} className="transition hover:text-[#ff5a5a]">Events</button>
              <button onClick={() => scrollToSection("cinema")} className="transition hover:text-[#ff5a5a]">Cinema</button>
              <button onClick={() => scrollToSection("shop")} className="transition hover:text-[#ff5a5a]">Shop</button>
              <button onClick={() => scrollToSection("events")} className="border border-red-800/40 bg-red-950/30 px-3 py-2 text-[#ff7b7b] shadow-[0_0_20px_rgba(255,0,0,0.35)] transition hover:bg-red-900/30">Enter</button>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setNavOpen((o) => !o)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Menu"
            >
              <span className={`block h-px w-6 bg-[#e5dccf]/70 transition-all duration-300 ${navOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-px w-6 bg-[#e5dccf]/70 transition-all duration-300 ${navOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px w-6 bg-[#e5dccf]/70 transition-all duration-300 ${navOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>

          {/* Mobile nav dropdown */}
          {navOpen && (
            <div className="md:hidden border-t border-white/10 px-4 pb-4 flex flex-col gap-4 text-sm uppercase tracking-[0.25em] text-[#e5dccf]/70">
              <button onClick={() => { scrollToSection("events"); setNavOpen(false); }} className="text-left py-2 transition hover:text-[#ff5a5a]">Events</button>
              <button onClick={() => { scrollToSection("cinema"); setNavOpen(false); }} className="text-left py-2 transition hover:text-[#ff5a5a]">Cinema</button>
              <button onClick={() => { scrollToSection("shop");   setNavOpen(false); }} className="text-left py-2 transition hover:text-[#ff5a5a]">Shop</button>
              <button onClick={() => { scrollToSection("events"); setNavOpen(false); }} className="self-start border border-red-800/40 bg-red-950/30 px-4 py-2 text-[#ff7b7b]">Enter</button>
            </div>
          )}
        </nav>

        {/* HERO CONTENT */}
        <div className="relative z-20 mt-16 flex flex-1 items-center">

          <div className="max-w-6xl">

            <div className="mb-5 inline-block border border-red-800/40 bg-black/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.35em] text-[#ff5a5a] backdrop-blur-sm md:text-xs">
              12 Seats Only
            </div>

            {/* Neon Logo */}
            <div className="relative inline-block">

              <div className="absolute inset-0 blur-3xl opacity-70">
                <h1 className="font-black uppercase leading-none tracking-[-0.06em] text-[#ff2f2f] text-[5rem] md:text-[10rem] lg:text-[13rem]">
                  SALONGEN
                </h1>
              </div>

              <h1 className="relative animate-pulse font-black uppercase leading-none tracking-[-0.06em] text-[#ffb3b3] drop-shadow-[0_0_25px_rgba(255,0,0,0.95)] text-[5rem] md:text-[10rem] lg:text-[13rem]">
                SALONGEN
              </h1>

            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px] md:items-end">

              <div>

                <p className="max-w-xl text-lg leading-relaxed text-[#e5dccf]/70 md:text-2xl">
                  The last salon for film, music, conversation and temporary gatherings.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">

                  <button
                    onClick={() => scrollToSection("events")}
                    className="border border-[#ff4d4d]/40 bg-[#ff2b2b]/10 px-6 py-3 text-sm uppercase tracking-[0.3em] text-[#ffb0b0] shadow-[0_0_20px_rgba(255,0,0,0.25)] transition duration-300 hover:bg-[#ff2b2b]/20 hover:shadow-[0_0_50px_rgba(255,0,0,0.7)]"
                  >
                    Upcoming Events
                  </button>

                  <button
                    onClick={() => setBookingOpen(true)}
                    className="border border-white/10 bg-white/5 px-6 py-3 text-sm uppercase tracking-[0.3em] text-[#e5dccf]/70 transition hover:border-[#ff4d4d]/40 hover:text-[#ff7a7a]"
                  >
                    Book Cinema
                  </button>

                </div>

              </div>

              {/* STATUS BOX */}
              <div className="border border-white/10 bg-black/60 p-5 font-mono text-xs leading-relaxed text-[#e5dccf]/60 backdrop-blur-sm">

                <div className="mb-3 text-[#ff5a5a]">
                  STATUS
                </div>

                <div>Screenings: Active</div>
                <div>Seats Remaining: 12</div>
                <div>Signal: Stable</div>
                <div>Advertisements: Disabled</div>
                <div>Algorithms: Offline</div>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom Strip */}
        <div className="relative z-20 mt-10 grid gap-4 border border-white/10 bg-black/40 p-4 text-xs uppercase tracking-[0.2em] text-[#e5dccf]/50 backdrop-blur-sm md:grid-cols-4">

          <div>Film Screenings</div>
          <div>Live Music</div>
          <div>Conversations</div>
          <div>Late Night Gatherings</div>


        </div>

      </section>

      <Events />

      <GatenheimPreview />

      <Shop />

      <HiddenToken />

      <HiddenArcadeEntrance />

      {bookingOpen && (
        <BookingModal onClose={() => setBookingOpen(false)} />
      )}

    </main>
  );
}