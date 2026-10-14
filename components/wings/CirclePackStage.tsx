"use client";

import { useEffect, useRef } from "react";
import { makeRng } from "@/lib/rng";
import { useStagePointer } from "@/components/museum/useStagePointer";

type C = { x: number; y: number; r: number; growing: boolean; c: string };

export function CirclePackStage({ seed = "igris-pack" }: { seed?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const growingRef = useRef<C | null>(null);
  const commitRef = useRef<C | null>(null);

  useStagePointer(ref, {
    onDown: (p) => {
      growingRef.current = {
        x: p.x,
        y: p.y,
        r: 2,
        growing: true,
        c: ["#e8e4dc", "#b91c1c", "#71717a", "#a1a1aa", "#fafafa"][(Math.random() * 5) | 0],
      };
    },
    onMove: (p) => {
      if (growingRef.current && p.down) {
        growingRef.current.x = p.x;
        growingRef.current.y = p.y;
      }
    },
    onUp: () => {
      if (growingRef.current) {
        commitRef.current = { ...growingRef.current, growing: false };
        growingRef.current = null;
      }
    },
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    const rng = makeRng(seed);

    const colors = ["#e8e4dc", "#b91c1c", "#71717a", "#a1a1aa", "#fafafa"];
    let circles: C[] = [];
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
      circles = [];
      ctx.fillStyle = "#0e0e10";
      ctx.fillRect(0, 0, w, h);
    };
    resize();

    const fits = (c: C) => {
      if (
        c.x - c.r < 8 ||
        c.y - c.r < 8 ||
        c.x + c.r > canvas.clientWidth - 8 ||
        c.y + c.r > canvas.clientHeight - 8
      )
        return false;
      for (const o of circles) {
        if (Math.hypot(c.x - o.x, c.y - o.y) < c.r + o.r + 1.5) return false;
      }
      return true;
    };

    const frame = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "rgba(14,14,16,0.08)";
      ctx.fillRect(0, 0, w, h);

      if (commitRef.current) {
        const c = commitRef.current;
        commitRef.current = null;
        if (c.r > 2) circles.push(c);
      }

      const active = growingRef.current;
      if (active) {
        const next = { ...active, r: active.r + 0.55 };
        if (fits(next)) {
          active.r = next.r;
        } else {
          circles.push({ ...active, growing: false });
          growingRef.current = null;
        }
      } else {
        for (let i = 0; i < 2; i++) {
          const nc: C = {
            x: 20 + rng() * (w - 40),
            y: 20 + rng() * (h - 40),
            r: 2,
            growing: true,
            c: colors[(rng() * colors.length) | 0],
          };
          if (fits(nc)) circles.push(nc);
        }
      }

      for (const c of circles) {
        if (c.growing) {
          c.r += 0.35;
          if (!fits(c)) {
            c.r -= 0.35;
            c.growing = false;
          }
        }
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.strokeStyle = c.c;
        ctx.globalAlpha = 0.75;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      if (growingRef.current) {
        const g = growingRef.current;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.strokeStyle = g.c;
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      if (circles.length > 420) circles = circles.filter((c) => c.r > 6).slice(-280);
      raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [seed]);

  return <canvas ref={ref} className="h-full w-full touch-none cursor-cell" />;
}
