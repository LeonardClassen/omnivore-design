import type { ReactNode } from "react";
import { cn } from "./cn";

// Stepper — horizontal lifecycle stepper. `current` is the 0-based active step
// index; earlier steps render as done (brand check), later ones as numbers.
// Icon-library-free: the "done" check is an inline SVG.

type Step = { label: ReactNode; sublabel?: ReactNode };

function Check() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function Stepper({
  steps,
  current,
  className,
}: {
  steps: Array<Step>;
  current: number;
  className?: string;
}) {
  return (
    <div className={cn("omv-stepper", className)}>
      {steps.map((s, i) => {
        const past = i < current;
        const isCurrent = i === current;
        const last = i === steps.length - 1;
        return (
          <div className="omv-step" key={i}>
            <div className="omv-step-inner">
              <div
                className={cn(
                  "omv-step-dot",
                  past && "is-past",
                  isCurrent && "is-current",
                )}
              >
                {past ? <Check /> : i + 1}
              </div>
              <div className={cn("omv-step-label", isCurrent && "is-current")}>
                <div>{s.label}</div>
                {s.sublabel && <div className="omv-step-sublabel">{s.sublabel}</div>}
              </div>
            </div>
            {!last && <div className={cn("omv-step-line", past && "is-past")} />}
          </div>
        );
      })}
    </div>
  );
}
