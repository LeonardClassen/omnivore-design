import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "./cn";

// Tabs — the underline tab strip. Controlled: pass `active` (an id) and
// `onSelect`. The active tab gets the --brand underline.
// Keyboard per WAI-ARIA APG "Tabs" (automatic activation): one tab stop
// (roving tabindex), Left/Right wrap around, Home/End jump to the ends.

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
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const current = tabs.findIndex((t) => t.id === active);
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight" ? (current >= last ? 0 : current + 1)
      : e.key === "ArrowLeft" ? (current <= 0 ? last : current - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    onSelect(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className={cn("omv-tabs", className)} role="tablist" onKeyDown={onKeyDown}>
      {tabs.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="tab"
          aria-selected={t.id === active}
          tabIndex={t.id === active ? 0 : -1}
          className={cn("omv-tab", t.id === active && "is-active")}
          onClick={() => onSelect(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
