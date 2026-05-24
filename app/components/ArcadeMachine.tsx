"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ArcadeMachine() {
  const [hasToken, setHasToken] =
    useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token =
        localStorage.getItem(
          "salongenToken1"
        );

      if (token === "true") {
        setHasToken(true);
      }
    };

    checkToken();

    window.addEventListener(
      "tokenFound",
      checkToken
    );

    return () => {
      window.removeEventListener(
        "tokenFound",
        checkToken
      );
    };
  }, []);

  const handlePlay = () => {
    window.location.href = "/aroma";
  };

  return (
    <div
      className="
        absolut
        right-[-40px]
        top-[82vh]
        z-20
        scale-[0.55]
        origin-bottom-right
        opacity-60
        transition-all
        duration-500
        hover:opacity-100
        hover:scale-[0.6]
      "
    >

      <div className="relative">

        {/* MACHINE */}
        <Image
          src="/aroma/arcade-machine.png"
          alt="Arcade Machine"
          width={380}
          height={600}
          priority
          className="
            object-contain
            drop-shadow-[0_0_35px_rgba(255,0,0,0.35)]
          "
        />

        {/* STATUS LIGHT */}
        <div
          className={`
            absolute
            left-1/2
            top-[405px]
            h-2
            w-2
            -translate-x-1/2
            rounded-full

            ${
              hasToken
                ? `
                bg-red-500
                shadow-[0_0_15px_rgba(255,0,0,1)]
              `
                : `
                bg-gray-700
              `
            }
          `}
        />

        {/* BUTTON */}
        <button
          onClick={handlePlay}
          disabled={!hasToken}
          className={`
            absolute
            bottom-[95px]
            left-1/2
            -translate-x-1/2
            border
            px-5
            py-2
            text-xs
            uppercase
            tracking-[0.35em]
            transition-all
            duration-300

            ${
              hasToken
                ? `
                border-red-500
                text-red-400
                hover:bg-red-500
                hover:text-black
              `
                : `
                border-gray-700
                text-gray-600
                cursor-not-allowed
              `
            }
          `}
        >
          {hasToken
            ? "PLAY"
            : "INSERT TOKEN"}
        </button>

      </div>

    </div>
  );
}