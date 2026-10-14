"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Exhibit } from "@/lib/museum/types";
import { ExhibitStage } from "./ExhibitStage";

export function ExhibitFullscreen({ exhibit }: { exhibit: Exhibit }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const reduce = useReducedMotion();

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);
  const openFs = useCallback(() => setOpen(true), []);

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
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="flex shrink-0 items-center justify-between border-b border-[rgba(232,228,220,0.12)] px-4 py-3 md:px-6"
                  initial={reduce ? false : { y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
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
                </motion.div>
                <div className="relative min-h-0 flex-1">
                  <div className="absolute inset-0">
                    <ExhibitStage exhibit={exhibit} expanded />
                  </div>
                </div>
                <p className="shrink-0 border-t border-[rgba(232,228,220,0.12)] px-4 py-2 accession text-[rgba(232,228,220,0.45)] md:px-6">
                  Full window · Close or Esc
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <>
      <div className={`stage-host relative h-full w-full ${open ? "invisible" : ""}`}>
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
