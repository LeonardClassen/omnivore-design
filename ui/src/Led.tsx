import { cn } from "./cn";

// Led — status dot (+ optional mono label). `on` shows the OK-state green with
// a soft glow; off is a dim neutral. Uses --ok (status green), never --brand.

export function Led({ on, label }: { on: boolean; label?: string }) {
  return (
    <span className="omv-led">
      <span className={cn("omv-led-dot", on && "is-ok")} />
      {label && <span>{label}</span>}
    </span>
  );
}
