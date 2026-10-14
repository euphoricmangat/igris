"use client";

import { useEffect, useRef } from "react";
import { makeRng } from "@/lib/rng";
import { makePerlin2D } from "@/lib/noise";
import { useStagePointer } from "@/components/museum/useStagePointer";

export function JoyDivisionStage({ seed = "igris-horizon" }: { seed?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const tOffset = useRef(0);
  const peakBoost = useRef(0);
  const peakX = useRef(0.5);
  const lastY = useRef<number | null>(null);

  const pointerRef = useStagePointer(ref, {
    onDown: (p) => {
      lastY.current = p.y;
      peakX.current = p.u;
    },
    onMove: (p) => {
      if (p.down && lastY.current != null) {
        tOffset.current += (p.y - lastY.current) * -0.004;
        lastY.current = p.y;
        peakBoost.current = Math.min(1.4, peakBoost.current + 0.06);
      }
      if (p.inside) peakX.current = p.u;
    },
    onUp: () => {
      lastY.current = null;
    },
    onWheel: (dy, p) => {
      tOffset.current += dy * 0.0015;
      peakX.current = p.u;
      peakBoost.current = Math.min(1.4, peakBoost.current + 0.12);
    },
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    const rng = makeRng(seed);
    const noise = makePerlin2D(rng);
    let raf = 0;
    let t = 0;

    const resize = () => {
      const w = parent?.clientWidth || 800;
      const h = parent?.clientHeight || 500;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      t += 0.008;
      peakBoost.current *= 0.97;
      const time = t + tOffset.current;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "#0e0e10";
      ctx.fillRect(0, 0, w, h);

      const rows = 42;
      const cols = 120;
      ctx.strokeStyle = "#e8e4dc";
      ctx.lineWidth = 1.1;
      const boostX = peakX.current * w;
      const boost = peakBoost.current;

      for (let r = 0; r < rows; r++) {
        const y0 = h * 0.12 + (r / rows) * h * 0.78;
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const x = (c / cols) * w;
          const n = noise(c * 0.045, r * 0.12 + time);
          let peak = Math.max(0, n) ** 1.6;
          const dist = Math.abs(x - boostX);
          if (boost > 0.02 && dist < w * 0.22) {
            peak += (1 - dist / (w * 0.22)) * boost * 0.55;
          }
          const y = y0 - peak * h * 0.22;
          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.globalAlpha = 0.35 + (r / rows) * 0.55;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      ctx.strokeStyle = "rgba(185,28,28,0.55)";
      ctx.beginPath();
      ctx.moveTo(0, h * 0.58);
      ctx.lineTo(w, h * 0.58);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [seed, pointerRef]);

  return <canvas ref={ref} className="h-full w-full touch-none cursor-ns-resize" />;
}
