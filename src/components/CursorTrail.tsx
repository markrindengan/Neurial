import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  alpha: number;
  radius: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const MAX_PARTICLES = 22;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMove = (e: MouseEvent) => {
      particles.push({ x: e.clientX, y: e.clientY, alpha: 0.75, radius: 7 });
      while (particles.length > MAX_PARTICLES) particles.shift();
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        const t = (i + 1) / particles.length;
        p.alpha *= 0.91;
        p.radius *= 0.94;
        if (p.alpha < 0.01 || p.radius < 0.2) return;
        ctx.save();
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = p.radius * 2.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * t, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${p.alpha * t})`;
        ctx.fill();
        ctx.restore();
      });
      animId = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9997 }}
    />
  );
}
