import { useEffect, type ReactNode } from "react";
import { cn } from "./cn";

// Modal — hand-rolled overlay (no Radix; design-system decision = hand-roll 0-dep).
// The scrim + card come from omv-modal* in components.css; this wrapper adds the
// only real logic: Escape-to-close + scrim-click-to-close.
//
// Rendered inline (no react-dom portal) so the lib's peer deps stay at just `react`
// — a position:fixed scrim already covers the viewport, matching the HMI's existing
// dialogs. On the keyboard-less touch kiosk the scrim blocks background touches, so a
// heavy focus-trap isn't needed; Escape is there for the cloud surface / a maintenance
// keyboard. `width` overrides the 520px default (the HMI dialogs are 420–440px).

export function Modal({
  open,
  onClose,
  title,
  footer,
  children,
  width,
  closeOnScrim = true,
  showClose = true,
  className,
  "data-testid": dataTestId,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: ReactNode;
  children: ReactNode;
  width?: number | string;
  closeOnScrim?: boolean;
  showClose?: boolean;
  className?: string;
  "data-testid"?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="omv-modal-scrim"
      onClick={
        closeOnScrim
          ? (e) => {
              if (e.target === e.currentTarget) onClose();
            }
          : undefined
      }
    >
      <div
        role="dialog"
        aria-modal="true"
        data-testid={dataTestId}
        className={cn("omv-modal", className)}
        style={
          width !== undefined
            ? { maxWidth: typeof width === "number" ? `${width}px` : width }
            : undefined
        }
      >
        {(title || showClose) && (
          <header className="omv-modal-header">
            {title ? <h2 className="omv-modal-title">{title}</h2> : <span />}
            {showClose && (
              <button
                type="button"
                className="omv-iconbtn"
                onClick={onClose}
                aria-label="Close"
              >
                {"×"}
              </button>
            )}
          </header>
        )}
        <div className="omv-modal-body">{children}</div>
        {footer && <footer className="omv-modal-footer">{footer}</footer>}
      </div>
    </div>
  );
}
