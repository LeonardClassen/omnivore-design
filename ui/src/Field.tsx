import type { ReactNode } from "react";
import { cn } from "./cn";

// Field — label + control + hint/error, wrapped in a <label> so the control is
// associated automatically. Put an <Input>/<Select>/native control as children.
// `error` (a message) shows instead of `hint`; pair it with `invalid` on the
// control for the red border.

export function Field({
  label,
  children,
  hint,
  error,
  htmlFor,
  className,
}: {
  label?: string;
  children: ReactNode;
  hint?: string;
  error?: string;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label className={cn("omv-field", className)} htmlFor={htmlFor}>
      {label && <span className="omv-field-label">{label}</span>}
      {children}
      {error ? (
        <span className="omv-field-error">{error}</span>
      ) : hint ? (
        <span className="omv-field-hint">{hint}</span>
      ) : null}
    </label>
  );
}
