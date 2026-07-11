import type { ReactNode } from "react";
import { cn } from "./cn";

// Btn — API-compatible with the HMI's original ui.tsx so screens don't change.
// Styling lives in components.css (.omv-btn*), token-driven + theme-aware.

type Variant = "default" | "primary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  default: "omv-btn-secondary",
  primary: "omv-btn-primary",
  danger: "omv-btn-danger",
  ghost: "omv-btn-ghost",
};

export function Btn({
  children,
  onClick,
  variant = "default",
  disabled,
  size = "md",
  className,
  type,
  "data-testid": dataTestId,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  disabled?: boolean;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
  "data-testid"?: string;
}) {
  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
      className={cn("omv-btn", VARIANT[variant], `omv-btn-${size}`, className)}
    >
      {children}
    </button>
  );
}
