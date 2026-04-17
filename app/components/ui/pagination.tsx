"use client"

import { useState } from "react"
import { cn } from "~/lib/utils"

interface PaginationProps {
  total: number
  current?: number
  defaultCurrent?: number
  pageSize?: number
  defaultPageSize?: number
  onChange?: (page: number, pageSize: number) => void
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
  showQuickJumper?: boolean
  showTotal?: (total: number, range: [number, number]) => React.ReactNode
  simple?: boolean
  disabled?: boolean
  size?: "default" | "small"
  className?: string
}

function Pagination({
  total,
  current: controlledCurrent,
  defaultCurrent = 1,
  pageSize: controlledPageSize,
  defaultPageSize = 10,
  onChange,
  showSizeChanger,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper,
  showTotal,
  simple,
  disabled,
  size = "default",
  className,
}: PaginationProps) {
  const [internalPage, setInternalPage] = useState(defaultCurrent)
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize)

  const current = controlledCurrent ?? internalPage
  const pageSize = controlledPageSize ?? internalPageSize
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  function goTo(page: number) {
    const p = Math.min(Math.max(1, page), totalPages)
    if (controlledCurrent === undefined) setInternalPage(p)
    onChange?.(p, pageSize)
  }

  function changeSize(size: number) {
    const newTotal = Math.ceil(total / size)
    const newPage = Math.min(current, newTotal)
    if (controlledPageSize === undefined) setInternalPageSize(size)
    if (controlledCurrent === undefined) setInternalPage(newPage)
    onChange?.(newPage, size)
  }

  const btnClass = cn(
    "inline-flex items-center justify-center rounded-md border border-border bg-background transition-colors select-none",
    "hover:bg-muted hover:border-primary/40",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:cursor-not-allowed disabled:opacity-50",
    disabled && "cursor-not-allowed opacity-50",
    size === "small" ? "h-6 min-w-6 px-1 text-xs" : "h-8 min-w-8 px-2 text-sm",
  )
  const activeBtnClass = "border-primary bg-primary text-primary-foreground hover:bg-primary hover:border-primary"

  if (simple) {
    return (
      <div className={cn("inline-flex items-center gap-2 text-sm", disabled && "opacity-50 pointer-events-none", className)}>
        <button className={btnClass} onClick={() => goTo(current - 1)} disabled={disabled || current <= 1} aria-label="Previous page">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="M10 3L5 8l5 5" /></svg>
        </button>
        <span className="text-muted-foreground">{current} / {totalPages}</span>
        <button className={btnClass} onClick={() => goTo(current + 1)} disabled={disabled || current >= totalPages} aria-label="Next page">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="M6 3l5 5-5 5" /></svg>
        </button>
      </div>
    )
  }

  const range: [number, number] = [Math.min((current - 1) * pageSize + 1, total), Math.min(current * pageSize, total)]

  // Generate page numbers with ellipsis
  function getPages(): (number | "…left" | "…right")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | "…left" | "…right")[] = [1]
    if (current > 4) pages.push("…left")
    for (let i = Math.max(2, current - 2); i <= Math.min(totalPages - 1, current + 2); i++) pages.push(i)
    if (current < totalPages - 3) pages.push("…right")
    pages.push(totalPages)
    return pages
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", disabled && "opacity-50 pointer-events-none", className)}>
      {showTotal && <span className="mr-1 text-sm text-muted-foreground">{showTotal(total, range)}</span>}
      <button className={btnClass} onClick={() => goTo(current - 1)} disabled={disabled || current <= 1} aria-label="Previous page">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="M10 3L5 8l5 5" /></svg>
      </button>
      {getPages().map((p, i) =>
        typeof p === "string" ? (
          <button key={p + i} className={btnClass} onClick={() => goTo(p === "…left" ? current - 5 : current + 5)} aria-label="More pages">
            ···
          </button>
        ) : (
          <button key={p} onClick={() => goTo(p)} className={cn(btnClass, p === current && activeBtnClass)} aria-current={p === current ? "page" : undefined}>
            {p}
          </button>
        )
      )}
      <button className={btnClass} onClick={() => goTo(current + 1)} disabled={disabled || current >= totalPages} aria-label="Next page">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="M6 3l5 5-5 5" /></svg>
      </button>
      {showSizeChanger && (
        <select
          value={pageSize}
          onChange={(e) => changeSize(Number(e.target.value))}
          className={cn("rounded-md border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", size === "small" ? "h-6 text-xs" : "h-8")}
        >
          {pageSizeOptions.map((s) => <option key={s} value={s}>{s} / page</option>)}
        </select>
      )}
      {showQuickJumper && (
        <span className="flex items-center gap-1 text-sm">
          Go to
          <input
            type="number"
            min={1}
            max={totalPages}
            className={cn("w-12 rounded-md border border-border bg-background px-2 text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", size === "small" ? "h-6 text-xs" : "h-8")}
            onKeyDown={(e) => {
              if (e.key === "Enter") goTo(Number((e.target as HTMLInputElement).value))
            }}
            onBlur={(e) => { if (e.target.value) goTo(Number(e.target.value)) }}
          />
        </span>
      )}
    </div>
  )
}

export { Pagination }
export type { PaginationProps }
