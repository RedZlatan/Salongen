"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HiddenArcadeEntrance() {
  const router = useRouter();

  const [hovered, setHovered] =
    useState(false);

  const enterArcade = () => {
    const audio = new Audio(
      "/arcade/dooropen.mp3"
    );

    audio.volume = 0.15;

    audio.play();

    setTimeout(() => {
      router.push("/arcade");
    }, 600);
  };

  return (
    <div
      className="
        relative
        flex
        justify-center
        py-32
      "
    >

      <button
        onClick={enterArcade}
        onMouseEnter={() =>
          setHovered(true)
        }
        onMouseLeave={() =>
          setHovered(false)
        }
        className="
          group
          relative
          h-20
          w-14
          cursor-pointer
        "
      >

        {/* glow */}
        <div
          className={`
            absolute
            inset-0
            rounded-t-full
            bg-red-500/20
            blur-xl
            transition-all
            duration-500

            ${
              hovered
                ? "opacity-100"
                : "opacity-40"
            }
          `}
        />

        {/* door */}
        <div
          className="
            absolute
            inset-0
            rounded-t-full
            border
            border-[#ff4d4d]/30
            bg-black
            transition-all
            duration-500
            group-hover:border-[#ff6b6b]
            group-hover:shadow-[0_0_25px_rgba(255,0,0,0.4)]
          "
        >

          {/* light */}
          <div
            className={`
              absolute
              bottom-0
              left-1/2
              h-1
              w-8
              -translate-x-1/2
              bg-red-500
              blur-sm
              transition-all
              duration-500

              ${
                hovered
                  ? "opacity-100"
                  : "opacity-40"
              }
            `}
          />

        </div>

        {/* label */}
        <div
          className={`
            absolute
            top-24
            left-1/2
            -translate-x-1/2
            whitespace-nowrap
            font-mono
            text-[10px]
            uppercase
            tracking-[0.35em]
            text-[#ff6b6b]
            transition-all
            duration-500

            ${
              hovered
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        >
          Själslig Arkadhall
        </div>

      </button>

    </div>
  );
}