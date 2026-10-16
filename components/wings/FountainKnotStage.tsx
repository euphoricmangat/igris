"use client";

import { useEffect, useRef } from "react";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { StageControlStrip, StageSlider } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";
import { qualityScale } from "@/lib/museum/qualityScale";
import { springStep } from "@/lib/museum/spring";

/** Stream along a knot that returns to its source. */
export function FountainKnotStage({
  exhibitId,
  expanded = false,
}: {
  exhibitId?: string;
  expanded?: boolean;
} = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useSeededParams(exhibitId, { coil: 1, beads: 1 });
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const pointerRef = useStagePointer(ref);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    let w = 800;
    let h = 500;
    let raf = 0;
    let t = 0;
    let coil = 1;
    let coilV = 0;
    const nBeads = Math.round(qualityScale(expanded, 48, 90));
    const beadPhase = Array.from({ length: nBeads }, (_, i) => i / nBeads);

    const resize = () => {
      w = parent?.clientWidth || 800;
      h = parent?.clientHeight || 500;
      const dpr = Math.min(devicePixelRatio || 1, qualityScale(expanded, 1.75, 2));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const knotPoint = (u: number, radius: number) => {
      // Trefoil-like closed curve in 2D projection
      const a = u * Math.PI * 2;
      const scale = Math.min(w, h) * 0.22 * radius;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const x = Math.sin(a) + 0.55 * Math.sin(3 * a);
      const y = Math.cos(a) - 0.55 * Math.cos(3 * a);
      return { x: cx + x * scale, y: cy + y * scale * 0.92 };
    };

    const frame = () => {
      t += 0.016;
      const ptr = pointerRef.current;
      let targetCoil = paramsRef.current.coil;
      if (ptr.inside) {
        targetCoil = 0.65 + ptr.u * 0.9 + (ptr.down ? 0.25 : 0);
      } else {
        targetCoil = paramsRef.current.coil + Math.sin(t * 0.4) * 0.08;
      }
      const stepped = springStep(coil, targetCoil, coilV, 0.12, 0.84);
      coil = stepped.value;
      coilV = stepped.velocity;

      ctx.fillStyle = "rgba(12,14,18,0.22)";
      ctx.fillRect(0, 0, w, h);
      if (t < 0.05) {
        ctx.fillStyle = "#0c0e12";
        ctx.fillRect(0, 0, w, h);
      }

      // Faint path
      ctx.beginPath();
      const pathSteps = qualityScale(expanded, 80, 140);
      for (let i = 0; i <= pathSteps; i++) {
        const p = knotPoint(i / pathSteps, coil);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(100,140,180,0.25)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      const beadMul = paramsRef.current.beads;
      const flow = 0.0035 * (ptr.down && ptr.inside ? 1.6 : 1);
      for (let i = 0; i < nBeads; i++) {
        beadPhase[i] = (beadPhase[i] + flow * beadMul) % 1;
        const p = knotPoint(beadPhase[i], coil);
        const nearSource = beadPhase[i] < 0.04 || beadPhase[i] > 0.96;
        const sz = qualityScale(expanded, 2.2, 3.2) * (nearSource ? 1.4 : 1);
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        ctx.fillStyle = nearSource
          ? "rgba(200,230,255,0.85)"
          : i % 5 === 0
            ? "rgba(185,28,28,0.75)"
            : "rgba(90,150,210,0.7)";
        ctx.fill();
        if (expanded && nearSource) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 14);
          g.addColorStop(0, "rgba(180,220,255,0.35)");
          g.addColorStop(1, "rgba(12,14,18,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Source marker — stream returns here
      const src = knotPoint(0, coil);
      ctx.strokeStyle = "rgba(232,228,220,0.35)";
      ctx.lineWidth = 1;
      ctx.strokeRect(src.x - 8, src.y - 8, 16, 16);

      raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [pointerRef, expanded]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />
      <StageControlStrip>
        <StageSlider
          label="Coil"
          value={params.coil}
          min={0.6}
          max={1.6}
          step={0.05}
          onChange={(v) => setParams((p) => ({ ...p, coil: v }))}
        />
        <StageSlider
          label="Beads"
          value={params.beads}
          min={0.5}
          max={1.8}
          step={0.05}
          onChange={(v) => setParams((p) => ({ ...p, beads: v }))}
        />
      </StageControlStrip>
    </div>
  );
}
