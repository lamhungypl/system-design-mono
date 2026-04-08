"use client"

import { useState } from "react"
import { cn } from "~/lib/utils"

type Level = 1 | 2 | 3 | 4

const levelStyles: Record<Level, string> = {
  1: "text-2xl font-bold",
  2: "text-xl font-semibold",
  3: "text-base font-semibold",
  4: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
}

const chevronSize: Record<Level, string> = {
  1: "size-5",
  2: "size-4",
  3: "size-4",
  4: "size-3.5",
}

interface CollapsibleHeadingProps {
  level: Level
  title: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

function CollapsibleHeading({
  level,
  title,
  children,
  defaultOpen = true,
  className,
}: CollapsibleHeadingProps) {
  const [open, setOpen] = useState(defaultOpen)
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4"

  return (
    <div data-level={level} className={cn("flex flex-col", className)}>
      <Tag>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "group flex w-full items-center gap-2 text-left transition-colors",
            "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
            levelStyles[level],
          )}
        >
          <ChevronIcon open={open} className={chevronSize[level]} />
          {title}
        </button>
      </Tag>

      {/* CSS grid trick: animates height without JS measurement */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function ChevronIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "shrink-0 transition-transform duration-200",
        open ? "rotate-90" : "rotate-0",
        className,
      )}
    >
      <path d="M6 3l5 5-5 5" />
    </svg>
  )
}

export { CollapsibleHeading }
