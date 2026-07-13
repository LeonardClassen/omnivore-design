import type { ReactNode } from "react";
import { cn } from "./cn";

// Banner — inline notice with a semantic border/tint. Pass an `icon` (the lib is
// icon-library-free, so the consumer supplies the glyph) and an optional `title`;
// body is children. Reserve `danger`/`warning` for genuinely abnormal states.

type BannerTone = "ok" | "warning" | "danger" | "info";

export function Banner({
  children,
  tone = "info",
  title,
  icon,
  className,
}: {
  children?: ReactNode;
  tone?: BannerTone;
  title?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("omv-banner", `omv-banner-${tone}`, className)}>
      {icon}
      <div>
        {title && <div className="omv-banner-title">{title}</div>}
        {children}
      </div>
    </div>
  );
}
