import { cn } from "./cn";

// Progress — thin determinate bar. `value` is a percentage (0–100, clamped).
// `tone` uses --brand for task progress, --info/--warn for buffers/thresholds.

type ProgressTone = "primary" | "info" | "warning";

export function Progress({
  value,
  tone = "primary",
  className,
}: {
  value: number;
  tone?: ProgressTone;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("omv-progress", className)}>
      <div
        className={cn("omv-progress-bar", `omv-progress-${tone}`)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
