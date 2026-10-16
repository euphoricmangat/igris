import Link from "next/link";

const links = [
  { href: "/corridor", label: "Corridor" },
  { href: "/index", label: "Index" },
  { href: "/index#atelier", label: "Atelier" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(10,10,12,0.72)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-syne)] text-xl font-extrabold tracking-tight text-[var(--paper)]"
        >
          IGRIS
        </Link>
        <nav className="flex items-center gap-5 md:gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="eyebrow !normal-case !tracking-[0.14em] text-[var(--ink-soft)] transition-colors hover:text-[var(--accent)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
