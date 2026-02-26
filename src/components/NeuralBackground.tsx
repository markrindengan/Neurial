import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const mouse = { x: -9999, y: -9999 };
    let dots: Dot[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const isMobile = window.innerWidth < 768;

    const spawn = () => {
      dots = [];
      const maxDots = isMobile ? 40 : 140;
      const density = isMobile ? 20000 : 13000;
      const count = Math.min(
        Math.floor((canvas.width * canvas.height) / density),
        maxDots
      );
      for (let i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 1.6 + 0.7,
          opacity: Math.random() * 0.45 + 0.2,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const CONNECT_DIST = 125;
    const PULL_RADIUS = 160;
    const PULL_FORCE = 0.016;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const d of dots) {
        const dx = mouse.x - d.x;
        const dy = mouse.y - d.y;
        const dist = Math.hypot(dx, dy);

        if (dist < PULL_RADIUS && dist > 0) {
          const f = ((PULL_RADIUS - dist) / PULL_RADIUS) * PULL_FORCE;
          d.x += dx * f;
          d.y += dy * f;
        }

        d.x += d.vx;
        d.y += d.vy;

        if (d.x < 0) d.x = canvas.width;
        else if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        else if (d.y > canvas.height) d.y = 0;

        ctx.save();
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${d.opacity})`;
        ctx.fill();
        ctx.restore();
      }

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.11;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(16,185,129,${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(tick);
    };

    resize();
    spawn();
    tick();

    const onResize = () => {
      resize();
      spawn();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
