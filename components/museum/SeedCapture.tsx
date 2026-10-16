"use client";

import { useCallback, useState } from "react";
import type { Exhibit } from "@/lib/museum/types";
import { getLiveParams } from "@/lib/museum/exhibitParams";
import { saveVisitorSeed } from "@/lib/museum/visitorSeeds";

/** Leave a visitor seed for this accession (local constellation archive). */
export function SeedCapture({ exhibit }: { exhibit: Exhibit }) {
  const [saved, setSaved] = useState(false);

  const leave = useCallback(() => {
    saveVisitorSeed({
      exhibitId: exhibit.id,
      accession: exhibit.accession,
      title: exhibit.title,
      params: getLiveParams(exhibit.id),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }, [exhibit]);

  return (
    <button
      type="button"
      onClick={leave}
      className="mt-5 border border-[var(--line-strong)] bg-[rgba(232,228,220,0.35)] px-3 py-2 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      {saved ? "Seed archived · see Index" : "Leave a visitor seed"}
    </button>
  );
}
