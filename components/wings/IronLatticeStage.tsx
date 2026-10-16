"use client";

import { useEffect, useRef } from "react";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { StageControlStrip, StageSlider } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";
import { qualityScale } from "@/lib/museum/qualityScale";
import { springStep } from "@/lib/museum/spring";

type Filing = { x: number; y: number; angle: number; v: number };

/** Magnetic filings aligning to a pointer pole. */
export function IronLatticeStage({
  exhibitId,
  expanded = false,
}: {
  exhibitId?: string;
  expanded?: boolean;
} = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pointerRef = useStagePointer(ref);
  const [params, setParams] = useSeededParams(exhibitId, { stiffness: 0.1, pole: 1 });
  const { stiffness, pole } = params;
  const setStiffness = (v: number) => setParams((p) => ({ ...p, stiffness: v }));
  const setPole = (v: number) => setParams((p) => ({ ...p, pole: v }));
  const paramsRef = useRef({ stiffness, pole });
  paramsRef.current = { stiffness, pole };
  const spacing = qualityScale(expanded, 14, 9);
  const lenBoost = qualityScale(expanded, 1, 1.35);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    let filings: Filing[] = [];
    let raf = 0;
    let w = 800;
    let h = 500;

    const resize = () => {
      w = parent?.clientWidth || 800;
      h = parent?.clientHeight || 500;
      const dpr = Math.min(devicePixelRatio || 1, qualityScale(expanded, 1.75, 2));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const step = spacing;
      const cols = Math.floor(w / step);
      const rows = Math.floor(h / step);
      filings = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          filings.push({
            x: 10 + c * step + (r % 2) * (step * 0.5),
            y: 10 + r * step,
            angle: Math.random() * Math.PI,
            v: 0,
          });
        }
      }
    };
    resize();
    let t = 0;

    const frame = () => {
      t += 0.016;
      const ptr = pointerRef.current;
      const idleX = w * 0.5 + Math.sin(t * 0.55) * w * 0.28;
      const idleY = h * 0.48 + Math.sin(t * 0.85 + 1.2) * h * 0.22;
      const px = ptr.inside ? ptr.x : idleX;
      const py = ptr.inside ? ptr.y : idleY;
      const strength = (ptr.down ? 2.4 : 1.35) * paramsRef.current.pole;
      const k = paramsRef.current.stiffness;

      ctx.fillStyle = "rgba(14,14,16,0.28)";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(212,212,216,0.55)";
      ctx.lineWidth = qualityScale(expanded, 1.1, 1.25);
      ctx.lineCap = "round";

      for (const f of filings) {
        const dx = px - f.x;
        const dy = py - f.y;
        const dist = Math.hypot(dx, dy) + 0.001;
        const target = Math.atan2(dy, dx) + (strength * 18) / dist;
        const stepped = springStep(f.angle, target, f.v, k, 0.86);
        f.angle = stepped.value;
        f.v = stepped.velocity;

        const len = (5 + Math.min(7, (strength * 40) / dist)) * lenBoost;
        const cx = Math.cos(f.angle) * len;
        const cy = Math.sin(f.angle) * len;
        const near = dist < 90;
        ctx.strokeStyle = near
          ? `rgba(185,28,28,${0.35 + Math.min(0.5, 40 / dist)})`
          : "rgba(168,164,156,0.45)";
        ctx.beginPath();
        ctx.moveTo(f.x - cx, f.y - cy);
        ctx.lineTo(f.x + cx, f.y + cy);
        ctx.stroke();
      }

      if (ptr.inside) {
        const g = ctx.createRadialGradient(px, py, 0, px, py, 70);
        g.addColorStop(0, "rgba(185,28,28,0.22)");
        g.addColorStop(1, "rgba(14,14,16,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, 70, 0, Math.PI * 2);
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
  }, [pointerRef, expanded, spacing, lenBoost]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />
      <StageControlStrip>
        <StageSlider
          label="Spring"
          value={stiffness}
          min={0.04}
          max={0.22}
          step={0.01}
          onChange={setStiffness}
        />
        <StageSlider label="Pole" value={pole} min={0.5} max={2.2} step={0.1} onChange={setPole} />
      </StageControlStrip>
    </div>
  );
}
