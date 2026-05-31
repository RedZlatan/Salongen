"use client";

import { useEffect, useState } from "react";
import ForestGame from "../components/forest-game/ForestGame";

type Scene =
  | "entrance"
  | "aroma"
  | "confession"
  | "observer"
  | "lockeleftfromaroma";

export default function ArcadePage() {
  const [scene, setScene] =
    useState<Scene>("entrance");

  const [hasToken, setHasToken] =
    useState(false);

  const [confession, setConfession] =
    useState("");

  const [response, setResponse] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [cameraActive, setCameraActive] =
    useState(false);

  const [forestOpen, setForestOpen] =
    useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem(
        "salongenToken1"
      );

    if (token === "true") {
      setHasToken(true);
    }

    const audio = new Audio(
      "/arcade/arcadesound.mp3"
    );

    audio.loop = true;
    audio.volume = 0.35;

    audio.play().catch(() => {});

    return () => {
      audio.pause();
    };
  }, []);

  const getSceneImage = () => {
    switch (scene) {
      case "aroma":
        return "/arcade/aromaclose.jpeg";

      case "lockeleftfromaroma":
        return "/arcade/lockeleftfromaroma.jpeg";

      case "confession":
        return "/arcade/blank-confession.jpeg";

      case "observer":
        return "/arcade/observer-blank.jpeg";

      default:
        return "/arcade/entrance.jpeg";
    }
  };

  const startAroma = () => {
    if (!hasToken) {
      const error = new Audio(
        "/arcade/dooropen.mp3"
      );

      error.volume = 0.1;

      error.play();

      return;
    }

    window.location.href = "/aroma";
  };

  const handleConfession =
    async () => {
      if (!confession.trim())
        return;

      setLoading(true);
      setResponse("");

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
        h-screen
        w-screen
        overflow-hidden
        bg-black
      "
    >

      {/* BACKGROUND */}
      <img
        src={getSceneImage()}
        alt="Arcade"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/20" />

      {/* CRT */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-screen">
        <div className="h-full w-full bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.08)_51%)] bg-[length:100%_4px]" />
      </div>

      {/* TITLE */}
      <div
        className="
          absolute
          left-8
          top-8
          z-20
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
          Själslig Arkadhall
        </p>

        <h1
          className="
            text-4xl
            font-black
            uppercase
            text-white
            md:text-6xl
          "
        >
          Arcade
        </h1>

      </div>

      {/* ENTRANCE */}
      {scene === "entrance" && (
        <>

          {/* AROMA */}
          <button
            onClick={() =>
              setScene("aroma")
            }
            className="
              absolute
              left-1/2
              top-1/2
              z-20
              h-[500px]
              w-[500px]
              -translate-x-1/2
              -translate-y-1/2
              cursor-pointer
            "
          />

          {/* CONFESSION */}
          <button
            onClick={() =>
              setScene("confession")
            }
            className="
              absolute
              right-[7%]
              top-[14%]
              z-20
              h-[620px]
              w-[240px]
              cursor-pointer
            "
          />

          {/* LEAVE */}
          <button
            onClick={() => {
              window.location.href =
                "/";
            }}
            className="
              absolute
              bottom-10
              left-8
              z-30
              border
              border-white/20
              bg-black/40
              px-5
              py-3
              font-mono
              text-xs
              uppercase
              tracking-[0.35em]
              text-white/60
              backdrop-blur-sm
              transition
              hover:border-[#ff4d4d]/40
              hover:text-white
            "
          >
            Leave Arcade
          </button>

        </>
      )}

      {/* AROMA */}
      {scene === "aroma" && (
        <>

          {/* BEGIN */}
          <button
            onClick={startAroma}
            className="
              absolute
              left-1/2
              top-[72%]
              z-20
              h-20
              w-40
              -translate-x-1/2
              cursor-pointer
            "
          />

          {/* OBSERVER HOTSPOT */}
          <button
            onClick={() =>
              setScene("observer")
            }
            className="
              absolute
              right-[12%]
              top-[22%]
              z-20
              h-[360px]
              w-[180px]
              cursor-pointer
            "
          />

          {/* TURN LEFT */}
          <button
            onClick={() =>
              setScene("lockeleftfromaroma")
            }
            className="
              absolute
              bottom-10
              left-8
              z-30
              flex
              items-center
              gap-2
              border
              border-white/20
              bg-black/40
              px-5
              py-3
              font-mono
              text-xs
              uppercase
              tracking-[0.35em]
              text-white/60
              backdrop-blur-sm
              transition
              hover:border-[#4aff8c]/30
              hover:text-white
            "
          >
            ← Turn Left
          </button>

          {/* RETURN */}
          <button
            onClick={() =>
              setScene("entrance")
            }
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

        </>
      )}

      {/* LOCKE LEFT FROM AROMA */}
      {scene === "lockeleftfromaroma" && (
        <>

          {/* FOREST MACHINE HOTSPOT */}
          <button
            onClick={() => setForestOpen(true)}
            className="
              absolute
              left-1/2
              top-1/2
              z-20
              h-[480px]
              w-[320px]
              -translate-x-1/2
              -translate-y-1/2
              cursor-pointer
              group
            "
            aria-label="Forest of the Broken Brains"
          >
            <span
              className="
                absolute
                bottom-[-2.5rem]
                left-1/2
                -translate-x-1/2
                whitespace-nowrap
                font-mono
                text-[10px]
                uppercase
                tracking-[0.35em]
                text-[#4aff8c]/0
                transition-all
                duration-300
                group-hover:text-[#4aff8c]/70
              "
            >
              Forest of the Broken Brains
            </span>
          </button>

          {/* RETURN */}
          <button
            onClick={() => setScene("aroma")}
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

        </>
      )}

      {/* CONFESSION */}
      {scene === "confession" && (
        <>

          {/* INPUT */}
          <textarea
            value={confession}
            onChange={(e) =>
              setConfession(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();
                handleConfession();
              }
            }}
            className="
              absolute
              bottom-[12.5%]
              left-1/2
              z-30
              h-[75px]
              w-[320px]
              -translate-x-1/2
              resize-none
              bg-transparent
              p-0
              font-mono
              text-sm
              uppercase
              tracking-[0.15em]
              text-transparent
              outline-none
            "
          />

          {/* TEXT */}
          <div
            className="
              absolute
              bottom-[14.5%]
              left-1/2
              z-20
              w-[300px]
              -translate-x-1/2
              font-mono
              text-sm
              uppercase
              tracking-[0.12em]
              text-[#ff6b6b]
              opacity-80
            "
          >
            {confession}

            <span
              className="
                ml-1
                inline-block
                animate-pulse
                text-[#ff6b6b]
              "
            >
              |
            </span>
          </div>

          {/* RESPONSE */}
          {(response || loading) && (
            <div
              className="
                absolute
                left-1/2
                top-[46%]
                z-30
                w-[260px]
                -translate-x-1/2
                text-center
                font-mono
                text-lg
                uppercase
                leading-relaxed
                tracking-[0.08em]
                text-[#ff6b6b]
                drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]
              "
            >
              {loading
                ? "THE MACHINE LISTENS..."
                : response}
            </div>
          )}

          {/* CONFESS */}
          <button
            onClick={handleConfession}
            className="
              absolute
              bottom-[11%]
              left-[58%]
              z-30
              h-16
              w-28
              -translate-x-1/2
              cursor-pointer
            "
          />

          {/* RETURN */}
          <button
            onClick={() => {
              setScene("entrance");
              setResponse("");
              setConfession("");
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

        </>
      )}

      {/* OBSERVER */}
      {scene === "observer" && (
        <>

          {/* ACTIVATE */}
          <button
            onClick={async () => {
              try {
                await navigator.mediaDevices.getUserMedia(
                  {
                    video: true,
                  }
                );

                setCameraActive(
                  true
                );
              } catch (err) {
                console.log(err);
              }
            }}
            className="
              absolute
              bottom-[14%]
              left-1/2
              z-30
              h-20
              w-72
              -translate-x-1/2
              cursor-pointer
            "
          />

          {/* CAMERA */}
          {cameraActive && (
            <video
              autoPlay
              playsInline
              ref={(video) => {
                if (
                  video &&
                  !video.srcObject
                ) {
                  navigator.mediaDevices
                    .getUserMedia({
                      video: true,
                    })
                    .then((stream) => {
                      video.srcObject =
                        stream;
                    });
                }
              }}
              className="
                absolute
                left-1/2
                top-[26%]
                z-20
                h-[420px]
                w-[520px]
                -translate-x-1/2
                rounded-[30px]
                object-cover
                opacity-90
                contrast-125
                grayscale
              "
            />
          )}

          {/* RETURN */}
          <button
            onClick={() => {
              setScene("aroma");
              setCameraActive(
                false
              );
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
              hover:border-[#4da6ff]/40
              hover:text-white
            "
          >
            Return
          </button>

        </>
      )}

      {/* FOREST GAME */}
      {forestOpen && (
        <ForestGame onClose={() => setForestOpen(false)} />
      )}

      {/* TOKEN */}
      <div
        className="
          absolute
          bottom-8
          right-8
          z-30
          font-mono
          text-xs
          uppercase
          tracking-[0.3em]
        "
      >

        {hasToken ? (
          <span className="text-[#ff5a5a]">
            Token Accepted
          </span>
        ) : (
          <span className="text-white/40">
            Token Required
          </span>
        )}

      </div>

    </main>
  );
}