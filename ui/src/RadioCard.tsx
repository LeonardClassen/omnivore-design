import type { ReactNode } from "react";
import { cn } from "./cn";

// RadioCard — a large selectable option card (plan / variant picker). Selected
// state gets the --brand border + soft fill + ring. Keyboard-activatable for the
// cloud surface; on the touch kiosk it's a tap target.

export function RadioCard({
  selected = false,
  onSelect,
  children,
  className,
  "data-testid": dataTestId,
}: {
  selected?: boolean;
  onSelect?: () => void;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      data-testid={dataTestId}
      className={cn("omv-radio-card", selected && "is-selected", className)}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.();
        }
      }}
    >
      {children}
    </div>
  );
}
