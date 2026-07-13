import type { ReactNode } from "react";
import { cn } from "./cn";

// KV — a label-over-value pair. `mono` renders the value in the tabular mono
// face (for serials, codes, live numbers).

export function KV({
  label,
  children,
  mono = false,
  className,
}: {
  label: string;
  children: ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("omv-kv", className)}>
      <span className="omv-kv-label">{label}</span>
      <span className={cn("omv-kv-value", mono && "omv-mono")}>{children}</span>
    </div>
  );
}
