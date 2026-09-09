import { Column, RowData } from "@tanstack/react-table"
import { CSSProperties } from "react"

import { cn } from "~/hr-port/utils/style"

export const getCommonCellStyles = <T extends RowData>({
  column,
}: {
  column: Column<T>
}): { className: string; style: CSSProperties } => {
  const isPinned = column.getIsPinned()
  const style = {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    zIndex: isPinned ? 1 : undefined,
  } satisfies CSSProperties
  return {
    style,
    className: cn({
      "right-shadow": isPinned && column.getIsLastColumn("left"),
      "left-shadow": isPinned && column.getIsFirstColumn("right"),
    }),
  }
}
