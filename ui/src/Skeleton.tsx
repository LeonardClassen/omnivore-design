import { cn } from "./cn";

// Skeleton — shimmering placeholder block. `width`/`height` accept px numbers or
// any CSS length string.

export function Skeleton({
  width = "100%",
  height = 12,
  className,
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) {
  return (
    <div
      className={cn("omv-skeleton", className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}
