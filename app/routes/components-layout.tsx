"use client"

import { Outlet } from "react-router"
import { SidebarLayout } from "~/components/layout/sidebar-layout"
import { nav } from "~/lib/nav"

export default function ComponentsLayout() {
  return (
    <SidebarLayout
      sections={nav}
      header={
        <span className="text-sm font-semibold tracking-tight">
          System Design
        </span>
      }
    >
      <Outlet />
    </SidebarLayout>
  )
}
