export const nav = [
  {
    items: [
      { label: "Dashboard", href: "/", icon: <GridIcon /> },
      { label: "Components", href: "/components/dashboard", icon: <LayersIcon /> },
    ],
  },
  {
    title: "General",
    items: [
      { label: "Button", href: "/components/button", icon: <FormIcon /> },
      { label: "Segmented Control", href: "/components/segmented-control", icon: <ToggleIcon /> },
      { label: "Tooltip", href: "/components/tooltip", icon: <TooltipIcon /> },
    ],
  },
  {
    title: "Layout",
    items: [
      { label: "Separator", href: "/components/button", icon: <SeparatorIcon /> },
      { label: "Sidebar Layout", href: "/", icon: <LayersIcon /> },
    ],
  },
  {
    title: "Navigation",
    items: [],
  },
  {
    title: "Data Entry",
    items: [
      { label: "Field", href: "/components/field", icon: <FormIcon /> },
      { label: "Label", href: "/components/label", icon: <FormIcon /> },
      { label: "Date Picker", href: "/components/date-picker", icon: <DateIcon /> },
      { label: "Range Picker", href: "/components/range-picker", icon: <DateIcon /> },
      { label: "Date Range Picker", href: "/components/date-range-picker", icon: <DateIcon /> },
    ],
  },
  {
    title: "Data Display",
    items: [
      { label: "Collapsible", href: "/components/collapsible", icon: <CollapsibleIcon /> },
    ],
  },
  {
    title: "Feedback",
    items: [
      { label: "Dialog", href: "/components/dialog", icon: <DialogIcon /> },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Settings", href: "/settings", icon: <GearIcon /> },
    ],
  },
]

function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    </svg>
  )
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <path d="M1.5 5.5 8 2l6.5 3.5-6.5 3.5L1.5 5.5Z" />
      <path d="M1.5 10 8 13.5 14.5 10" />
    </svg>
  )
}

function FormIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="2" y="2" width="12" height="12" rx="1.5" />
      <path d="M5 5.5h6M5 8h6M5 10.5h3" />
    </svg>
  )
}

function ToggleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
      <rect x="1.5" y="4" width="13" height="8" rx="4" />
      <circle cx="10.5" cy="8" r="2.5" />
    </svg>
  )
}

function TooltipIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="3" y="8" width="10" height="6" rx="1.5" />
      <path d="M7 8l1-2 1 2" />
      <circle cx="8" cy="4" r="1.5" />
    </svg>
  )
}

function SeparatorIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
      <path d="M2 8h12" />
    </svg>
  )
}

function DateIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
      <path d="M5 1v3M11 1v3M1.5 6.5h13" />
    </svg>
  )
}

function CollapsibleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M2 4h12M2 8h8M2 12h5" />
      <path d="M12 10l2 2-2 2" />
    </svg>
  )
}

function DialogIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
      <path d="M5 9.5h6M5 7h4" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" />
    </svg>
  )
}
