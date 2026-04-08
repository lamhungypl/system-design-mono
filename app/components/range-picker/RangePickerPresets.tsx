import { useEffect, useRef, useState } from "react"

import { cn } from "~/lib/utils"
import {
  type RangePreset,
  resolveRangePreset,
  formatDate,
} from "~/lib/dateUtils"
import { useRangePickerContext } from "./RangePickerContext"

export function RangePickerPresets({ presets }: { presets: RangePreset[] }) {
  const {
    effectiveRange,
    commitRange,
    setOpen,
    setActivePreset,
    setOpenToDate,
    setViewMode,
    disabled,
    calendarRef,
  } = useRangePickerContext()

  // Match current range to a preset
  function findActiveIndex() {
    const { start, end } = effectiveRange
    if (!start || !end) return -1
    return presets.findIndex((p) => {
      const resolved = resolveRangePreset(p)
      if (!resolved) return false
      const [s, e] = resolved
      return s.getTime() === start.getTime() && e.getTime() === end.getTime()
    })
  }

  // Track "custom" selection explicitly
  const [customActive, setCustomActive] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const i = findActiveIndex()
    if (i >= 0) {
      setFocusedIndex(i)
      setCustomActive(false)
    }
  }, [effectiveRange]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(preset: RangePreset, index: number) {
    const resolved = resolveRangePreset(preset)
    if (resolved) {
      // Preset with a value — commit and close
      const [start, end] = resolved
      setCustomActive(false)
      commitRange({ start, end })
      setActivePreset("preset")
      setOpenToDate(start)
      setViewMode("days")
      setOpen(false)
    } else {
      // Custom preset — keep popover open, ensure day view, focus first day
      setCustomActive(true)
      setActivePreset("custom")
      setViewMode("days")
      setFocusedIndex(index)
      requestAnimationFrame(() => {
        const btn = calendarRef.current?.querySelector<HTMLElement>("button")
        btn?.focus()
      })
    }
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = (index + 1) % presets.length
      setFocusedIndex(next)
      itemRefs.current[next]?.focus()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const prev = (index - 1 + presets.length) % presets.length
      setFocusedIndex(prev)
      itemRefs.current[prev]?.focus()
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      handleSelect(presets[index], index)
    }
  }

  const activeIndex = findActiveIndex()
  const { start, end } = effectiveRange

  const rangeLabel =
    start && end
      ? `${formatDate(start)} \u2192 ${formatDate(end)}`
      : start
        ? `${formatDate(start)} \u2192 ...`
        : "No range selected"

  function isActive(i: number, preset: RangePreset) {
    if (!preset.value) return customActive
    return i === activeIndex && !customActive
  }

  return (
    <div className="flex w-44 flex-col border-r border-border">
      {/* Range display */}
      <div
        className="border-b border-border px-4 py-3"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="text-xs text-muted-foreground">{rangeLabel}</span>
      </div>

      {/* Preset list */}
      <div
        role="listbox"
        aria-label="Date range presets"
        aria-orientation="vertical"
        className="flex flex-col py-1"
      >
        {presets.map((p, i) => (
          <button
            key={p.label}
            role="option"
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            tabIndex={i === focusedIndex ? 0 : -1}
            aria-selected={isActive(i, p)}
            onClick={() => {
              setFocusedIndex(i)
              handleSelect(p, i)
            }}
            onKeyDown={(e) => handleKeyDown(e, i)}
            disabled={disabled}
            className={cn(
              "flex w-full cursor-pointer items-center px-4 py-2.5 text-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
              "hover:bg-accent hover:text-accent-foreground",
              isActive(i, p)
                ? "bg-accent/60 font-medium text-accent-foreground"
                : "text-foreground",
              disabled && "cursor-not-allowed",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
