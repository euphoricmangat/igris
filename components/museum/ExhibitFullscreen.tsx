"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Exhibit } from "@/lib/museum/types";
import { ExhibitStage } from "./ExhibitStage";
import { InteractHint } from "./InteractHint";
import { ModePlaque } from "./ModePlaque";

/** FLIP Expand — grows from the placard stage; same void family as closed. */
export function ExhibitFullscreen({ exhibit }: { exhibit: Exhibit }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<DOMRect | null>(null);
  const titleId = useId();
  const preferReduce = useReducedMotion();
  const reduce = !mounted || !!preferReduce;

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);
  const openFs = useCallback(() => {
    if (stageRef.current) originRef.current = stageRef.current.getBoundingClientRect();
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const origin = originRef.current;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const flipFrom =
    !reduce && origin
      ? {
          opacity: 0.92,
          scaleX: Math.max(0.2, origin.width / vw),
          scaleY: Math.max(0.2, origin.height / vh),
          x: origin.left + origin.width / 2 - vw / 2,
          y: origin.top + origin.height / 2 - vh / 2,
        }
      : { opacity: 0 };

  const dialog =
    mounted
      ? createPortal(
          <AnimatePresence>
            {open ? (
              <motion.div
                className="fixed inset-0 z-[80] flex flex-col bg-[#0e0e10]"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                initial={flipFrom}
                animate={{ opacity: 1, scaleX: 1, scaleY: 1, x: 0, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "center center" }}
              >
                <div className="flex shrink-0 items-center justify-between border-b border-[rgba(232,228,220,0.12)] px-4 py-3 md:px-6">
                  <div>
                    <p className="accession text-[rgba(232,228,220,0.55)]">{exhibit.accession}</p>
                    <h2
                      id={titleId}
                      className="font-[family-name:var(--font-syne)] text-lg text-[var(--paper)] md:text-xl"
                    >
                      {exhibit.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    className="border border-[rgba(232,228,220,0.28)] bg-[rgba(232,228,220,0.06)] px-4 py-2 font-[family-name:var(--font-syne)] text-sm text-[var(--paper)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    autoFocus
                  >
                    Close
                    <span className="ml-2 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.14em] text-[rgba(232,228,220,0.45)]">
                      Esc
                    </span>
                  </button>
                </div>
                <div className="relative min-h-0 flex-1">
                  <div className="absolute inset-0 bg-[#0e0e10]">
                    <ExhibitStage exhibit={exhibit} expanded />
                  </div>
                </div>
                <div className="shrink-0 border-t border-[rgba(232,228,220,0.12)] px-4 py-2 md:px-6">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="min-w-0 [&_.accession]:mt-0 [&_p]:text-[rgba(232,228,220,0.55)]">
                      <InteractHint engine={exhibit.engine} />
                      <ModePlaque engine={exhibit.engine} />
                    </div>
                    <p className="accession shrink-0 text-[rgba(232,228,220,0.45)]">
                      Full window · Close or Esc
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <>
      <div
        ref={stageRef}
        className={`stage-host relative h-full w-full bg-[#0e0e10] ${open ? "invisible" : ""}`}
      >
        {!open && <ExhibitStage exhibit={exhibit} />}
        <button
          type="button"
          onClick={openFs}
          className="absolute right-3 top-3 z-20 border border-[rgba(232,228,220,0.28)] bg-[rgba(14,14,16,0.72)] px-3 py-1.5 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--paper)] backdrop-blur-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          aria-label="Expand to full window"
        >
          Expand
        </button>
      </div>
      {dialog}
    </>
  );
}
