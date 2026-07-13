import type { ReactNode } from "react";
import { cn } from "./cn";

// Tabs — the underline tab strip. Controlled: pass `active` (an id) and
// `onSelect`. The active tab gets the --brand underline.

type Tab = { id: string; label: ReactNode };

export function Tabs({
  tabs,
  active,
  onSelect,
  className,
}: {
  tabs: Array<Tab>;
  active: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("omv-tabs", className)} role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={t.id === active}
          className={cn("omv-tab", t.id === active && "is-active")}
          onClick={() => onSelect(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
