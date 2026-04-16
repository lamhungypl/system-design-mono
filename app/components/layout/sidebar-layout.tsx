"use client"

import { useState } from "react"
import { cn } from "~/lib/utils"

interface SidebarItem {
  label: string
  href?: string
  icon?: React.ReactNode
  active?: boolean
}

interface SidebarSection {
  title?: string
  items: SidebarItem[]
}

interface SidebarLayoutProps {
  sections: SidebarSection[]
  header?: React.ReactNode
  children: React.ReactNode
  className?: string
  defaultCollapsed?: boolean
}

function SidebarLayout({
  sections,
  header,
  children,
  className,
  defaultCollapsed = false,
}: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  return (
    <div className={cn("flex min-h-svh", className)}>
      <div
        data-slot="sidebar"
        data-collapsed={collapsed}
        className={cn(
          "group/sidebar relative flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-in-out",
          collapsed ? "w-14" : "w-60",
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center border-b border-sidebar-border px-3">
          {!collapsed && header && (
            <div className="flex-1 overflow-hidden">
              {header}
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              collapsed && "mx-auto",
            )}
          >
            <ChevronIcon collapsed={collapsed} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden p-2">
          {sections.filter((s) => s.items.length > 0).map((section, i) => (
            <SidebarSectionGroup key={i} section={section} collapsed={collapsed} />
          ))}
        </nav>
      </div>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function SidebarSectionGroup({
  section,
  collapsed,
}: {
  section: SidebarSection
  collapsed: boolean
}) {
  return (
    <div data-slot="sidebar-section" className="flex flex-col gap-0.5">
      {section.title && !collapsed && (
        <p className="px-2 py-1 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider truncate">
          {section.title}
        </p>
      )}
      {collapsed && section.title && (
        <div className="my-1 mx-2 h-px bg-sidebar-border" />
      )}
      {section.items.map((item, i) => (
        <SidebarItemRow key={i} item={item} collapsed={collapsed} />
      ))}
    </div>
  )
}

function SidebarItemRow({
  item,
  collapsed,
}: {
  item: SidebarItem
  collapsed: boolean
}) {
  const Tag = item.href ? "a" : "button"
  return (
    <Tag
      href={item.href}
      title={collapsed ? item.label : undefined}
      data-slot="sidebar-item"
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        item.active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
        collapsed && "justify-center px-0",
      )}
    >
      {item.icon && (
        <span className="flex size-4 shrink-0 items-center justify-center">
          {item.icon}
        </span>
      )}
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
    </Tag>
  )
}

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 transition-transform duration-200", collapsed && "rotate-180")}
    >
      <path d="M10 3 5 8l5 5" />
    </svg>
  )
}

export { SidebarLayout }
export type { SidebarLayoutProps, SidebarSection as SidebarSectionType, SidebarItem as SidebarItemType }
