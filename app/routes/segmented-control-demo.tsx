"use client"

import { useState } from "react"

import {
  SegmentedControl,
  SegmentedControlItem,
} from "~/components/ui/segmented-control"

export default function SegmentedControlDemo() {
  const [view, setView] = useState(["grid"])
  const [align, setAlign] = useState(["left"])

  return (
    <div className="flex flex-col gap-10 p-8">
      <div>
        <h1 className="text-xl font-semibold">Segmented Control</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A toggle group styled as a segmented control, with an icon variant
          that shows tooltips on hover and focus.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Default (text labels)
        </h2>
        <SegmentedControl defaultValue={["weekly"]}>
          <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
          <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
          <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        </SegmentedControl>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Icon variant with tooltips
        </h2>
        <SegmentedControl variant="icon" value={view} onValueChange={setView}>
          <SegmentedControlItem value="grid" tooltip="Grid view" aria-label="Grid view">
            <GridIcon />
          </SegmentedControlItem>
          <SegmentedControlItem value="list" tooltip="List view" aria-label="List view">
            <ListIcon />
          </SegmentedControlItem>
          <SegmentedControlItem value="kanban" tooltip="Kanban view" aria-label="Kanban view">
            <KanbanIcon />
          </SegmentedControlItem>
        </SegmentedControl>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Icon variant — text alignment
        </h2>
        <SegmentedControl variant="icon" value={align} onValueChange={setAlign}>
          <SegmentedControlItem value="left" tooltip="Align left" aria-label="Align left">
            <AlignLeftIcon />
          </SegmentedControlItem>
          <SegmentedControlItem value="center" tooltip="Align center" aria-label="Align center">
            <AlignCenterIcon />
          </SegmentedControlItem>
          <SegmentedControlItem value="right" tooltip="Align right" aria-label="Align right">
            <AlignRightIcon />
          </SegmentedControlItem>
        </SegmentedControl>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Sizes</h2>
        <div className="flex items-center gap-4">
          <SegmentedControl variant="icon" size="sm" defaultValue={["grid"]}>
            <SegmentedControlItem value="grid" tooltip="Grid view" aria-label="Grid view">
              <GridIcon />
            </SegmentedControlItem>
            <SegmentedControlItem value="list" tooltip="List view" aria-label="List view">
              <ListIcon />
            </SegmentedControlItem>
          </SegmentedControl>

          <SegmentedControl variant="icon" defaultValue={["grid"]}>
            <SegmentedControlItem value="grid" tooltip="Grid view" aria-label="Grid view">
              <GridIcon />
            </SegmentedControlItem>
            <SegmentedControlItem value="list" tooltip="List view" aria-label="List view">
              <ListIcon />
            </SegmentedControlItem>
          </SegmentedControl>

          <SegmentedControl variant="icon" size="lg" defaultValue={["grid"]}>
            <SegmentedControlItem value="grid" tooltip="Grid view" aria-label="Grid view">
              <GridIcon />
            </SegmentedControlItem>
            <SegmentedControlItem value="list" tooltip="List view" aria-label="List view">
              <ListIcon />
            </SegmentedControlItem>
          </SegmentedControl>
        </div>
      </section>
    </div>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <rect x="2" y="2" width="5" height="5" rx="0.5" />
      <rect x="9" y="2" width="5" height="5" rx="0.5" />
      <rect x="2" y="9" width="5" height="5" rx="0.5" />
      <rect x="9" y="9" width="5" height="5" rx="0.5" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
      <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />
    </svg>
  )
}

function KanbanIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
      <path d="M3 2.5v8M8 2.5v11M13 2.5v5" />
    </svg>
  )
}

function AlignLeftIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
      <path d="M2.5 3h11M2.5 6.5h7M2.5 10h9M2.5 13.5h5" />
    </svg>
  )
}

function AlignCenterIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
      <path d="M2.5 3h11M4.5 6.5h7M3.5 10h9M5.5 13.5h5" />
    </svg>
  )
}

function AlignRightIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
      <path d="M2.5 3h11M6.5 6.5h7M4.5 10h9M8.5 13.5h5" />
    </svg>
  )
}
