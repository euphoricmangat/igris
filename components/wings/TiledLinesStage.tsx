"use client";

import { useEffect, useRef } from "react";
import { makeRng } from "@/lib/rng";
import { useStagePointer } from "@/components/museum/useStagePointer";

/** Diagonal tile field — click flips a tile; drag paints flips. */
export function TiledLinesStage({ seed = "igris-tiles" }: { seed?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const flipQueue = useRef<{ c: number; r: number }[]>([]);

  useStagePointer(ref, {
    onDown: (p) => flipQueue.current.push({ c: p.u, r: p.v }),
    onMove: (p) => {
      if (p.down) flipQueue.current.push({ c: p.u, r: p.v });
    },
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    const rng = makeRng(seed);
    const cols = 24;
    const rows = 16;
    const tiles = Array.from({ length: cols * rows }, () => rng() > 0.5);
    let raf = 0;

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

    const frame = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const tw = w / cols;
      const th = h / rows;

      while (flipQueue.current.length) {
        const q = flipQueue.current.pop()!;
        const c = Math.min(cols - 1, Math.max(0, Math.floor(q.c * cols)));
        const r = Math.min(rows - 1, Math.max(0, Math.floor(q.r * rows)));
        tiles[r * cols + c] = !tiles[r * cols + c];
      }

      ctx.fillStyle = "#0e0e10";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#e8e4dc";
      ctx.lineWidth = 1.4;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * tw;
          const y = r * th;
          const diag = tiles[r * cols + c];
          ctx.beginPath();
          if (diag) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + tw, y + th);
          } else {
            ctx.moveTo(x + tw, y);
            ctx.lineTo(x, y + th);
          }
          ctx.strokeStyle = (r + c) % 7 === 0 ? "#b91c1c" : "#e8e4dc";
          ctx.globalAlpha = 0.75;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [seed]);

  return <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />;
}
