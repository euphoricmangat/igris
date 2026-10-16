import { getResearch } from "@/lib/museum/research";
import type { EngineKind } from "@/lib/museum/types";

/** Small physics / mode plaque under the stage — spring grammar made visible. */
export function ModePlaque({ engine }: { engine: EngineKind }) {
  const note = getResearch(engine);
  if (!note.physics) return null;
  return (
    <p className="mt-2 max-w-xl border-l border-[var(--line-strong)] pl-3 text-[11px] leading-relaxed text-[var(--ink-soft)]">
      <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]">
        Mode
      </span>
      <span className="mt-1 block font-[family-name:var(--font-geist-mono)] tracking-[0.02em]">
        {note.physics}
      </span>
    </p>
  );
}
