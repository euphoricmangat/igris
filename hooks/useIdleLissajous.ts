"use client";

/**
 * Normalized idle attractor (0..1 UV space) — Lissajous wander when pointer is away.
 * Call each frame with elapsed seconds.
 */
export function idleLissajous(
  t: number,
  opts?: { ax?: number; ay?: number; ox?: number; oy?: number }
): { u: number; v: number } {
  const ax = opts?.ax ?? 0.55;
  const ay = opts?.ay ?? 0.85;
  const ox = opts?.ox ?? 0.5;
  const oy = opts?.oy ?? 0.48;
  return {
    u: ox + Math.sin(t * ax) * 0.28,
    v: oy + Math.sin(t * ay + 1.2) * 0.22,
  };
}

/** Pixel-space idle point for a canvas of size w×h. */
export function idleLissajousPx(
  t: number,
  w: number,
  h: number,
  opts?: { ax?: number; ay?: number }
): { x: number; y: number } {
  const { u, v } = idleLissajous(t, opts);
  return { x: u * w, y: v * h };
}
