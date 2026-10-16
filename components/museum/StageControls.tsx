"use client";

/** Shared Forge-style control strip for Field / Signal stages. */
export function StageControlStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center gap-3">
      {children}
    </div>
  );
}

export function StageSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="pointer-events-auto accession flex min-w-[7rem] flex-1 items-center gap-2 text-[var(--paper)]">
      <span className="shrink-0 opacity-80">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--accent)]"
        aria-label={label}
      />
    </label>
  );
}

export function StageToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pointer-events-auto border px-2.5 py-1 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.14em] transition ${
        active
          ? "border-[var(--accent)] text-[var(--accent)]"
          : "border-[rgba(232,228,220,0.28)] text-[rgba(232,228,220,0.7)] hover:border-[var(--paper)]"
      }`}
    >
      {label}
    </button>
  );
}
