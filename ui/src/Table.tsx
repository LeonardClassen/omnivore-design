import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "./cn";

// Table — a CSS-grid table (header row + data rows share one column template).
// Generic over the row type. Column `width` values are grid tracks ("1fr",
// "120px"); or pass an explicit `columnsTemplate`. Rows re-theme automatically.

type Column<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  width?: string;
};

export function Table<T>({
  columns,
  rows,
  rowKey,
  columnsTemplate,
  onRowClick,
  className,
}: {
  columns: Array<Column<T>>;
  rows: T[];
  rowKey: (row: T, index: number) => string | number;
  columnsTemplate?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}) {
  const template =
    columnsTemplate ?? columns.map((c) => c.width ?? "1fr").join(" ");
  // CSS-grid layout, so the table semantics come from ARIA roles (APG "Table").
  // Clickable rows are focusable and react to Enter/Space like a button.
  return (
    <div className={cn("omv-table", className)} role="table">
      <div role="rowgroup">
        <div className="omv-thead" role="row" style={{ gridTemplateColumns: template }}>
          {columns.map((c) => (
            <div key={c.key} role="columnheader">
              {c.header}
            </div>
          ))}
        </div>
      </div>
      <div role="rowgroup">
        {rows.map((row, i) => (
          <div
            key={rowKey(row, i)}
            className="omv-trow"
            role="row"
            style={{ gridTemplateColumns: template }}
            {...(onRowClick && {
              tabIndex: 0,
              onClick: () => onRowClick(row),
              onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onRowClick(row);
                }
              },
            })}
          >
            {columns.map((c) => (
              <div key={c.key} role="cell">
                {c.render(row)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
