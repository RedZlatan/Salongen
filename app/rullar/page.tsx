"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cormorant_Garamond, DM_Mono } from "next/font/google";
import { stories, type Story } from "./data";

// Brödtext: Cormorant Garamond. Etiketter/taggar: DM Mono.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

const UNLOCK_KEY = "rullar_unlocked";
const UNLOCK_PRICE_ORE = 4900; // 49 kr

// Index för låskortet — allt efter det är gated.
const LOCK_INDEX = stories.findIndex((s) => s.type === "lock");

export default function RullarPage() {
  const [index, setIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  // Refs för native swipe (touch + mus) — ersätter framer-motion drag.
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);

  // Läs upplåsning från localStorage (och fånga retur från Stripe).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("unlocked") === "1") {
      localStorage.setItem(UNLOCK_KEY, "1");
    }
    setUnlocked(localStorage.getItem(UNLOCK_KEY) === "1");
  }, []);

  // Upplåst → allt utom låskortet. Låst → fram t.o.m. låskortet.
  const cards: Story[] = useMemo(() => {
    if (unlocked) return stories.filter((s) => s.type !== "lock");
    return stories.slice(0, LOCK_INDEX + 1);
  }, [unlocked]);

  // Håll index inom gränserna när korten ändras.
  useEffect(() => {
    setIndex((i) => Math.min(i, cards.length - 1));
  }, [cards.length]);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => Math.max(0, Math.min(cards.length - 1, i + dir)));
    },
    [cards.length]
  );

  // Tangentbord för desktop-test.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        go(1);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Native touch-swipe — fungerar med tummen på mobil. preventDefault kräver
  // icke-passiva listeners, därför addEventListener i stället för JSX-handlers.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      e.preventDefault(); // stoppa native scroll under svep
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (diff > 60) go(1);        // svep > 60px uppåt → nästa kort
      else if (diff < -60) go(-1); // svep > 60px nedåt → föregående kort
      touchStartY.current = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [go]);

  const handleUnlock = useCallback(async () => {
    setLoadingCheckout(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              name: "Rullar — lås upp alla berättelser",
              price: UNLOCK_PRICE_ORE,
              quantity: 1,
            },
          ],
          metadata: { product: "rullar_unlock" },
          successPath: "/rullar?unlocked=1",
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setLoadingCheckout(false);
    } catch {
      setLoadingCheckout(false);
    }
  }, []);

  const current = cards[index];

  return (
    <main
      className="fixed inset-0 select-none overflow-hidden"
      style={{ background: PAGE_BG }}
    >
      {/* Subtil progressrad — tunn linje */}
      <div className="absolute inset-x-0 top-0 z-20 h-px bg-white/10">
        <motion.div
          className="h-full bg-white/45"
          animate={{ width: `${((index + 1) / cards.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Vertikal pager — native swipe (touch via listeners, mus via handlers) */}
      <div
        ref={containerRef}
        className="h-full w-full"
        style={{ touchAction: "none" }}
        onMouseDown={(e) => {
          mouseStartY.current = e.clientY;
        }}
        onMouseUp={(e) => {
          if (mouseStartY.current === null) return;
          const diff = mouseStartY.current - e.clientY;
          if (diff > 60) go(1);
          else if (diff < -60) go(-1);
          mouseStartY.current = null;
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full w-full items-center justify-center overflow-y-auto px-5 py-10"
          >
            {current && <CardView story={current} onUnlock={handleUnlock} loading={loadingCheckout} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Svep-hint på första kortet */}
      {index === 0 && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-7 flex flex-col items-center gap-1 text-white/35"
          animate={{ y: [0, -7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <span className="text-lg leading-none">↑</span>
          <span className="text-[10px] tracking-[0.4em]" style={{ fontFamily: MONO }}>
            SVEP UPPÅT
          </span>
        </motion.div>
      )}
    </main>
  );
}

/* ── Tema ──────────────────────────────────────────────────────────── */

const PAGE_BG = "#0b0b0c";
const PAPER = "#f3efe6";
const INK = "#1a1815";

const SERIF = cormorant.style.fontFamily;
const MONO = dmMono.style.fontFamily;

const TYPE_LABEL: Partial<Record<Story["type"], string>> = {
  instruction: "INSTRUKTION",
  law: "FÖRORDNING",
  dict: "UPPSLAGSORD",
  diary: "DAGBOK",
};

/* ── Korttyper ─────────────────────────────────────────────────────── */

function CardView({
  story,
  onUnlock,
  loading,
}: {
  story: Story;
  onUnlock: () => void;
  loading: boolean;
}) {
  switch (story.type) {
    case "cover":
      return <CoverCard />;
    case "lock":
      return <LockCard onUnlock={onUnlock} loading={loading} />;
    default:
      return <ContentCard story={story} />;
  }
}

/* Elegant tunn wire-o-spiral */
function Spiral() {
  return (
    <div className="pointer-events-none absolute -top-[9px] inset-x-0 z-10 flex justify-between px-9">
      {Array.from({ length: 13 }).map((_, i) => (
        <span
          key={i}
          className="h-[18px] w-[4px] rounded-full border border-black/25"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(120,120,120,0.12) 45%, transparent)",
          }}
        />
      ))}
    </div>
  );
}

function Header({ label, tag }: { label?: string; tag?: string }) {
  if (!label && !tag) return null;
  return (
    <div
      className="mb-9 flex items-center justify-between text-black/40"
      style={{ fontFamily: MONO }}
    >
      <span className="text-[10px] tracking-[0.4em]">{label ?? ""}</span>
      <span className="text-[10px] tracking-[0.3em] text-black/30">{tag}</span>
    </div>
  );
}

function Paragraphs({ text, italic }: { text?: string; italic?: boolean }) {
  if (!text) return null;
  return (
    <>
      {text.split("\n\n").map((para, i) => (
        <p
          key={i}
          className={`mb-6 whitespace-pre-line text-[1.6rem] leading-[1.55] tracking-[0.01em] ${
            italic ? "italic" : ""
          }`}
        >
          {para}
        </p>
      ))}
    </>
  );
}

/* Pappersram — story, diary, instruction, law, dict */
function ContentCard({ story }: { story: Story }) {
  const label = TYPE_LABEL[story.type];
  const isDiary = story.type === "diary";
  const isDict = story.type === "dict";

  return (
    <div className="relative my-auto w-full max-w-md">
      <Spiral />
      <div
        className="relative flex min-h-[70vh] flex-col justify-center overflow-hidden rounded-[2px] px-9 pb-14 pt-12 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.75)]"
        style={{ background: PAPER, color: INK, fontFamily: SERIF }}
      >
        <Header label={label} tag={story.tag} />

        {story.title && (
          <h1
            className={`mb-6 leading-[1.1] ${
              isDict ? "text-4xl lowercase italic" : "text-3xl"
            } ${isDiary ? "italic" : ""}`}
            style={{ fontWeight: 500 }}
          >
            {story.title}
          </h1>
        )}

        <Paragraphs text={story.text} italic={isDiary} />
      </div>
    </div>
  );
}

/* Omslag — avskalad titelsida på svart */
function CoverCard() {
  return (
    <div
      className="my-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center text-center"
      style={{ color: PAPER }}
    >
      <h1
        className="leading-none"
        style={{
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: "clamp(3.25rem, 19vw, 5rem)",
          letterSpacing: "0.08em",
          // kompensera så texten ser optiskt centrerad ut trots letter-spacing
          textIndent: "0.08em",
        }}
      >
        RULLAR
      </h1>
      <p
        className="mt-7 text-[11px] tracking-[0.4em] text-white/45"
        style={{ fontFamily: MONO }}
      >
        MICRO-NOVELLER · ROBIN OLSSON
      </p>
    </div>
  );
}

/* Låskort */
function LockCard({
  onUnlock,
  loading,
}: {
  onUnlock: () => void;
  loading: boolean;
}) {
  return (
    <div className="relative my-auto w-full max-w-md">
      <Spiral />
      <div
        className="relative flex min-h-[70vh] flex-col justify-center overflow-hidden rounded-[2px] px-9 pb-14 pt-12 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.75)]"
        style={{ background: PAPER, color: INK, fontFamily: SERIF }}
      >
        <Header label="FORTSÄTTNING" tag="—" />

        {/* suddig tjuvtitt på det låsta */}
        <p
          aria-hidden
          className="pointer-events-none mb-10 select-none text-[1.6rem] leading-[1.55] blur-[3px] opacity-50"
        >
          Det tog honom hela livet att förstå att det inte var han som
          misslyckats, utan rollen som hade rationaliserats bort…
        </p>

        <div className="border-t border-black/10 pt-9 text-center">
          <h2 className="text-3xl leading-tight" style={{ fontWeight: 500 }}>
            Resten av rullen
          </h2>
          <p className="mx-auto mt-3 max-w-xs text-[1.25rem] leading-snug text-black/55">
            Lås upp hela rullen för {(UNLOCK_PRICE_ORE / 100).toFixed(0)} kr.
          </p>
          <button
            onClick={onUnlock}
            disabled={loading}
            className="mt-8 w-full rounded-full border border-black px-6 py-3.5 text-[11px] tracking-[0.3em] transition active:scale-[0.98] disabled:opacity-50"
            style={{ fontFamily: MONO, background: INK, color: PAPER }}
          >
            {loading ? "ÖPPNAR KASSAN…" : "LÅS UPP HELA RULLEN – 49 KR"}
          </button>
        </div>
      </div>
    </div>
  );
}
