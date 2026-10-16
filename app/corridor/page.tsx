import Link from "next/link";
import { CorridorDoor } from "@/components/museum/CorridorDoor";
import { wings } from "@/lib/museum/wings";
import { exhibitsByWing } from "@/lib/museum/exhibits";

export const metadata = { title: "Corridor" };

export default function CorridorPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Museum plan</p>
          <h1 className="mt-3 text-4xl text-[var(--paper)] md:text-6xl">Corridor</h1>
          <p className="mt-4 max-w-xl text-[var(--ink-soft)]">
            Six luminous doors. Each threshold holds a living vignette — play as you walk.
          </p>
          <p className="mt-3">
            <Link
              href="/index#atelier"
              className="accession text-[var(--ink-soft)] transition hover:text-[var(--accent)]"
            >
              Atelier plates on Index →
            </Link>
          </p>
        </div>
        <p className="accession hidden md:block">Scroll sideways on mobile · walk the plan</p>
      </div>

      <div className="sprocket-rail mt-10 flex items-center gap-2 overflow-hidden" aria-hidden>
        {Array.from({ length: 64 }).map((_, i) => (
          <span
            key={i}
            className="h-3 w-4 shrink-0 rounded-[2px] border border-[var(--line-strong)] bg-[rgba(232,228,220,0.06)]"
          />
        ))}
      </div>

      <div className="mt-6 flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible md:pb-0 md:snap-none">
        {wings.map((wing, i) => {
          const list = exhibitsByWing(wing.id).filter((e) => e.engine !== "archive-plates");
          const hero = list[0];
          if (!hero) return null;
          return (
            <CorridorDoor key={wing.id} wing={wing} index={i} hero={hero} count={list.length} />
          );
        })}
      </div>
    </div>
  );
}
