"use client";

import { useEffect, useRef } from "react";
import { makeRng } from "@/lib/rng";
import { makePerlin2D } from "@/lib/noise";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { StageControlStrip, StageSlider } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";
import { qualityScale } from "@/lib/museum/qualityScale";

export function FlowFieldStage({
  seed = "igris-current",
  expanded = false,
  exhibitId,
}: {
  seed?: string;
  expanded?: boolean;
  exhibitId?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pointerRef = useStagePointer(ref);
  const [params, setParams] = useSeededParams(exhibitId, { viscosity: 1.4 });
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

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
    type P = { x: number; y: number; c: string; age: number };
    let particles: P[] = [];
    let t = 0;

    const reset = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const count = qualityScale(expandedRef.current, 1400, 2400);
      particles = Array.from({ length: count }, () => ({
        x: rng() * w,
        y: rng() * h,
        c: colors[Math.floor(rng() * colors.length)],
        age: rng(),
      }));
      ctx.fillStyle = "#0e0e10";
      ctx.fillRect(0, 0, w, h);
    };
    reset();

    let raf = 0;
    const frame = () => {
      t += 0.004;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const ptr = pointerRef.current;
      const step = paramsRef.current.viscosity;
      ctx.fillStyle = "rgba(14,14,16,0.045)";
      ctx.fillRect(0, 0, w, h);

      const radius = ptr.down ? 160 : ptr.inside ? 110 : 0;
      const strength = ptr.down ? 1.15 : 0.55;

      for (const p of particles) {
        p.age += 0.01;
        let a =
          noise(p.x * 0.0025 + t * 0.35, p.y * 0.0025 + t * 0.22) * Math.PI * 4;
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
        const speed = step * (0.85 + 0.3 * Math.sin(p.age));
        p.x += Math.cos(a) * speed;
        p.y += Math.sin(a) * speed;
        if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          p.x = rng() * w;
          p.y = rng() * h;
        }
        ctx.globalAlpha = 0.45 + 0.55 * Math.min(1, speed / 2.2);
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, 1.1, 1.1);
      }
      ctx.globalAlpha = 1;

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
  }, [seed, pointerRef, expanded]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />
      {expanded ? (
        <StageControlStrip>
          <StageSlider
            label="Viscosity"
            value={params.viscosity}
            min={0.7}
            max={2.4}
            step={0.05}
            onChange={(v) => setParams((p) => ({ ...p, viscosity: v }))}
          />
        </StageControlStrip>
      ) : null}
    </div>
  );
}
