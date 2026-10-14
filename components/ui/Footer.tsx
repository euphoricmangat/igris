import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="accession">IGR.MUSEUM · Synthetic archive</p>
        <div className="flex gap-5">
          <Link href="/corridor" className="eyebrow hover:text-[var(--accent)]">
            Enter
          </Link>
          <Link href="/about" className="eyebrow hover:text-[var(--accent)]">
            Curatorial note
          </Link>
        </div>
      </div>
    </footer>
  );
}
