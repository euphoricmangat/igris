"use client";

import { useEffect, useRef } from "react";
import { makeRng } from "@/lib/rng";
import { makePerlin2D } from "@/lib/noise";
import { useStagePointer } from "@/components/museum/useStagePointer";

export function FlowFieldStage({ seed = "igris-current" }: { seed?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pointerRef = useStagePointer(ref);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    const resize = () => {
      const w = parent?.clientWidth || 800;
      const h = parent?.clientHeight || 500;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const rng = makeRng(seed);
    const noise = makePerlin2D(rng);
    const colors = ["#b91c1c", "#e8e4dc", "#a1a1aa", "#71717a", "#fafafa"];
    type P = { x: number; y: number; c: string };
    let particles: P[] = [];
    const count = 1800;
    const reset = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      particles = Array.from({ length: count }, () => ({
        x: rng() * w,
        y: rng() * h,
        c: colors[Math.floor(rng() * colors.length)],
      }));
      ctx.fillStyle = "#0e0e10";
      ctx.fillRect(0, 0, w, h);
    };
    reset();

    let raf = 0;
    const frame = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const ptr = pointerRef.current;
      ctx.fillStyle = "rgba(14,14,16,0.045)";
      ctx.fillRect(0, 0, w, h);

      const radius = ptr.down ? 160 : ptr.inside ? 110 : 0;
      const strength = ptr.down ? 1.15 : 0.55;

      for (const p of particles) {
        let a = noise(p.x * 0.0025, p.y * 0.0025) * Math.PI * 4;
        if (radius > 0) {
          const dx = ptr.x - p.x;
          const dy = ptr.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < radius) {
            const toward = Math.atan2(dy, dx);
            const blend = (1 - dist / radius) * strength;
            a = a * (1 - blend) + toward * blend;
          }
        }
        p.x += Math.cos(a) * 1.4;
        p.y += Math.sin(a) * 1.4;
        if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          p.x = rng() * w;
          p.y = rng() * h;
        }
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, 1.1, 1.1);
      }

      if (ptr.inside) {
        ctx.beginPath();
        ctx.arc(ptr.x, ptr.y, radius || 24, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(185,28,28,0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    };
    frame();

    const onResize = () => {
      resize();
      reset();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [seed, pointerRef]);

  return <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />;
}
