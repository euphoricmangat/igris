"use client";

import { useEffect, useRef } from "react";
import { makeRng } from "@/lib/rng";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { StageControlStrip, StageToggle } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";
import { springStep } from "@/lib/museum/spring";
import { qualityScale } from "@/lib/museum/qualityScale";

type C = { x: number; y: number; r: number; vr: number; growing: boolean; c: string };

export function CirclePackStage({
  seed = "igris-pack",
  expanded = false,
  exhibitId,
}: {
  seed?: string;
  expanded?: boolean;
  exhibitId?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const growingRef = useRef<C | null>(null);
  const commitRef = useRef<C | null>(null);
  const [params, setParams] = useSeededParams(exhibitId, { pauseAuto: 0 });
  const pauseRef = useRef(params.pauseAuto > 0.5);
  pauseRef.current = params.pauseAuto > 0.5;
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

  useStagePointer(ref, {
    onDown: (p) => {
      growingRef.current = {
        x: p.x,
        y: p.y,
        r: 2,
        vr: 0,
        growing: true,
        c: ["#e8e4dc", "#b91c1c", "#71717a", "#a1a1aa", "#fafafa"][(Math.random() * 5) | 0],
      };
    },
    onMove: (p) => {
      if (growingRef.current && p.down) {
        growingRef.current.x = p.x;
        growingRef.current.y = p.y;
      }
    },
    onUp: () => {
      if (growingRef.current) {
        commitRef.current = { ...growingRef.current, growing: false };
        growingRef.current = null;
      }
    },
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    const rng = makeRng(seed);

    const colors = ["#e8e4dc", "#b91c1c", "#71717a", "#a1a1aa", "#fafafa"];
    let circles: C[] = [];
    let raf = 0;

    const resize = () => {
      const w = parent?.clientWidth || 800;
      const h = parent?.clientHeight || 500;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      circles = [];
      ctx.fillStyle = "#0e0e10";
      ctx.fillRect(0, 0, w, h);
    };
    resize();

    const fits = (c: C) => {
      if (
        c.x - c.r < 8 ||
        c.y - c.r < 8 ||
        c.x + c.r > canvas.clientWidth - 8 ||
        c.y + c.r > canvas.clientHeight - 8
      )
        return false;
      for (const o of circles) {
        if (Math.hypot(c.x - o.x, c.y - o.y) < c.r + o.r + 1.5) return false;
      }
      return true;
    };

    const frame = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "rgba(14,14,16,0.08)";
      ctx.fillRect(0, 0, w, h);

      if (commitRef.current) {
        const c = commitRef.current;
        commitRef.current = null;
        if (c.r > 2) circles.push(c);
      }

      const active = growingRef.current;
      if (active) {
        const targetR = active.r + 0.9;
        const stepped = springStep(active.r, targetR, active.vr, 0.2, 0.78);
        const next = { ...active, r: stepped.value, vr: stepped.velocity };
        if (fits(next)) {
          active.r = next.r;
          active.vr = next.vr;
        } else {
          circles.push({ ...active, growing: false, vr: 0 });
          growingRef.current = null;
        }
      } else if (!pauseRef.current) {
        for (let i = 0; i < 2; i++) {
          const nc: C = {
            x: 20 + rng() * (w - 40),
            y: 20 + rng() * (h - 40),
            r: 2,
            vr: 0,
            growing: true,
            c: colors[(rng() * colors.length) | 0],
          };
          if (fits(nc)) circles.push(nc);
        }
      }

      for (const c of circles) {
        if (c.growing) {
          const stepped = springStep(c.r, c.r + 0.55, c.vr, 0.18, 0.8);
          const trial = { ...c, r: stepped.value };
          if (fits(trial)) {
            c.r = stepped.value;
            c.vr = stepped.velocity;
          } else {
            c.growing = false;
            c.vr = 0;
          }
        }
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.strokeStyle = c.c;
        ctx.globalAlpha = 0.75;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      if (growingRef.current) {
        const g = growingRef.current;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.strokeStyle = g.c;
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      const cap = qualityScale(expandedRef.current, 420, 620);
      if (circles.length > cap) circles = circles.filter((c) => c.r > 6).slice(-Math.floor(cap * 0.66));
      raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [seed, expanded]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className="h-full w-full touch-none cursor-cell" />
      {expanded ? (
        <StageControlStrip>
          <StageToggle
            label={params.pauseAuto > 0.5 ? "Auto off" : "Auto on"}
            active={params.pauseAuto > 0.5}
            onClick={() =>
              setParams((p) => ({ ...p, pauseAuto: p.pauseAuto > 0.5 ? 0 : 1 }))
            }
          />
        </StageControlStrip>
      ) : null}
    </div>
  );
}
