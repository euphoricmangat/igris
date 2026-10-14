import type { EngineKind } from "@/lib/museum/types";
import { getInteractionHint } from "@/lib/museum/interactionHints";

export function InteractHint({ engine }: { engine: EngineKind }) {
  const hint = getInteractionHint(engine);
  return (
    <p className="accession mt-3 text-[var(--ink-soft)]" aria-live="polite">
      Interact · {hint}
    </p>
  );
}
