"use client";

import { useEffect, useRef } from "react";
import type { WingId } from "@/lib/museum/types";

/**
 * Ink-on-plaster palettes — charcoal + muted rust, not chalk-white glow orbs.
 * Values are RGB triples for rgba() compositing on the warm museum ground.
 */
const PALETTE: Record<WingId, { ink: string; rust: string; stone: string }> = {
  relief: { ink: "28,26,24", rust: "140,38,36", stone: "74,70,64" },
  locus: { ink: "26,26,28", rust: "148,42,40", stone: "70,68,72" },
  alcove: { ink: "30,28,26", rust: "132,36,36", stone: "68,64,60" },
  field: { ink: "28,26,24", rust: "150,44,40", stone: "72,68,62" },
  signal: { ink: "24,24,26", rust: "160,40,40", stone: "66,66,70" },
  forge: { ink: "32,28,24", rust: "138,36,32", stone: "78,70,62" },
};

type Particle = {
  layer: number;
  along: number;
  phase: number;
  size: number;
  speed: number;
  kind: "ink" | "rust" | "stone";
  alpha: number;
};

function waveY(x: number, t: number, layer: number, h: number): number {
  const base = h * (0.3 + layer * 0.17);
  const amp = h * (0.09 + layer * 0.028);
  return (
    base +
    Math.sin(x * 0.0075 + t * (0.48 + layer * 0.1) + layer) * amp +
    Math.sin(x * 0.017 - t * 0.32 + layer * 1.6) * amp * 0.42 +
    Math.sin(x * 0.004 + t * 0.18) * amp * 0.28
  );
}

export function WingBanner({ wing }: { wing: WingId }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const palette = PALETTE[wing];
    let raf = 0;
    let t = 0;
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];

    const seed = () => {
      particles = [];
      const count = Math.min(180, Math.max(100, Math.floor(w * 0.14)));
      for (let i = 0; i < count; i++) {
        const roll = i % 11;
        particles.push({
          layer: i % 3,
          along: Math.random(),
          phase: Math.random() * Math.PI * 2,
          size: 0.55 + Math.random() * 1.35,
          speed: 0.01 + Math.random() * 0.022 + (i % 3) * 0.003,
          kind: roll === 0 || roll === 5 ? "rust" : roll % 3 === 0 ? "stone" : "ink",
          alpha: 0.22 + Math.random() * 0.38,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();

    const rgbFor = (kind: Particle["kind"]) =>
      kind === "rust" ? palette.rust : kind === "stone" ? palette.stone : palette.ink;

    const frame = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Graphite ribbon guides — thin, low contrast on plaster
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 5) {
          const y = waveY(x, t, layer, h);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${palette.ink}, ${0.1 + layer * 0.035})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      for (const p of particles) {
        p.along += p.speed * 0.0042;
        if (p.along > 1.08) p.along -= 1.16;

        const x = p.along * (w + 40) - 20;
        const y =
          waveY(x, t, p.layer, h) +
          Math.sin(t * 1.2 + p.phase) * (1.8 + p.layer * 0.6) +
          Math.sin(t * 0.55 + p.phase * 2) * 0.9;

        const rgb = rgbFor(p.kind);
        const breathe = 0.82 + 0.18 * Math.sin(t * 1.6 + p.phase);
        const r = p.size * breathe;

        // Tight soft halo — graphite dust, not neon bloom
        const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 2.4);
        halo.addColorStop(0, `rgba(${rgb}, ${p.alpha * 0.55 * breathe})`);
        halo.addColorStop(0.55, `rgba(${rgb}, ${p.alpha * 0.18})`);
        halo.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, r * 2.4, 0, Math.PI * 2);
        ctx.fill();

        // Dense ink core
        ctx.fillStyle = `rgba(${rgb}, ${Math.min(0.72, p.alpha * 1.15)})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.45, r * 0.45), 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };
    frame();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [wing]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
