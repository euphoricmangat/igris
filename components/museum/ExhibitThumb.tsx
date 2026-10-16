"use client";

import { useEffect, useRef, useState } from "react";
import type { Exhibit } from "@/lib/museum/types";
import { ExhibitStage } from "./ExhibitStage";

/** Live mini-render for wing walls — mounts the engine only while on-screen; pointer plays. */
export function ExhibitThumb({
  exhibit,
  hint,
}: {
  exhibit: Exhibit;
  hint?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(!!entry?.isIntersecting);
      },
      { rootMargin: "120px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={host}
      className="stage-host relative h-full w-full"
      style={{ background: "#0e0e10" }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {!inView && (
        <div className="absolute inset-0 flex items-end p-4">
          <span className="accession text-[rgba(232,228,220,0.45)]">{exhibit.accession}</span>
        </div>
      )}
      {inView ? <ExhibitStage exhibit={exhibit} /> : null}
      {hint && hovered && inView ? (
        <p className="pointer-events-none absolute bottom-2 left-2 right-2 z-10 accession truncate rounded bg-[rgba(14,14,16,0.72)] px-2 py-1 text-[rgba(232,228,220,0.75)] backdrop-blur-sm">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
