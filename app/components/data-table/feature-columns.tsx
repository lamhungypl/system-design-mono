import type { ColumnDef, RowData, Row } from "@tanstack/react-table"
import { ChevronRight } from "lucide-react"
import { Checkbox } from "~/components/ui/checkbox"
import { cn } from "~/lib/utils"

export const SELECT_COL_ID = "__select__"
export const EXPAND_COL_ID = "__expand__"

export function selectionColumn<T extends RowData>(type: "checkbox" | "radio"): ColumnDef<T> {
  return {
    id: SELECT_COL_ID,
    size: 44,
    enableSorting: false,
    enableColumnFilter: false,
    header: ({ table }) => {
      if (type === "radio") return null
      const all = table.getIsAllPageRowsSelected()
      const some = table.getIsSomePageRowsSelected()
      return (
        <Checkbox
          checked={all}
          indeterminate={some && !all}
          onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
        />
      )
    },
    cell: ({ row }: { row: Row<T> }) => {
      if (!row.getCanSelect()) return null
      if (type === "radio") {
        return (
          <input
            type="radio"
            className="size-4 cursor-pointer accent-primary"
            checked={row.getIsSelected()}
            onChange={() => {
              row.getToggleSelectedHandler()({ target: { checked: true } })
            }}
          />
        )
      }
      return (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(checked) => row.toggleSelected(!!checked)}
        />
      )
    },
  }
}

export function expandColumn<T extends RowData>(): ColumnDef<T> {
  return {
    id: EXPAND_COL_ID,
    size: 40,
    enableSorting: false,
    enableColumnFilter: false,
    header: () => null,
    cell: ({ row }: { row: Row<T> }) => {
      if (!row.getCanExpand()) return null
      return (
        <button
          type="button"
          onClick={row.getToggleExpandedHandler()}
          className={cn(
            "inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground transition-transform hover:text-foreground",
          )}
          style={{
            transform: row.getIsExpanded() ? "rotate(90deg)" : "rotate(0deg)",
          }}
          aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
        >
          <ChevronRight className="size-4" />
        </button>
      )
    },
  }
}
