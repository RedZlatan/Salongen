"use client";

import Image from "next/image";
import { useState } from "react";

export default function HiddenToken() {
  const [found, setFound] =
    useState(false);

  const handleFind = () => {
    localStorage.setItem(
      "salongenToken1",
      "true"
    );

    setFound(true);

    window.dispatchEvent(
      new Event("tokenFound")
    );
  };

  return (
    <div className="relative flex justify-center py-32">

      {!found ? (
        <button
          onClick={handleFind}
          className="
            opacity-20
            transition
            duration-500
            hover:opacity-100
            hover:scale-110
          "
        >
          <Image
            src="/aroma/token-front.png"
            alt="Hidden Token"
            width={100}
            height={100}
            className="
              drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]
            "
          />
        </button>
      ) : (
        <div className="text-center">

          <Image
            src="/aroma/token-front.png"
            alt="Found Token"
            width={140}
            height={140}
            className="
              animate-pulse
              drop-shadow-[0_0_35px_rgba(255,0,0,0.7)]
            "
          />

          <p className="mt-6 text-sm uppercase tracking-[0.35em] text-[#ff6a6a]">
            TOKEN FOUND
          </p>

        </div>
      )}

    </div>
  );
}