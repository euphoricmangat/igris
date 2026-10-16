import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getWing } from "@/lib/museum/wings";
import { exhibitsByWing } from "@/lib/museum/exhibits";
import type { WingId } from "@/lib/museum/types";
import { ExhibitThumb } from "@/components/museum/ExhibitThumb";
import { WingBanner } from "@/components/museum/WingBanner";
import { getInteractionHint } from "@/lib/museum/interactionHints";

export function generateStaticParams() {
  return ["paradox", "locus", "alcove", "field", "signal", "forge", "relief"].map((wing) => ({
    wing,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ wing: string }> }) {
  const { wing } = await params;
  const meta = getWing(wing);
  return { title: meta?.title ?? "Wing" };
}

function WingGridSkeleton() {
  return (
    <div className="mt-10 grid gap-8 md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="aspect-[16/10] border border-[var(--line)] bg-[rgba(232,228,220,0.04)]" />
          <div className="mt-4 h-3 w-24 bg-[rgba(232,228,220,0.08)]" />
          <div className="mt-2 h-5 w-40 bg-[rgba(232,228,220,0.1)]" />
        </div>
      ))}
    </div>
  );
}

async function WingBannerLayer({ params }: { params: Promise<{ wing: string }> }) {
  const { wing: wingId } = await params;
  if (wingId === "relief") return <WingBanner wing="paradox" />;
  const wing = getWing(wingId);
  if (!wing) return null;
  return <WingBanner wing={wing.id as WingId} />;
}

async function WingIntro({ params }: { params: Promise<{ wing: string }> }) {
  const { wing: wingId } = await params;
  if (wingId === "relief") redirect("/wing/paradox");
  const wing = getWing(wingId);
  if (!wing) notFound();
  return (
    <>
      <h1 className="mt-3 text-4xl text-[var(--paper)] md:text-6xl">{wing.title}</h1>
      <p className="mt-4 max-w-xl text-[rgba(232,228,220,0.85)]">
        {wing.subtitle}. {wing.medium}.
      </p>
      <p className="mt-3 max-w-lg text-sm text-[var(--ink-soft)]">{wing.blurb}</p>
    </>
  );
}

async function WingBody({ params }: { params: Promise<{ wing: string }> }) {
  const { wing: wingId } = await params;
  if (wingId === "relief") redirect("/wing/paradox");
  const wing = getWing(wingId);
  if (!wing) notFound();
  const list = exhibitsByWing(wing.id as WingId).filter((e) => e.engine !== "archive-plates");

  return (
    <div className="mt-10 grid gap-8 md:grid-cols-2">
      {list.map((ex, i) => (
        <article
          key={ex.id}
          className="group animate-rise"
          style={{ animationDelay: `${60 + i * 60}ms` }}
        >
          <div className="stage-frame transition duration-500 group-hover:border-[var(--accent)]">
            <ExhibitThumb exhibit={ex} hint={getInteractionHint(ex.engine)} />
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <div>
              <p className="accession">{ex.accession}</p>
              <Link href={`/exhibit/${ex.id}`}>
                <h2 className="mt-1 text-xl text-[var(--paper)] transition hover:text-[var(--accent)]">
                  {ex.title}
                </h2>
              </Link>
            </div>
            <Link
              href={`/exhibit/${ex.id}`}
              className="accession text-right transition hover:text-[var(--accent)]"
            >
              Enter · {ex.medium}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function WingPage({ params }: { params: Promise<{ wing: string }> }) {
  return (
    <div className="animate-page-in relative mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden opacity-50 md:h-48">
        <Suspense fallback={null}>
          <WingBannerLayer params={params} />
        </Suspense>
      </div>

      <div className="relative">
        <Link href="/corridor" className="eyebrow hover:text-[var(--accent)]">
          ← Corridor
        </Link>
        <Suspense
          fallback={
            <>
              <div className="mt-3 h-10 w-44 animate-pulse bg-[rgba(232,228,220,0.08)] md:h-14 md:w-56" />
              <div className="mt-4 h-4 max-w-md animate-pulse bg-[rgba(232,228,220,0.06)]" />
            </>
          }
        >
          <WingIntro params={params} />
        </Suspense>
      </div>

      <div className="relative mt-10 flex items-center gap-2 overflow-hidden" aria-hidden>
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className="h-3 w-4 shrink-0 rounded-[2px] border border-[var(--line-strong)] bg-[rgba(232,228,220,0.06)]"
          />
        ))}
      </div>

      <Suspense fallback={<WingGridSkeleton />}>
        <WingBody params={params} />
      </Suspense>
    </div>
  );
}
