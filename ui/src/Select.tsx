import type { ReactNode } from "react";
import { cn } from "./cn";

// Select — a styled NATIVE <select> (no Radix listbox; design-system decision =
// hand-roll 0-dep). components.css sets appearance:none on select.omv-input, so we
// draw the chevron ourselves. On the touch kiosk the native picker is the best
// affordance (OS wheel), and on the cloud it's an ordinary select — zero custom
// popover logic either way. Pass `options` (strings or {value,label}) or raw
// <option> children.

type Option = { value: string; label?: string; disabled?: boolean };

export function Select({
  value,
  onChange,
  options,
  children,
  disabled,
  id,
  className,
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
}: {
  value: string;
  onChange: (value: string) => void;
  options?: Array<Option | string>;
  children?: ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "data-testid"?: string;
}) {
  return (
    <div className={cn("omv-input-wrap", className)}>
      <select
        id={id}
        className="omv-input"
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        data-testid={dataTestId}
        onChange={(e) => onChange(e.target.value)}
      >
        {options
          ? options.map((o) => {
              const opt = typeof o === "string" ? { value: o } : o;
              return (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {typeof o === "string" ? o : opt.label ?? opt.value}
                </option>
              );
            })
          : children}
      </select>
      <svg
        className="omv-select-chevron"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
