import { cn } from "./cn";

// Stat — label + big tabular-mono value (+ optional unit/hint). Tone tints the
// value with a state color; live values never jitter (tabular numerics).

export function Stat({
  label,
  value,
  unit,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  tone?: "default" | "ok" | "warn" | "err";
}) {
  return (
    <div className="omv-stat">
      <div className="omv-stat-label">{label}</div>
      <div className="omv-stat-row">
        <span className={cn("omv-stat-value", tone !== "default" && `is-${tone}`)}>
          {value}
        </span>
        {unit && <span className="omv-stat-unit">{unit}</span>}
      </div>
      {hint && <div className="omv-stat-hint">{hint}</div>}
    </div>
  );
}
