"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GatenheimPreview() {
  const [hovered, setHovered] = useState(false);

  const router = useRouter();

  const playHoverSound = () => {
    const audio = new Audio(
      "/gathenhielmskamedia/höger1.mp3"
    );

    audio.volume = 0.08;

    audio.play();
  };

  return (
    <section
      className="
        relative
        px-5
        py-20
        md:px-10
      "
    >

      <div className="mb-10 text-center">

        <p
          className="
            mb-3
            font-mono
            text-xs
            uppercase
            tracking-[0.35em]
            text-[#ff5a5a]
          "
        >
          Gatenhielmska
        </p>

        <h2
          className="
            text-3xl
            font-black
            uppercase
            tracking-tight
            md:text-5xl
          "
        >
          The Manor Beyond The Fog
        </h2>

      </div>

      <div
        onMouseEnter={() => {
          setHovered(true);
          playHoverSound();
        }}
        onMouseLeave={() => setHovered(false)}
        onClick={() => router.push("/gatenheim")}
        className="
          group
          relative
          mx-auto
          max-w-3xl
          cursor-pointer
          overflow-hidden
          transition
          duration-500
        "
      >

        <img
          src={
            hovered
              ? "/gathenhielmskamedia/arrival-posetiv.jpeg"
              : "/gathenhielmskamedia/arrival-negative.jpeg"
          }
          alt="Gatenhielmska Manor"
          className="
            h-full
            w-full
            object-cover
            transition-all
            duration-700
            group-hover:scale-[1.01]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-transparent
            to-black/20
          "
        />

        <div
          className="
            absolute
            bottom-6
            left-6
          "
        >

          <p
            className="
              mb-2
              font-mono
              text-xs
              uppercase
              tracking-[0.35em]
              text-[#ff5a5a]
            "
          >
            Interactive Archive
          </p>

          <h3
            className="
              text-2xl
              font-black
              uppercase
              md:text-4xl
            "
          >
            Enter Gatenheim
          </h3>

        </div>

      </div>

    </section>
  );
}