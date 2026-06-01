"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationGroup } from "@babylonjs/core";

type Props = { onClose: () => void };

// ── Foreground tree silhouettes ───────────────────────────────────────────────
// Pre-computed at module level (never re-run on render).

const SVG_H = 500; // SVG canvas height in px
const GND   = 490; // tree root y within the SVG

function pine(cx: number, h: number, w: number): string {
  const b = GND;
  return [
    `M${cx},${b}`,
    `L${r(cx - w * .50)},${r(b - h * .35)}`,
    `L${r(cx - w * .30)},${r(b - h * .35)}`,
    `L${r(cx - w * .38)},${r(b - h * .65)}`,
    `L${r(cx - w * .18)},${r(b - h * .65)}`,
    `L${cx},${r(b - h)}`,
    `L${r(cx + w * .18)},${r(b - h * .65)}`,
    `L${r(cx + w * .38)},${r(b - h * .65)}`,
    `L${r(cx + w * .30)},${r(b - h * .35)}`,
    `L${r(cx + w * .50)},${r(b - h * .35)}`,
    "Z",
  ].join(" ");
}

function bare(cx: number, h: number, w: number): string {
  const b = GND;
  const s = w / 2;
  return [
    `M${cx - 5},${b}`,
    `L${cx - 5},${r(b - h * .55)}`,
    `L${r(cx - s - 5)},${r(b - h * .88)}`,
    `L${r(cx - s + 8)},${r(b - h * .88)}`,
    `L${cx - 5},${r(b - h * .63)}`,
    `L${cx},${r(b - h)}`,
    `L${cx + 5},${r(b - h * .63)}`,
    `L${r(cx + s - 8)},${r(b - h * .88)}`,
    `L${r(cx + s + 5)},${r(b - h * .88)}`,
    `L${cx + 5},${r(b - h * .55)}`,
    `L${cx + 5},${b}`,
    "Z",
  ].join(" ");
}

function r(n: number) { return Math.round(n); }

const TREES: Array<{ f: "pine" | "bare"; cx: number; h: number; w: number }> = [
  { f: "pine", cx:  150, h: 290, w: 150 }, { f: "bare", cx:  350, h: 240, w:  85 },
  { f: "pine", cx:  560, h: 340, w: 180 }, { f: "bare", cx:  760, h: 210, w:  75 },
  { f: "pine", cx:  960, h: 275, w: 145 }, { f: "bare", cx: 1150, h: 250, w:  88 },
  { f: "pine", cx: 1330, h: 315, w: 165 }, { f: "bare", cx: 1530, h: 230, w:  80 },
  { f: "pine", cx: 1720, h: 365, w: 190 }, { f: "bare", cx: 1940, h: 260, w:  92 },
  { f: "pine", cx: 2130, h: 295, w: 155 }, { f: "bare", cx: 2320, h: 245, w:  86 },
  { f: "pine", cx: 2510, h: 325, w: 170 }, { f: "bare", cx: 2710, h: 220, w:  78 },
  { f: "pine", cx: 2900, h: 285, w: 148 }, { f: "bare", cx: 3080, h: 255, w:  90 },
  { f: "pine", cx: 3270, h: 355, w: 185 }, { f: "bare", cx: 3480, h: 240, w:  83 },
  { f: "pine", cx: 3660, h: 300, w: 158 }, { f: "bare", cx: 3860, h: 265, w:  93 },
  { f: "pine", cx: 4050, h: 340, w: 175 }, { f: "bare", cx: 4250, h: 235, w:  82 },
  { f: "pine", cx: 4430, h: 280, w: 147 }, { f: "bare", cx: 4630, h: 250, w:  88 },
  { f: "pine", cx: 4820, h: 320, w: 167 }, { f: "bare", cx: 5020, h: 228, w:  78 },
  { f: "pine", cx: 5200, h: 310, w: 162 }, { f: "bare", cx: 5400, h: 260, w:  90 },
  { f: "pine", cx: 5590, h: 345, w: 180 }, { f: "bare", cx: 5800, h: 238, w:  82 },
  { f: "pine", cx: 5960, h: 285, w: 150 },
];

const treePaths = TREES.map((t) =>
  t.f === "pine" ? pine(t.cx, t.h, t.w) : bare(t.cx, t.h, t.w)
);

// ─────────────────────────────────────────────────────────────────────────────

