import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { exhibits, getExhibit } from "@/lib/museum/exhibits";
import { getWing } from "@/lib/museum/wings";
import { Placard } from "@/components/museum/Placard";
import { ExhibitInteractChrome, ExhibitView } from "@/components/museum/ExhibitView";

export function generateStaticParams() {
  return exhibits.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ex = getExhibit(id);
  return { title: ex?.title ?? "Exhibit" };
}

function ExhibitSkeleton() {
  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_0.7fr] lg:items-end">
      <div>
        <div
          className="min-h-[360px] animate-pulse border border-[var(--line)] lg:min-h-[520px]"
          style={{
            background:
              "linear-gradient(160deg, rgba(42,36,32,0.55) 0%, rgba(28,24,22,0.35) 100%)",
          }}
        />
        <div className="mt-3 h-3 max-w-md animate-pulse bg-[rgba(14,14,16,0.08)]" />
      </div>
      <div className="space-y-3 animate-pulse">
        <div className="h-3 w-20 bg-[rgba(14,14,16,0.08)]" />
        <div className="h-8 w-48 bg-[rgba(14,14,16,0.1)]" />
        <div className="h-24 w-full bg-[rgba(232,228,220,0.35)]" />
      </div>
    </div>
  );
}

async function ExhibitBackLink({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exhibit = getExhibit(id);
  if (!exhibit) notFound();
  const wing = getWing(exhibit.wing);
  return (
    <Link href={`/wing/${exhibit.wing}`} className="eyebrow hover:text-[var(--accent)]">
      ← {wing?.title ?? "Wing"}
    </Link>
  );
}

async function ExhibitContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exhibit = getExhibit(id);
  if (!exhibit) notFound();

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_0.7fr] lg:items-end">
      <div className="animate-rise">
        <div className="stage-frame min-h-[360px] lg:min-h-[520px]">
          <ExhibitView exhibit={exhibit} />
        </div>
        <ExhibitInteractChrome exhibit={exhibit} />
        <p className="mt-2 accession text-[var(--ink-soft)]">
          Use <span className="text-[var(--ink)]">Expand</span> on the stage for a full-window view · Esc to close
        </p>
      </div>
      <div className="animate-rise" style={{ animationDelay: "90ms" }}>
        <Placard exhibit={exhibit} />
      </div>
    </div>
  );
}

export default function ExhibitPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="animate-page-in mx-auto max-w-[1400px] px-5 py-10 md:px-8 md:py-14">
      <Suspense fallback={<span className="eyebrow">← Wing</span>}>
        <ExhibitBackLink params={params} />
      </Suspense>
      <Suspense fallback={<ExhibitSkeleton />}>
        <ExhibitContent params={params} />
      </Suspense>
    </div>
  );
}
