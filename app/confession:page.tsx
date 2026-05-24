"use client";

import { useState } from "react";

export default function ConfessionPage() {
  const [confession, setConfession] =
    useState("");

  const [response, setResponse] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleConfess = async () => {
    if (!confession.trim()) return;

    setLoading(true);
    setResponse("");

    // fake machine thinking
    setTimeout(() => {
      const responses = [
        "THE MACHINE HAS HEARD WORSE.",

        "YOUR GUILT IS NOT UNIQUE.",

        "YOU SPEAK AS IF THIS IS NEW.",

        "THE MACHINE REMEMBERS.",

        "SOME THINGS CANNOT BE FORGIVEN.",

        "TRUTH ARRIVED BEFORE YOU DID.",
      ];

      const random =
        responses[
          Math.floor(
            Math.random() *
              responses.length
          )
        ];

      setResponse(random);
      setLoading(false);
    }, 2200);
  };

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-black
        px-6
        py-20
        text-[#e5dccf]
      "
    >

      {/* background */}
      <img
        src="/arcade/confession-close.jpeg"
        alt="Confession Machine"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          opacity-40
        "
      />

      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* CRT lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-screen">
        <div className="h-full w-full bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.08)_51%)] bg-[length:100%_4px]" />
      </div>

      {/* CONTENT */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-3xl
          border
          border-red-500/20
          bg-black/60
          p-8
          backdrop-blur-md
        "
      >

        {/* TITLE */}
        <p
          className="
            mb-3
            font-mono
            text-xs
            uppercase
            tracking-[0.45em]
            text-[#ff5a5a]
          "
        >
          The Machine Listens
        </p>

        <h1
          className="
            mb-10
            text-4xl
            font-black
            uppercase
            md:text-6xl
          "
        >
          Confession
        </h1>

        {/* INPUT */}
        <textarea
          value={confession}
          onChange={(e) =>
            setConfession(
              e.target.value
            )
          }
          placeholder="Speak truth."
          className="
            h-48
            w-full
            resize-none
            border
            border-red-500/20
            bg-black/70
            p-6
            font-mono
            text-lg
            text-[#e5dccf]
            outline-none
            placeholder:text-white/20
          "
        />

        {/* BUTTON */}
        <button
          onClick={handleConfess}
          disabled={loading}
          className="
            mt-6
            border
            border-red-500/30
            bg-black
            px-8
            py-4
            font-mono
            text-xs
            uppercase
            tracking-[0.4em]
            text-[#ff6b6b]
            transition-all
            duration-300
            hover:border-red-500
            hover:bg-red-500
            hover:text-black
          "
        >
          {loading
            ? "LISTENING..."
            : "CONFESS"}
        </button>

        {/* RESPONSE */}
        {(response || loading) && (
          <div
            className="
              mt-10
              border-t
              border-white/10
              pt-8
            "
          >

            <p
              className="
                mb-4
                font-mono
                text-xs
                uppercase
                tracking-[0.35em]
                text-white/30
              "
            >
              Machine Response
            </p>

            <div
              className="
                min-h-[80px]
                font-mono
                text-2xl
                uppercase
                leading-relaxed
                tracking-[0.08em]
                text-[#ff5a5a]
              "
            >
              {loading
                ? "THE MACHINE IS LISTENING..."
                : response}
            </div>

          </div>
        )}

        {/* BACK */}
        <button
          onClick={() => {
            window.location.href =
              "/arcade";
          }}
          className="
            mt-12
            font-mono
            text-xs
            uppercase
            tracking-[0.35em]
            text-white/40
            transition
            hover:text-white
          "
        >
          Leave Confession
        </button>

      </div>

    </main>
  );
}