import type { ReactNode } from "react";
import { cn } from "./cn";

// Card — bordered Industrial-Glass panel. Optional header (mono-uppercase
// title on dark, semibold on light — see the theme-aware rule in components.css).

export function Card({
  children,
  title,
  right,
  className,
}: {
  children: ReactNode;
  title?: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("omv-card omv-card-panel", className)}>
      {(title || right) && (
        <header className="omv-card-header">
          {title ? <h2 className="omv-card-title">{title}</h2> : <span />}
          {right}
        </header>
      )}
      <div className="omv-card-body">{children}</div>
    </section>
  );
}
