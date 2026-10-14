import Link from "next/link";
import { wings } from "@/lib/museum/wings";
import { exhibitsByWing } from "@/lib/museum/exhibits";

export const metadata = { title: "Corridor" };

export default function CorridorPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Museum plan</p>
          <h1 className="mt-3 text-4xl md:text-6xl">Corridor</h1>
          <p className="mt-4 max-w-xl text-[var(--ink-soft)]">
            Six doorways. Each wing hosts a different medium — kinetic sculptures and live engines.
          </p>
        </div>
        <p className="accession hidden md:block">Scroll sideways on mobile · walk the plan</p>
      </div>

      {/* Sprocket rail */}
      <div className="sprocket-rail mt-10 flex items-center gap-2 overflow-hidden" aria-hidden>
        {Array.from({ length: 64 }).map((_, i) => (
          <span
            key={i}
            className="h-3 w-4 shrink-0 rounded-[2px] border border-[var(--line-strong)] bg-[rgba(14,14,16,0.08)]"
          />
        ))}
      </div>

      <div className="mt-6 flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible md:pb-0 md:snap-none">
        {wings.map((wing, i) => {
          const count = exhibitsByWing(wing.id).length;
          return (
            <Link
              key={wing.id}
              href={`/wing/${wing.id}`}
              className="door min-w-[240px] flex-shrink-0 snap-start animate-rise md:min-w-0"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center justify-between">
                <p className="accession">0{i + 1}</p>
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              </div>
              <h2 className="mt-8 text-2xl md:text-3xl">{wing.title}</h2>
              <p className="mt-2 text-sm leading-snug text-[var(--ink-soft)]">{wing.subtitle}</p>
              <div className="mt-10 border-t border-[var(--line)] pt-3">
                <p className="accession">
                  {count} works
                  <br />
                  {wing.medium}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
