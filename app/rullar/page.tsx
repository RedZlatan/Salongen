"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { stories, TOTAL_STORIES, type Story } from "./data";

const UNLOCK_KEY = "rullar_unlocked";
const UNLOCK_PRICE_ORE = 4900; // 49 kr

// Index för låskortet — allt efter det är gated.
const LOCK_INDEX = stories.findIndex((s) => s.type === "lock");

export default function RullarPage() {
  const [index, setIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

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

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = 80;
      if (info.offset.y < -threshold || info.velocity.y < -500) go(1); // svep uppåt → nästa
      else if (info.offset.y > threshold || info.velocity.y > 500) go(-1);
    },
    [go]
  );

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
    <main className="fixed inset-0 overflow-hidden bg-neutral-900 select-none">
      {/* Tunn progressrad */}
      <div className="absolute inset-x-0 top-0 z-20 h-1 bg-white/10">
        <motion.div
          className="h-full bg-amber-300"
          animate={{ width: `${((index + 1) / cards.length) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Vertikal pager — svep uppåt för nästa rulle */}
      <motion.div
        className="h-full w-full"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={onDragEnd}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex h-full w-full items-center justify-center overflow-y-auto p-4"
          >
            {current && <CardView story={current} onUnlock={handleUnlock} loading={loadingCheckout} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Svep-hint på första kortet */}
      {index === 0 && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center text-white/60"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <span className="text-2xl leading-none">↑</span>
          <span className="text-xs tracking-wide">svep uppåt</span>
        </motion.div>
      )}
    </main>
  );
}

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
    case "dict":
      return <DocumentCard story={story} variant="dict" />;
    case "law":
      return <DocumentCard story={story} variant="law" />;
    case "instruction":
      return <DocumentCard story={story} variant="instruction" />;
    case "diary":
      return <PaperCard story={story} variant="diary" />;
    default:
      return <PaperCard story={story} variant="story" />;
  }
}

/* ── Spiralblock-ram ───────────────────────────────────────────────── */

function Spiral() {
  return (
    <div className="absolute -top-3 left-0 right-0 z-10 flex justify-around px-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="flex flex-col items-center">
          <span className="h-3 w-1.5 rounded-full bg-neutral-400/70" />
          <span className="-mt-1 h-4 w-4 rounded-full border-2 border-neutral-500/70 bg-neutral-800/60" />
        </span>
      ))}
    </div>
  );
}

const HAND_FONT =
  "'Patrick Hand', 'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive";
const MONO_FONT =
  "'Courier New', 'Courier', ui-monospace, SFMono-Regular, monospace";

function Tag({ tag, mono }: { tag?: string; mono?: boolean }) {
  if (!tag) return null;
  return (
    <span
      className="absolute right-5 top-5 text-xs tracking-[0.3em] text-neutral-400"
      style={{ fontFamily: mono ? MONO_FONT : HAND_FONT }}
    >
      {tag}
    </span>
  );
}

function Paragraphs({ text, className }: { text?: string; className?: string }) {
  if (!text) return null;
  return (
    <>
      {text.split("\n\n").map((para, i) => (
        <p key={i} className={`mb-4 whitespace-pre-line ${className ?? ""}`}>
          {para}
        </p>
      ))}
    </>
  );
}

/* Handskrivet linjerat papper — story, diary, cover */
function PaperCard({
  story,
  variant,
}: {
  story: Story;
  variant: "story" | "diary";
}) {
  return (
    <div className="relative my-auto w-full max-w-md">
      <Spiral />
      <div
        className="relative overflow-hidden rounded-md px-7 pb-10 pt-9 shadow-2xl"
        style={{
          background: "#f4efe1",
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 31px, rgba(120,110,90,0.18) 32px)",
          color: "#2a2620",
          fontFamily: HAND_FONT,
        }}
      >
        <span className="absolute inset-y-0 left-10 w-px bg-red-400/40" />
        <Tag tag={story.tag} />
        <div className="relative pl-6">
          {story.title && (
            <h1 className="mb-4 text-2xl leading-tight">{story.title}</h1>
          )}
          <Paragraphs
            text={story.text}
            className={variant === "diary" ? "text-xl leading-relaxed italic" : "text-xl leading-relaxed"}
          />
        </div>
      </div>
    </div>
  );
}

/* Maskinskrivet "dokument" — dict, law, instruction */
function DocumentCard({
  story,
  variant,
}: {
  story: Story;
  variant: "dict" | "law" | "instruction";
}) {
  const label =
    variant === "dict" ? "UPPSLAGSORD" : variant === "law" ? "FÖRORDNING" : "INSTRUKTION";
  return (
    <div className="relative my-auto w-full max-w-md">
      <div
        className="relative overflow-hidden rounded-sm border border-neutral-300 px-8 py-9 shadow-2xl"
        style={{
          background: "#efece4",
          color: "#23211c",
          fontFamily: MONO_FONT,
        }}
      >
        <Tag tag={story.tag} mono />
        <p className="mb-6 text-[10px] tracking-[0.4em] text-neutral-500">{label}</p>
        {story.title && (
          <h1
            className={`mb-4 ${
              variant === "law"
                ? "text-3xl font-bold"
                : variant === "dict"
                  ? "text-2xl font-bold lowercase"
                  : "text-2xl font-bold"
            }`}
          >
            {story.title}
          </h1>
        )}
        <Paragraphs text={story.text} className="text-[15px] leading-relaxed" />
      </div>
    </div>
  );
}

/* Omslag */
function CoverCard() {
  return (
    <div className="relative my-auto w-full max-w-md">
      <Spiral />
      <div
        className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden rounded-md px-7 py-16 text-center shadow-2xl"
        style={{ background: "#1c1a17", color: "#f4efe1", fontFamily: HAND_FONT }}
      >
        <p className="mb-4 text-sm uppercase tracking-[0.5em] text-amber-300/80">
          Den sista salongen
        </p>
        <h1 className="text-6xl leading-none tracking-tight text-amber-200">RULLAR</h1>
        <p className="mt-6 max-w-xs text-lg text-neutral-300">
          {TOTAL_STORIES} korta rullar att svepa dig igenom.
        </p>
        <p className="mt-10 text-sm text-neutral-500">svep uppåt för att börja ↑</p>
      </div>
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
        className="relative overflow-hidden rounded-md px-7 pb-10 pt-9 shadow-2xl"
        style={{
          background: "#f4efe1",
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 31px, rgba(120,110,90,0.18) 32px)",
          color: "#2a2620",
          fontFamily: HAND_FONT,
        }}
      >
        <span className="absolute inset-y-0 left-10 w-px bg-red-400/40" />

        {/* suddig tjuvtitt på det låsta */}
        <div aria-hidden className="pointer-events-none mb-6 select-none pl-6 blur-[3px] opacity-60">
          <p className="text-xl leading-relaxed">
            Det tog honom hela livet att förstå att det inte var han som
            misslyckats, utan rollen som hade rationaliserats bort…
          </p>
        </div>

        <div className="relative mx-1 rounded-md border-2 border-dashed border-neutral-400 bg-white/40 px-5 py-7 text-center">
          <div className="mb-3 text-4xl">🔒</div>
          <h2 className="mb-1 text-2xl">Resten är bara för medlemmar</h2>
          <p className="mb-6 text-base text-neutral-600">
            Lås upp alla {TOTAL_STORIES} rullar för {(UNLOCK_PRICE_ORE / 100).toFixed(0)} kr.
          </p>
          <button
            onClick={onUnlock}
            disabled={loading}
            className="w-full rounded-full bg-neutral-900 px-6 py-3 text-lg font-semibold text-amber-200 shadow-lg transition active:scale-95 disabled:opacity-60"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {loading ? "Öppnar kassan…" : "Lås upp alla rullar"}
          </button>
        </div>
      </div>
    </div>
  );
}
