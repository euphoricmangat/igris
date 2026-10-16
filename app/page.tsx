import Link from "next/link";
import { LobbyCurtain } from "@/components/museum/LobbyCurtain";
import { exhibits } from "@/lib/museum/exhibits";
import { wings } from "@/lib/museum/wings";

export default function Home() {
  const liveCount = exhibits.filter((e) => e.engine !== "archive-plates").length;

  return (
    <>
      <section className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
        <LobbyCurtain />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(10,10,12,0.78)] via-[rgba(10,10,12,0.08)] to-[rgba(10,10,12,0.22)]" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1400px] flex-col justify-end px-5 pb-16 pt-24 md:px-8 md:pb-24">
          <p className="eyebrow animate-rise text-[var(--steel)]">Move through the veil</p>
          <h1
            className="mt-4 max-w-4xl animate-rise text-7xl text-[var(--paper)] md:text-9xl lg:text-[9.5rem]"
            style={{ animationDelay: "80ms" }}
          >
            IGRIS
          </h1>
          <p
            className="mt-5 max-w-md animate-rise text-lg text-[rgba(232,228,220,0.78)]"
            style={{ animationDelay: "140ms" }}
          >
            A nocturne vault of living sculpture — play the curtain, then walk six doors.
          </p>
          <div
            className="mt-9 flex animate-rise flex-wrap items-center gap-4"
            style={{ animationDelay: "200ms" }}
          >
            <Link
              href="/corridor"
              className="bg-[var(--accent)] px-7 py-3.5 font-[family-name:var(--font-syne)] text-sm font-semibold tracking-wide text-[var(--paper)] transition hover:bg-[var(--accent-soft)]"
            >
              Enter the corridor
            </Link>
            <Link
              href="/about"
              className="border border-[rgba(232,228,220,0.45)] px-5 py-3.5 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--paper)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              How to visit
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:grid-cols-[1fr_1.35fr] md:px-8 md:py-20">
          <div>
            <p className="eyebrow">Institution</p>
            <h2 className="mt-3 text-3xl text-[var(--paper)] md:text-4xl">
              {wings.length} wings · {liveCount} live works
            </h2>
            <p className="mt-4 max-w-sm text-[var(--ink-soft)]">
              Thresholds, not menus. Each door holds a living vignette — Expand never swaps the
              sculpture, only densifies it.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {wings.map((w, i) => (
              <li key={w.id}>
                <Link href={`/wing/${w.id}`} className="door block px-4 py-4">
                  <span className="accession">0{i + 1}</span>
                  <span className="mt-2 block font-[family-name:var(--font-syne)] text-lg text-[var(--paper)]">
                    {w.title}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--ink-soft)] line-clamp-2">
                    {w.blurb}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
