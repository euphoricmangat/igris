"use client";

import { useEffect, useRef } from "react";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { StageControlStrip, StageSlider } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";
import { qualityScale } from "@/lib/museum/qualityScale";
import { springStep } from "@/lib/museum/spring";

/** Self-driving belt / wheel — always turns; hold to load. */
export function ClosedTreadStage({
  exhibitId,
  expanded = false,
}: {
  exhibitId?: string;
  expanded?: boolean;
} = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useSeededParams(exhibitId, { drive: 1, load: 0.35 });
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
    let angle = 0;
    let speed = 0.04;
    let speedV = 0;
    let t = 0;
    const segs = Math.round(qualityScale(expanded, 18, 28));

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

    const frame = () => {
      t += 0.016;
      const ptr = pointerRef.current;
      const drive = paramsRef.current.drive;
      const baseLoad = paramsRef.current.load;
      const held = ptr.down && ptr.inside;
      const targetSpeed = drive * 0.055 * (held ? 0.35 + (1 - baseLoad) * 0.25 : 1);
      // Idle self-drive never quite stops
      const idleBoost = 0.012 + Math.sin(t * 0.7) * 0.004;
      const stepped = springStep(speed, targetSpeed + idleBoost, speedV, 0.1, 0.86);
      speed = Math.max(0.008, stepped.value);
      speedV = stepped.velocity;
      angle += speed;

      ctx.fillStyle = "#0e0e10";
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.52;
      const R = Math.min(w, h) * 0.28;
      const rInner = R * 0.55;

      // Frame
      ctx.fillStyle = "#1a1816";
      ctx.fillRect(cx - R - 40, cy - 16, R * 2 + 80, 32);
      ctx.strokeStyle = "rgba(168,164,156,0.4)";
      ctx.strokeRect(cx - R - 40, cy - 16, R * 2 + 80, 32);

      // Outer rim
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "#a8a49c";
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
      ctx.strokeStyle = "#71717a";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Belt segments that "drive themselves"
      for (let i = 0; i < segs; i++) {
        const a = angle + (i / segs) * Math.PI * 2;
        const x0 = cx + Math.cos(a) * R;
        const y0 = cy + Math.sin(a) * R;
        const x1 = cx + Math.cos(a) * (R - 14);
        const y1 = cy + Math.sin(a) * (R - 14);
        const hot = Math.sin(a * 3 + t) > 0.6;
        ctx.strokeStyle = hot ? "#b91c1c" : "#d4d4d8";
        ctx.lineWidth = qualityScale(expanded, 2.2, 3.2);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }

      // Hub
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fillStyle = "#d4d4d8";
      ctx.fill();
      ctx.strokeStyle = "#0e0e10";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Load indicator when held
      if (held) {
        const g = ctx.createRadialGradient(cx, cy, rInner, cx, cy, R + 20);
        g.addColorStop(0, "rgba(185,28,28,0.08)");
        g.addColorStop(1, "rgba(14,14,16,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, R + 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // Paradox caption mark — arrow that closes on itself
      ctx.strokeStyle = "rgba(185,28,28,0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy - R - 28, 10, 0.2, Math.PI * 1.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 8, cy - R - 22);
      ctx.lineTo(cx + 2, cy - R - 18);
      ctx.lineTo(cx + 10, cy - R - 16);
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
          label="Drive"
          value={params.drive}
          min={0.4}
          max={1.8}
          step={0.05}
          onChange={(v) => setParams((p) => ({ ...p, drive: v }))}
        />
        <StageSlider
          label="Load"
          value={params.load}
          min={0.1}
          max={0.9}
          step={0.05}
          onChange={(v) => setParams((p) => ({ ...p, load: v }))}
        />
      </StageControlStrip>
    </div>
  );
}
