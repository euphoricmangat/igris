"use client";

import { useEffect, useRef } from "react";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { StageControlStrip, StageSlider } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";
import { qualityScale } from "@/lib/museum/qualityScale";

/** Two-joint ink arm that never stops writing — art accumulates on the plate. */
export function PlotterArmStage({
  exhibitId,
  expanded = false,
}: {
  exhibitId?: string;
  expanded?: boolean;
} = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const clearPlate = useRef(false);
  const lastClick = useRef(0);
  const [params, setParams] = useSeededParams(exhibitId, { inkWeight: 1, ambient: 1 });
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const pointerRef = useStagePointer(ref, {
    onClick: () => {
      const now = performance.now();
      if (now - lastClick.current < 380) clearPlate.current = true;
      lastClick.current = now;
    },
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;

    const plate = document.createElement("canvas");
    const pctx = plate.getContext("2d");
    if (!pctx) return;

    let w = 800;
    let h = 500;
    let t = 0;
    let ink = 0;
    let last: { x: number; y: number } | null = null;
    let raf = 0;

    const resize = () => {
      w = parent?.clientWidth || 800;
      h = parent?.clientHeight || 500;
      const dpr = Math.min(devicePixelRatio || 1, qualityScale(expanded, 1.75, 2));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const prev = document.createElement("canvas");
      prev.width = plate.width || w;
      prev.height = plate.height || h;
      prev.getContext("2d")?.drawImage(plate, 0, 0);
      plate.width = w;
      plate.height = h;
      pctx.fillStyle = "#0e0e10";
      pctx.fillRect(0, 0, w, h);
      if (prev.width && prev.height) {
        pctx.drawImage(prev, 0, 0, w, h);
      }
    };
    resize();

    const L1 = () => Math.min(w, h) * 0.28;
    const L2 = () => Math.min(w, h) * 0.34;
    const origin = () => ({ x: w * 0.5, y: h * 0.12 });
    const inkScale = qualityScale(expanded, 1, 1.45);

    const frame = () => {
      if (clearPlate.current) {
        clearPlate.current = false;
        pctx.fillStyle = "#0e0e10";
        pctx.fillRect(0, 0, w, h);
        last = null;
      }

      const ambient = paramsRef.current.ambient;
      t += 0.016 * ambient;
      const ptr = pointerRef.current;
      const o = origin();
      const l1 = L1();
      const l2 = L2();

      let tx = w * 0.5 + Math.sin(t * 0.55) * w * 0.28 + Math.sin(t * 0.19) * w * 0.08;
      let ty = h * 0.55 + Math.cos(t * 0.41) * h * 0.22 + Math.sin(t * 0.27) * h * 0.06;
      if (ptr.inside) {
        const blend = ptr.down ? 0.72 : 0.35;
        tx = tx * (1 - blend) + ptr.x * blend;
        ty = ty * (1 - blend) + ptr.y * blend;
      }

      const dx = tx - o.x;
      const dy = ty - o.y;
      const dist = Math.min(Math.hypot(dx, dy), l1 + l2 - 1);
      const reach = Math.max(dist, Math.abs(l1 - l2) + 1);
      const cosA2 = (reach * reach - l1 * l1 - l2 * l2) / (2 * l1 * l2);
      const a2 = Math.acos(Math.max(-1, Math.min(1, cosA2)));
      const a1 =
        Math.atan2(dy, dx) - Math.atan2(l2 * Math.sin(a2), l1 + l2 * Math.cos(a2));

      const e = { x: o.x + Math.cos(a1) * l1, y: o.y + Math.sin(a1) * l1 };
      const tip = {
        x: e.x + Math.cos(a1 + a2) * l2,
        y: e.y + Math.sin(a1 + a2) * l2,
      };

      const weight = paramsRef.current.inkWeight;
      const press = (ptr.down ? 2.4 : 1.15) * weight * inkScale;
      if (last) {
        const speed = Math.hypot(tip.x - last.x, tip.y - last.y);
        pctx.strokeStyle = ink % 3 === 0 ? "#b91c1c" : ink % 3 === 1 ? "#e8e4dc" : "#71717a";
        pctx.globalAlpha = Math.min(0.85, 0.25 + press * 0.2);
        pctx.lineWidth = press * (0.7 + Math.min(2.2, speed * 0.35));
        pctx.lineCap = "round";
        pctx.lineJoin = "round";
        pctx.beginPath();
        pctx.moveTo(last.x, last.y);
        pctx.lineTo(tip.x, tip.y);
        pctx.stroke();
        pctx.globalAlpha = 1;
      }
      last = tip;
      if (ptr.down && Math.random() < 0.02) ink++;

      ctx.drawImage(plate, 0, 0, w, h);

      ctx.strokeStyle = "rgba(232,228,220,0.08)";
      ctx.lineWidth = 1;
      ctx.strokeRect(18, 18, w - 36, h - 36);

      ctx.fillStyle = "#1a1816";
      ctx.fillRect(o.x - 28, 4, 56, 18);
      ctx.strokeStyle = "rgba(168,164,156,0.45)";
      ctx.strokeRect(o.x - 28, 4, 56, 18);

      ctx.strokeStyle = "#a8a49c";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(o.x, o.y);
      ctx.lineTo(e.x, e.y);
      ctx.lineTo(tip.x, tip.y);
      ctx.stroke();

      ctx.strokeStyle = "rgba(14,14,16,0.55)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(o.x, o.y);
      ctx.lineTo(e.x, e.y);
      ctx.lineTo(tip.x, tip.y);
      ctx.stroke();

      for (const j of [o, e]) {
        ctx.beginPath();
        ctx.arc(j.x, j.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#d4d4d8";
        ctx.fill();
        ctx.strokeStyle = "#0e0e10";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(tip.x, tip.y, ptr.down ? 4.5 : 3.2, 0, Math.PI * 2);
      ctx.fillStyle = "#b91c1c";
      ctx.fill();

      ctx.strokeStyle = "rgba(113,113,122,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(o.x + 20, 14);
      ctx.quadraticCurveTo(o.x + 60, o.y + 40, e.x, e.y);
      ctx.stroke();

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
          label="Ink"
          value={params.inkWeight}
          min={0.5}
          max={2}
          step={0.05}
          onChange={(v) => setParams((p) => ({ ...p, inkWeight: v }))}
        />
        <StageSlider
          label="Ambient"
          value={params.ambient}
          min={0.4}
          max={1.8}
          step={0.05}
          onChange={(v) => setParams((p) => ({ ...p, ambient: v }))}
        />
        <p className="pointer-events-none accession text-[rgba(232,228,220,0.45)]">
          Double-click clears
        </p>
      </StageControlStrip>
    </div>
  );
}
