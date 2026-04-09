"use client"

import { SidebarLayout } from "~/components/layout/sidebar-layout"

const nav = [
  {
    items: [
      { label: "Dashboard", href: "/", active: true, icon: <GridIcon /> },
      { label: "Components", href: "/components", icon: <LayersIcon /> },
      { label: "Patterns", href: "/patterns", icon: <PuzzleIcon /> },
      { label: "Form Demo", href: "/form", icon: <FormIcon /> },
      { label: "Dialog Demo", href: "/dialog", icon: <DialogIcon /> },
      { label: "Collapsible", href: "/collapsible", icon: <CollapsibleIcon /> },
      { label: "Date Range", href: "/date-range", icon: <DateIcon /> },
      { label: "Date Picker", href: "/date-picker", icon: <DateIcon /> },
      { label: "Range Picker", href: "/range-picker", icon: <DateIcon /> },
      { label: "Segmented Control", href: "/segmented-control", icon: <ToggleIcon /> },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Documentation", href: "/docs", icon: <BookIcon /> },
      { label: "Settings", href: "/settings", icon: <GearIcon /> },
    ],
  },
]

export default function Home() {
  return (
    <SidebarLayout
      sections={nav}
      header={
        <span className="text-sm font-semibold tracking-tight">
          System Design
        </span>
      }
    >
      <div className="p-8">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome to the system design monorepo.
        </p>
      </div>
    </SidebarLayout>
  )
}

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

function PuzzleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <path d="M6 2h4v2a1 1 0 0 0 2 0V2h2v4h-2a1 1 0 0 0 0 2h2v4h-2v-2a1 1 0 0 0-2 0v2H6v-2a1 1 0 0 0-2 0v2H2v-4h2a1 1 0 0 0 0-2H2V2h2v2a1 1 0 0 0 2 0V2Z" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <path d="M3 2h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
      <path d="M11 4h1a1 1 0 0 1 1 1v8" />
      <path d="M5 5.5h4M5 7.5h4M5 9.5h2" />
    </svg>
  )
}

function DateIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
      <path d="M5 1v3M11 1v3M1.5 6.5h13" />
      <path d="M4.5 10h2M9.5 10h2" />
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

function GearIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" />
    </svg>
  )
}
