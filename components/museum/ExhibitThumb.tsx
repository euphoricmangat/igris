"use client";

import { useEffect, useRef, useState } from "react";
import type { Exhibit } from "@/lib/museum/types";
import { ExhibitStage } from "./ExhibitStage";

/** Live mini-render for wing walls — mounts the engine only while on-screen. */
export function ExhibitThumb({ exhibit }: { exhibit: Exhibit }) {
  const host = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

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
      className="stage-host pointer-events-none relative h-full w-full [&_*]:!pointer-events-none"
      style={{
        background:
          "linear-gradient(160deg, #2a2420 0%, #1a1614 55%, #121014 100%)",
      }}
    >
      {!inView && (
        <div className="absolute inset-0 flex items-end p-4">
          <span className="accession text-[rgba(232,228,220,0.45)]">{exhibit.accession}</span>
        </div>
      )}
      {inView ? <ExhibitStage exhibit={exhibit} /> : null}
    </div>
  );
}
