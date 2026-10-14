"use client";

import { useEffect, useRef } from "react";
import { makeRng } from "@/lib/rng";
import { useStagePointer } from "@/components/museum/useStagePointer";

/** Meteor trails — click spawns a shower toward the pointer. */
export function MeteorStage({ seed = "igris-meteor" }: { seed?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const spawns = useRef<{ x: number; y: number }[]>([]);

  useStagePointer(ref, {
    onClick: (p) => spawns.current.push({ x: p.x, y: p.y }),
    onMove: (p) => {
      if (p.down) spawns.current.push({ x: p.x, y: p.y });
    },
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    const rng = makeRng(seed);
    type M = { x: number; y: number; vx: number; vy: number; life: number; c: string };
    let mets: M[] = [];
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

    const spawn = (tx: number, ty: number) => {
      for (let i = 0; i < 14; i++) {
        const a = -Math.PI / 2 + (rng() - 0.5) * 1.2;
        const sp = 2 + rng() * 5;
        mets.push({
          x: tx + (rng() - 0.5) * 40,
          y: ty - 20 - rng() * 60,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp + 2,
          life: 1,
          c: rng() > 0.7 ? "#b91c1c" : "#e8e4dc",
        });
      }
    };

    // ambient meteors
    for (let i = 0; i < 8; i++) {
      spawn(rng() * (parent?.clientWidth || 800), rng() * 40);
    }

    const frame = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      while (spawns.current.length) {
        const s = spawns.current.pop()!;
        spawn(s.x, s.y);
      }
      if (rng() < 0.04) spawn(rng() * w, rng() * h * 0.3);

      ctx.fillStyle = "rgba(14,14,16,0.2)";
      ctx.fillRect(0, 0, w, h);

      mets = mets.filter((m) => m.life > 0.02);
      for (const m of mets) {
        m.x += m.vx;
        m.y += m.vy;
        m.vy += 0.04;
        m.life *= 0.985;
        ctx.strokeStyle = m.c;
        ctx.globalAlpha = m.life;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 3, m.y - m.vy * 3);
        ctx.stroke();
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
