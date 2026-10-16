"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { defineMaterial, FragCanvas, useFrame, usePointer } from "spektral/react";
import { useStagePointer } from "@/components/museum/useStagePointer";
import { StageControlStrip, StageSlider } from "@/components/museum/StageControls";
import { useSeededParams } from "@/hooks/useSeededParams";
import { idleLissajous } from "@/hooks/useIdleLissajous";
import { qualityScale } from "@/lib/museum/qualityScale";

const PULSE_WGSL = /* wgsl */ `
fn frag(uv: vec2f) -> vec4f {
  let p = uv - uPointer;
  let d = length(p) * 1.35;
  var col = vec3f(0.055, 0.055, 0.063);
  let pulse = 0.5 + 0.5 * sin(uTime * (uSpeed + 0.2) + uKick * 3.0);
  let rings = i32(clamp(uRings, 6.0, 22.0));
  for (var i = 0; i < 22; i++) {
    if (i >= rings) { break; }
    let phase = uTime * uSpeed + uKick * 3.0 + f32(i) * 0.45;
    let r = fract(phase * 0.08 + d) ;
    let band = smoothstep(0.04, 0.0, abs(r - 0.12));
    let alpha = band * (0.25 + pulse * 0.55) * (1.0 - d);
    col += vec3f(0.72, 0.11, 0.11) * alpha;
  }
  let vig = smoothstep(1.1, 0.15, d);
  col = mix(col * 0.45, col, vig);
  return vec4f(col, 1.0);
}
`;

function SpektralDriver({
  speed,
  rings,
  kickRef,
}: {
  speed: number;
  rings: number;
  kickRef: React.MutableRefObject<number>;
}) {
  const { state, lastClick, resetClick } = usePointer({
    onClick: () => {
      kickRef.current = 1;
    },
  });

  useFrame((frame) => {
    kickRef.current *= 0.92;
    frame.setUniform("uTime", frame.time);
    frame.setUniform("uKick", kickRef.current);
    frame.setUniform("uSpeed", speed);
    frame.setUniform("uRings", rings);
    const s = state.current;
    if (s.inside) {
      frame.setUniform("uPointer", [s.uv[0], s.uv[1]] as const);
    } else {
      const idle = idleLissajous(frame.time);
      frame.setUniform("uPointer", [idle.u, idle.v] as const);
    }
    if (lastClick.current) resetClick();
  });

  return null;
}

