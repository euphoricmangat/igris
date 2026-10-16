"use client";

import { useEffect, useRef } from "react";
import { makeRng } from "@/lib/rng";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { StageControlStrip, StageSlider } from "@/components/museum/StageControls";
import { idleLissajousPx } from "@/hooks/useIdleLissajous";
import { useSeededParams } from "@/hooks/useSeededParams";
import { qualityScale } from "@/lib/museum/qualityScale";

/** Double pendulum shedding ember sand — glowing tip, bloom floor, steel rods. */
export function SandPendulumStage({
  exhibitId,
  expanded = false,
}: {
  exhibitId?: string;
  expanded?: boolean;
} = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const clearRef = useRef(false);
  const [params, setParams] = useSeededParams(exhibitId, { damp: 0.9994, sand: 1 });
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const pointerRef = useStagePointer(ref, {
    onClick: () => {
      clearRef.current = true;
    },
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;

    const floor = document.createElement("canvas");
    const fctx = floor.getContext("2d");
    if (!fctx) return;
    const bloom = document.createElement("canvas");
    const bctx = bloom.getContext("2d");
    if (!bctx) return;

    let w = 800;
    let h = 500;
    let raf = 0;
    let t = 0;

    const rng = makeRng(exhibitId ?? "sand-pendulum");
    let a1 = Math.PI * (0.45 + rng() * 0.4);
    let a2 = Math.PI * (0.2 + rng() * 0.45);
    let v1 = (rng() - 0.5) * 0.08;
    let v2 = (rng() - 0.5) * 0.08;
    const g = 0.85;
    const m1 = 1.1;
    const m2 = 1;
    let hueFlip = 0;
    let prevTip = { x: 0, y: 0, ok: false };

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
      prev.width = floor.width || w;
      prev.height = floor.height || h;
      prev.getContext("2d")?.drawImage(floor, 0, 0);
      floor.width = w;
      floor.height = h;
      bloom.width = w;
      bloom.height = h;
      fctx.fillStyle = "#0c0c0e";
      fctx.fillRect(0, 0, w, h);
      if (prev.width && prev.height) fctx.drawImage(prev, 0, 0, w, h);
    };
    resize();

    const pivot = () => ({ x: w * 0.5, y: h * 0.14 });
    const L1 = () => Math.min(w, h) * 0.22;
    const L2 = () => Math.min(w, h) * 0.26;

    const stepPhysics = (dt: number) => {
      for (let i = 0; i < 2; i++) {
        const l1 = L1();
        const l2 = L2();
        const num1 =
          -g * (2 * m1 + m2) * Math.sin(a1) -
          m2 * g * Math.sin(a1 - 2 * a2) -
          2 *
            Math.sin(a1 - a2) *
            m2 *
            (v2 * v2 * l2 + v1 * v1 * l1 * Math.cos(a1 - a2));
        const den = 2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2);
        const num2 =
          2 *
          Math.sin(a1 - a2) *
          (v1 * v1 * l1 * (m1 + m2) +
            g * (m1 + m2) * Math.cos(a1) +
            v2 * v2 * l2 * m2 * Math.cos(a1 - a2));
        const aa1 = num1 / (den * l1);
        const aa2 = num2 / (den * l2);
        v1 += aa1 * dt;
        v2 += aa2 * dt;
        a1 += v1 * dt;
        a2 += v2 * dt;
        const d = paramsRef.current.damp;
        v1 *= d;
        v2 *= d;
      }
    };

    const frame = () => {
      t += 0.016;
      const ptr = pointerRef.current;
      const p = pivot();
      const l1 = L1();
      const l2 = L2();

      if (clearRef.current) {
        fctx.fillStyle = "#0c0c0e";
        fctx.fillRect(0, 0, w, h);
        clearRef.current = false;
        hueFlip++;
        prevTip.ok = false;
      }

      if (ptr.down && ptr.inside) {
        const x1 = p.x + Math.sin(a1) * l1;
        const y1 = p.y + Math.cos(a1) * l1;
        const x2 = x1 + Math.sin(a2) * l2;
        const y2 = y1 + Math.cos(a2) * l2;
        const dx = ptr.x - x2;
        const dy = ptr.y - y2;
        v1 += (Math.atan2(dx, dy + 1) - a1) * 0.004;
        v2 += (Math.atan2(ptr.x - x1, ptr.y - y1 + 1) - a2) * 0.006;
        v1 += dx * 0.00002;
        v2 += dy * 0.00003;
      } else if (!ptr.inside) {
        // Gentle idle Lissajous drive so small canvases don't settle dull
        const idle = idleLissajousPx(t * 0.4, w, h);
        const x1 = p.x + Math.sin(a1) * l1;
        const y1 = p.y + Math.cos(a1) * l1;
        v1 += (Math.atan2(idle.x - x1, idle.y - y1 + 1) - a1) * 0.0008;
        v2 += (Math.atan2(idle.x - x1, idle.y - y1 + 1) - a2) * 0.001;
      }

      if (Math.hypot(v1, v2) < 0.08) {
        v1 += (Math.random() - 0.5) * 0.02;
        v2 += (Math.random() - 0.5) * 0.03;
      }

      stepPhysics(0.045);

      const x1 = p.x + Math.sin(a1) * l1;
      const y1 = p.y + Math.cos(a1) * l1;
      const x2 = x1 + Math.sin(a2) * l2;
      const y2 = y1 + Math.cos(a2) * l2;

      const speed = Math.hypot(v1 * l1, v2 * l2);
      const grainCap = qualityScale(expanded, 5, 9);
      const sand = paramsRef.current.sand;
      const grains =
        1 +
        Math.min(grainCap, Math.floor(speed * qualityScale(expanded, 9, 14) * sand));
      for (let i = 0; i < grains; i++) {
        const jx = x2 + (Math.random() - 0.5) * 2.8;
        const jy = y2 + (Math.random() - 0.5) * 2.8;
        const ember = Math.random() > 0.72;
        fctx.fillStyle =
          hueFlip % 2 === 0
            ? ember
              ? "rgba(255,90,40,0.55)"
              : "rgba(185,28,28,0.45)"
            : ember
              ? "rgba(232,228,220,0.5)"
              : "rgba(185,28,28,0.35)";
        fctx.fillRect(jx, jy, 1.4, 1.4);

        // Soft bloom grain
        if (ember) {
          const g = fctx.createRadialGradient(jx, jy, 0, jx, jy, 5);
          g.addColorStop(0, "rgba(255,120,60,0.22)");
          g.addColorStop(1, "rgba(14,14,16,0)");
          fctx.fillStyle = g;
          fctx.beginPath();
          fctx.arc(jx, jy, 5, 0, Math.PI * 2);
          fctx.fill();
        }
      }

      // Floor with subtle glow pass
      bctx.clearRect(0, 0, w, h);
      bctx.globalAlpha = 0.45;
      bctx.filter = "blur(3px)";
      bctx.drawImage(floor, 0, 0);
      bctx.filter = "none";
      bctx.globalAlpha = 1;

      ctx.drawImage(floor, 0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.35;
      ctx.drawImage(bloom, 0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      // Warm mount light
      const mountGlow = ctx.createRadialGradient(p.x, 8, 0, p.x, 8, 90);
      mountGlow.addColorStop(0, "rgba(255,220,180,0.12)");
      mountGlow.addColorStop(1, "rgba(14,14,16,0)");
      ctx.fillStyle = mountGlow;
      ctx.fillRect(p.x - 90, 0, 180, 100);

      ctx.fillStyle = "#1a1816";
      ctx.fillRect(p.x - 40, 0, 80, 18);
      ctx.strokeStyle = "rgba(212,212,216,0.5)";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(p.x - 40, 0, 80, 18);

      // Specular steel rods
      const rodGrad = ctx.createLinearGradient(p.x, p.y, x2, y2);
      rodGrad.addColorStop(0, "#e8e4dc");
      rodGrad.addColorStop(0.45, "#a8a49c");
      rodGrad.addColorStop(1, "#71717a");
      ctx.strokeStyle = rodGrad;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(232,228,220,0.25)";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Motion blur ghost of tip bob
      if (prevTip.ok) {
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(prevTip.x, prevTip.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#b91c1c";
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Mid bob
      ctx.beginPath();
      ctx.arc(x1, y1, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#d4d4d8";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.stroke();

      // Tip bob + glowing aperture
      const tipGlow = ctx.createRadialGradient(x2, y2, 0, x2, y2, 22);
      tipGlow.addColorStop(0, "rgba(255,140,70,0.55)");
      tipGlow.addColorStop(0.5, "rgba(185,28,28,0.28)");
      tipGlow.addColorStop(1, "rgba(14,14,16,0)");
      ctx.fillStyle = tipGlow;
      ctx.beginPath();
      ctx.arc(x2, y2, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x2, y2, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#b91c1c";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x2, y2 + 5, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = "#ffe4c8";
      ctx.shadowColor = "#ff8a3a";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      prevTip = { x: x2, y: y2, ok: true };
      raf = requestAnimationFrame(frame);
    };
    frame();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [pointerRef, exhibitId, expanded]);

  return (
    <div className="absolute inset-0 h-full w-full bg-[#0e0e10]">
      <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />
      <StageControlStrip>
        <StageSlider
          label="Damp"
          value={params.damp}
          min={0.997}
          max={0.9998}
          step={0.0001}
          onChange={(v) => setParams((p) => ({ ...p, damp: v }))}
        />
        <StageSlider
          label="Sand"
          value={params.sand}
          min={0.3}
          max={2}
          step={0.05}
          onChange={(v) => setParams((p) => ({ ...p, sand: v }))}
        />
      </StageControlStrip>
    </div>
  );
}
