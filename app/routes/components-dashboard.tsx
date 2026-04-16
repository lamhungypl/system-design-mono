"use client"

import { useState } from "react"
import { Link } from "react-router"

// ── Types ──────────────────────────────────────────────────────────────────────

interface ComponentItem {
  name: string
  description: string
  href?: string
  icon: React.ReactNode
}

interface ComponentGroup {
  title: string
  items: ComponentItem[]
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function ButtonIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-10">
      <rect
        x="4"
        y="12"
        width="32"
        height="16"
        rx="4"
        fill="currentColor"
        fillOpacity=".08"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
      />
      <rect
        x="10"
        y="17"
        width="20"
        height="6"
        rx="2"
        fill="currentColor"
        fillOpacity=".4"
      />
    </svg>
  )
}

function SegmentedIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-10">
      <rect
        x="4"
        y="13"
        width="32"
        height="14"
        rx="4"
        fill="currentColor"
        fillOpacity=".08"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
      />
      <rect
        x="6"
        y="15"
        width="10"
        height="10"
        rx="2.5"
        fill="currentColor"
        fillOpacity=".4"
      />
      <line
        x1="18"
        y1="14"
        x2="18"
        y2="26"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1"
      />
      <line
        x1="28"
        y1="14"
        x2="28"
        y2="26"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1"
      />
    </svg>
  )
}

function TooltipIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-10">
      <rect
        x="12"
        y="22"
        width="16"
        height="10"
        rx="2.5"
        fill="currentColor"
        fillOpacity=".08"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
      />
      <path d="M18 22l2-3 2 3" fill="currentColor" fillOpacity=".3" />
      <circle
        cx="20"
        cy="13"
        r="5"
        fill="currentColor"
        fillOpacity=".15"
        stroke="currentColor"
        strokeOpacity=".3"
        strokeWidth="1.5"
      />
      <path
        d="M20 11v3M20 15.5v.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SeparatorIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-10">
      <line
        x1="6"
        y1="12"
        x2="34"
        y2="12"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
      />
      <line
        x1="6"
        y1="20"
        x2="34"
        y2="20"
        stroke="currentColor"
        strokeOpacity=".6"
        strokeWidth="1.5"
      />
      <line
        x1="6"
        y1="28"
        x2="34"
        y2="28"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function SidebarIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-10">
      <rect
        x="4"
        y="6"
        width="32"
        height="28"
        rx="3"
        fill="currentColor"
        fillOpacity=".06"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
      />
      <rect
        x="4"
        y="6"
        width="12"
        height="28"
        rx="3"
        fill="currentColor"
        fillOpacity=".1"
      />
      <line
        x1="16"
        y1="7"
        x2="16"
        y2="33"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1"
      />
      <line
        x1="21"
        y1="14"
        x2="32"
        y2="14"
        stroke="currentColor"
        strokeOpacity=".3"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="21"
        y1="19"
        x2="30"
        y2="19"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function FieldIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-10">
      <text
        x="6"
        y="15"
        fontSize="7"
        fill="currentColor"
        fillOpacity=".5"
        fontFamily="sans-serif"
      >
        Label
      </text>
      <rect
        x="6"
        y="19"
        width="28"
        height="12"
        rx="3"
        fill="currentColor"
        fillOpacity=".08"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
      />
      <line
        x1="10"
        y1="25"
        x2="22"
        y2="25"
        stroke="currentColor"
        strokeOpacity=".3"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LabelIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-10">
      <rect
        x="6"
        y="14"
        width="28"
        height="12"
        rx="3"
        fill="currentColor"
        fillOpacity=".08"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      <text
        x="10"
        y="23"
        fontSize="8"
        fill="currentColor"
        fillOpacity=".6"
        fontFamily="sans-serif"
      >
        Text
      </text>
    </svg>
  )
}

function DatePickerIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-10">
      <rect
        x="5"
        y="8"
        width="30"
        height="26"
        rx="3"
        fill="currentColor"
        fillOpacity=".06"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
      />
      <line
        x1="5"
        y1="16"
        x2="35"
        y2="16"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1"
      />
      <line
        x1="13"
        y1="6"
        x2="13"
        y2="11"
        stroke="currentColor"
        strokeOpacity=".4"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="27"
        y1="6"
        x2="27"
        y2="11"
        stroke="currentColor"
        strokeOpacity=".4"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="20" cy="25" r="4" fill="currentColor" fillOpacity=".25" />
    </svg>
  )
}

function RangePickerIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-10">
      <rect
        x="3"
        y="8"
        width="15"
        height="24"
        rx="2.5"
        fill="currentColor"
        fillOpacity=".06"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
      />
      <rect
        x="22"
        y="8"
        width="15"
        height="24"
        rx="2.5"
        fill="currentColor"
        fillOpacity=".06"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
      />
      <line
        x1="18"
        y1="20"
        x2="22"
        y2="20"
        stroke="currentColor"
        strokeOpacity=".4"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="22" r="3" fill="currentColor" fillOpacity=".25" />
      <circle cx="29" cy="22" r="3" fill="currentColor" fillOpacity=".15" />
    </svg>
  )
}

function DateRangePickerIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-10">
      <rect
        x="4"
        y="10"
        width="32"
        height="22"
        rx="3"
        fill="currentColor"
        fillOpacity=".06"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
      />
      <line
        x1="4"
        y1="17"
        x2="36"
        y2="17"
        stroke="currentColor"
        strokeOpacity=".15"
        strokeWidth="1"
      />
      <line
        x1="20"
        y1="10"
        x2="20"
        y2="32"
        stroke="currentColor"
        strokeOpacity=".15"
        strokeWidth="1"
      />
      <circle cx="13" cy="24" r="3" fill="currentColor" fillOpacity=".3" />
      <circle cx="27" cy="24" r="3" fill="currentColor" fillOpacity=".15" />
    </svg>
  )
}

function CollapsibleIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-10">
      <rect
        x="5"
        y="8"
        width="30"
        height="10"
        rx="3"
        fill="currentColor"
        fillOpacity=".1"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
      />
      <rect
        x="5"
        y="22"
        width="30"
        height="10"
        rx="3"
        fill="currentColor"
        fillOpacity=".04"
        stroke="currentColor"
        strokeOpacity=".1"
        strokeWidth="1.5"
      />
      <path
        d="M31 13l-2 2-2-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="10"
        y1="13"
        x2="26"
        y2="13"
        stroke="currentColor"
        strokeOpacity=".4"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function DialogIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-10">
      <rect
        x="3"
        y="3"
        width="34"
        height="34"
        rx="3"
        fill="currentColor"
        fillOpacity=".04"
        stroke="currentColor"
        strokeOpacity=".1"
        strokeWidth="1.5"
      />
      <rect
        x="8"
        y="8"
        width="24"
        height="24"
        rx="3"
        fill="currentColor"
        fillOpacity=".08"
        stroke="currentColor"
        strokeOpacity=".25"
        strokeWidth="1.5"
      />
      <line
        x1="12"
        y1="17"
        x2="28"
        y2="17"
        stroke="currentColor"
        strokeOpacity=".3"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="21"
        x2="22"
        y2="21"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="20"
        y="25"
        width="8"
        height="4"
        rx="1.5"
        fill="currentColor"
        fillOpacity=".3"
      />
    </svg>
  )
}

// ── Data ───────────────────────────────────────────────────────────────────────

const GROUPS: ComponentGroup[] = [
  {
    title: "General",
    items: [
      {
        name: "Button",
        description: "Trigger an operation.",
        href: "/components/button",
        icon: <ButtonIcon />,
      },
      {
        name: "Segmented Control",
        description: "Toggle between mutually exclusive options.",
        href: "/components/segmented-control",
        icon: <SegmentedIcon />,
      },
      {
        name: "Tooltip",
        description: "Show contextual info on hover or focus.",
        href: "/components/tooltip",
        icon: <TooltipIcon />,
      },
    ],
  },
  {
    title: "Layout",
    items: [
      {
        name: "Separator",
        description: "A visual divider between content sections.",
        icon: <SeparatorIcon />,
      },
      {
        name: "Sidebar Layout",
        description: "App shell with a collapsible navigation sidebar.",
        icon: <SidebarIcon />,
      },
    ],
  },
  {
    title: "Navigation",
    items: [],
  },
  {
    title: "Data Entry",
    items: [
      {
        name: "Field",
        description: "Form field wrapper with label and error message.",
        href: "/components/field",
        icon: <FieldIcon />,
      },
      {
        name: "Label",
        description: "Accessible label for form controls.",
        href: "/components/label",
        icon: <LabelIcon />,
      },
      {
        name: "Date Picker",
        description: "Select a single date with optional presets.",
        href: "/components/date-picker",
        icon: <DatePickerIcon />,
      },
      {
        name: "Range Picker",
        description: "Select a date range in a popover.",
        href: "/components/range-picker",
        icon: <RangePickerIcon />,
      },
      {
        name: "Date Range Picker",
        description: "Side-by-side single and range date pickers.",
        href: "/components/date-range-picker",
        icon: <DateRangePickerIcon />,
      },
    ],
  },
  {
    title: "Data Display",
    items: [
      {
        name: "Collapsible",
        description: "Expandable and collapsible content section.",
        href: "/components/collapsible",
        icon: <CollapsibleIcon />,
      },
    ],
  },
  {
    title: "Feedback",
    items: [
      {
        name: "Dialog",
        description: "Modal dialog for confirmations and forms.",
        href: "/components/dialog",
        icon: <DialogIcon />,
      },
    ],
  },
]

// ── Component Card ─────────────────────────────────────────────────────────────

function ComponentCard({ item }: { item: ComponentItem }) {
  const inner = (
    <div className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/50">
      <div className="shrink-0 text-muted-foreground/60 transition-colors group-hover:text-primary/60">
        {item.icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{item.name}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </div>
  )

  if (item.href) {
    return <Link to={item.href}>{inner}</Link>
  }
  return inner
}

// ── Empty placeholder ──────────────────────────────────────────────────────────

function EmptyGroup() {
  return (
    <div className="rounded-xl border border-dashed border-border py-8 text-center">
      <p className="text-sm text-muted-foreground">No components yet</p>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ComponentsPage() {
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()

  const filtered = GROUPS.map((group) => ({
    ...group,
    items: q
      ? group.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
        )
      : group.items,
  })).filter((group) => !q || group.items.length > 0)

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-8 py-10">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Components</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {GROUPS.reduce((n, g) => n + g.items.length, 0)} components across{" "}
            {GROUPS.filter((g) => g.items.length > 0).length} categories.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search components..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>

      {/* Groups */}
      <div className="space-y-10">
        {filtered.map((group) => (
          <section key={group.title} className="space-y-4">
            <h2 className="border-b border-border pb-2 text-base font-semibold">
              {group.title}
            </h2>
            {group.items.length === 0 ? (
              <EmptyGroup />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <ComponentCard key={item.name} item={item} />
                ))}
              </div>
            )}
          </section>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">
              No components match &ldquo;{query}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <circle cx="6.5" cy="6.5" r="4" />
      <path d="M11 11l3 3" strokeLinecap="round" />
    </svg>
  )
}
