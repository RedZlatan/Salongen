"use client";

import { motion } from "framer-motion";

export default function Intro() {
  return (
    <main className="relative h-screen overflow-hidden bg-black">

      <motion.div
        initial={{
          y: "0%",
          scale: 1.10,
        }}

        animate={{
          y: "-140%",
          scale: 0.50,
        }}

        transition={{
          duration: 72,
          ease: [0.25, 0.1, 0.20, 0.25],
        }}

        className="
          absolute
          inset-0
          flex
          justify-center
          will-change-transform
        "
      >
        <img
          src="/shop/sistasalongenstickeranimering.jpeg"
          alt="Den sista salongen"
          className="
            h-[460vh]
            w-auto
            max-w-none
            object-contain
            object-top
          "
        />
      </motion.div>

      {/* FILMISKT MÖRKER */}
      <div className="absolute inset-0 bg-black/16" />

      {/* SUBTIL RÖD ATMOSFÄR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.015, 0.04, 0.07],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        className="
          absolute
          inset-0
          bg-red-700
          mix-blend-screen
          pointer-events-none
        "
      />

      {/* SALONGEN NEON */}
      <motion.div
        initial={{
          opacity: 0,
        }}

        animate={{
          opacity: [
            0,
            1,
            0.2,
            1,
            0.5,
            1,
          ],
        }}

        transition={{
          delay: 72,
          duration: 12,
        }}

        className="
          absolute
          bottom-[9vh]
          left-1/2
          -translate-x-1/2
          w-[42vw]
          h-[4vh]
          bg-red-500/55
          blur-2xl
          rounded-full
          mix-blend-screen
          pointer-events-none
        "
      />

      {/* EXTRA FLICKER */}
      <motion.div
        initial={{ opacity: 0 }}

        animate={{
          opacity: [
            0,
            1,
            0.3,
            1,
            0.2,
            1,
          ],
        }}

        transition={{
          delay: 73,
          duration: 10,
        }}

        className="
          absolute
          bottom-[9vh]
          left-1/2
          -translate-x-1/2
          w-[34vw]
          h-[2vh]
          bg-red-300/40
          blur-xl
          mix-blend-color-dodge
          pointer-events-none
        "
      />

    </main>
  );
}