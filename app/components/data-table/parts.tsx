import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react"
import { flexRender, type Column, type Header as TanstackHeader, type RowData, type Table } from "@tanstack/react-table"
import { ChevronUp, ChevronDown, ChevronRight, Filter } from "lucide-react"
import { Checkbox } from "~/components/ui/checkbox"
import { Button } from "~/components/ui/button"
import { Select } from "~/components/ui/select"
import { Spin } from "~/components/ui/spin"
import { Empty } from "~/components/ui/empty"
import { Popover } from "~/components/ui/popover"
import { cn } from "~/lib/utils"
import { DataTableProvider, useDataTableContext } from "./data-table-context"
import type { TableSize, ColumnType } from "./types"

const sizeConfig: Record<TableSize, { cellPad: string; headPad: string; text: string }> = {
  small: { cellPad: "px-2 py-1.5", headPad: "px-2 py-1.5", text: "text-xs" },
  middle: { cellPad: "px-3 py-2.5", headPad: "px-3 py-2", text: "text-sm" },
  large: { cellPad: "px-4 py-3.5", headPad: "px-4 py-3", text: "text-sm" },
}

function pinStyle<T>(column: Column<T, unknown>): CSSProperties {
  const pinned = column.getIsPinned()
  if (!pinned) return {}
  const style: CSSProperties = {
    position: "sticky",
    zIndex: 2,
  }
  if (pinned === "left") style.left = column.getStart("left")
  if (pinned === "right") style.right = column.getAfter("right")
  return style
}

// ───────────────────────────── Root ─────────────────────────────

interface RootProps<T extends RowData> {
  table: Table<T>
  size?: TableSize
  bordered?: boolean
  showHeader?: boolean
  loading?: boolean
  emptyText?: React.ReactNode
  expandedRowRender?: (record: T, index: number) => React.ReactNode
  rowExpandable?: (record: T) => boolean
  scrollY?: number | string
  stickyHeader?: boolean
  infinite?: {
    hasMore: boolean
    loading: boolean
    onLoadMore: () => void
  }
  onColumnReorder?: (sourceId: string, targetId: string) => void
  className?: string
  children: React.ReactNode
}

function Root<T extends RowData>({
  table,
  size = "middle",
  bordered = false,
  showHeader = true,
  loading = false,
  emptyText,
  expandedRowRender,
  rowExpandable,
  scrollY,
  stickyHeader = false,
  infinite,
  onColumnReorder,
  className,
  children,
}: RootProps<T>) {
  return (
    <DataTableProvider<T>
      value={{
        table,
        size,
        bordered,
        showHeader,
        loading,
        emptyText: emptyText ?? <Empty description="No data" />,
        expandedRowRender,
        rowExpandable,
        scrollY,
        stickyHeader: stickyHeader || !!scrollY,
        infinite,
        onColumnReorder,
      }}
    >
      <div className={cn("flex flex-col gap-3", className)}>{children}</div>
    </DataTableProvider>
  )
}

// ───────────────────────────── Toolbar ─────────────────────────────

function Toolbar({ children, className }: { children?: React.ReactNode; className?: string }) {
  if (!children) return null
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>
  )
}

// ───────────────────────────── Container ─────────────────────────────

function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  const { bordered, loading, scrollY, infinite } = useDataTableContext()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const infiniteRef = useRef(infinite)
  infiniteRef.current = infinite
  const infiniteEnabled = !!infinite

  useEffect(() => {
    if (!infiniteEnabled) return
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        const current = infiniteRef.current
        if (!current) return
        if (entry?.isIntersecting && current.hasMore && !current.loading) {
          current.onLoadMore()
        }
      },
      { root: scrollRef.current, rootMargin: "64px 0px" },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [infiniteEnabled])

  const style: CSSProperties = scrollY ? { maxHeight: scrollY } : {}

  return (
    <div
      ref={scrollRef}
      style={style}
      className={cn(
        "relative overflow-auto rounded-xl bg-card",
        bordered ? "border border-border" : "border border-border/60",
        className,
      )}
    >
      {children}
      {infinite && (
        <div ref={sentinelRef} className="flex items-center justify-center py-3">
          {infinite.loading ? (
            <Spin size="small" />
          ) : infinite.hasMore ? (
            <span className="text-xs text-muted-foreground">Scroll for more</span>
          ) : (
            <span className="text-xs text-muted-foreground">— End of list —</span>
          )}
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70">
          <Spin />
        </div>
      )}
    </div>
  )
}

// ───────────────────────────── Table ─────────────────────────────

function TableEl({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <table className={cn("w-full border-collapse text-sm", className)}>
      {children}
    </table>
  )
}

// ───────────────────────────── Header ─────────────────────────────

