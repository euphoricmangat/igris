"use client";

import Link from "next/link";
import { ArchivePlateViewer } from "@/components/museum/ArchivePlateViewer";
import { annexExhibits } from "@/lib/museum/exhibits";

/** Index annex — baked atelier plates beside the live catalog. */
export function ArchiveAnnex() {
  const annex = annexExhibits();

  return (
    <section id="atelier" className="mt-14 scroll-mt-24 border-t border-[var(--line)] pt-10">
      <p className="eyebrow">Atelier annex</p>
      <h2 className="mt-2 text-2xl md:text-3xl">Plate archive</h2>
      <p className="mt-3 max-w-lg text-sm text-[var(--ink-soft)]">
        Offline Python plates baked into <code>public/archive</code> — scrub frames; open an
        accession for the full placard.
      </p>

      <ul className="mt-8 grid gap-8 md:grid-cols-3">
        {annex.map((ex) => (
          <li key={ex.id} className="border border-[var(--line)] bg-[rgba(232,228,220,0.2)]">
            <div className="aspect-[4/3] border-b border-[var(--line)]">
              <ArchivePlateViewer folder={ex.archive!} />
            </div>
            <div className="flex items-baseline justify-between gap-3 px-3 py-3">
              <div>
                <p className="accession">{ex.accession}</p>
                <Link
                  href={`/exhibit/${ex.id}`}
                  className="font-[family-name:var(--font-syne)] text-lg hover:text-[var(--accent)]"
                >
                  {ex.title}
                </Link>
              </div>
              <span className="accession text-right">Atelier plate</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
