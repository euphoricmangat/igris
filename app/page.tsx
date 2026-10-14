import Link from "next/link";
import { LobbyCurtain } from "@/components/museum/LobbyCurtain";
import { exhibits } from "@/lib/museum/exhibits";
import { wings } from "@/lib/museum/wings";

export default function Home() {
  return (
    <>
      <section className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
        <LobbyCurtain />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(14,14,16,0.72)] via-transparent to-[rgba(14,14,16,0.25)]" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1400px] flex-col justify-end px-5 pb-16 pt-24 md:px-8 md:pb-20">
          <p className="eyebrow animate-rise text-[var(--steel)]">Digital museum of living media</p>
          <h1 className="mt-4 max-w-3xl animate-rise text-6xl text-[var(--paper)] md:text-8xl lg:text-9xl" style={{ animationDelay: "80ms" }}>
            IGRIS
          </h1>
          <p className="mt-5 max-w-md animate-rise text-lg text-[rgba(232,228,220,0.78)]" style={{ animationDelay: "140ms" }}>
            Six wings. Relief pins, loci, glass alcoves, living fields, kinetic signal, and forge
            machines — a synthetic archive you walk, not scroll past.
          </p>
          <div className="mt-8 flex animate-rise flex-wrap gap-4" style={{ animationDelay: "200ms" }}>
            <Link
              href="/corridor"
              className="bg-[var(--accent)] px-6 py-3 font-[family-name:var(--font-syne)] text-sm font-semibold tracking-wide text-[var(--paper)] transition hover:bg-[var(--accent-soft)]"
            >
              Enter the corridor
            </Link>
            <Link
              href="/index"
              className="border border-[rgba(232,228,220,0.35)] px-6 py-3 font-[family-name:var(--font-syne)] text-sm tracking-wide text-[var(--paper)] transition hover:border-[var(--paper)]"
            >
              Research index
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[rgba(14,14,16,0.04)]">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:grid-cols-[1fr_1.2fr] md:px-8 md:py-20">
          <div>
            <p className="eyebrow">Institution</p>
            <h2 className="mt-3 text-3xl md:text-4xl">
              {wings.length} wings · {exhibits.length} accessions
            </h2>
            <p className="mt-4 max-w-sm text-[var(--ink-soft)]">
              Live browser engines and a Python atelier share the same walls. Nothing scraped —
              everything authored.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {wings.map((w) => (
              <li key={w.id}>
                <Link
                  href={`/wing/${w.id}`}
                  className="block border border-[var(--line)] bg-[rgba(232,228,220,0.28)] px-4 py-4 transition hover:border-[var(--accent)]"
                >
                  <span className="font-[family-name:var(--font-syne)] text-lg">{w.title}</span>
                  <span className="mt-1 block text-sm text-[var(--ink-soft)]">{w.subtitle}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
