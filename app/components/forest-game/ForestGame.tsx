"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationGroup } from "@babylonjs/core";

type Props = { onClose: () => void };

export default function ForestGame({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef     = useRef<HTMLDivElement>(null);
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
        // Transparent so CSS background image shows through
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        scene.fogMode    = BABYLON.Scene.FOGMODE_EXP2;
        scene.fogDensity = 0.022;
        scene.fogColor   = new BABYLON.Color3(0.02, 0.04, 0.02);

        // ── Lighting ──────────────────────────────────────────────────────
        const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
        hemi.intensity    = 0.45;
        hemi.diffuse      = new BABYLON.Color3(0.55, 0.75, 0.5);
        hemi.groundColor  = new BABYLON.Color3(0.06, 0.08, 0.05);

        const sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-0.4, -1, 0.6), scene);
        sun.intensity = 0.8;
        sun.diffuse   = new BABYLON.Color3(0.8, 0.9, 0.75);

        // ── Ground ────────────────────────────────────────────────────────
        const ground = BABYLON.MeshBuilder.CreateGround(
          "ground",
          { width: 400, height: 20, subdivisions: 1 },
          scene
        );
        const gMat = new BABYLON.StandardMaterial("gMat", scene);
        gMat.diffuseColor  = new BABYLON.Color3(0.08, 0.06, 0.02);
        gMat.specularColor = BABYLON.Color3.Black();
        ground.material    = gMat;

        // ── 2.5D side camera ─────────────────────────────────────────────
        const camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 2.5, -9), scene);
        camera.setTarget(new BABYLON.Vector3(0, 1.2, 0));
        camera.inputs.clear();

        const camTarget = new BABYLON.Vector3(0, 1.2, 0);

        // ── Load character ────────────────────────────────────────────────
        const { meshes } = await BABYLON.SceneLoader.ImportMeshAsync(
          "",
          "/forest-game/",
          "animations.glb",
          scene
        );
        if (disposed) return;

        const charRoot = meshes[0];

        // ── Scale ─────────────────────────────────────────────────────────
        charRoot.computeWorldMatrix(true);
        const b0 = charRoot.getHierarchyBoundingVectors(true);
        const modelH = b0.max.y - b0.min.y;
        if (modelH > 0.01 && (modelH < 0.8 || modelH > 5)) {
          charRoot.scaling.setAll(2.0 / modelH);
        }
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
            const keys = ta.animation.getKeys();
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

        const playLoop = (g: AnimationGroup | undefined) =>
          g?.start(true, 1.0, g.from, g.to, false);

        if (idleGroup) playLoop(idleGroup);
        setStatus("ready");

        // ── Keyboard — X-axis only ────────────────────────────────────────
        const held: Record<string, boolean> = {};
        const MOVE = new Set(["ArrowLeft", "ArrowRight", "KeyA", "KeyD", "Space"]);
        const onKeyDown = (e: KeyboardEvent) => {
          held[e.code] = true;
          if (MOVE.has(e.code)) e.preventDefault();
        };
        const onKeyUp = (e: KeyboardEvent) => { held[e.code] = false; };
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup",   onKeyUp);
        cleanups.push(
          () => document.removeEventListener("keydown", onKeyDown),
          () => document.removeEventListener("keyup",   onKeyUp)
        );

        // ── Game loop ─────────────────────────────────────────────────────
        const SPEED   = 0.055;
        const GRAVITY = 0.012;
        const JUMP_V  = 0.22;
        const GROUND_Y = pivot.position.y;

        const jumpGroup = pick("jump", "leap", "hop");

        let walking = false;
        let jumping = false;
        let velY    = 0;

        scene.registerBeforeRender(() => {
          const goLeft  = held["ArrowLeft"]  || held["KeyA"];
          const goRight = held["ArrowRight"] || held["KeyD"];
          const moving  = goLeft || goRight;
          const jumpPress = held["Space"];

          // ── Jump ──────────────────────────────────────────────────────
          if (jumpPress && !jumping) {
            jumping = true;
            velY = JUMP_V;
            walkGroup?.stop();
            idleGroup?.stop();
            if (jumpGroup) playLoop(jumpGroup); else playLoop(walkGroup);
            held["Space"] = false;
          }

          // ── Gravity & landing ─────────────────────────────────────────
          if (jumping) {
            velY -= GRAVITY;
            pivot.position.y += velY;
            if (pivot.position.y <= GROUND_Y) {
              pivot.position.y = GROUND_Y;
              velY = 0;
              jumping = false;
              jumpGroup?.stop();
              if (moving) playLoop(walkGroup);
              else if (idleGroup) playLoop(idleGroup); else walkGroup?.stop();
            }
          }

          // ── Walk / idle ────────────────────────────────────────────────
          if (!jumping) {
            if (moving && !walking) {
              walking = true;
              idleGroup?.stop();
              playLoop(walkGroup);
            } else if (!moving && walking) {
              walking = false;
              walkGroup?.stop();
              if (idleGroup) playLoop(idleGroup);
            }
          }
          walking = moving && !jumping;

          // ── X-only movement ────────────────────────────────────────────
          const dx = (goRight ? 1 : 0) - (goLeft ? 1 : 0);
          if (moving) {
            pivot.position.x += dx * SPEED;
            pivot.rotation.y  = dx > 0 ? Math.PI : 0;
          }

          // ── Camera follows X ───────────────────────────────────────────
          camera.position.x = pivot.position.x;
          camTarget.x       = pivot.position.x;
          camera.setTarget(camTarget);

          // ── Parallax background ────────────────────────────────────────
          if (bgRef.current) {
            const offset = pivot.position.x * -15;
            bgRef.current.style.backgroundPosition = `calc(50% + ${offset}px) 50%`;
          }
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

        {/* Parallax background */}
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

        {/* Horizon fog overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 35%, rgba(4,8,3,0.25) 58%, rgba(4,8,3,0.55) 100%)",
          }}
        />

        {/* Babylon canvas — transparent bg */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

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
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 select-none font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">
            ← A &nbsp;&nbsp; D → &nbsp;&nbsp; Space ↑
          </p>
        )}
      </div>

    </div>
  );
}
