"use client";

import Link from "next/link";
import type { Exhibit } from "@/lib/museum/types";
import type { WingMeta } from "@/lib/museum/types";
import { ExhibitThumb } from "./ExhibitThumb";
import { getInteractionHint } from "@/lib/museum/interactionHints";

/** Live threshold — vignette plays behind the door placard. */
export function CorridorDoor({
  wing,
  index,
  hero,
  count,
}: {
  wing: WingMeta;
  index: number;
  hero: Exhibit;
  count: number;
}) {
  return (
    <Link
      href={`/wing/${wing.id}`}
      className="door group relative min-w-[260px] flex-shrink-0 snap-start overflow-hidden animate-rise md:min-w-0"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.55] transition-opacity duration-500 group-hover:opacity-80">
        <div className="absolute inset-0 scale-110">
          <ExhibitThumb exhibit={hero} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,12,0.95)] via-[rgba(10,10,12,0.55)] to-[rgba(10,10,12,0.25)]" />
      </div>

      <div className="relative z-10 flex h-full min-h-[320px] flex-col">
        <div className="flex items-center justify-between">
          <p className="accession text-[var(--paper)]">0{index + 1}</p>
          <span className="door-beam h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(185,28,28,0.8)]" />
        </div>
        <div className="mt-auto">
          <h2 className="text-2xl text-[var(--paper)] md:text-3xl">{wing.title}</h2>
          <p className="mt-2 text-sm leading-snug text-[rgba(232,228,220,0.72)]">{wing.subtitle}</p>
          <p className="mt-2 text-xs leading-snug text-[var(--ink-soft)] line-clamp-2">{wing.blurb}</p>
          <div className="mt-6 border-t border-[var(--line)] pt-3">
            <p className="accession">
              {count} works · {wing.medium}
            </p>
            <p className="mt-1 accession truncate text-[rgba(232,228,220,0.45)]">
              {getInteractionHint(hero.engine)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
