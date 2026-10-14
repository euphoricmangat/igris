"use client";

import { useEffect, useRef } from "react";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { springStep } from "@/lib/museum/spring";

type Filing = { x: number; y: number; angle: number; v: number };

/** Magnetic filings aligning to a pointer pole. */
export function IronLatticeStage() {
  const ref = useRef<HTMLCanvasElement>(null);
  const pointerRef = useStagePointer(ref);

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
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.floor(w / 14);
      const rows = Math.floor(h / 14);
      filings = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          filings.push({
            x: 10 + c * 14 + (r % 2) * 7,
            y: 10 + r * 14,
            angle: Math.random() * Math.PI,
            v: 0,
          });
        }
      }
    };
    resize();

    const frame = () => {
      const ptr = pointerRef.current;
      const px = ptr.inside ? ptr.x : w * 0.5;
      const py = ptr.inside ? ptr.y : h * 0.45;
      const strength = ptr.down ? 2.4 : 1.35;

      ctx.fillStyle = "#0e0e10";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(212,212,216,0.55)";
      ctx.lineWidth = 1.1;
      ctx.lineCap = "round";

      for (const f of filings) {
        const dx = px - f.x;
        const dy = py - f.y;
        const dist = Math.hypot(dx, dy) + 0.001;
        const target = Math.atan2(dy, dx) + (strength * 18) / dist;
        const stepped = springStep(f.angle, target, f.v, 0.1, 0.86);
        f.angle = stepped.value;
        f.v = stepped.velocity;

        const len = 5 + Math.min(7, (strength * 40) / dist);
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

      // Pole glow
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
  }, [pointerRef]);

  return <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />;
}
