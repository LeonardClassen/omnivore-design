import type { ReactNode } from "react";
import { cn } from "./cn";

// Avatar — round initials chip in brand-soft. `size` (px) scales the box and
// the font together.

export function Avatar({
  children,
  size = 40,
  className,
}: {
  children: ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("omv-avatar", className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {children}
    </span>
  );
}
