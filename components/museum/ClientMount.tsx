"use client";

import { useEffect, useState } from "react";

/**
 * Render children only after hydration. Use around R3F Canvas (and similar)
 * so server HTML and the first client paint stay identical.
 */
export function ClientMount({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
