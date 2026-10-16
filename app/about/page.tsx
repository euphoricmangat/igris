import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-12 md:px-8 md:py-16">
      <p className="eyebrow">Visitor guide</p>
      <h1 className="mt-3 text-4xl text-[var(--paper)] md:text-5xl">How to visit</h1>

      <ol className="mt-10 space-y-6 text-[17px] leading-relaxed text-[var(--ink-soft)]">
        <li>
          <span className="accession text-[var(--paper)]">01 · Lobby</span>
          <p className="mt-2">
            Move through the wavy curtain on the{" "}
            <Link href="/" className="text-[var(--paper)] underline-offset-2 hover:underline">
              landing
            </Link>
            — the veil answers the pointer before you enter.
          </p>
        </li>
        <li>
          <span className="accession text-[var(--paper)]">02 · Corridor</span>
          <p className="mt-2">
            Walk the{" "}
            <Link href="/corridor" className="text-[var(--paper)] underline-offset-2 hover:underline">
              corridor
            </Link>
            . Six luminous doors — each holds a living vignette of the wing beyond.
          </p>
        </li>
        <li>
          <span className="accession text-[var(--paper)]">03 · Play on the wall</span>
          <p className="mt-2">
            On a wing page, move over a work — thumbs are live. Hover for a short hint, then open the
            title to Enter.
          </p>
        </li>
        <li>
          <span className="accession text-[var(--paper)]">04 · Expand</span>
          <p className="mt-2">
            Expand densifies the same sculpture — lights, materials, and void stay continuous. Esc
            closes. Leave a visitor seed if you want the constellation to remember a state.
          </p>
        </li>
        <li>
          <span className="accession text-[var(--paper)]">05 · Index &amp; Atelier</span>
          <p className="mt-2">
            <Link href="/index" className="text-[var(--paper)] underline-offset-2 hover:underline">
              Index
            </Link>{" "}
            lists every accession.{" "}
            <Link href="/index#atelier" className="text-[var(--paper)] underline-offset-2 hover:underline">
              Atelier plates
            </Link>{" "}
            are baked offline filmstrips — scrub frames; they are not live engines.
          </p>
        </li>
      </ol>

      <div className="mt-14 border-t border-[var(--line)] pt-10">
        <p className="eyebrow">Curatorial note</p>
        <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-[var(--ink-soft)]">
          <p>
            Igris is a nocturne vault of living media — named for vigilance: a quiet guard over a
            synthetic archive. Works run in the browser; nothing here is scraped.
          </p>
          <p>
            Beauty first; language is a tool, not a boundary. Every accession is authored for this
            institution — algorithms with mass, light, and a visitor&apos;s hand in the field.
          </p>
        </div>
      </div>
    </div>
  );
}
