export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-12 md:px-8 md:py-16">
      <p className="eyebrow">Curatorial note</p>
      <h1 className="mt-3 text-4xl md:text-5xl">About Igris</h1>
      <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-[var(--ink-soft)]">
        <p>
          Igris is a digital museum of living media — kinetic pin reliefs, generative loci, WebGL
          alcoves, continuous fields, and forge machines. It is named for vigilance: a silent guard
          over a synthetic archive.
        </p>
        <p>
          Works run live in the browser (Pts.js, React Three Fiber, Canvas). Some plates can still be
          baked offline by a Python atelier into <code>public/archive</code>. Beauty first; language
          is a tool, not a boundary.
        </p>
        <p>
          Nothing here is scraped from copyrighted film or comics. Every accession is authored for
          this institution — algorithms with mass, light, and a visitor&apos;s hand in the field.
        </p>
      </div>
    </div>
  );
}
