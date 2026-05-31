"use client";

import { motion } from "framer-motion";

export type DisplayEvent = {
  slug: string;
  title: string;
  type: string;
  date: string;
  image: string;
  description: string;
  status: string;
  price: number;
};

type Props = {
  event: DisplayEvent;
  onBook: () => void;
  onClose: () => void;
};

export default function EventDetailModal({ event, onBook, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        className="relative z-10 w-full max-w-2xl overflow-hidden border border-white/10 bg-[#080808] shadow-[0_0_80px_rgba(255,0,0,0.15)]"
      >
        {/* Large image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/30 to-transparent" />

          {/* Type tag */}
          <div className="absolute left-5 top-5 border border-[#ff4d4d]/20 bg-black/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff6b6b] backdrop-blur-sm">
            {event.type}
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 border border-white/10 bg-black/50 px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[#e5dccf]/50 backdrop-blur-sm transition hover:text-[#ff5a5a]"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-7">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-[#ff5a5a]">
            {event.date}
          </div>

          <h2 className="mb-4 text-3xl font-black uppercase leading-none md:text-4xl">
            {event.title}
          </h2>

          <p className="mb-6 leading-relaxed text-[#e5dccf]/65">
            {event.description}
          </p>

          <div className="mb-7 flex items-center gap-6 font-mono text-xs text-[#e5dccf]/50">
            <span className="uppercase tracking-[0.2em]">{event.type}</span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[#ffb3b3]">{event.price} kr / person</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { onBook(); onClose(); }}
              className="group/btn relative overflow-hidden border border-[#ff4d4d]/40 bg-[#ff2b2b]/10 px-7 py-3 font-mono text-xs uppercase tracking-[0.3em] text-[#ffb0b0] shadow-[0_0_20px_rgba(255,0,0,0.2)] transition duration-300 hover:bg-[#ff2b2b]/20 hover:shadow-[0_0_40px_rgba(255,0,0,0.45)]"
            >
              <span className="relative z-10">Book Now →</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ff4d4d]/15 to-transparent transition duration-700 group/btn-hover:translate-x-full" />
            </button>

            <button
              onClick={onClose}
              className="border border-white/10 bg-white/5 px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-[#e5dccf]/40 transition hover:border-white/20 hover:text-[#e5dccf]/70"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
