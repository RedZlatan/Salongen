"use client";

import { useEffect, useState } from "react";

import Intro from "./components/Intro";
import HomeContent from "./components/HomeContent";

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const seenIntro = localStorage.getItem("introSeen");

    if (!seenIntro) {
      setShowIntro(true);

      const timer = setTimeout(() => {
        localStorage.setItem("introSeen", "true");
        setShowIntro(false);
      }, 72000);

      return () => clearTimeout(timer);
    }
  }, []);

  const skipIntro = () => {
    localStorage.setItem("introSeen", "true");
    setShowIntro(false);
  };

  if (showIntro) {
    return (
      <div className="relative">

        <button
          onClick={skipIntro}
          className="
            absolute
            right-6
            top-6
            z-50
            border
            border-white/10
            bg-black/40
            px-4
            py-2
            text-xs
            uppercase
            tracking-[0.3em]
            text-white/60
            backdrop-blur-sm
            transition
            hover:text-white
            hover:border-red-500/40
          "
        >
          Skip
        </button>

        <Intro />

      </div>
    );
  }

  return <HomeContent />;
}