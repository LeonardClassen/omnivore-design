import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "./cn";

// Modal — hand-rolled overlay (no Radix; design-system decision = hand-roll 0-dep).
// The scrim + card come from omv-modal* in components.css; this wrapper adds the
// only real logic: Escape-to-close + scrim-click-to-close.
//
// Rendered inline (no react-dom portal) so the lib's peer deps stay at just `react`
// — a position:fixed scrim already covers the viewport, matching the HMI's existing
// dialogs. Keyboard per WAI-ARIA APG "Dialog (Modal)": focus moves into the dialog
// on open, Tab/Shift+Tab stay inside, Escape closes, and focus returns to the
// element that opened it. On the touch kiosk this costs nothing; on the cloud it is
// required. `width` overrides the 520px default (the HMI dialogs are 420–440px).

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Focus in on open, back to the opener on close.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => opener?.focus?.();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const inside = dialogRef.current.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
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
            {title ? <h2 className="omv-modal-title" id={titleId}>{title}</h2> : <span />}
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
