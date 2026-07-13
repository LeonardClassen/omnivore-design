import type { ReactNode } from "react";
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
  return (
    <div className={cn("omv-table", className)}>
      <div className="omv-thead" style={{ gridTemplateColumns: template }}>
        {columns.map((c) => (
          <div key={c.key}>{c.header}</div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={rowKey(row, i)}
          className="omv-trow"
          style={{ gridTemplateColumns: template }}
          onClick={onRowClick ? () => onRowClick(row) : undefined}
        >
          {columns.map((c) => (
            <div key={c.key}>{c.render(row)}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
