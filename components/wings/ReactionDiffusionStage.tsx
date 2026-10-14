"use client";

import { useEffect, useRef, useState } from "react";
import { useStagePointer } from "@/components/museum/useStagePointer";

/** Gray-Scott style reaction–diffusion wall piece. */
export function ReactionDiffusionStage() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [feed, setFeed] = useState(0.036);
  const [kill, setKill] = useState(0.06);
  const paramsRef = useRef({ feed, kill });
  paramsRef.current = { feed, kill };

  const pointerRef = useStagePointer(ref);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;

    const cols = 160;
    const rows = 100;
    let A = new Float32Array(cols * rows);
    let B = new Float32Array(cols * rows);
    let nA = new Float32Array(cols * rows);
    let nB = new Float32Array(cols * rows);

    const idx = (x: number, y: number) => ((y + rows) % rows) * cols + ((x + cols) % cols);
    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

    for (let i = 0; i < A.length; i++) {
      A[i] = 1;
      B[i] = 0;
    }
    for (let y = rows / 2 - 8; y < rows / 2 + 8; y++) {
      for (let x = cols / 2 - 8; x < cols / 2 + 8; x++) {
        B[idx(x | 0, y | 0)] = 1;
      }
    }
    for (let k = 0; k < 6; k++) {
      const cx = (Math.random() * cols) | 0;
      const cy = (Math.random() * rows) | 0;
      for (let y = cy - 4; y < cy + 4; y++) {
        for (let x = cx - 4; x < cx + 4; x++) B[idx(x, y)] = 1;
      }
    }

    const dA = 1.0;
    const dB = 0.5;

    const resize = () => {
      const w = parent?.clientWidth || 800;
      const h = parent?.clientHeight || 500;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const img = ctx.createImageData(cols, rows);
    const tmp = document.createElement("canvas");
    tmp.width = cols;
    tmp.height = rows;
    const tmpCtx = tmp.getContext("2d");
    if (!tmpCtx) return;
    let raf = 0;

    const lap = (arr: Float32Array, x: number, y: number) => {
      return (
        arr[idx(x, y)] * -1 +
        arr[idx(x - 1, y)] * 0.2 +
        arr[idx(x + 1, y)] * 0.2 +
        arr[idx(x, y - 1)] * 0.2 +
        arr[idx(x, y + 1)] * 0.2 +
        arr[idx(x - 1, y - 1)] * 0.05 +
        arr[idx(x + 1, y - 1)] * 0.05 +
        arr[idx(x - 1, y + 1)] * 0.05 +
        arr[idx(x + 1, y + 1)] * 0.05
      );
    };

    const paintAt = (px: number, py: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 1 || h < 1) return;
      const cx = Math.floor((px / w) * cols);
      const cy = Math.floor((py / h) * rows);
      for (let y = cy - 3; y <= cy + 3; y++) {
        for (let x = cx - 3; x <= cx + 3; x++) {
          if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= 10) {
            const i = idx(x, y);
            // Soft seed — hard 1.0 blows Gray–Scott into Infinity/NaN
            B[i] = Math.min(1, B[i] + 0.85);
            A[i] = Math.max(0, A[i] * 0.7);
          }
        }
      }
    };

    const frame = () => {
      const { feed: f, kill: k } = paramsRef.current;
      const ptr = pointerRef.current;
      if (ptr.down && ptr.inside) paintAt(ptr.x, ptr.y);

      for (let step = 0; step < 2; step++) {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = idx(x, y);
            const a = A[i];
            const b = B[i];
            const abb = a * b * b;
            nA[i] = clamp01(a + (dA * lap(A, x, y) - abb + f * (1 - a)));
            nB[i] = clamp01(b + (dB * lap(B, x, y) + abb - (k + f) * b));
          }
        }
        [A, nA] = [nA, A];
        [B, nB] = [nB, B];
      }

      for (let i = 0; i < cols * rows; i++) {
        const raw = A[i] - B[i] * 0.9;
        const v = Number.isFinite(raw) ? clamp01(raw) : 0;
        const o = i * 4;
        img.data[o] = 14 + v * 40 + (1 - v) * 160;
        img.data[o + 1] = 14 + v * 40;
        img.data[o + 2] = 16 + v * 40;
        img.data[o + 3] = 255;
      }

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      tmpCtx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, 0, 0, w, h);

      raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [pointerRef]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className="h-full w-full touch-none cursor-crosshair" />
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-3">
        <label className="accession flex flex-1 items-center gap-2 text-[var(--paper)]">
          F
          <input
            type="range"
            min={0.02}
            max={0.06}
            step={0.001}
            value={feed}
            onChange={(e) => setFeed(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </label>
        <label className="accession flex flex-1 items-center gap-2 text-[var(--paper)]">
          K
          <input
            type="range"
            min={0.045}
            max={0.07}
            step={0.001}
            value={kill}
            onChange={(e) => setKill(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </label>
      </div>
    </div>
  );
}
