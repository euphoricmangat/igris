"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

export type StagePointerState = {
  x: number;
  y: number;
  u: number;
  v: number;
  down: boolean;
  inside: boolean;
};

const idle: StagePointerState = {
  x: 0,
  y: 0,
  u: 0.5,
  v: 0.5,
  down: false,
  inside: false,
};

export type StagePointerHandlers = {
  onDown?: (p: StagePointerState) => void;
  onMove?: (p: StagePointerState) => void;
  onUp?: (p: StagePointerState) => void;
  onClick?: (p: StagePointerState) => void;
  onWheel?: (deltaY: number, p: StagePointerState) => void;
};

/** Attach pointer tracking to a canvas/element. State lives in a mutable ref for rAF loops. */
export function useStagePointer(
  targetRef: RefObject<HTMLElement | null>,
  handlers: StagePointerHandlers = {}
) {
  const stateRef = useRef<StagePointerState>({ ...idle });
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const downAtRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const read = useCallback((e: PointerEvent | WheelEvent): StagePointerState => {
    const el = targetRef.current;
    if (!el) return stateRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    return {
      x,
      y,
      u: x / w,
      v: y / h,
      down: stateRef.current.down,
      inside: x >= 0 && y >= 0 && x <= w && y <= h,
    };
  }, [targetRef]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      el.setPointerCapture?.(e.pointerId);
      const p = { ...read(e), down: true };
      stateRef.current = p;
      downAtRef.current = { x: p.x, y: p.y, t: performance.now() };
      handlersRef.current.onDown?.(p);
    };

    const onMove = (e: PointerEvent) => {
      const p = { ...read(e), down: stateRef.current.down };
      stateRef.current = p;
      handlersRef.current.onMove?.(p);
    };

    const onUp = (e: PointerEvent) => {
      const p = { ...read(e), down: false };
      stateRef.current = p;
      handlersRef.current.onUp?.(p);
      const start = downAtRef.current;
      if (start) {
        const dist = Math.hypot(p.x - start.x, p.y - start.y);
        if (dist < 8 && performance.now() - start.t < 400) {
          handlersRef.current.onClick?.(p);
        }
      }
      downAtRef.current = null;
    };

    const onWheel = (e: WheelEvent) => {
      // Only claim the wheel when a stage opts into onWheel.
      // Otherwise preventDefault blocks Lenis / native page scroll over canvases.
      if (!handlersRef.current.onWheel) return;
      e.preventDefault();
      const p = read(e);
      stateRef.current = p;
      handlersRef.current.onWheel(e.deltaY, p);
    };

    const onLeave = () => {
      stateRef.current = { ...stateRef.current, inside: false, down: false };
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("wheel", onWheel);
    };
  }, [targetRef, read]);

  return stateRef;
}
