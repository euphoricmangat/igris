"use client";

import { useCallback, useEffect, useState } from "react";
import {
  archiveFolderUrl,
  archiveFrameUrl,
  type ArchiveSetManifest,
} from "@/lib/museum/archive";

/** Scrubbable atelier plate sequence for a folder under /public/archive. */
export function ArchivePlateViewer({
  folder,
  className = "",
  expanded = false,
}: {
  folder: string;
  className?: string;
  expanded?: boolean;
}) {
  const [manifest, setManifest] = useState<ArchiveSetManifest | null>(null);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setManifest(null);
    setIndex(0);
    fetch(`${archiveFolderUrl(folder)}/manifest.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Missing plates for ${folder}`);
        return r.json() as Promise<ArchiveSetManifest>;
      })
      .then((data) => {
        if (!cancelled) setManifest(data);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message || "Failed to load plates");
      });
    return () => {
      cancelled = true;
    };
  }, [folder]);

  const frames = manifest?.frames ?? [];
  const frame = frames[index] ?? frames[0];

  const step = useCallback(
    (dir: number) => {
      if (!frames.length) return;
      setIndex((i) => (i + dir + frames.length) % frames.length);
    },
    [frames.length]
  );

  if (error) {
    return (
      <div className={`grid h-full place-items-center bg-[#0e0e10] p-6 text-center ${className}`}>
        <p className="accession text-[rgba(232,228,220,0.55)]">{error}</p>
      </div>
    );
  }

  if (!manifest || !frame) {
    return (
      <div className={`grid h-full place-items-center bg-[#0e0e10] ${className}`}>
        <p className="accession text-[rgba(232,228,220,0.45)]">Loading plates…</p>
      </div>
    );
  }

  return (
    <div className={`relative flex h-full w-full flex-col bg-[#0e0e10] ${className}`}>
      <div className="relative min-h-0 flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={archiveFrameUrl(folder, frame)}
          alt={`${manifest.title} · frame ${index + 1}`}
          className={`absolute inset-0 h-full w-full ${expanded ? "object-cover" : "object-contain"}`}
          draggable={false}
        />
      </div>
      <div
        className={`flex shrink-0 flex-wrap items-center gap-3 border-t border-[rgba(232,228,220,0.12)] px-3 py-2 ${
          expanded ? "py-3 md:px-5" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          className="border border-[rgba(232,228,220,0.28)] px-2 py-1 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--paper)] hover:border-[var(--accent)]"
        >
          Prev
        </button>
        <label className="accession flex min-w-[8rem] flex-1 items-center gap-2 text-[rgba(232,228,220,0.7)]">
          Frame
          <input
            type="range"
            min={0}
            max={Math.max(0, frames.length - 1)}
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
            aria-label="Plate frame"
          />
        </label>
        <button
          type="button"
          onClick={() => step(1)}
          className="border border-[rgba(232,228,220,0.28)] px-2 py-1 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--paper)] hover:border-[var(--accent)]"
        >
          Next
        </button>
        <span className="accession text-[rgba(232,228,220,0.45)]">
          {index + 1}/{frames.length}
          {expanded ? " · full" : ""}
        </span>
      </div>
    </div>
  );
}

export function ArchivePlateStage({
  folder,
  expanded = false,
}: {
  folder: string;
  expanded?: boolean;
}) {
  return (
    <div className="absolute inset-0 h-full w-full">
      <ArchivePlateViewer folder={folder} expanded={expanded} />
    </div>
  );
}
