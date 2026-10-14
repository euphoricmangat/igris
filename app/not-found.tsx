import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-[720px] flex-col justify-center px-5 py-20">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl">Room not found</h1>
      <p className="mt-4 text-[var(--ink-soft)]">This accession is not in the archive.</p>
      <Link href="/corridor" className="mt-8 text-[var(--accent)] underline-offset-4 hover:underline">
        Return to corridor
      </Link>
    </div>
  );
}
