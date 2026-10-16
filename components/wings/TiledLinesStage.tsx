"use client";

import { useEffect, useRef } from "react";
import { makeRng } from "@/lib/rng";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { qualityScale } from "@/lib/museum/qualityScale";

/** Diagonal tile field — click flips a tile; drag paints flips. */
export function TiledLinesStage({
  seed = "igris-tiles",
  expanded = false,
}: {
  seed?: string;
  expanded?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const flipQueue = useRef<{ c: number; r: number }[]>([]);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

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
    const cols = qualityScale(expanded, 24, 36);
    const rows = qualityScale(expanded, 16, 24);
    const tiles = Array.from({ length: cols * rows }, () => rng() > 0.5);
    const anim = new Float32Array(cols * rows); // 0 or 1 progress progress after flip
    const target = new Float32Array(cols * rows);
    for (let i = 0; i < tiles.length; i++) {
      anim[i] = tiles[i] ? 1 : 0;
      target[i] = anim[i];
    }
    let raf = 0;
    let idleTick = 0;

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
      idleTick++;

      while (flipQueue.current.length) {
        const q = flipQueue.current.pop()!;
        const c = Math.min(cols - 1, Math.max(0, Math.floor(q.c * cols)));
        const r = Math.min(rows - 1, Math.max(0, Math.floor(q.r * rows)));
        const i = r * cols + c;
        tiles[i] = !tiles[i];
        target[i] = tiles[i] ? 1 : 0;
      }

      // Rare ambient flip for corridor life
      if (idleTick % 90 === 0) {
        const i = (rng() * tiles.length) | 0;
        tiles[i] = !tiles[i];
        target[i] = tiles[i] ? 1 : 0;
      }

      ctx.fillStyle = "#0e0e10";
      ctx.fillRect(0, 0, w, h);

      if (expandedRef.current) {
        ctx.strokeStyle = "rgba(232,228,220,0.06)";
        ctx.lineWidth = 1;
        for (let c = 0; c <= cols; c++) {
          ctx.beginPath();
          ctx.moveTo(c * tw, 0);
          ctx.lineTo(c * tw, h);
          ctx.stroke();
        }
        for (let r = 0; r <= rows; r++) {
          ctx.beginPath();
          ctx.moveTo(0, r * th);
          ctx.lineTo(w, r * th);
          ctx.stroke();
        }
      }

      ctx.lineWidth = 1.4;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          anim[i] += (target[i] - anim[i]) * 0.18;
          const x = c * tw;
          const y = r * th;
          const t = anim[i];
          ctx.beginPath();
          // Cross-fade between slash orientations
          const ax0 = x;
          const ay0 = y;
          const ax1 = x + tw;
          const ay1 = y + th;
          const bx0 = x + tw;
          const by0 = y;
          const bx1 = x;
          const by1 = y + th;
          const x0 = ax0 * (1 - t) + bx0 * t;
          const y0 = ay0 * (1 - t) + by0 * t;
          const x1 = ax1 * (1 - t) + bx1 * t;
          const y1 = ay1 * (1 - t) + by1 * t;
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
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
  }, [seed, expanded]);

  return <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />;
}
