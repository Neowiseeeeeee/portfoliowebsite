import { useEffect, useRef } from "react";

interface KaelCosmicCanvasProps {
  className?: string;
}

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

const STAR_COLORS = [
  "255, 255, 255", // White
  "147, 197, 253", // Ice blue
  "103, 232, 249", // Starlight cyan
  "167, 139, 250", // Soft purple
  "253, 230, 138", // Warm golden
];

export function KaelCosmicCanvas({ className = "" }: KaelCosmicCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Stars collection
    let stars: Star[] = [];

    function initStars(w: number, h: number) {
      const count = Math.max(35, Math.min(85, Math.floor((w * h) / 4500)));
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          radius: Math.random() * 1.4 + 0.6,
          baseAlpha: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 0.025 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
    }

    function updateSize() {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      if (width === 0 || height === 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (stars.length === 0) {
        initStars(width, height);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);
    updateSize();

    let orbitAngle = 0;
    let lastTime = performance.now();

    function render(currentTime: number) {
      if (!ctx || width === 0 || height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      orbitAngle += dt * 0.65; // Smooth orbital rotation

      ctx.save();
      ctx.scale(dpr, dpr);

      // ── 1. Cosmic Background Gradient ──
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, "#081126"); // Navy obsidian center
      bgGrad.addColorStop(0.4, "#050b18"); // Deep space
      bgGrad.addColorStop(1, "#020409"); // Void black
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric glow behind the KAEL center
      const centerAura = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        0,
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.4
      );
      centerAura.addColorStop(0, "rgba(56, 189, 248, 0.12)");
      centerAura.addColorStop(0.6, "rgba(14, 116, 144, 0.05)");
      centerAura.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = centerAura;
      ctx.fillRect(0, 0, width, height);

      // ── 2. Update & Draw Constellation Stars ──
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        const twinkle = Math.sin(currentTime * s.twinkleSpeed + s.twinklePhase) * 0.25 + s.baseAlpha;
        const currentAlpha = Math.max(0.15, Math.min(0.95, twinkle));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${currentAlpha})`;
        ctx.fill();
      }

      // ── 3. Draw Constellation Connection Lines ──
      const maxDistance = Math.min(width, height) * 0.28;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.18;
            ctx.strokeStyle = `rgba(103, 232, 249, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      // ── 4. Central Orbital Portal & KAEL Interface ──
      const cx = width * 0.5;
      const cy = height * 0.5;
      const minDim = Math.min(width, height);

      const portalRadius = Math.max(34, minDim * 0.185);
      const orbit1Radius = portalRadius * 1.34;
      const orbit2Radius = portalRadius * 1.62;

      // Outer Faint Dashed Ring
      ctx.save();
      ctx.setLineDash([3, 5]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
      ctx.beginPath();
      ctx.arc(cx, cy, orbit2Radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Middle Orbit Track
      ctx.save();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
      ctx.beginPath();
      ctx.arc(cx, cy, orbit1Radius, 0, Math.PI * 2);
      ctx.stroke();

      // Orbiting Cyan Satellite / Beacon
      const orbitNodeX = cx + Math.cos(orbitAngle) * orbit1Radius;
      const orbitNodeY = cy + Math.sin(orbitAngle) * orbit1Radius;

      // Node aura
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(orbitNodeX, orbitNodeY, Math.max(3, minDim * 0.012), 0, Math.PI * 2);
      ctx.fill();

      // Node core
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(orbitNodeX, orbitNodeY, Math.max(1.8, minDim * 0.007), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Inner Portal Core (Dark glassy orb)
      ctx.save();
      const portalGrad = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        portalRadius
      );
      portalGrad.addColorStop(0, "rgba(10, 18, 38, 0.95)");
      portalGrad.addColorStop(0.85, "rgba(6, 12, 26, 0.98)");
      portalGrad.addColorStop(1, "rgba(5, 9, 20, 1)");

      ctx.fillStyle = portalGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, portalRadius, 0, Math.PI * 2);
      ctx.fill();

      // Portal Rim with soft electric glow
      ctx.shadowColor = "rgba(56, 189, 248, 0.6)";
      ctx.shadowBlur = 12;
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
      ctx.stroke();
      ctx.restore();

      // ── Central KAEL Typography (Times New Roman serif) ──
      ctx.save();
      const fontSize = Math.max(18, Math.min(36, Math.floor(minDim * 0.11)));
      ctx.font = `bold ${fontSize}px "Times New Roman", Times, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Glow behind text
      ctx.shadowColor = "rgba(56, 189, 248, 0.85)";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#ffffff";
      ctx.fillText("K A E L", cx, cy - 2);

      // Pure crisp top layer
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff";
      ctx.fillText("K A E L", cx, cy - 2);
      ctx.restore();

      // ── Status Pill: • READY ──
      const pillY = cy + portalRadius + Math.max(12, minDim * 0.045);
      if (pillY + 12 < height) {
        ctx.save();
        const pillWidth = Math.max(54, minDim * 0.16);
        const pillHeight = Math.max(16, minDim * 0.05);
        const pillRadius = pillHeight / 2;

        // Pill container
        ctx.fillStyle = "rgba(6, 13, 27, 0.85)";
        ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(cx - pillWidth / 2, pillY - pillHeight / 2, pillWidth, pillHeight, pillRadius);
        ctx.fill();
        ctx.stroke();

        // Glowing dot
        const dotRadius = Math.max(2, minDim * 0.008);
        const dotX = cx - pillWidth * 0.24;
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#34d399";
        ctx.beginPath();
        ctx.arc(dotX, pillY, dotRadius, 0, Math.PI * 2);
        ctx.fill();

        // Text: READY
        ctx.shadowBlur = 0;
        const pillFontSize = Math.max(8, Math.min(11, Math.floor(minDim * 0.03)));
        ctx.font = `700 ${pillFontSize}px monospace`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("READY", dotX + dotRadius + 5, pillY + 0.5);
        ctx.restore();
      }

      // ── Top-Left: NEOWISE Brandmark in Times New Roman ──
      ctx.save();
      const brandFontSize = Math.max(12, Math.min(18, Math.floor(minDim * 0.06)));
      ctx.font = `bold ${brandFontSize}px "Times New Roman", Times, serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#ffffff";
      const padX = Math.max(16, width * 0.05);
      const padY = Math.max(14, height * 0.05);
      ctx.fillText("NEOWISE", padX, padY);

      // Glowing dot over the 'I' in NEOWISE
      // Approximate position of 'I' in "NEOWISE"
      const prefixWidth = ctx.measureText("NEOW").width;
      const iCharWidth = ctx.measureText("I").width;
      const dotCenterX = padX + prefixWidth + iCharWidth * 0.5;
      const dotCenterY = padY - 2;

      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(dotCenterX, dotCenterY, Math.max(1.5, brandFontSize * 0.12), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ── Top-Right: Grid Applet Icon ──
      ctx.save();
      const rightPadX = width - Math.max(16, width * 0.05);
      const iconSize = Math.max(22, minDim * 0.075);
      const iconX = rightPadX - iconSize;
      const iconY = padY - 2;

      // Icon pill background
      ctx.fillStyle = "rgba(10, 20, 40, 0.7)";
      ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(iconX, iconY, iconSize, iconSize, 6);
      ctx.fill();
      ctx.stroke();

      // 2x2 grid dots
      const dotInner = iconSize * 0.22;
      const gap = iconSize * 0.28;
      const startX = iconX + (iconSize - gap) / 2;
      const startY = iconY + (iconSize - gap) / 2;
      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 4;

      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
          ctx.beginPath();
          ctx.roundRect(startX + c * gap - dotInner / 2, startY + r * gap - dotInner / 2, dotInner, dotInner, 1.5);
          ctx.fill();
        }
      }
      ctx.restore();

      ctx.restore();
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
}
