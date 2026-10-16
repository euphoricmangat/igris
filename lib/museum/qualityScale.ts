/** Pick thumb vs full numeric scale for expand payoff. */
export function qualityScale(expanded: boolean, thumb: number, full: number): number {
  return expanded ? full : thumb;
}
