import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  active: boolean;
}

const STAR_COLORS = [
  "255, 255, 255", // Pure white
  "147, 197, 253", // Ice blue
  "103, 232, 249", // Cyan starlight
  "167, 139, 250", // Soft nebula violet
  "253, 230, 138", // Warm golden star
];

export function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for celestial magnetism
    const mouse = { x: -1000, y: -1000, isOver: false };

    // Stars collection
    const starCount = Math.min(130, Math.floor((width * height) / 9500));
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        radius: Math.random() * 1.5 + 0.7,
        baseAlpha: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      });
    }

    // Periodic Neowise Comet
    const comet: Comet = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      length: 0,
      opacity: 0,
      active: false,
    };

    function triggerComet() {
      if (comet.active) return;
      comet.active = true;
      // Start near top or top-right
      comet.x = Math.random() * (width * 0.6) + width * 0.2;
      comet.y = Math.random() * (height * 0.25);
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3; // ~45 deg
      const speed = Math.random() * 6 + 7;
      comet.vx = -Math.cos(angle) * speed;
      comet.vy = Math.sin(angle) * speed;
      comet.length = Math.random() * 80 + 100;
      comet.opacity = 1;
    }

    // Trigger comet every 8 - 14 seconds
    const cometInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        triggerComet();
      }
    }, 9000);

    // Initial comet after 2.5s
    setTimeout(triggerComet, 2500);

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isOver = true;
    };
    const handleMouseLeave = () => {
      mouse.isOver = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Render loop
    let lastTime = performance.now();

    function render(currentTime: number) {
      if (!ctx) return;
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // 1. Clear & Draw Cosmic Backdrop
      // Deep space gradient: #040711 to #020308 with soft radial nebula
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        100,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, "#081021"); // Deep navy obsidian
      bgGrad.addColorStop(0.45, "#050914"); // Dark void
      bgGrad.addColorStop(1, "#020307"); // Pure abyss

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric aurora glows in outer margin areas
      const nebula1 = ctx.createRadialGradient(
        width * 0.15,
        height * 0.2,
        0,
        width * 0.15,
        height * 0.2,
        width * 0.4
      );
      nebula1.addColorStop(0, "rgba(14, 116, 144, 0.07)"); // Cyan glow
      nebula1.addColorStop(1, "rgba(14, 116, 144, 0)");
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(
        width * 0.85,
        height * 0.8,
        0,
        width * 0.85,
        height * 0.8,
        width * 0.45
      );
      nebula2.addColorStop(0, "rgba(88, 28, 135, 0.06)"); // Deep purple nebula
      nebula2.addColorStop(1, "rgba(88, 28, 135, 0)");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // 2. Update and draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Move star
        star.x += star.vx * (dt * 60);
        star.y += star.vy * (dt * 60);

        // Wrap edges smoothly
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Twinkle calculation
        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha =
          star.baseAlpha + Math.sin(star.twinklePhase) * 0.28;
        const clampedAlpha = Math.max(0.1, Math.min(1, currentAlpha));

        // Draw star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${clampedAlpha})`;
        ctx.fill();

        // Extra soft outer glow for brighter stars
        if (star.radius > 1.3) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color}, ${clampedAlpha * 0.25})`;
          ctx.fill();
        }
      }

      // 3. Connect constellation lines
      const maxConnectDist = 115;
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const lineOpacity = (1 - dist / maxConnectDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = `rgba(147, 197, 253, ${lineOpacity})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // 4. Mouse celestial magnetism lines
        if (mouse.isOver) {
          const mdx = s1.x - mouse.x;
          const mdy = s1.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < 150) {
            const mOpacity = (1 - mDist / 150) * 0.35;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${mOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Subtle gentle pull towards cursor
            s1.x -= (mdx / mDist) * 0.18;
            s1.y -= (mdy / mDist) * 0.18;
          }
        }
      }

      // 5. Draw Neowise Comet if active
      if (comet.active) {
        comet.x += comet.vx;
        comet.y += comet.vy;
        comet.opacity -= 0.012;

        if (comet.opacity <= 0 || comet.x < -100 || comet.y > height + 100) {
          comet.active = false;
        } else {
          const tailX = comet.x - (comet.vx / 10) * comet.length;
          const tailY = comet.y - (comet.vy / 10) * comet.length;

          const cometGrad = ctx.createLinearGradient(comet.x, comet.y, tailX, tailY);
          cometGrad.addColorStop(0, `rgba(255, 255, 255, ${comet.opacity})`);
          cometGrad.addColorStop(0.2, `rgba(103, 232, 249, ${comet.opacity * 0.7})`);
          cometGrad.addColorStop(1, "rgba(56, 189, 248, 0)");

          ctx.beginPath();
          ctx.moveTo(comet.x, comet.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = cometGrad;
          ctx.lineWidth = 2.2;
          ctx.stroke();

          // Comet head glow
          ctx.beginPath();
          ctx.arc(comet.x, comet.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${comet.opacity})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#38bdf8";
          ctx.fill();
          ctx.shadowBlur = 0; // Reset
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    // Only run if tab is visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(cometInterval);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
