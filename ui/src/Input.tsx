import type { ReactNode } from "react";
import { cn } from "./cn";

// Input — a text/number field inside the focus-ring wrapper. Pass an `icon`
// (consumer-supplied glyph) to inset it on the left; `invalid` draws the red
// border (the message belongs on the surrounding <Field error="…">).

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  invalid,
  icon,
  id,
  min,
  max,
  step,
  className,
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
}: {
  value: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "search" | "password" | "email";
  disabled?: boolean;
  invalid?: boolean;
  icon?: ReactNode;
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  "aria-label"?: string;
  "data-testid"?: string;
}) {
  return (
    <span
      className={cn(
        "omv-input-wrap",
        !!icon && "has-icon",
        invalid && "is-error",
        className,
      )}
    >
      {icon}
      <input
        id={id}
        className="omv-input"
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        data-testid={dataTestId}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </span>
  );
}
