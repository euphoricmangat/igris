"use client";

import { useEffect, useRef } from "react";
import { makeRng } from "@/lib/rng";
import { useStagePointer } from "@/components/museum/useStagePointer";

const SPECIES = 4;
const COLORS = ["#b91c1c", "#e8e4dc", "#71717a", "#f87171"];

export function ParticleLifeStage({ seed = "igris-swarm" }: { seed?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const magnetSpecies = useRef(0);
  const burstQueue = useRef<{ x: number; y: number; s: number }[]>([]);

  const pointerRef = useStagePointer(ref, {
    onClick: (p) => {
      const s = magnetSpecies.current;
      burstQueue.current.push({ x: p.x, y: p.y, s });
      magnetSpecies.current = (s + 1) % SPECIES;
    },
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    const rng = makeRng(seed);

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

    type Particle = { x: number; y: number; vx: number; vy: number; s: number };
    const n = 500;
    const particles: Particle[] = Array.from({ length: n }, () => ({
      x: rng() * canvas.clientWidth,
      y: rng() * canvas.clientHeight,
      vx: 0,
      vy: 0,
      s: Math.floor(rng() * SPECIES),
    }));

    const rules: number[][] = Array.from({ length: SPECIES }, () =>
      Array.from({ length: SPECIES }, () => rng() * 2 - 1)
    );

    let raf = 0;
    const frame = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const ptr = pointerRef.current;

      while (burstQueue.current.length) {
        const b = burstQueue.current.pop()!;
        for (let i = 0; i < 28; i++) {
          const a = rng() * Math.PI * 2;
          const r = rng() * 36;
          particles.push({
            x: b.x + Math.cos(a) * r,
            y: b.y + Math.sin(a) * r,
            vx: Math.cos(a) * 2,
            vy: Math.sin(a) * 2,
            s: b.s,
          });
        }
        if (particles.length > 900) particles.splice(0, particles.length - 700);
      }

      ctx.fillStyle = "rgba(14,14,16,0.18)";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        let fx = 0;
        let fy = 0;
        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          const b = particles[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          if (dist > 90) continue;
          const f = rules[a.s][b.s] / dist;
          fx += dx * f;
          fy += dy * f;
        }

        if (ptr.down && ptr.inside && a.s === magnetSpecies.current) {
          const dx = ptr.x - a.x;
          const dy = ptr.y - a.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 200) {
            fx += (dx / dist) * 18;
            fy += (dy / dist) * 18;
          }
        }

        a.vx = (a.vx + fx * 0.08) * 0.82;
        a.vy = (a.vy + fy * 0.08) * 0.82;
        a.x = (a.x + a.vx + w) % w;
        a.y = (a.y + a.vy + h) % h;
        ctx.fillStyle = COLORS[a.s];
        ctx.fillRect(a.x, a.y, 2.2, 2.2);
      }

      if (ptr.inside) {
        ctx.beginPath();
        ctx.arc(ptr.x, ptr.y, ptr.down ? 28 : 12, 0, Math.PI * 2);
        ctx.strokeStyle = COLORS[magnetSpecies.current];
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(frame);
    };
    frame();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [seed, pointerRef]);

  return <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />;
}