function HeaderCell<T>({ header }: { header: TanstackHeader<T, unknown> }) {
  const { size, bordered, onColumnReorder } = useDataTableContext()
  const { headPad, text } = sizeConfig[size]
  const column = header.column
  const antCol = column.columnDef.meta?.antColumn
  const align = antCol?.align
  const pinned = column.getIsPinned()
  const pinStyles = pinStyle(column)

  const [draggingOver, setDraggingOver] = useState(false)
  const canReorder = !!onColumnReorder && column.id !== "__select__" && column.id !== "__expand__"

  const thStyle: CSSProperties = {
    ...pinStyles,
    ...(header.getSize() !== 150 ? { width: header.getSize() } : {}),
  }

  return (
    <th
      scope="col"
      style={thStyle}
      draggable={canReorder}
      onDragStart={
        canReorder
          ? (e) => {
              e.dataTransfer.setData("text/plain", column.id)
              e.dataTransfer.effectAllowed = "move"
            }
          : undefined
      }
      onDragOver={
        canReorder
          ? (e) => {
              e.preventDefault()
              e.dataTransfer.dropEffect = "move"
              setDraggingOver(true)
            }
          : undefined
      }
      onDragLeave={canReorder ? () => setDraggingOver(false) : undefined}
      onDrop={
        canReorder
          ? (e) => {
              e.preventDefault()
              const sourceId = e.dataTransfer.getData("text/plain")
              setDraggingOver(false)
              if (sourceId && sourceId !== column.id) onColumnReorder?.(sourceId, column.id)
            }
          : undefined
      }
      className={cn(
        headPad,
        text,
        "font-medium text-muted-foreground text-left uppercase tracking-wide bg-muted/40",
        bordered && "border-r border-border last:border-r-0",
        align === "center" && "text-center",
        align === "right" && "text-right",
        pinned === "left" && "shadow-[1px_0_0_0_var(--border)]",
        pinned === "right" && "shadow-[-1px_0_0_0_var(--border)]",
        canReorder && "cursor-grab active:cursor-grabbing",
        draggingOver && "bg-accent",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1.5",
          align === "center" && "justify-center",
          align === "right" && "justify-end",
        )}
      >
        <span className="flex-1">
          {header.isPlaceholder
            ? null
            : flexRender(column.columnDef.header, header.getContext())}
        </span>
        {column.getCanSort() && <SortIndicator column={column} />}
        {column.getCanFilter() && antCol?.filters && (
          <FilterButton column={column} filters={antCol.filters} />
        )}
      </div>
    </th>
  )
}

function Header({ className }: { className?: string }) {
  const { table, showHeader, stickyHeader } = useDataTableContext()
  if (!showHeader) return null

  return (
    <thead
      className={cn(
        stickyHeader && "sticky top-0 z-[3]",
        className,
      )}
    >
      {table.getHeaderGroups().map((group) => (
        <tr key={group.id} className="border-b border-border">
          {group.headers.map((header) => (
            <HeaderCell key={header.id} header={header} />
          ))}
        </tr>
      ))}
    </thead>
  )
}

function SortIndicator<T>({ column }: { column: Column<T, unknown> }) {
  const dir = column.getIsSorted()
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        column.toggleSorting()
      }}
      className="inline-flex flex-col leading-none cursor-pointer"
      aria-label="Sort column"
    >
      <ChevronUp
        className={cn(
          "size-3 transition-opacity",
          dir === "asc" ? "text-foreground" : "text-muted-foreground opacity-60",
        )}
      />
      <ChevronDown
        className={cn(
          "-mt-1 size-3 transition-opacity",
          dir === "desc" ? "text-foreground" : "text-muted-foreground opacity-60",
        )}
      />
    </button>
  )
}

function FilterButton<T>({
  column,
  filters,
}: {
  column: Column<T, unknown>
  filters: { text: React.ReactNode; value: string | number | boolean }[]
}) {
  const current = (column.getFilterValue() as Array<string | number | boolean>) ?? []
  const [draft, setDraft] = useState<Array<string | number | boolean>>(current)
  const [open, setOpen] = useState(false)
  const active = current.length > 0

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) setDraft(current)
      }}
      placement="bottom-end"
      content={
        <div className="min-w-40">
          <div className="flex flex-col gap-1.5 pb-2">
            {filters.map((f) => (
              <Checkbox
                key={String(f.value)}
                checked={draft.includes(f.value)}
                onCheckedChange={(checked) => {
                  setDraft((d) =>
                    checked ? [...d, f.value] : d.filter((v) => v !== f.value),
                  )
                }}
              >
                {f.text}
              </Checkbox>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                setDraft([])
                column.setFilterValue(undefined)
                setOpen(false)
              }}
            >
              Reset
            </Button>
            <Button
              size="xs"
              onClick={() => {
                column.setFilterValue(draft.length ? draft : undefined)
                setOpen(false)
              }}
            >
              OK
            </Button>
          </div>
        </div>
      }
    >
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "inline-flex size-5 items-center justify-center rounded-sm transition-colors hover:bg-muted",
          active && "text-primary",
        )}
        aria-label="Filter column"
      >
        <Filter className="size-3" />
      </button>
    </Popover>
  )
}

