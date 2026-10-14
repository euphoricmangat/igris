"use client";

import { useEffect, useRef } from "react";
import { useStagePointer } from "@/components/museum/useStagePointer";

/** Clifford attractor trails — pointer nudges parameters. */
export function StrangeAttractorStage() {
  const ref = useRef<HTMLCanvasElement>(null);
  const params = useRef({ a: -1.4, b: 1.6, c: 1.0, d: 0.7 });

  useStagePointer(ref, {
    onMove: (p) => {
      if (!p.inside) return;
      params.current.a = -1.2 - p.u * 0.8;
      params.current.b = 1.2 + p.v * 0.9;
      if (p.down) {
        params.current.c = 0.6 + p.u * 1.2;
        params.current.d = 0.4 + p.v * 1.0;
      }
    },
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    let raf = 0;
    let x = 0.1;
    let y = 0.1;

    const resize = () => {
      const w = parent?.clientWidth || 800;
      const h = parent?.clientHeight || 500;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#0e0e10";
      ctx.fillRect(0, 0, w, h);
    };
    resize();

    const frame = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "rgba(14,14,16,0.04)";
      ctx.fillRect(0, 0, w, h);
      const { a, b, c, d } = params.current;
      const scale = Math.min(w, h) * 0.22;

      for (let i = 0; i < 800; i++) {
        const nx = Math.sin(a * y) + c * Math.cos(a * x);
        const ny = Math.sin(b * x) + d * Math.cos(b * y);
        x = nx;
        y = ny;
        const px = w / 2 + x * scale;
        const py = h / 2 + y * scale;
        ctx.fillStyle = i % 40 === 0 ? "#b91c1c" : "rgba(232,228,220,0.35)";
        ctx.fillRect(px, py, 1, 1);
      }
      raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />;
}
