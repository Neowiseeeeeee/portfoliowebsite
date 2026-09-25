import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CinematicPreloaderProps {
  onComplete: () => void;
  targetRef?: React.RefObject<HTMLElement | null>;
}

interface PreloaderStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
}

export function CinematicPreloader({ onComplete, targetRef }: CinematicPreloaderProps) {
  // Stages:
  // 1. "birth": Stars & constellations awake, center NEOWISE fades in (1.2s)
  // 2. "comet": Bright comet arcs across the sky and lands directly on top of the "I" (1.8s)
  // 3. "crowned": Comet has landed, dot glows with intense cyan brilliance forming an "i" (1.0s)
  // 4. "flight": NEOWISE + glowing dot together fly directly into the navbar destination (1.1s)
  // 5. "dissolve": Backdrop veil dissolves, handing off to live workstation (0.6s)
  const [stage, setStage] = useState<"birth" | "comet" | "crowned" | "flight" | "dissolve">("birth");

  const [destOffset, setDestOffset] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 0.35,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const dotTargetRef = useRef<HTMLSpanElement>(null);

  // Comet state for canvas rendering
  const cometAnimRef = useRef({
    progress: 0, // 0 to 1
    tailHistory: [] as { x: number; y: number; opacity: number }[],
    targetX: 0,
    targetY: 0,
    startX: 0,
    startY: 0,
    isActive: false,
  });

  const completeCallback = useRef(onComplete);
  useEffect(() => {
    completeCallback.current = onComplete;
  }, [onComplete]);

  // Coordinate measurement for the flight to the navbar
  const measureDestination = useCallback(() => {
    if (targetRef?.current && centerTextRef.current) {
      const destBox = targetRef.current.getBoundingClientRect();
      const centerBox = centerTextRef.current.getBoundingClientRect();

      const startX = centerBox.left + centerBox.width / 2;
      const startY = centerBox.top + centerBox.height / 2;

      const endX = destBox.left + destBox.width / 2;
      const endY = destBox.top + destBox.height / 2;

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const targetScale =
        destBox.height > 0 && centerBox.height > 0
          ? destBox.height / centerBox.height
          : 0.35;

      setDestOffset({
        x: deltaX,
        y: deltaY,
        scale: Math.max(0.28, Math.min(0.48, targetScale)),
      });
    } else {
      const fallbackX = -(window.innerWidth / 2 - 120);
      const fallbackY = -(window.innerHeight / 2 - 40);
      setDestOffset({
        x: fallbackX,
        y: fallbackY,
        scale: 0.35,
      });
    }
  }, [targetRef]);

  // Canvas loop for background constellations and the shooting comet
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate constellation stars
    const starCount = Math.min(100, Math.floor((width * height) / 10000));
    const stars: PreloaderStar[] = [];
    const colors = ["255, 255, 255", "147, 197, 253", "103, 232, 249", "167, 139, 250"];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let cometStartTime: number | null = null;
    const COMET_DURATION = 1800; // 1.8 seconds to travel smoothly

    function render(timestamp: number) {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Constellation Stars & connecting subtle lines
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        // Twinkle
        const currentAlpha = Math.sin(timestamp * s.twinkleSpeed) * 0.25 + s.alpha;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${Math.max(0.1, currentAlpha)})`;
        ctx.fill();

        // Connect nearby stars with faint celestial lines
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dist = Math.hypot(s.x - s2.x, s.y - s2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = `rgba(103, 232, 249, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // 2. Animate Shooting Comet
      const c = cometAnimRef.current;
      if (c.isActive) {
        if (!cometStartTime) cometStartTime = timestamp;
        const elapsed = timestamp - cometStartTime;
        c.progress = Math.min(1, elapsed / COMET_DURATION);

        // Smooth cubic ease-out trajectory so it smoothly glides directly into the exact landing spot
        const t = c.progress;
        const easeT = 1 - Math.pow(1 - t, 3);

        const currentX = c.startX + (c.targetX - c.startX) * easeT;
        const currentY = c.startY + (c.targetY - c.startY) * easeT;

        // Add tail particle
        c.tailHistory.unshift({ x: currentX, y: currentY, opacity: 1 });
        if (c.tailHistory.length > 28) {
          c.tailHistory.pop();
        }

        // Draw luminous tail - tail gradually dissipates as comet reaches destination
        const tailFade = 1 - Math.pow(t, 2) * 0.7;
        for (let i = 0; i < c.tailHistory.length; i++) {
          const p = c.tailHistory[i];
          const tailRatio = 1 - i / c.tailHistory.length;
          const tailWidth = (tailRatio * 5) + 0.5;

          ctx.beginPath();
          ctx.arc(p.x, p.y, tailWidth, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${tailRatio * 0.65 * tailFade})`;
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 15;
          ctx.fill();
        }

        // Draw bright comet head with cyan plasma core
        ctx.shadowColor = "#67e8f9";
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(103, 232, 249, 0.45)";
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Main Choreography Timeline
  useEffect(() => {
    // Stage 1: "birth" (0s - 1.2s) — center reveals NEOWISE with cosmic backdrop
    const tComet = window.setTimeout(() => {
      // Read the exact real-time pixel coordinates of the dot mount container
      if (dotTargetRef.current) {
        const dotBox = dotTargetRef.current.getBoundingClientRect();
        const targetX = dotBox.left + dotBox.width / 2;
        const targetY = dotBox.top + dotBox.height / 2;

        cometAnimRef.current.targetX = targetX;
        cometAnimRef.current.targetY = targetY;
        // Start high up in the sky to the right
        cometAnimRef.current.startX = targetX + Math.min(window.innerWidth * 0.45, 420);
        cometAnimRef.current.startY = Math.max(20, targetY - 320);
        cometAnimRef.current.isActive = true;
      }
      setStage("comet");
    }, 1200);

    // Stage 2 to 3: Comet completes its arc after 1.8s, lands and locks in as the dot
    const tCrowned = window.setTimeout(() => {
      cometAnimRef.current.isActive = false; // comet canvas head rests, React crown takes over at exact same coordinates
      setStage("crowned");
    }, 1200 + 1800); // 3.0s

    // Stage 4: "flight" (3.9s) — NEOWISE with glowing dot lifts off and glides to navbar
    const tFlight = window.setTimeout(() => {
      measureDestination();
      setStage("flight");
    }, 3900);

    // Stage 5: "dissolve" (5.0s) — curtain dissolves into workstation
    const tDissolve = window.setTimeout(() => {
      setStage("dissolve");
    }, 5000);

    // Complete & unmount (5.6s)
    const tComplete = window.setTimeout(() => {
      completeCallback.current();
    }, 5600);

    return () => {
      window.clearTimeout(tComet);
      window.clearTimeout(tCrowned);
      window.clearTimeout(tFlight);
      window.clearTimeout(tDissolve);
      window.clearTimeout(tComplete);
    };
  }, [measureDestination]);

  const isCrowned = stage === "crowned" || stage === "flight" || stage === "dissolve";
  const isMoving = stage === "flight" || stage === "dissolve";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === "dissolve" ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-[#03060f] overflow-hidden"
    >
      {/* Dynamic Cosmic Constellation Canvas (active background during intro) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Atmospheric Nebula Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{
          opacity: isMoving ? 0.2 : 0.65,
          scale: isMoving ? 1.4 : 1,
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute w-[550px] h-[550px] rounded-full bg-gradient-to-r from-blue-700/25 via-cyan-500/20 to-indigo-600/25 blur-[130px] z-0"
      />

      {/* Pulsing Concentric Energy Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: stage === "birth" || stage === "comet" ? [0.6, 1.2] : 1.5,
            opacity: stage === "birth" || stage === "comet" ? [0, 0.35, 0.15] : 0,
          }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-cyan-400/20 absolute"
        />
      </div>

      {/* NEOWISE Typography with Times New Roman & The Comet Dot on "I" */}
      <motion.div
        ref={centerTextRef}
        initial={{
          opacity: 0,
          scale: 0.85,
          filter: "blur(12px)",
        }}
        animate={
          !isMoving
            ? {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                x: 0,
                y: 0,
                transition: { duration: 0.9, ease: "easeOut" },
              }
            : {
                opacity: stage === "dissolve" ? 0 : 1,
                x: destOffset.x,
                y: destOffset.y,
                scale: destOffset.scale,
                transition: {
                  duration: 1.05,
                  ease: [0.16, 1, 0.3, 1], // cinematic smooth arrival
                },
              }
        }
        className="relative select-none text-center transform origin-center z-10"
      >
        <div
          className="relative inline-flex items-baseline font-bold text-white text-5xl sm:text-7xl md:text-8xl uppercase drop-shadow-[0_0_35px_rgba(56,189,248,0.7)]"
          style={{
            fontFamily: '"Times New Roman", Times, serif',
          }}
        >
          <span className="tracking-[0.16em]">NEOW</span>

          {/* Letter "I" with permanently mounted anchor for the dot */}
          <span className="relative inline-flex flex-col items-center justify-center tracking-normal px-1">
            {/* The designated dot container anchor (read directly by comet physics) */}
            <span
              ref={dotTargetRef}
              className="absolute -top-3.5 sm:-top-5 md:-top-6 left-1/2 -translate-x-1/2 w-4 h-4 flex items-center justify-center pointer-events-none"
            >
              {/* Only the glow activates when crowned - zero coordinate pop or shift */}
              {isCrowned && (
                <div className="relative flex items-center justify-center">
                  {/* Outer pulsating aurora glow */}
                  <motion.span
                    animate={{
                      scale: [1, 1.45, 1],
                      opacity: [0.65, 1, 0.65],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-cyan-400/40 blur-[5px]"
                  />
                  {/* Radiant cyan halo */}
                  <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-cyan-300 shadow-[0_0_16px_#38bdf8] flex items-center justify-center">
                    {/* Hot white starburst nucleus */}
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                  </span>
                </div>
              )}
            </span>

            {/* The vertical letter stem */}
            <span className="leading-none">I</span>
          </span>

          <span className="tracking-[0.16em] ml-1">SE</span>
        </div>

        {/* Dynamic Status / Subtitle during comet sequence */}
        <AnimatePresence>
          {!isMoving && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.75, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-xs sm:text-sm tracking-[0.35em] text-cyan-300 font-mono mt-4 uppercase flex items-center justify-center gap-2"
            >
              {stage === "birth" && <span>Aligning Celestial Coordinates...</span>}
              {stage === "comet" && (
                <span className="text-cyan-200 animate-pulse">
                  Comet Inbound · Vector Intercept
                </span>
              )}
              {stage === "crowned" && (
                <span className="text-emerald-300 font-semibold drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                  Vector Locked · Initializing System
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
