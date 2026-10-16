import type { Exhibit } from "@/lib/museum/types";
import { getResearch } from "@/lib/museum/research";
import { SeedCapture } from "./SeedCapture";

/** Server-safe placard — CSS rise stagger, no Framer (avoids hydration mismatch). */
export function Placard({ exhibit }: { exhibit: Exhibit }) {
  const research = getResearch(exhibit.engine);

  return (
    <aside className="placard max-w-md">
      <p className="accession animate-rise">{exhibit.accession}</p>
      <h2 className="mt-2 animate-rise text-2xl md:text-3xl" style={{ animationDelay: "70ms" }}>
        {exhibit.title}
      </h2>
      <p
        className="mt-1 animate-rise text-sm text-[var(--ink-soft)]"
        style={{ animationDelay: "140ms" }}
      >
        {exhibit.medium} · {exhibit.year}
      </p>
      <p
        className="mt-4 animate-rise text-[15px] leading-relaxed text-[var(--ink-soft)]"
        style={{ animationDelay: "210ms" }}
      >
        {exhibit.blurb}
      </p>

      <div
        className="animate-rise mt-6 space-y-3 border-t border-[var(--line)] pt-4"
        style={{ animationDelay: "280ms" }}
      >
        <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--ink)]">
          Research
        </p>
        <p className="text-[13px] leading-relaxed text-[var(--ink-soft)]">{research.citation}</p>
        <p className="text-[13px] leading-relaxed text-[var(--ink-soft)]">
          <span className="text-[var(--ink)]">Interact · </span>
          {research.grammar}
        </p>
      </div>

      <div className="animate-rise" style={{ animationDelay: "340ms" }}>
        <SeedCapture exhibit={exhibit} />
      </div>
    </aside>
  );
}
