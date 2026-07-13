import type { ReactNode } from "react";
import { cn } from "./cn";

// Badge — small status pill. `tone` picks the semantic color; `dot` prepends a
// filled dot (currentColor). Uses status/brand-soft tokens, never a solid fill.

type BadgeTone = "primary" | "ok" | "warn" | "danger" | "info" | "neutral";

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("omv-badge", `omv-badge-${tone}`, className)}>
      {dot && <span className="omv-badge-dot" />}
      {children}
    </span>
  );
}
