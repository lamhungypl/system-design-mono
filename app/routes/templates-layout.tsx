"use client"

import { Outlet } from "react-router"
import { SidebarLayout } from "~/components/layout/sidebar-layout"
import { templatesNav } from "~/lib/templates-nav"

export default function TemplatesLayout() {
  return (
    <SidebarLayout
      sections={templatesNav}
      header={
        <span className="text-sm font-semibold tracking-tight">
          Ant Design Pro
        </span>
      }
    >
      <Outlet />
    </SidebarLayout>
  )
}