export default function ForestGame({ onClose }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const bgRef      = useRef<HTMLDivElement>(null);
  const fgRef      = useRef<HTMLDivElement>(null);
  const musicRef   = useRef<HTMLAudioElement | null>(null);
  const howlTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      try {
        const BABYLON = await import("@babylonjs/core");
        await import("@babylonjs/loaders/glTF");
        if (disposed) return;

        // ── Engine & scene ────────────────────────────────────────────────
        const engine = new BABYLON.Engine(canvas, true, { adaptToDeviceRatio: true });
        cleanups.push(() => engine.dispose());

        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // transparent → CSS bg shows
        scene.fogMode    = BABYLON.Scene.FOGMODE_EXP2;
        scene.fogDensity = 0.022;
        scene.fogColor   = new BABYLON.Color3(0.02, 0.04, 0.02);

        // ── Lighting ──────────────────────────────────────────────────────
        const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
        hemi.intensity   = 0.45;
        hemi.diffuse     = new BABYLON.Color3(0.55, 0.75, 0.5);
        hemi.groundColor = new BABYLON.Color3(0.06, 0.08, 0.05);

        const sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-0.4, -1, 0.6), scene);
        sun.intensity = 0.8;
        sun.diffuse   = new BABYLON.Color3(0.8, 0.9, 0.75);

        // ── Ground ────────────────────────────────────────────────────────
        const ground = BABYLON.MeshBuilder.CreateGround(
          "ground", { width: 400, height: 20, subdivisions: 1 }, scene
        );
        const gMat = new BABYLON.StandardMaterial("gMat", scene);
        gMat.diffuseColor  = new BABYLON.Color3(0.08, 0.06, 0.02);
        gMat.specularColor = BABYLON.Color3.Black();
        ground.material    = gMat;

        // ── 2.5D camera ───────────────────────────────────────────────────
        const camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 2.5, -9), scene);
        camera.setTarget(new BABYLON.Vector3(0, 1.2, 0));
        camera.inputs.clear();
        const camTarget = new BABYLON.Vector3(0, 1.2, 0);

        // ── Load character ────────────────────────────────────────────────
        const { meshes } = await BABYLON.SceneLoader.ImportMeshAsync(
          "", "/forest-game/", "animations.glb", scene
        );
        if (disposed) return;

        const charRoot = meshes[0];

        // ── Scale to ~2 units tall ────────────────────────────────────────
        charRoot.computeWorldMatrix(true);
        const b0     = charRoot.getHierarchyBoundingVectors(true);
        const modelH = b0.max.y - b0.min.y;
        if (modelH > 0.01 && (modelH < 0.8 || modelH > 5)) charRoot.scaling.setAll(2.0 / modelH);
        charRoot.computeWorldMatrix(true);
        const b1 = charRoot.getHierarchyBoundingVectors(true);
        charRoot.position.y = b1.min.y < 0 ? -b1.min.y : 0;

        // ── Facing pivot ──────────────────────────────────────────────────
        const pivot = new BABYLON.TransformNode("pivot", scene);
        charRoot.parent  = pivot;
        pivot.rotation.y = 0;

        // ── Strip root-motion XZ ──────────────────────────────────────────
        for (const group of scene.animationGroups) {
          for (const ta of group.targetedAnimations) {
            if (ta.animation.targetProperty !== "position") continue;
            const keys  = ta.animation.getKeys();
            const hasXZ = keys.some(
              (k) => k.value != null &&
                (Math.abs(k.value.x ?? 0) > 0.001 || Math.abs(k.value.z ?? 0) > 0.001)
            );
            if (!hasXZ) continue;
            for (const k of keys) { k.value.x = 0; k.value.z = 0; }
            ta.animation.setKeys(keys);
          }
        }

        // ── Animation groups ──────────────────────────────────────────────
        const groups = scene.animationGroups;
        groups.forEach((g) => g.stop());

        const pick = (...terms: string[]): AnimationGroup | undefined =>
          terms.reduce<AnimationGroup | undefined>(
            (hit, t) => hit ?? groups.find((g) => g.name.toLowerCase().includes(t.toLowerCase())),
            undefined
          );

        const idleGroup = pick("idle", "stand", "rest", "a-pose", "t-pose", "bind");
        const walkGroup = pick("walk", "run", "jog", "move", "locomotion") ?? groups[0];
        const jumpGroup = pick("jump", "leap", "hop");

        const playLoop = (g: AnimationGroup | undefined) =>
          g?.start(true, 1.0, g.from, g.to, false);

        if (idleGroup) playLoop(idleGroup);
        setStatus("ready");

        // ── Soundtrack ────────────────────────────────────────────────────
        const music = new Audio("/forest-game/560444__migfus20__mysterious-background-music-orchestra.mp3");
        music.loop   = true;
        music.volume = 0.4;
        musicRef.current = music;
        music.play().catch(() => {});
        cleanups.push(() => { music.pause(); music.src = ""; });

        // ── Wolf howl — random interval 15–45 s ───────────────────────────
        const scheduleHowl = () => {
          const delay = 15000 + Math.random() * 30000;
          howlTimer.current = setTimeout(() => {
            if (disposed) return;
            const howl = new Audio("/forest-game/810171__mokasza__lone-wolf-howling.mp3");
            howl.volume = 0.6;
            howl.play().catch(() => {});
            scheduleHowl();
          }, delay);
        };
        scheduleHowl();
        cleanups.push(() => { if (howlTimer.current) clearTimeout(howlTimer.current); });

        // ── Keyboard ──────────────────────────────────────────────────────
        const held: Record<string, boolean> = {};
        const MOVE = new Set([
          "ArrowLeft", "ArrowRight", "KeyA", "KeyD",
          "ArrowUp", "ArrowDown", "KeyW", "KeyS",
          "Space",
        ]);
        const onKeyDown = (e: KeyboardEvent) => { held[e.code] = true;  if (MOVE.has(e.code)) e.preventDefault(); };
        const onKeyUp   = (e: KeyboardEvent) => { held[e.code] = false; };
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup",   onKeyUp);
        cleanups.push(
          () => document.removeEventListener("keydown", onKeyDown),
          () => document.removeEventListener("keyup",   onKeyUp)
        );

        // ── Game loop constants ───────────────────────────────────────────
        const SPEED    = 0.055;
        const SPEED_Z  = 0.04;
        const Z_LIMIT  = 2;      // ±2 units → 3 visible depth zones
        const GRAVITY  = 0.012;
        const JUMP_V   = 0.22;
        const FLOOR_Y  = pivot.position.y;

        let walking = false;
        let jumping = false;
        let velY    = 0;

        scene.registerBeforeRender(() => {
          const goLeft    = held["ArrowLeft"]  || held["KeyA"];
          const goRight   = held["ArrowRight"] || held["KeyD"];
          const goFwd     = held["ArrowUp"]    || held["KeyW"]; // into screen
          const goBack    = held["ArrowDown"]  || held["KeyS"]; // toward camera
          const moving    = goLeft || goRight || goFwd || goBack;
          const jumpPress = held["Space"];

          // ── Jump ────────────────────────────────────────────────────────
          if (jumpPress && !jumping) {
            jumping = true;
            velY    = JUMP_V;
            walkGroup?.stop(); idleGroup?.stop();
            if (jumpGroup) playLoop(jumpGroup); else playLoop(walkGroup);
            held["Space"] = false;
          }

          // ── Gravity & landing ────────────────────────────────────────────
          if (jumping) {
            velY -= GRAVITY;
            pivot.position.y += velY;
            if (pivot.position.y <= FLOOR_Y) {
              pivot.position.y = FLOOR_Y;
              velY    = 0;
              jumping = false;
              jumpGroup?.stop();
              if (moving) playLoop(walkGroup);
              else if (idleGroup) playLoop(idleGroup); else walkGroup?.stop();
            }
          }

          // ── Walk / idle ──────────────────────────────────────────────────
          if (!jumping) {
            if (moving && !walking)      { walking = true;  idleGroup?.stop(); playLoop(walkGroup); }
            else if (!moving && walking) { walking = false; walkGroup?.stop(); if (idleGroup) playLoop(idleGroup); }
          }
          walking = moving && !jumping;

          // ── Movement ─────────────────────────────────────────────────────
          const dx = (goRight ? 1 : 0) - (goLeft ? 1 : 0);
          const dz = (goFwd   ? 1 : 0) - (goBack ? 1 : 0);

          if (moving) {
            pivot.position.x += dx * SPEED;
            pivot.position.z  = Math.max(-Z_LIMIT, Math.min(Z_LIMIT, pivot.position.z + dz * SPEED_Z));
            if (goLeft || goRight) pivot.rotation.y = Math.atan2(dx, 0);
          }

          // ── Depth scale: 0.85 (back) → 1.15 (front) ─────────────────────
          pivot.scaling.setAll(1.0 - (pivot.position.z / Z_LIMIT) * 0.15);

          // ── Camera tracks X ───────────────────────────────────────────────
          camera.position.x = pivot.position.x;
          camTarget.x       = pivot.position.x;
          camera.setTarget(camTarget);

          // ── Parallax ─────────────────────────────────────────────────────
          const bgOffset = pivot.position.x * -15;
          const fgOffset = bgOffset * 1.8;

          // Subtle Y-shift on background when moving in Z (perspective illusion)
          const bgY = 50 + (pivot.position.z / Z_LIMIT) * 4; // ±4% vertical shift

          if (bgRef.current)
            bgRef.current.style.backgroundPosition = `calc(50% + ${bgOffset}px) ${bgY}%`;
          if (fgRef.current)
            fgRef.current.style.transform = `translateX(calc(-50% + ${fgOffset}px))`;
        });

        engine.runRenderLoop(() => { if (!disposed) scene.render(); });

        const onResize = () => engine.resize();
        window.addEventListener("resize", onResize);
        cleanups.push(() => window.removeEventListener("resize", onResize));

      } catch (err) {
        console.error("[ForestGame]", err);
        if (!disposed) setStatus("error");
      }
    })();

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">

      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-6 py-4">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.4em] text-[#4aff8c]/60">
            Arkadhallen
          </p>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white">
            Forest of the Broken Brains
          </h1>
        </div>
        <button
          onClick={onClose}
          className="border border-white/20 bg-black/40 px-5 py-2 font-mono text-xs uppercase tracking-[0.35em] text-white/60 backdrop-blur-sm transition hover:border-[#ff4d4d]/40 hover:text-white"
        >
          Exit
        </button>
      </div>

      {/* Scene */}
      <div className="relative flex-1 overflow-hidden">

        {/* 1. Parallax background image */}
        <div
          ref={bgRef}
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/forest-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "50% 50%",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* 2. Horizon fog overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 35%, rgba(4,8,3,0.25) 58%, rgba(4,8,3,0.55) 100%)",
          }}
        />

        {/* 3. Babylon canvas — transparent so background shows through */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* 4. Ground fog — thick gradient at the bottom */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            height: "32%",
            background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.70))",
          }}
        />

        {/* 5. Foreground tree silhouettes — scrolls 1.8× faster than background */}
        <div
          ref={fgRef}
          className="pointer-events-none absolute bottom-0"
          style={{ left: "50%", transform: "translateX(-50%)", width: "6000px" }}
        >
          <svg viewBox={`0 0 6000 ${SVG_H}`} width="6000" height={SVG_H} style={{ display: "block" }}>
            {treePaths.map((d, i) => (
              <path key={i} d={d} fill="#020502" />
            ))}
          </svg>
        </div>

        {/* Status overlays */}
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <p className="animate-pulse font-mono text-sm uppercase tracking-[0.35em] text-[#4aff8c]/70">
              Loading Forest...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <p className="font-mono text-sm uppercase tracking-[0.35em] text-[#ff4d4d]/80">
              Failed to load scene
            </p>
          </div>
        )}

        {status === "ready" && (
          <>
            {/* Keyboard hint — desktop only */}
            <p className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 select-none font-mono text-[10px] uppercase tracking-[0.3em] text-white/25 sm:block">
              ← A &nbsp; D → &nbsp;&nbsp; W / S &nbsp;&nbsp; Space ↑
            </p>

            {/* Touch D-pad — mobile only */}
            <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex items-end justify-between px-4 sm:hidden">
              {/* Left cluster: directional */}
              <div className="pointer-events-auto grid grid-cols-3 gap-1" style={{ gridTemplateAreas: `". up ." "left . right" ". down ."` }}>
                {([
                  { code: "ArrowUp",    label: "↑", area: "up" },
                  { code: "ArrowLeft",  label: "←", area: "left" },
                  { code: "ArrowRight", label: "→", area: "right" },
                  { code: "ArrowDown",  label: "↓", area: "down" },
                ] as const).map(({ code, label, area }) => (
                  <button
                    key={code}
                    style={{ gridArea: area }}
                    onPointerDown={(e) => { e.preventDefault(); document.dispatchEvent(new KeyboardEvent("keydown", { code, bubbles: true })); }}
                    onPointerUp={() => document.dispatchEvent(new KeyboardEvent("keyup", { code, bubbles: true }))}
                    onPointerLeave={() => document.dispatchEvent(new KeyboardEvent("keyup", { code, bubbles: true }))}
                    className="flex h-12 w-12 items-center justify-center border border-white/20 bg-black/50 font-mono text-lg text-white/70 backdrop-blur-sm active:bg-white/10"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Right cluster: jump */}
              <button
                onPointerDown={(e) => { e.preventDefault(); document.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true })); }}
                onPointerUp={() => document.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }))}
                onPointerLeave={() => document.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }))}
                className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#4aff8c]/30 bg-black/50 font-mono text-xs uppercase tracking-widest text-[#4aff8c]/70 backdrop-blur-sm active:bg-[#4aff8c]/10"
              >
                ↑
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
