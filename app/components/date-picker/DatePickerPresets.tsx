import { useEffect, useRef, useState } from "react"

import { cn } from "~/lib/utils"
import {
  type DatePreset,
  resolveDatePreset,
  formatDate,
} from "~/lib/dateUtils"
import { useDatePickerContext } from "./DatePickerContext"

export function DatePickerPresets({ presets }: { presets: DatePreset[] }) {
  const {
    effectiveValue,
    commitValue,
    setOpen,
    setOpenToDate,
    setViewMode,
    disabled,
    calendarRef,
  } = useDatePickerContext()

  // Track which preset is active (matches current value)
  function findActiveIndex() {
    if (!effectiveValue) return -1
    return presets.findIndex((p) => {
      const d = resolveDatePreset(p)
      return d !== null && d.getTime() === effectiveValue.getTime()
    })
  }

  // Track "custom" selection explicitly — when a no-value preset is clicked
  const [customActive, setCustomActive] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Sync focused index when value changes externally
  useEffect(() => {
    const i = findActiveIndex()
    if (i >= 0) {
      setFocusedIndex(i)
      setCustomActive(false)
    }
  }, [effectiveValue]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(preset: DatePreset, index: number) {
    const date = resolveDatePreset(preset)
    if (date) {
      // Preset with a value — commit and close
      setCustomActive(false)
      commitValue(date)
      setOpenToDate(date)
      setOpen(false)
    } else {
      // Custom preset — keep popover open, ensure day view, focus first day
      setCustomActive(true)
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

  function isActive(i: number, preset: DatePreset) {
    // Custom (no-value) preset is active when explicitly clicked
    if (!preset.value) return customActive
    return i === activeIndex && !customActive
  }

  return (
    <div className="flex w-44 flex-col border-r border-border">
      {/* Current value display */}
      <div
        className="border-b border-border px-4 py-3"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="text-xs text-muted-foreground">
          {effectiveValue ? formatDate(effectiveValue) : "No date selected"}
        </span>
      </div>

      {/* Preset list */}
      <div
        role="listbox"
        aria-label="Date presets"
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
