"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  clearVisitorSeeds,
  loadVisitorSeeds,
  type VisitorSeed,
} from "@/lib/museum/visitorSeeds";

/** Gaze-to-Stars style constellation of locally saved visitor seeds. */
export function SeedConstellation() {
  const [seeds, setSeeds] = useState<VisitorSeed[]>([]);

  useEffect(() => {
    setSeeds(loadVisitorSeeds());
  }, []);

  const points = useMemo(() => {
    return seeds.map((s, i) => {
      const a = (i / Math.max(seeds.length, 1)) * Math.PI * 2 + s.hue * 0.04;
      const r = 28 + (i % 5) * 11 + (s.hue % 7);
      return {
        ...s,
        x: 50 + Math.cos(a) * r * 0.55,
        y: 50 + Math.sin(a) * r * 0.42,
      };
    });
  }, [seeds]);

  if (seeds.length === 0) {
    return (
      <section className="mt-14 border-t border-[var(--line)] pt-10">
        <p className="eyebrow">Visitor archive</p>
        <h2 className="mt-2 text-2xl md:text-3xl">Constellation</h2>
        <p className="mt-3 max-w-md text-sm text-[var(--ink-soft)]">
          Leave a seed on any placard — visits gather here as a private star field in this browser.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-14 border-t border-[var(--line)] pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Visitor archive</p>
          <h2 className="mt-2 text-2xl md:text-3xl">Constellation</h2>
          <p className="mt-3 max-w-md text-sm text-[var(--ink-soft)]">
            {seeds.length} seed{seeds.length === 1 ? "" : "s"} remembered on this device.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearVisitorSeeds();
            setSeeds([]);
          }}
          className="accession text-[var(--ink-soft)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
        >
          Clear archive
        </button>
      </div>

      <div className="relative mt-8 aspect-[2/1] w-full overflow-hidden border border-[var(--line)] bg-[#0e0e10]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {points.map((p, i) => {
            const next = points[(i + 1) % points.length];
            if (points.length < 2) return null;
            return (
              <line
                key={`l-${p.id}`}
                x1={p.x}
                y1={p.y}
                x2={next.x}
                y2={next.y}
                stroke="rgba(185,28,28,0.28)"
                strokeWidth={0.15}
              />
            );
          })}
          {points.map((p) => (
            <circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={0.9 + (p.hue % 5) * 0.12}
              fill={`hsl(${8 + p.hue}, 72%, ${48 + (p.hue % 20)}%)`}
            />
          ))}
        </svg>
      </div>

      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {seeds.map((s) => (
          <li key={s.id}>
            <Link
              href={`/exhibit/${s.exhibitId}`}
              className="flex items-baseline justify-between gap-3 border border-[var(--line)] bg-[rgba(232,228,220,0.28)] px-3 py-2 transition hover:border-[var(--accent)]"
            >
              <span className="font-[family-name:var(--font-syne)] text-sm">
                {s.title}
                {s.params ? (
                  <span className="ml-2 accession text-[var(--accent)]">params</span>
                ) : null}
              </span>
              <span className="accession shrink-0">{s.accession}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
