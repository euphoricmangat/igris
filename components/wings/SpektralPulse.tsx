"use client";

import { useEffect, useRef } from "react";
import { useStagePointer } from "@/components/museum/useStagePointer";

/**
 * Monarch Pulse — reliable Canvas 2D ring pulse (WebGPU Spektral was black/failing
 * in Expand). Same visual language: crimson rings, pointer center, click kick.
 */
export function SpektralPulse() {
  const ref = useRef<HTMLCanvasElement>(null);
  const kickRef = useRef(0);

  const pointerRef = useStagePointer(ref, {
    onClick: () => {
      kickRef.current = 1;
    },
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    let raf = 0;
    let t0 = performance.now();

    const resize = () => {
      const w = parent?.clientWidth || 800;
      const h = parent?.clientHeight || 500;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const frame = (now: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 2 || h < 2) {
        raf = requestAnimationFrame(frame);
        return;
      }

      const t = (now - t0) / 1000;
      kickRef.current *= 0.92;
      const kick = kickRef.current;
      const ptr = pointerRef.current;
      const cx = (ptr.inside ? ptr.u : 0.5) * w;
      const cy = (ptr.inside ? ptr.v : 0.5) * h;

      ctx.fillStyle = "#0e0e10";
      ctx.fillRect(0, 0, w, h);

      const maxR = Math.hypot(w, h) * 0.55;
      for (let i = 0; i < 14; i++) {
        const phase = t * 1.4 + kick * 3 + i * 0.45;
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.6 + kick * 3);
        const r = ((phase * 40) % maxR) + 8;
        const alpha = (1 - r / maxR) * (0.25 + pulse * 0.45);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(185,28,28,${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.5 + pulse;
        ctx.stroke();
      }

      // soft vignette instead of per-frame grain alloc
      const vig = ctx.createRadialGradient(cx, cy, 20, cx, cy, maxR);
      vig.addColorStop(0, "rgba(185,28,28,0.08)");
      vig.addColorStop(1, "rgba(14,14,16,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [pointerRef]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full touch-none cursor-crosshair" />;
}
