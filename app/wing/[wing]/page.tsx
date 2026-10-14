import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWing } from "@/lib/museum/wings";
import { exhibitsByWing } from "@/lib/museum/exhibits";
import type { WingId } from "@/lib/museum/types";
import { ExhibitThumb } from "@/components/museum/ExhibitThumb";
import { WingBanner } from "@/components/museum/WingBanner";

export function generateStaticParams() {
  return ["relief", "locus", "alcove", "field", "signal", "forge"].map((wing) => ({ wing }));
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
          <div className="aspect-[16/10] border border-[var(--line)] bg-[rgba(232,228,220,0.4)]" />
          <div className="mt-4 h-3 w-24 bg-[rgba(14,14,16,0.08)]" />
          <div className="mt-2 h-5 w-40 bg-[rgba(14,14,16,0.1)]" />
        </div>
      ))}
    </div>
  );
}

async function WingBannerLayer({ params }: { params: Promise<{ wing: string }> }) {
  const { wing: wingId } = await params;
  const wing = getWing(wingId);
  if (!wing) return null;
  return <WingBanner wing={wing.id as WingId} />;
}

async function WingIntro({ params }: { params: Promise<{ wing: string }> }) {
  const { wing: wingId } = await params;
  const wing = getWing(wingId);
  if (!wing) notFound();
  return (
    <>
      <h1 className="mt-3 text-4xl md:text-6xl">{wing.title}</h1>
      <p className="mt-4 max-w-xl text-[rgba(14,14,16,0.9)]">
        {wing.subtitle}. {wing.medium}.
      </p>
    </>
  );
}

async function WingBody({ params }: { params: Promise<{ wing: string }> }) {
  const { wing: wingId } = await params;
  const wing = getWing(wingId);
  if (!wing) notFound();
  const list = exhibitsByWing(wing.id as WingId);

  return (
    <div className="mt-10 grid gap-8 md:grid-cols-2">
      {list.map((ex, i) => (
        <Link
          key={ex.id}
          href={`/exhibit/${ex.id}`}
          className="group block animate-rise"
          style={{ animationDelay: `${60 + i * 60}ms` }}
        >
          <div className="stage-frame transition duration-500 group-hover:border-[var(--accent)]">
            <ExhibitThumb exhibit={ex} />
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <div>
              <p className="accession">{ex.accession}</p>
              <h2 className="mt-1 text-xl group-hover:text-[var(--accent)]">{ex.title}</h2>
            </div>
            <span className="accession text-right">{ex.medium}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function WingPage({ params }: { params: Promise<{ wing: string }> }) {
  return (
    <div className="animate-page-in relative mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden opacity-70 md:h-48">
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
              <div className="mt-3 h-10 w-44 animate-pulse bg-[rgba(14,14,16,0.08)] md:h-14 md:w-56" />
              <div className="mt-4 h-4 max-w-md animate-pulse bg-[rgba(14,14,16,0.06)]" />
            </>
          }
        >
          <WingIntro params={params} />
        </Suspense>
      </div>

      {/* Sprocket rail — echoes corridor */}
      <div className="relative mt-10 flex items-center gap-2 overflow-hidden" aria-hidden>
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className="h-3 w-4 shrink-0 rounded-[2px] border border-[var(--line-strong)] bg-[rgba(14,14,16,0.08)]"
          />
        ))}
      </div>

      <Suspense fallback={<WingGridSkeleton />}>
        <WingBody params={params} />
      </Suspense>
    </div>
  );
}
