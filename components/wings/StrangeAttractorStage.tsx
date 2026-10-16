"use client";

import { useEffect, useRef } from "react";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { StageControlStrip, StageToggle } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";
import { setLiveParams } from "@/lib/museum/exhibitParams";
import { springStep } from "@/lib/museum/spring";
import { qualityScale } from "@/lib/museum/qualityScale";

const DEFAULTS = { a: -1.4, b: 1.6, c: 1.0, d: 0.7 };

/** Clifford attractor trails — pointer nudges parameters. */
export function StrangeAttractorStage({
  expanded = false,
  exhibitId,
}: {
  expanded?: boolean;
  exhibitId?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [params] = useSeededParams(exhibitId, DEFAULTS);
  const live = useRef({ ...params });
  const target = useRef({ ...params });
  const vel = useRef({ a: 0, b: 0, c: 0, d: 0 });
  const resetFlag = useRef(false);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

  useEffect(() => {
    live.current = { a: params.a, b: params.b, c: params.c, d: params.d };
    target.current = { ...live.current };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed restore once on mount
  }, []);

  useStagePointer(ref, {
    onMove: (p) => {
      if (!p.inside) return;
      target.current.a = -1.2 - p.u * 0.8;
      target.current.b = 1.2 + p.v * 0.9;
      if (p.down) {
        target.current.c = 0.6 + p.u * 1.2;
        target.current.d = 0.4 + p.v * 1.0;
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
    let ticks = 0;

    const resize = () => {
      const w = parent?.clientWidth || 800;
      const h = parent?.clientHeight || 500;
      const dpr = Math.min(devicePixelRatio || 1, qualityScale(expanded, 1.75, 2));
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
      if (resetFlag.current) {
        resetFlag.current = false;
        x = 0.1;
        y = 0.1;
        live.current = { ...DEFAULTS };
        target.current = { ...DEFAULTS };
        vel.current = { a: 0, b: 0, c: 0, d: 0 };
        ctx.fillStyle = "#0e0e10";
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        if (exhibitId) setLiveParams(exhibitId, { ...DEFAULTS });
      }

      for (const key of ["a", "b", "c", "d"] as const) {
        const s = springStep(live.current[key], target.current[key], vel.current[key], 0.12, 0.84);
        live.current[key] = s.value;
        vel.current[key] = s.velocity;
      }

      ticks++;
      if (exhibitId && ticks % 24 === 0) {
        setLiveParams(exhibitId, { ...live.current });
      }

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "rgba(14,14,16,0.04)";
      ctx.fillRect(0, 0, w, h);
      const { a, b, c, d } = live.current;
      const scale = Math.min(w, h) * 0.22;
      const iters = qualityScale(expandedRef.current, 800, 1400);

      for (let i = 0; i < iters; i++) {
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
  }, [expanded, exhibitId]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />
      {expanded ? (
        <StageControlStrip>
          <StageToggle
            label="Reset"
            active={false}
            onClick={() => {
              resetFlag.current = true;
            }}
          />
        </StageControlStrip>
      ) : null}
    </div>
  );
}
