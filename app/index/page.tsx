import Link from "next/link";
import { exhibits } from "@/lib/museum/exhibits";
import { getWing } from "@/lib/museum/wings";

export const metadata = { title: "Index" };

export default function IndexPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-12 md:px-8 md:py-16">
      <p className="eyebrow">Research mode</p>
      <h1 className="mt-3 text-4xl md:text-6xl">Index</h1>
      <p className="mt-4 max-w-lg text-[var(--ink-soft)]">
        Flat catalog of every accession — for finding, not wandering.
      </p>

      <ul className="mt-12 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {exhibits.map((ex) => (
          <li key={ex.id}>
            <Link
              href={`/exhibit/${ex.id}`}
              className="grid grid-cols-[1fr_auto] gap-4 py-5 transition hover:text-[var(--accent)] md:grid-cols-[140px_1fr_160px_auto]"
            >
              <span className="accession">{ex.accession}</span>
              <span className="font-[family-name:var(--font-syne)] text-lg">{ex.title}</span>
              <span className="hidden text-sm text-[var(--ink-soft)] md:block">
                {getWing(ex.wing)?.title} · {ex.medium}
              </span>
              <span className="accession">{ex.year}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
