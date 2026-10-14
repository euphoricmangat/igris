/** Hooke spring + damping — shared by kinetic sculptures and forge mechanisms. */
export function springStep(
  current: number,
  target: number,
  velocity: number,
  stiffness = 0.12,
  damping = 0.82
): { value: number; velocity: number } {
  const force = (target - current) * stiffness;
  const nextV = (velocity + force) * damping;
  return { value: current + nextV, velocity: nextV };
}

export function preferReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
