"use client";

import { useEffect, useRef, useState } from "react";

type Scene =
  | "arrival"
  | "left"
  | "right"
  | "approach"
  | "door";

export default function Gatenheim() {
  const [scene, setScene] = useState<Scene>("arrival");
  const [audioStarted, setAudioStarted] = useState(false);

  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const weatherRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioStarted) return;

    ambienceRef.current = new Audio(
      "/gathenhielmskamedia/bakgrund.mp3"
    );

    weatherRef.current = new Audio(
      "/gathenhielmskamedia/väder.mp3"
    );

    ambienceRef.current.loop = true;
    weatherRef.current.loop = true;

    ambienceRef.current.volume = 0.45;
    weatherRef.current.volume = 0.25;

    ambienceRef.current.play().catch(() => {});
    weatherRef.current.play().catch(() => {});

    return () => {
      ambienceRef.current?.pause();
      weatherRef.current?.pause();
    };
  }, [audioStarted]);

  const startAudio = () => {
    if (!audioStarted) {
      setAudioStarted(true);
    }
  };

  const playRightSound = () => {
    const audio = new Audio(
      "/gathenhielmskamedia/höger1.mp3"
    );

    audio.volume = 0.5;

    audio.play();
  };

  const tryDoor = () => {
    const audio = new Audio(
      "/gathenhielmskamedia/låstdör.mp3"
    );

    audio.volume = 0.7;

    audio.play();
  };

  const getSceneImage = () => {
    switch (scene) {
      case "left":
        return "/gathenhielmskamedia/left.jpeg";

      case "right":
        return "/gathenhielmskamedia/right.jpeg";

      case "approach":
        return "/gathenhielmskamedia/approach-manor.jpeg";

      case "door":
        return "/gathenhielmskamedia/door-close.jpeg";

      default:
        return "/gathenhielmskamedia/arrival-posetiv.jpeg";
    }
  };

  return (
    <main
      className="
        relative
        h-screen
        w-screen
        overflow-hidden
        bg-black
      "
    >

      {/* SCENE IMAGE */}
      <img
        src={getSceneImage()}
        alt="Gatenheim"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          transition-opacity
          duration-700
        "
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/25" />

      {/* BACK TO HOME */}
      <a
        href="/"
        className="absolute left-6 top-6 z-50 border border-white/20 bg-black/40 px-6 py-3 font-mono text-xs uppercase tracking-[0.35em] text-white/70 backdrop-blur-sm transition hover:border-[#ff4d4d]/40 hover:text-white"
      >
        ← Back
      </a>

      {/* LIGHT FLICKER */}
      {scene === "door" && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            animate-pulse
            bg-[radial-gradient(circle_at_center,rgba(255,190,100,0.14),transparent_55%)]
            opacity-70
            mix-blend-screen
          "
        />
      )}

      {/* TITLE */}
      <div className="absolute left-8 top-8 z-20">

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
          Gatenhielmska
        </p>

        <h1
          className="
            text-3xl
            font-black
            uppercase
            text-white
            md:text-5xl
          "
        >
          The Manor Beyond The Fog
        </h1>

      </div>

      {/* ARRIVAL */}
      {scene === "arrival" && (
        <>

          {/* LEFT */}
          <button
            onClick={() => {
              startAudio();
              setScene("left");
            }}
            className="
              absolute
              left-0
              top-0
              z-10
              h-full
              w-1/3
              cursor-pointer
            "
          />

          {/* RIGHT */}
          <button
            onClick={() => {
              startAudio();
              playRightSound();
              setScene("right");
            }}
            className="
              absolute
              right-0
              top-0
              z-10
              h-full
              w-1/3
              cursor-pointer
            "
          />

          {/* APPROACH */}
          <button
            onClick={() => {
              startAudio();
              setScene("approach");
            }}
            className="
              absolute
              left-1/2
              top-1/2
              z-10
              h-48
              w-96
              -translate-x-1/2
              -translate-y-1/2
              cursor-pointer
            "
          />

        </>
      )}

      {/* APPROACH */}
      {scene === "approach" && (
        <button
          onClick={() => {
            startAudio();
            setScene("door");
          }}
          className="
            absolute
            left-1/2
            top-1/2
            z-10
            h-[500px]
            w-[420px]
            -translate-x-1/2
            -translate-y-1/2
            cursor-pointer
          "
        />
      )}

      {/* DOOR */}
      {scene === "door" && (
        <button
          onClick={() => {
            startAudio();
            tryDoor();
          }}
          className="
            absolute
            left-1/2
            top-1/2
            z-20
            h-[500px]
            w-[300px]
            -translate-x-1/2
            -translate-y-1/2
            cursor-pointer
          "
        />
      )}

      {/* RETURN */}
      {scene !== "arrival" && (
        <button
          onClick={() => {
            if (scene === "door") {
              setScene("approach");
              return;
            }

            if (scene === "approach") {
              setScene("arrival");
              return;
            }

            setScene("arrival");
          }}
          className="
            absolute
            bottom-10
            left-1/2
            z-30
            -translate-x-1/2
            border
            border-white/20
            bg-black/40
            px-6
            py-3
            font-mono
            text-xs
            uppercase
            tracking-[0.35em]
            text-white/70
            backdrop-blur-sm
            transition
            hover:border-[#ff4d4d]/40
            hover:text-white
          "
        >
          Return
        </button>
      )}

    </main>
  );
}   