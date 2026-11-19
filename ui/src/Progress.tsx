import { cn } from "./cn";

// Progress — thin determinate bar. `value` is a percentage (0–100, clamped).
// `tone` uses --brand for task progress, --info/--warn for buffers/thresholds.

type ProgressTone = "primary" | "info" | "warning";

export function Progress({
  value,
  tone = "primary",
  label,
  className,
}: {
  value: number;
  tone?: ProgressTone;
  /** Accessible name, e.g. "Füllstand" — announced with the percentage (required: WCAG 4.1.2). */
  label: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("omv-progress", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn("omv-progress-bar", `omv-progress-${tone}`)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