// ───────────────────────────── Body ─────────────────────────────

function Body({ className }: { className?: string }) {
  const { table, size, bordered, emptyText, expandedRowRender } = useDataTableContext()
  const { cellPad, text } = sizeConfig[size]
  const rows = table.getRowModel().rows
  const colCount = table.getVisibleFlatColumns().length

  if (rows.length === 0) {
    return (
      <tbody className={className}>
        <tr>
          <td colSpan={colCount} className="py-10 text-center text-muted-foreground">
            {emptyText}
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody className={className}>
      {rows.map((row) => {
        if (row.getIsGrouped()) {
          return (
            <tr key={row.id} className="bg-muted/50 border-b border-border">
              <td
                colSpan={colCount}
                className={cn(cellPad, "font-medium text-sm")}
              >
                <button
                  type="button"
                  onClick={row.getToggleExpandedHandler()}
                  className="inline-flex items-center gap-2 w-full text-left cursor-pointer"
                >
                  <ChevronRight
                    className="size-4 text-muted-foreground transition-transform"
                    style={{ transform: row.getIsExpanded() ? "rotate(90deg)" : "rotate(0deg)" }}
                  />
                  <span className="uppercase tracking-wide text-xs text-muted-foreground">
                    {String(row.groupingColumnId)}
                  </span>
                  <span className="font-semibold">{String(row.groupingValue)}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {row.subRows.length} {row.subRows.length === 1 ? "item" : "items"}
                  </span>
                </button>
              </td>
            </tr>
          )
        }
        return (
          <Fragment key={row.id}>
            <tr
              className={cn(
                "border-b border-border/60 transition-colors",
                "hover:bg-muted/30",
                row.getIsSelected() && "bg-primary/5",
              )}
            >
              {row.getVisibleCells().map((cell) => {
                const column = cell.column
                const antCol = column.columnDef.meta?.antColumn
                const align = antCol?.align
                const pinned = column.getIsPinned()
                return (
                  <td
                    key={cell.id}
                    style={pinStyle(column)}
                    className={cn(
                      cellPad,
                      text,
                      "align-middle bg-card",
                      bordered && "border-r border-border last:border-r-0",
                      align === "center" && "text-center",
                      align === "right" && "text-right",
                      antCol?.ellipsis && "max-w-0 truncate",
                      pinned === "left" && "shadow-[1px_0_0_0_var(--border)]",
                      pinned === "right" && "shadow-[-1px_0_0_0_var(--border)]",
                    )}
                  >
                    {flexRender(column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
            {row.getIsExpanded() && expandedRowRender && !row.getIsGrouped() && (
              <tr className="bg-muted/20">
                <td colSpan={colCount} className={cn(cellPad, "border-b border-border/60")}>
                  {expandedRowRender(row.original, row.index)}
                </td>
              </tr>
            )}
          </Fragment>
        )
      })}
    </tbody>
  )
}

// ───────────────────────────── Pagination ─────────────────────────────

interface PaginationPartProps {
  pageSizeOptions?: number[]
  showSizeChanger?: boolean
  showTotal?: (total: number, range: [number, number]) => React.ReactNode
  className?: string
}

function Pagination({
  pageSizeOptions = [10, 20, 50, 100],
  showSizeChanger = true,
  showTotal,
  className,
}: PaginationPartProps = {}) {
  const { table } = useDataTableContext()
  const { pageIndex, pageSize } = table.getState().pagination
  const total = table.getRowCount()
  const pageCount = table.getPageCount()

  if (total === 0) return null

  const from = pageIndex * pageSize + 1
  const to = Math.min((pageIndex + 1) * pageSize, total)

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground",
        className,
      )}
    >
      <div>{showTotal ? showTotal(total, [from, to]) : `${from}-${to} of ${total}`}</div>

      <div className="flex items-center gap-2">
        {showSizeChanger && (
          <Select
            size="small"
            value={String(pageSize)}
            onChange={(v) => table.setPageSize(Number(v))}
            options={pageSizeOptions.map((n) => ({
              value: String(n),
              label: `${n} / page`,
            }))}
            className="w-28"
          />
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Prev
        </Button>
        <span className="tabular-nums text-foreground">
          {pageIndex + 1} / {Math.max(pageCount, 1)}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export { Root, Toolbar, Container, TableEl as Table, Header, Body, Pagination }
export type { PaginationPartProps }