function CanvasPulseFallback({
  speed,
  rings,
  setSpeed,
  setRings,
  expanded,
}: {
  speed: number;
  rings: number;
  setSpeed: (v: number) => void;
  setRings: (v: number) => void;
  expanded: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const kickRef = useRef(0);
  const params = useRef({ speed, rings });
  params.current = { speed, rings };

  const pointerRef = useStagePointer(ref, {
    onClick: () => {
      kickRef.current = 1;
    },
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    let raf = 0;
    let t0 = performance.now();
    const ringBoost = qualityScale(expanded, 0, 4);
    const lineBoost = qualityScale(expanded, 1, 1.35);

    const resize = () => {
      const w = parent?.clientWidth || 800;
      const h = parent?.clientHeight || 500;
      const dpr = Math.min(devicePixelRatio || 1, qualityScale(expanded, 1.75, 2));
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const frame = (now: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 2 || h < 2) {
        raf = requestAnimationFrame(frame);
        return;
      }

      const t = (now - t0) / 1000;
      kickRef.current *= 0.92;
      const kick = kickRef.current;
      const ptr = pointerRef.current;
      const idle = idleLissajous(t);
      const cx = (ptr.inside ? ptr.u : idle.u) * w;
      const cy = (ptr.inside ? ptr.v : idle.v) * h;
      const spd = params.current.speed;
      const ringCount = Math.round(params.current.rings) + ringBoost;

      ctx.fillStyle = "#0e0e10";
      ctx.fillRect(0, 0, w, h);

      const maxR = Math.hypot(w, h) * 0.55;
      for (let i = 0; i < ringCount; i++) {
        const phase = t * spd + kick * 3 + i * 0.45;
        const pulse = 0.5 + 0.5 * Math.sin(t * (spd + 0.2) + kick * 3);
        const r = ((phase * 40) % maxR) + 8;
        const alpha = (1 - r / maxR) * (0.25 + pulse * 0.45);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(185,28,28,${alpha.toFixed(3)})`;
        ctx.lineWidth = (1.5 + pulse) * lineBoost;
        ctx.stroke();
      }

      const vig = ctx.createRadialGradient(cx, cy, 20, cx, cy, maxR);
      vig.addColorStop(0, "rgba(185,28,28,0.08)");
      vig.addColorStop(1, "rgba(14,14,16,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [pointerRef, expanded]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className="absolute inset-0 h-full w-full touch-none cursor-crosshair" />
      <StageControlStrip>
        <StageSlider label="Speed" value={speed} min={0.6} max={2.8} step={0.1} onChange={setSpeed} />
        <StageSlider label="Rings" value={rings} min={6} max={22} step={1} onChange={setRings} />
        <span className="pointer-events-none accession text-[rgba(232,228,220,0.45)]">Canvas</span>
      </StageControlStrip>
    </div>
  );
}

/**
 * Monarch Pulse — WebGPU Spektral when available; Canvas 2D fallback otherwise.
 */
export function SpektralPulse({
  exhibitId,
  expanded = false,
}: {
  exhibitId?: string;
  expanded?: boolean;
} = {}) {
  const [params, setParams] = useSeededParams(exhibitId, { speed: 1.4, rings: 14 });
  const { speed, rings } = params;
  const setSpeed = (v: number) => setParams((p) => ({ ...p, speed: v }));
  const setRings = (v: number) => setParams((p) => ({ ...p, rings: v }));
  const displayRings = rings + qualityScale(expanded, 0, 4);
  // DPR resolved after mount — avoid SSR/client attribute mismatch
  const [gpuDpr, setGpuDpr] = useState(1);

  // Start on Canvas immediately — upgrade to WebGPU if available (no blank pending flash)
  const [mode, setMode] = useState<"webgpu" | "canvas">("canvas");
  const kickRef = useRef(0);

  useEffect(() => {
    setGpuDpr(Math.min(window.devicePixelRatio || 1, qualityScale(expanded, 1.5, 2)));
  }, [expanded]);

  const material = useMemo(
    () =>
      defineMaterial({
        fragment: PULSE_WGSL,
        uniforms: {
          uTime: 0,
          uKick: 0,
          uSpeed: 1.4,
          uRings: 14,
          uPointer: [0.5, 0.5] as const,
        },
      }),
    []
  );

  useEffect(() => {
    const ok =
      typeof navigator !== "undefined" &&
      "gpu" in navigator &&
      typeof (navigator as Navigator & { gpu?: unknown }).gpu !== "undefined";
    if (ok) setMode("webgpu");
  }, []);

  const onError = useCallback(() => {
    setMode("canvas");
  }, []);

  const onKick = useCallback(() => {
    kickRef.current = 1;
  }, []);

  if (mode === "canvas") {
    return (
      <CanvasPulseFallback
        speed={speed}
        rings={rings}
        setSpeed={setSpeed}
        setRings={setRings}
        expanded={expanded}
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      <FragCanvas
        material={material}
        className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
        showErrorOverlay={false}
        onError={onError}
        onClick={onKick}
        dpr={gpuDpr}
      >
        <SpektralDriver speed={speed} rings={displayRings} kickRef={kickRef} />
      </FragCanvas>
      <StageControlStrip>
        <StageSlider label="Speed" value={speed} min={0.6} max={2.8} step={0.1} onChange={setSpeed} />
        <StageSlider label="Rings" value={rings} min={6} max={22} step={1} onChange={setRings} />
        <span className="pointer-events-none accession text-[var(--accent)]">WebGPU</span>
      </StageControlStrip>
    </div>
  );
}
