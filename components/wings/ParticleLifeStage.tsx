"use client";

import { useEffect, useRef } from "react";
import { makeRng } from "@/lib/rng";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { StageControlStrip, StageSlider } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";
import { idleLissajousPx } from "@/hooks/useIdleLissajous";
import { qualityScale } from "@/lib/museum/qualityScale";

const SPECIES = 4;
const COLORS = ["#b91c1c", "#e8e4dc", "#71717a", "#f87171"];
const CELL = 80;

export function ParticleLifeStage({
  seed = "igris-swarm",
  exhibitId,
  expanded = false,
}: {
  seed?: string;
  exhibitId?: string;
  expanded?: boolean;
} = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const magnetSpecies = useRef(0);
  const burstQueue = useRef<{ x: number; y: number; s: number }[]>([]);
  const [params, setParams] = useSeededParams(exhibitId, { friction: 0.82, magnet: 18 });
  const { friction, magnet } = params;
  const setFriction = (v: number) => setParams((p) => ({ ...p, friction: v }));
  const setMagnet = (v: number) => setParams((p) => ({ ...p, magnet: v }));
  const paramsRef = useRef({ friction, magnet });
  paramsRef.current = { friction, magnet };
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

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
    const n = qualityScale(expandedRef.current, 420, 680);
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
    let t = 0;
    const frame = () => {
      t += 0.016;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const ptr = pointerRef.current;
      const fric = paramsRef.current.friction;
      const mag = paramsRef.current.magnet;
      const idle = idleLissajousPx(t, w, h);
      const mx = ptr.inside ? ptr.x : idle.x;
      const my = ptr.inside ? ptr.y : idle.y;
      const magnetOn = ptr.inside ? ptr.down : true;
      const magnetStrength = ptr.inside && ptr.down ? mag : mag * 0.22;

      ctx.fillStyle = "rgba(14,14,16,0.22)";
      ctx.fillRect(0, 0, w, h);

      while (burstQueue.current.length) {
        const b = burstQueue.current.pop()!;
        for (let i = 0; i < 28; i++) {
          const a = Math.random() * Math.PI * 2;
          const s = 2 + Math.random() * 4;
          particles.push({
            x: b.x,
            y: b.y,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s,
            s: b.s,
          });
        }
        const cap = qualityScale(expandedRef.current, 700, 950);
        if (particles.length > cap) particles.splice(0, particles.length - Math.floor(cap * 0.85));
      }

      // Spatial hash
      const cols = Math.max(1, Math.ceil(w / CELL));
      const buckets = new Map<number, number[]>();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const key = Math.floor(p.x / CELL) + Math.floor(p.y / CELL) * cols;
        let list = buckets.get(key);
        if (!list) {
          list = [];
          buckets.set(key, list);
        }
        list.push(i);
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        let fx = 0;
        let fy = 0;
        const cx = Math.floor(a.x / CELL);
        const cy = Math.floor(a.y / CELL);
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const list = buckets.get(cx + ox + (cy + oy) * cols);
            if (!list) continue;
            for (const j of list) {
              if (i === j) continue;
              const b = particles[j];
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const dist = Math.hypot(dx, dy) || 1;
              if (dist > 80) continue;
              const force = rules[a.s][b.s] / dist;
              fx += (dx / dist) * force;
              fy += (dy / dist) * force;
            }
          }
        }

        if (magnetOn) {
          const dx = mx - a.x;
          const dy = my - a.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 200) {
            fx += (dx / dist) * magnetStrength;
            fy += (dy / dist) * magnetStrength;
          }
        }

        a.vx = (a.vx + fx * 0.08) * fric;
        a.vy = (a.vy + fy * 0.08) * fric;
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
  }, [seed, pointerRef, expanded]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />
      <StageControlStrip>
        <StageSlider
          label="Friction"
          value={friction}
          min={0.7}
          max={0.94}
          step={0.01}
          onChange={setFriction}
        />
        <StageSlider label="Magnet" value={magnet} min={6} max={36} step={1} onChange={setMagnet} />
      </StageControlStrip>
    </div>
  );
}
