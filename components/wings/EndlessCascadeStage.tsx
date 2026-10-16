"use client";

import { useEffect, useRef } from "react";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { StageControlStrip, StageSlider } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";
import { qualityScale } from "@/lib/museum/qualityScale";

type Drop = { s: number; side: 0 | 1 | 2 | 3; life: number };

/** Impossible closed water loop — climbs, falls, returns. */
export function EndlessCascadeStage({
  exhibitId,
  expanded = false,
}: {
  exhibitId?: string;
  expanded?: boolean;
} = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useSeededParams(exhibitId, { flow: 1, join: 0.5 });
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
    const drops: Drop[] = [];
    const cap = Math.round(qualityScale(expanded, 120, 220));

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

    const channel = () => {
      const mx = w * 0.5;
      const my = h * 0.48;
      const rw = Math.min(w, h) * 0.28;
      const rh = Math.min(w, h) * 0.22;
      return { mx, my, rw, rh };
    };

    /** Map progress 0–1 around the closed loop (with impossible vertical climb). */
    const posAt = (s: number, joinBias: number) => {
      const { mx, my, rw, rh } = channel();
      const u = ((s % 1) + 1) % 1;
      // Four segments: fall right, bottom return, climb left (impossible), top cross
      if (u < 0.28) {
        const p = u / 0.28;
        return { x: mx + rw * 0.85, y: my - rh + p * (rh * 2.1) };
      }
      if (u < 0.5) {
        const p = (u - 0.28) / 0.22;
        return { x: mx + rw * 0.85 - p * rw * 1.7, y: my + rh * 1.05 };
      }
      if (u < 0.78) {
        const p = (u - 0.5) / 0.28;
        // Climb: water goes up the left channel
        const wobble = Math.sin(p * Math.PI * 3 + t * 2) * 4;
        return { x: mx - rw * 0.85 + wobble + (joinBias - 0.5) * 28, y: my + rh - p * (rh * 2.1) };
      }
      const p = (u - 0.78) / 0.22;
      return { x: mx - rw * 0.85 + p * rw * 1.7, y: my - rh * 0.95 };
    };

    for (let i = 0; i < cap; i++) {
      drops.push({
        s: i / cap,
        side: (i % 4) as 0 | 1 | 2 | 3,
        life: 0.6 + Math.random() * 0.4,
      });
    }

    const frame = () => {
      t += 0.016;
      const ptr = pointerRef.current;
      let join = paramsRef.current.join;
      let flow = paramsRef.current.flow;
      if (ptr.inside) {
        join = ptr.u;
        if (ptr.down) flow = Math.min(2.2, flow * 1.015 + 0.02);
      } else {
        join = 0.5 + Math.sin(t * 0.35) * 0.12;
      }
      paramsRef.current = { ...paramsRef.current, join, flow: ptr.down && ptr.inside ? flow : paramsRef.current.flow };

      ctx.fillStyle = "#0c1014";
      ctx.fillRect(0, 0, w, h);

      const { mx, my, rw, rh } = channel();
      // Machine frame
      ctx.strokeStyle = "rgba(168,180,196,0.35)";
      ctx.lineWidth = 2;
      ctx.strokeRect(mx - rw - 18, my - rh - 18, rw * 2 + 36, rh * 2 + 36);
      ctx.fillStyle = "#1a222c";
      ctx.fillRect(mx - rw - 8, my - rh - 8, rw * 2 + 16, rh * 2 + 16);

      // Impossible joint highlight
      const joint = posAt(0.5, join);
      const g = ctx.createRadialGradient(joint.x, joint.y, 2, joint.x, joint.y, 40);
      g.addColorStop(0, "rgba(56,140,200,0.35)");
      g.addColorStop(1, "rgba(12,16,20,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(joint.x, joint.y, 40, 0, Math.PI * 2);
      ctx.fill();

      const speed = 0.0042 * flow * (ptr.down && ptr.inside ? 1.55 : 1);
      for (const d of drops) {
        d.s = (d.s + speed * (0.85 + d.life * 0.3)) % 1;
        const p = posAt(d.s, join);
        const climb = d.s >= 0.5 && d.s < 0.78;
        ctx.fillStyle = climb
          ? `rgba(120,190,230,${0.45 + d.life * 0.4})`
          : `rgba(70,140,200,${0.35 + d.life * 0.45})`;
        const sz = qualityScale(expanded, 1.6, 2.2) * (0.7 + d.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        ctx.fill();
        if (expanded && climb) {
          ctx.fillStyle = "rgba(200,230,255,0.15)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, sz * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Splash at fall foot
      const foot = posAt(0.27, join);
      ctx.fillStyle = "rgba(180,210,230,0.2)";
      ctx.beginPath();
      ctx.ellipse(foot.x, foot.y + 6, 22 + Math.sin(t * 8) * 4, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [pointerRef, expanded, exhibitId]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />
      <StageControlStrip>
        <StageSlider
          label="Flow"
          value={params.flow}
          min={0.4}
          max={2}
          step={0.05}
          onChange={(v) => setParams((p) => ({ ...p, flow: v }))}
        />
        <StageSlider
          label="Join"
          value={params.join}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => setParams((p) => ({ ...p, join: v }))}
        />
      </StageControlStrip>
    </div>
  );
}
