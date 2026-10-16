"use client";

import { useEffect, useRef } from "react";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { StageControlStrip, StageSlider } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";

type Particle = { x: number; y: number; vx: number; vy: number; life: number; hue: number };

/** Additive ember wake — idle Lissajous trail so wing thumbs stay alive without pointer. */
export function EmberWakeStage({
  exhibitId,
  expanded = false,
}: {
  exhibitId?: string;
  expanded?: boolean;
} = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pointerRef = useStagePointer(ref);
  const [params, setParams] = useSeededParams(exhibitId, { linger: 0.012, spawn: 1 });
  const { linger, spawn } = params;
  const setLinger = (v: number) => setParams((p) => ({ ...p, linger: v }));
  const setSpawn = (v: number) => setParams((p) => ({ ...p, spawn: v }));
  const paramsRef = useRef({ linger, spawn });
  paramsRef.current = { linger, spawn };
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    const particles: Particle[] = [];
    let raf = 0;
    let t = 0;
    let prevX = 0;
    let prevY = 0;
    let hasPrev = false;

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

    const spawnAt = (x: number, y: number, speed: number) => {
      const mult = paramsRef.current.spawn * (expandedRef.current ? 1.35 : 1);
      const n = Math.floor((2 + Math.min(8, Math.floor(speed * 0.4))) * mult);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 0.4 + Math.random() * 1.8;
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(a) * s * 0.35,
          vy: Math.sin(a) * s * 0.35 - 0.4,
          life: 1,
          hue: Math.random() > 0.7 ? 0 : 12,
        });
      }
      const area = canvas.clientWidth * canvas.clientHeight;
      const cap = Math.min(1400, Math.max(400, Math.floor(area / 900) * (expandedRef.current ? 1.4 : 1)));
      if (particles.length > cap) particles.splice(0, particles.length - Math.floor(cap * 0.78));
    };

    const frame = () => {
      t += 0.016;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const ptr = pointerRef.current;

      ctx.fillStyle = "rgba(14,14,16,0.12)";
      ctx.fillRect(0, 0, w, h);

      if (ptr.inside) {
        const dx = hasPrev ? ptr.x - prevX : 0;
        const dy = hasPrev ? ptr.y - prevY : 0;
        const speed = Math.hypot(dx, dy);
        spawnAt(ptr.x, ptr.y, speed + (ptr.down ? 6 : 1.5));
        prevX = ptr.x;
        prevY = ptr.y;
        hasPrev = true;
      } else {
        hasPrev = false;
        const cx = w * 0.5 + Math.sin(t * 0.55) * w * 0.28;
        const cy = h * 0.48 + Math.sin(t * 0.85 + 1.2) * h * 0.22;
        spawnAt(cx, cy, 2.2);
      }

      const lifeStep = paramsRef.current.linger;
      ctx.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy = p.vy * 0.98 - 0.01;
        p.life -= lifeStep;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const r = 2 + p.life * 6;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, `rgba(255,${120 + p.hue},${80}, ${0.55 * p.life})`);
        g.addColorStop(0.45, `rgba(185,28,28,${0.35 * p.life})`);
        g.addColorStop(1, "rgba(14,14,16,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(frame);
    };
    frame();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [pointerRef]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />
      <StageControlStrip>
        <StageSlider
          label="Linger"
          value={linger}
          min={0.006}
          max={0.024}
          step={0.001}
          onChange={setLinger}
        />
        <StageSlider label="Spawn" value={spawn} min={0.4} max={2.2} step={0.1} onChange={setSpawn} />
      </StageControlStrip>
    </div>
  );
}
