"use client";

import { useEffect, useRef } from "react";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { springStep } from "@/lib/museum/spring";

/** Eccentric cam press — spring stamp leaving glowing ink. */
export function CamPressStage() {
  const ref = useRef<HTMLCanvasElement>(null);
  const inkRef = useRef(0);
  const pointerRef = useStagePointer(ref, {
    onClick: () => {
      inkRef.current = (inkRef.current + 1) % 4;
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
    let angle = 0;
    let headY = 0;
    let headV = 0;
    let lastImpact = -1;
    let glow = 0;
    let raf = 0;
    const inks = ["#b91c1c", "#e8e4dc", "#71717a", "#a8a49c"];

    const resize = () => {
      w = parent?.clientWidth || 800;
      h = parent?.clientHeight || 500;
      const dpr = Math.min(devicePixelRatio || 1, 2);
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
      pctx.fillStyle = "#0c0c0e";
      pctx.fillRect(0, 0, w, h);
      if (prev.width && prev.height) pctx.drawImage(prev, 0, 0, w, h);
    };
    resize();

    const frame = () => {
      const ptr = pointerRef.current;
      const rush = ptr.down && ptr.inside ? 2.6 : 1;
      angle += 0.035 * rush;

      const cam = Math.sin(angle);
      const cam2 = Math.sin(angle * 2 + 0.4);
      const target = 40 + cam * 70 + cam2 * 12;
      const stepped = springStep(headY, target, headV, 0.22, 0.78);
      headY = stepped.value;
      headV = stepped.velocity;

      const impactPhase = Math.floor((angle + Math.PI / 2) / (Math.PI * 2));
      if (impactPhase !== lastImpact && cam < -0.92) {
        lastImpact = impactPhase;
        glow = 1;
        const cx = w * 0.5 + Math.sin(angle * 0.5) * w * 0.12;
        const cy = h * 0.62 + headY * 0.15;
        const ink = inks[inkRef.current];
        pctx.save();
        pctx.globalAlpha = 0.55;
        pctx.fillStyle = ink;
        pctx.beginPath();
        pctx.ellipse(cx, cy, 18 + Math.random() * 10, 10 + Math.random() * 6, angle * 0.2, 0, Math.PI * 2);
        pctx.fill();
        // Soft bloom stamp
        const g = pctx.createRadialGradient(cx, cy, 2, cx, cy, 36);
        g.addColorStop(0, ink);
        g.addColorStop(1, "rgba(14,14,16,0)");
        pctx.globalAlpha = 0.28;
        pctx.fillStyle = g;
        pctx.beginPath();
        pctx.arc(cx, cy, 36, 0, Math.PI * 2);
        pctx.fill();
        pctx.restore();
      }
      glow *= 0.92;

      ctx.drawImage(plate, 0, 0, w, h);

      // Machine frame
      const mx = w * 0.5;
      const top = h * 0.12;
      ctx.fillStyle = "#1a1816";
      ctx.fillRect(mx - 90, top - 10, 180, 18);
      ctx.strokeStyle = "rgba(168,164,156,0.45)";
      ctx.strokeRect(mx - 90, top - 10, 180, 18);

      // Cams
      const drawCam = (cx: number, cy: number, a: number, r: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a);
        ctx.fillStyle = "#3f3f46";
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.62, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#a8a49c";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "#d4d4d8";
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      drawCam(mx - 48, top + 48, angle, 28);
      drawCam(mx + 48, top + 48, angle * 2 + 0.4, 22);

      // Push rods
      ctx.strokeStyle = "#a8a49c";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      const headX = mx;
      const hy = top + 90 + headY;
      ctx.beginPath();
      ctx.moveTo(mx - 48, top + 48);
      ctx.lineTo(headX - 20, hy - 20);
      ctx.moveTo(mx + 48, top + 48);
      ctx.lineTo(headX + 20, hy - 20);
      ctx.stroke();

      // Stamp head
      ctx.fillStyle = "#27272a";
      ctx.fillRect(headX - 34, hy - 16, 68, 28);
      ctx.strokeStyle = "#d4d4d8";
      ctx.strokeRect(headX - 34, hy - 16, 68, 28);
      ctx.fillStyle = inks[inkRef.current];
      ctx.fillRect(headX - 22, hy + 8, 44, 10);

      if (glow > 0.05) {
        const g = ctx.createRadialGradient(headX, hy + 18, 0, headX, hy + 18, 50);
        g.addColorStop(0, `rgba(185,28,28,${0.45 * glow})`);
        g.addColorStop(1, "rgba(14,14,16,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(headX, hy + 18, 50, 0, Math.PI * 2);
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
  }, [pointerRef]);

  return <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />;
}
